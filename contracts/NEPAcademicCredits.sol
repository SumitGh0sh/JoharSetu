// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title NEPAcademicCredits
 * @notice Soulbound Token (SBT) conferring verifiable experiential academic credits under NEP 2020.
 * @dev Non-transferable token bound to the student's wallet address.
 * Issued by authorized HEI Mentors or the Department of Higher & Technical Education, Govt of Jharkhand.
 */
contract NEPAcademicCredits is ERC721URIStorage, AccessControl, Pausable {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");

    struct AcademicCredential {
        uint256 tokenId;
        address studentAddress;
        string studentName;
        string studentRollNumber;
        string abcId; // Academic Bank of Credits Identifier (e.g. ABC-JH-2026-88912)
        string heiName; // e.g. BIT Sindri / BIT Mesra / IIT ISM Dhanbad
        string ticketId; // Problem solved (e.g. JH-DHN-2026-001)
        uint256 nepCreditsBasis; // 400 = 4.00 Credits
        uint256 nssHours; // e.g. 120 verified field hours
        string evidenceIpfsCid; // Tamper-proof IPFS report hash
        uint256 issuedAt;
        bool isValid;
        string revocationReason;
    }

    uint256 private _nextTokenId;

    // tokenId => AcademicCredential
    mapping(uint256 => AcademicCredential) public credentials;

    // student => array of tokenIds
    mapping(address => uint256[]) private _studentTokens;

    // ticketId => array of tokenIds
    mapping(string => uint256[]) private _ticketTokens;

    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed studentAddress,
        string studentName,
        string abcId,
        string indexed ticketId,
        uint256 nepCreditsBasis,
        uint256 nssHours,
        string evidenceIpfsCid,
        uint256 timestamp
    );

    event CredentialRevoked(
        uint256 indexed tokenId,
        address indexed studentAddress,
        string reason,
        address indexed revokedBy,
        uint256 timestamp
    );

    error SoulboundTokenNonTransferable();
    error StudentAddressRequired();
    error CredentialDoesNotExist(uint256 tokenId);
    error CredentialAlreadyRevoked(uint256 tokenId);

    constructor(address initialAdmin) ERC721("JoharSetu NEP 2020 Experiential Credential", "NEP-CREDIT") {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(GOVERNMENT_ROLE, initialAdmin);
        _grantRole(ISSUER_ROLE, initialAdmin);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    /**
     * @notice Prevents token transfers between accounts. Only minting (from zero address) and burning (to zero address) are allowed.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override whenNotPaused returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenNonTransferable();
        }
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Issues an experiential learning Soulbound Credential to a student upon verified problem completion.
     */
    function issueCredential(
        address studentAddress,
        string calldata studentName,
        string calldata studentRollNumber,
        string calldata abcId,
        string calldata heiName,
        string calldata ticketId,
        uint256 nepCreditsBasis,
        uint256 nssHours,
        string calldata evidenceIpfsCid,
        string calldata metadataUri
    ) external whenNotPaused returns (uint256) {
        if (!hasRole(ISSUER_ROLE, msg.sender) && !hasRole(GOVERNMENT_ROLE, msg.sender) && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert AccessControlUnauthorizedAccount(msg.sender, ISSUER_ROLE);
        }

        if (studentAddress == address(0)) revert StudentAddressRequired();

        uint256 tokenId = ++_nextTokenId;
        _safeMint(studentAddress, tokenId);
        _setTokenURI(tokenId, metadataUri);

        AcademicCredential memory cred = AcademicCredential({
            tokenId: tokenId,
            studentAddress: studentAddress,
            studentName: studentName,
            studentRollNumber: studentRollNumber,
            abcId: abcId,
            heiName: heiName,
            ticketId: ticketId,
            nepCreditsBasis: nepCreditsBasis,
            nssHours: nssHours,
            evidenceIpfsCid: evidenceIpfsCid,
            issuedAt: block.timestamp,
            isValid: true,
            revocationReason: ""
        });

        credentials[tokenId] = cred;
        _studentTokens[studentAddress].push(tokenId);
        _ticketTokens[ticketId].push(tokenId);

        emit CredentialIssued(
            tokenId,
            studentAddress,
            studentName,
            abcId,
            ticketId,
            nepCreditsBasis,
            nssHours,
            evidenceIpfsCid,
            block.timestamp
        );

        return tokenId;
    }

    /**
     * @notice Revokes a credential in case of academic misconduct or erroneous issuance.
     */
    function revokeCredential(uint256 tokenId, string calldata reason) external whenNotPaused {
        if (!hasRole(GOVERNMENT_ROLE, msg.sender) && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert AccessControlUnauthorizedAccount(msg.sender, GOVERNMENT_ROLE);
        }

        AcademicCredential storage cred = credentials[tokenId];
        if (cred.tokenId == 0) revert CredentialDoesNotExist(tokenId);
        if (!cred.isValid) revert CredentialAlreadyRevoked(tokenId);

        cred.isValid = false;
        cred.revocationReason = reason;

        emit CredentialRevoked(tokenId, cred.studentAddress, reason, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns credential details.
     */
    function getCredential(uint256 tokenId) external view returns (AcademicCredential memory) {
        AcademicCredential memory cred = credentials[tokenId];
        if (cred.tokenId == 0) revert CredentialDoesNotExist(tokenId);
        return cred;
    }

    /**
     * @notice Returns all credential token IDs earned by a student.
     */
    function getStudentTokens(address student) external view returns (uint256[] memory) {
        return _studentTokens[student];
    }

    /**
     * @notice Returns all credential token IDs issued for a given problem ticket.
     */
    function getTicketTokens(string calldata ticketId) external view returns (uint256[] memory) {
        return _ticketTokens[ticketId];
    }

    /**
     * @notice Checks validity of credential.
     */
    function isCredentialValid(uint256 tokenId) external view returns (bool) {
        return credentials[tokenId].tokenId != 0 && credentials[tokenId].isValid;
    }

    function totalCredentialsIssued() external view returns (uint256) {
        return _nextTokenId;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
