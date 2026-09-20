// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title JoharMilestoneEscrow
 * @notice Milestone-based CSR fund escrow with joint verification release for rural Jharkhand civic projects.
 * @dev Part of JoharSetu (जोहारसेतु) for SIH Problem Statement SIH26043.
 * Locks CSR donations in smart contract escrow and disburses tranches only upon verified milestone completion.
 */
contract JoharMilestoneEscrow is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant HEI_ROLE = keccak256("HEI_ROLE");
    bytes32 public constant CSR_ROLE = keccak256("CSR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    enum MilestoneStatus {
        PENDING,
        PROOF_SUBMITTED,
        VERIFIED_BY_HEI,
        APPROVED_BY_GOVT,
        RELEASED,
        REFUNDED
    }

    struct Milestone {
        string title;
        uint256 payoutAmount;
        string proofIpfsCid;
        MilestoneStatus status;
        uint256 submittedAt;
        uint256 approvedAt;
    }

    struct EscrowProject {
        string ticketId;
        address csrSponsor;
        address payable heiBeneficiary;
        uint256 totalCommitted;
        uint256 totalDeposited;
        uint256 totalDisbursed;
        bool isClosed;
        uint256 milestoneCount;
    }

    // ticketId => EscrowProject
    mapping(string => EscrowProject) public projects;

    // ticketId => (milestoneIndex => Milestone)
    mapping(string => mapping(uint256 => Milestone)) public projectMilestones;

    string[] public projectTicketIds;

    event ProjectCreated(string indexed ticketId, address indexed csrSponsor, address indexed heiBeneficiary, uint256 totalCommitted);
    event FundsDeposited(string indexed ticketId, address indexed donor, uint256 amount, uint256 totalDeposited);
    event MilestoneAdded(string indexed ticketId, uint256 indexed milestoneIndex, string title, uint256 payoutAmount);
    event MilestoneProofSubmitted(string indexed ticketId, uint256 indexed milestoneIndex, string proofIpfsCid);
    event MilestoneVerifiedByHei(string indexed ticketId, uint256 indexed milestoneIndex, address verifiedBy);
    event MilestoneApprovedByGovt(string indexed ticketId, uint256 indexed milestoneIndex, address approvedBy);
    event FundsDisbursed(string indexed ticketId, uint256 indexed milestoneIndex, address indexed recipient, uint256 amount);
    event ProjectRefunded(string indexed ticketId, address indexed csrSponsor, uint256 amountRefunded);

    error ProjectAlreadyExists(string ticketId);
    error ProjectNotFound(string ticketId);
    error ProjectIsClosed(string ticketId);
    error InvalidBeneficiaryAddress();
    error InvalidDepositAmount();
    error MilestoneIndexOutOfBounds(uint256 index);
    error InvalidMilestoneState(MilestoneStatus current, MilestoneStatus expected);
    error InsufficientEscrowBalance(uint256 available, uint256 required);
    error PayoutFailed();

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(GOVERNMENT_ROLE, initialAdmin);
        _grantRole(HEI_ROLE, initialAdmin);
        _grantRole(CSR_ROLE, initialAdmin);
        _grantRole(VERIFIER_ROLE, initialAdmin);
        _grantRole(GOVERNMENT_ROLE, msg.sender);
    }

    /**
     * @notice Registers a new CSR-sponsored project for a civic problem ticket.
     */
    function createProject(
        string calldata ticketId,
        address payable heiBeneficiary,
        uint256 totalCommitted
    ) external whenNotPaused {
        if (projects[ticketId].heiBeneficiary != address(0)) revert ProjectAlreadyExists(ticketId);
        if (heiBeneficiary == address(0)) revert InvalidBeneficiaryAddress();

        projects[ticketId] = EscrowProject({
            ticketId: ticketId,
            csrSponsor: msg.sender,
            heiBeneficiary: heiBeneficiary,
            totalCommitted: totalCommitted,
            totalDeposited: 0,
            totalDisbursed: 0,
            isClosed: false,
            milestoneCount: 0
        });

        projectTicketIds.push(ticketId);

        emit ProjectCreated(ticketId, msg.sender, heiBeneficiary, totalCommitted);
    }

    /**
     * @notice Locks CSR funds in the smart contract escrow.
     */
    function depositFunds(string calldata ticketId) external payable whenNotPaused nonReentrant {
        EscrowProject storage proj = projects[ticketId];
        if (proj.heiBeneficiary == address(0)) revert ProjectNotFound(ticketId);
        if (proj.isClosed) revert ProjectIsClosed(ticketId);
        if (msg.value == 0) revert InvalidDepositAmount();

        proj.totalDeposited += msg.value;

        emit FundsDeposited(ticketId, msg.sender, msg.value, proj.totalDeposited);
    }

    /**
     * @notice Defines a milestone tranche for a project.
     */
    function addMilestone(
        string calldata ticketId,
        string calldata title,
        uint256 payoutAmount
    ) external whenNotPaused {
        EscrowProject storage proj = projects[ticketId];
        if (proj.heiBeneficiary == address(0)) revert ProjectNotFound(ticketId);
        if (proj.isClosed) revert ProjectIsClosed(ticketId);

        if (!hasRole(GOVERNMENT_ROLE, msg.sender) && !hasRole(HEI_ROLE, msg.sender) && msg.sender != proj.csrSponsor && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert AccessControlUnauthorizedAccount(msg.sender, GOVERNMENT_ROLE);
        }

        uint256 idx = proj.milestoneCount++;
        projectMilestones[ticketId][idx] = Milestone({
            title: title,
            payoutAmount: payoutAmount,
            proofIpfsCid: "",
            status: MilestoneStatus.PENDING,
            submittedAt: 0,
            approvedAt: 0
        });

        emit MilestoneAdded(ticketId, idx, title, payoutAmount);
    }

    /**
     * @notice HEI Student/Faculty team submits completion evidence (photos/lab reports) anchored to IPFS.
     */
    function submitMilestoneProof(
        string calldata ticketId,
        uint256 milestoneIndex,
        string calldata proofIpfsCid
    ) external whenNotPaused {
        EscrowProject storage proj = projects[ticketId];
        if (proj.heiBeneficiary == address(0)) revert ProjectNotFound(ticketId);
        if (milestoneIndex >= proj.milestoneCount) revert MilestoneIndexOutOfBounds(milestoneIndex);

        Milestone storage m = projectMilestones[ticketId][milestoneIndex];
        if (m.status != MilestoneStatus.PENDING) revert InvalidMilestoneState(m.status, MilestoneStatus.PENDING);

        m.proofIpfsCid = proofIpfsCid;
        m.status = MilestoneStatus.PROOF_SUBMITTED;
        m.submittedAt = block.timestamp;

        emit MilestoneProofSubmitted(ticketId, milestoneIndex, proofIpfsCid);
    }

    /**
     * @notice College faculty mentor inspects and verifies physical ground installation.
     */
    function verifyMilestoneByHei(
        string calldata ticketId,
        uint256 milestoneIndex
    ) external whenNotPaused {
        if (!hasRole(HEI_ROLE, msg.sender) && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert AccessControlUnauthorizedAccount(msg.sender, HEI_ROLE);
        }

        EscrowProject storage proj = projects[ticketId];
        if (proj.heiBeneficiary == address(0)) revert ProjectNotFound(ticketId);
        if (milestoneIndex >= proj.milestoneCount) revert MilestoneIndexOutOfBounds(milestoneIndex);

        Milestone storage m = projectMilestones[ticketId][milestoneIndex];
        if (m.status != MilestoneStatus.PROOF_SUBMITTED) revert InvalidMilestoneState(m.status, MilestoneStatus.PROOF_SUBMITTED);

        m.status = MilestoneStatus.VERIFIED_BY_HEI;

        emit MilestoneVerifiedByHei(ticketId, milestoneIndex, msg.sender);
    }

    /**
     * @notice Government Department / Gram Panchayat Mukhiya approves release of funds.
     */
    function approveMilestoneByGovt(
        string calldata ticketId,
        uint256 milestoneIndex
    ) external whenNotPaused {
        if (!hasRole(GOVERNMENT_ROLE, msg.sender) && !hasRole(VERIFIER_ROLE, msg.sender) && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert AccessControlUnauthorizedAccount(msg.sender, GOVERNMENT_ROLE);
        }

        EscrowProject storage proj = projects[ticketId];
        if (proj.heiBeneficiary == address(0)) revert ProjectNotFound(ticketId);
        if (milestoneIndex >= proj.milestoneCount) revert MilestoneIndexOutOfBounds(milestoneIndex);

        Milestone storage m = projectMilestones[ticketId][milestoneIndex];
        if (m.status != MilestoneStatus.VERIFIED_BY_HEI && m.status != MilestoneStatus.PROOF_SUBMITTED) {
            revert InvalidMilestoneState(m.status, MilestoneStatus.VERIFIED_BY_HEI);
        }

        m.status = MilestoneStatus.APPROVED_BY_GOVT;
        m.approvedAt = block.timestamp;

        emit MilestoneApprovedByGovt(ticketId, milestoneIndex, msg.sender);
    }

    /**
     * @notice Releases escrow payout directly to the HEI project account upon approval.
     */
    function releaseMilestonePayout(
        string calldata ticketId,
        uint256 milestoneIndex
    ) external whenNotPaused nonReentrant {
        EscrowProject storage proj = projects[ticketId];
        if (proj.heiBeneficiary == address(0)) revert ProjectNotFound(ticketId);
        if (milestoneIndex >= proj.milestoneCount) revert MilestoneIndexOutOfBounds(milestoneIndex);

        Milestone storage m = projectMilestones[ticketId][milestoneIndex];
        if (m.status != MilestoneStatus.APPROVED_BY_GOVT) {
            revert InvalidMilestoneState(m.status, MilestoneStatus.APPROVED_BY_GOVT);
        }

        uint256 availableBalance = proj.totalDeposited - proj.totalDisbursed;
        if (availableBalance < m.payoutAmount) {
            revert InsufficientEscrowBalance(availableBalance, m.payoutAmount);
        }

        m.status = MilestoneStatus.RELEASED;
        proj.totalDisbursed += m.payoutAmount;

        (bool sent, ) = proj.heiBeneficiary.call{value: m.payoutAmount}("");
        if (!sent) revert PayoutFailed();

        emit FundsDisbursed(ticketId, milestoneIndex, proj.heiBeneficiary, m.payoutAmount);
    }

    /**
     * @notice Refunds remaining unreleased funds to CSR sponsor if project is cancelled by government.
     */
    function emergencyRefund(string calldata ticketId) external onlyRole(GOVERNMENT_ROLE) nonReentrant {
        EscrowProject storage proj = projects[ticketId];
        if (proj.heiBeneficiary == address(0)) revert ProjectNotFound(ticketId);
        if (proj.isClosed) revert ProjectIsClosed(ticketId);

        uint256 refundable = proj.totalDeposited - proj.totalDisbursed;
        proj.isClosed = true;

        if (refundable > 0) {
            (bool sent, ) = payable(proj.csrSponsor).call{value: refundable}("");
            if (!sent) revert PayoutFailed();
        }

        emit ProjectRefunded(ticketId, proj.csrSponsor, refundable);
    }

    function getProject(string calldata ticketId) external view returns (EscrowProject memory) {
        return projects[ticketId];
    }

    function getMilestone(string calldata ticketId, uint256 milestoneIndex) external view returns (Milestone memory) {
        return projectMilestones[ticketId][milestoneIndex];
    }

    function getAllMilestones(string calldata ticketId) external view returns (Milestone[] memory) {
        uint256 count = projects[ticketId].milestoneCount;
        Milestone[] memory list = new Milestone[](count);
        for (uint256 i = 0; i < count; i++) {
            list[i] = projectMilestones[ticketId][i];
        }
        return list;
    }

    function totalProjects() external view returns (uint256) {
        return projectTicketIds.length;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    receive() external payable {}
}
