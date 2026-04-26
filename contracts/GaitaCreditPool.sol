// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title GAITA Credit Pool
/// @notice Domain aggregate that controls user reputation and credit approval.
contract GaitaCreditPool {
    address public immutable owner;

    // User reputation value object. Solidity uint8 naturally fits the 0-100 score range.
    mapping(address user => uint8 score) public creditScore;

    // CreditPool aggregate state: one active credit per user at a time.
    mapping(address user => bool isActive) public hasActiveCredit;

    event ScoreUpdated(
        address indexed user,
        uint8 score,
        address indexed updatedBy
    );
    event CreditApproved(address indexed user, uint256 amount, uint8 score);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can update credit scores");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Owner/admin updates the user's CreditScore value object.
    /// @dev The aggregate rejects scores outside the ubiquitous language range.
    function updateScore(address user, uint8 score) external onlyOwner {
        require(user != address(0), "User address cannot be zero");
        require(score <= 100, "Credit score must be between 0 and 100");

        creditScore[user] = score;

        emit ScoreUpdated(user, score, msg.sender);
    }

    /// @notice User requests credit from the CreditPool aggregate.
    /// @dev Approval is deterministic: score >= 50 and no active credit.
    function requestCredit(uint256 amount) external {
        uint8 userScore = creditScore[msg.sender];

        require(amount > 0, "Credit amount must be greater than zero");
        require(userScore >= 50, "Credit score must be at least 50");
        require(!hasActiveCredit[msg.sender], "User already has active credit");

        hasActiveCredit[msg.sender] = true;

        emit CreditApproved(msg.sender, amount, userScore);
    }
}
