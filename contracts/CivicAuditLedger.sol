// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CivicAuditLedger
 * @notice Immutable cryptographic audit ledger for civic tickets across Jharkhand.
 * @dev Part of JoharSetu (जोहारसेतु) for SIH Problem Statement SIH26043.
 * Anchors ticket lifecycle state transitions on-chain with SHA-256 / Keccak-256 hash chains.
 */
contract CivicAuditLedger is AccessControl, Pausable {
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");

    struct AuditRecord {
        uint256 recordId;
        string ticketId;
        bytes32 previousBlockHash;
        bytes32 currentBlockHash;
        string action;
        string evidenceIpfsCid;
        string gpsCoordinatesHash;
        bytes32 payloadHash;
        address actor;
        string actorRole;
        uint256 timestamp;
        uint256 blockNumber;
    }

    // recordId => AuditRecord
    mapping(uint256 => AuditRecord) public records;

    // ticketId => array of recordIds
    mapping(string => uint256[]) private _ticketRecordIds;

    // ticketId => latest record hash
    mapping(string => bytes32) public ticketLatestHash;

    uint256 public totalRecordsCount;

    event AuditEventRecorded(
        uint256 indexed recordId,
        string indexed ticketId,
        string action,
        bytes32 previousHash,
        bytes32 currentHash,
        string evidenceIpfsCid,
        address indexed actor,
        string actorRole,
        uint256 timestamp
    );

    error TicketIdRequired();
    error ActionRequired();
    error RecordNotFound(uint256 recordId);

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(GOVERNMENT_ROLE, initialAdmin);
        _grantRole(RELAYER_ROLE, initialAdmin);
        _grantRole(RELAYER_ROLE, msg.sender);
    }

    /**
     * @notice Records an immutable civic lifecycle event into the cryptographic ledger.
     * @param ticketId The unique ticket code (e.g., JH-DHN-2026-001)
     * @param action The lifecycle event ("SUBMITTED", "AI_ROUTED", "ACCEPTED_BY_HEI", "PROTOTYPE_DEPLOYED", "RESOLVED")
     * @param evidenceIpfsCid IPFS CID containing photos/documents (e.g., ipfs://bafy...)
     * @param gpsCoordinatesHash Hash representing verified geo-location
     * @param payloadHash Keccak-256 hash of auxiliary problem/solution metadata
     * @param actor Address of citizen, student lead, or official
     * @param actorRole Role description (e.g., "CITIZEN", "STUDENT_LEAD", "HEI_MENTOR", "GOVT_ADMIN")
     */
    function recordAuditEvent(
        string calldata ticketId,
        string calldata action,
        string calldata evidenceIpfsCid,
        string calldata gpsCoordinatesHash,
        bytes32 payloadHash,
        address actor,
        string calldata actorRole
    ) external whenNotPaused returns (uint256, bytes32) {
        if (!hasRole(RELAYER_ROLE, msg.sender) && !hasRole(GOVERNMENT_ROLE, msg.sender) && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert AccessControlUnauthorizedAccount(msg.sender, RELAYER_ROLE);
        }

        if (bytes(ticketId).length == 0) revert TicketIdRequired();
        if (bytes(action).length == 0) revert ActionRequired();

        bytes32 prevHash = ticketLatestHash[ticketId];
        uint256 newRecordId = totalRecordsCount + 1;
        totalRecordsCount = newRecordId;

        // Compute cryptographic block hash
        bytes32 currentHash = keccak256(
            abi.encodePacked(
                newRecordId,
                ticketId,
                prevHash,
                action,
                evidenceIpfsCid,
                gpsCoordinatesHash,
                payloadHash,
                actor,
                actorRole,
                block.timestamp,
                block.number
            )
        );

        AuditRecord memory record = AuditRecord({
            recordId: newRecordId,
            ticketId: ticketId,
            previousBlockHash: prevHash,
            currentBlockHash: currentHash,
            action: action,
            evidenceIpfsCid: evidenceIpfsCid,
            gpsCoordinatesHash: gpsCoordinatesHash,
            payloadHash: payloadHash,
            actor: actor,
            actorRole: actorRole,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        records[newRecordId] = record;
        _ticketRecordIds[ticketId].push(newRecordId);
        ticketLatestHash[ticketId] = currentHash;

        emit AuditEventRecorded(
            newRecordId,
            ticketId,
            action,
            prevHash,
            currentHash,
            evidenceIpfsCid,
            actor,
            actorRole,
            block.timestamp
        );

        return (newRecordId, currentHash);
    }

    /**
     * @notice Retrieves the full audit trail for a ticket.
     */
    function getTicketAuditTrail(string calldata ticketId) external view returns (AuditRecord[] memory) {
        uint256[] memory ids = _ticketRecordIds[ticketId];
        uint256 len = ids.length;
        AuditRecord[] memory trail = new AuditRecord[](len);

        for (uint256 i = 0; i < len; i++) {
            trail[i] = records[ids[i]];
        }
        return trail;
    }

    /**
     * @notice Cryptographically verifies that no historical event in the ticket chain was altered.
     */
    function verifyTicketAuditChain(string calldata ticketId) external view returns (bool isValid, uint256 count) {
        uint256[] memory ids = _ticketRecordIds[ticketId];
        uint256 len = ids.length;
        if (len == 0) {
            return (true, 0);
        }

        bytes32 expectedPrev = bytes32(0);
        for (uint256 i = 0; i < len; i++) {
            AuditRecord memory r = records[ids[i]];
            if (r.previousBlockHash != expectedPrev) {
                return (false, i);
            }

            bytes32 recalculatedHash = keccak256(
                abi.encodePacked(
                    r.recordId,
                    r.ticketId,
                    r.previousBlockHash,
                    r.action,
                    r.evidenceIpfsCid,
                    r.gpsCoordinatesHash,
                    r.payloadHash,
                    r.actor,
                    r.actorRole,
                    r.timestamp,
                    r.blockNumber
                )
            );

            if (recalculatedHash != r.currentBlockHash) {
                return (false, i);
            }

            expectedPrev = r.currentBlockHash;
        }

        return (true, len);
    }

    /**
     * @notice Returns individual record details.
     */
    function getRecord(uint256 recordId) external view returns (AuditRecord memory) {
        if (recordId == 0 || recordId > totalRecordsCount) revert RecordNotFound(recordId);
        return records[recordId];
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
