// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// Utility Token Contract - Mintable rewards token
contract EcoToken is ERC20, Ownable {
    constructor() ERC20("EcoLink Token", "ECO") Ownable(msg.sender) {
         _mint(msg.sender, 1000000 * 10**18);
    }
    
    // Only the reward system can mint new tokens
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

// NFT Contract for verified eco-actions with metadata stored in NFT
contract EcoActionNFT is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIds;
    
    struct ActionMetadata {
        string actionType;
        string description;
        string proofHash; // IPFS hash of proof materials
        uint256 timestamp;
        address protector;
        uint256 carbonOffset; // Estimated carbon offset in grams
    }
    
    mapping(uint256 => ActionMetadata) private _actionMetadata;
    
    constructor() ERC721("EcoLink NFT", "ECONFT") Ownable(msg.sender) {}
    
    function mintActionNFT(
        address to,
        string memory actionType,
        string memory description,
        string memory proofHash,
        uint256 carbonOffset
    ) external onlyOwner returns (uint256) {
        _tokenIds += 1;
        uint256 newTokenId = _tokenIds;
        _mint(to, newTokenId);
        
        _actionMetadata[newTokenId] = ActionMetadata({
            actionType: actionType,
            description: description,
            proofHash: proofHash,
            timestamp: block.timestamp,
            protector: to,
            carbonOffset: carbonOffset
        });
        
        return newTokenId;
    }
    
    function getActionMetadata(uint256 tokenId) external view returns (ActionMetadata memory) {
        require(tokenId <= _tokenIds, "Token does not exist");
        return _actionMetadata[tokenId];
    }
    
    // Override tokenURI to return metadata as JSON
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= _tokenIds, "Token does not exist");
        
        ActionMetadata memory metadata = _actionMetadata[tokenId];
        
        // Convert timestamp to string
        string memory timestampStr = metadata.timestamp.toString();
        
        // Convert carbon offset to string
        string memory carbonOffsetStr = metadata.carbonOffset.toString();
        
        // Convert protector address to string
        string memory protectorStr = Strings.toHexString(uint160(metadata.protector), 20);
        
        // Create JSON metadata
        string memory json = string(
            abi.encodePacked(
                '{"name": "Planet Guardian Action #',
                tokenId.toString(),
                '", "description": "',
                metadata.description,
                '", "attributes": [',
                '{"trait_type": "Action Type", "value": "',
                metadata.actionType,
                '"}, ',
                '{"trait_type": "Carbon Offset (grams)", "value": ',
                carbonOffsetStr,
                ', "display_type": "number"}, ',
                '{"trait_type": "Timestamp", "value": ',
                timestampStr,
                ', "display_type": "date"}, ',
                '{"trait_type": "Protector", "value": "',
                protectorStr,
                '"}, ',
                '{"trait_type": "Proof Hash", "value": "',
                metadata.proofHash,
                '"}]}'
            )
        );
        
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }
    
    // Additional utility functions
    function getAllTokenIds() external view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](_tokenIds);
        for (uint256 i = 0; i < _tokenIds; i++) {
            tokenIds[i] = i + 1;
        }
        return tokenIds;
    }
    
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }
        return tokenIds;
    }
    
    function getTotalSupply() external view returns (uint256) {
        return _tokenIds;
    }
}

// Main Reward System Contract
contract EcoRewardSystem is Ownable, ReentrancyGuard {
    EcoToken public ecoToken;
    EcoActionNFT public ecoActionNFT;
    uint256 private _proposalIds;
    address public immutable contractOwner;
    
    // Staking requirements and rewards
    uint256 public constant VERIFIER_STAKE_AMOUNT = 50 * 10**18; // 50 tokens
    uint256 public constant REWARD_AMOUNT = 10 * 10**18; // 10 tokens reward
    uint256 public constant GOVERNOR_REWARD = 2 * 10**18; // 2 tokens for governors
    uint256 public constant VOTING_PERIOD = 7 days;
    
    // User roles and staking
    mapping(address => bool) public protectors;
    mapping(address => bool) public verifiers;
    mapping(address => bool) public governors;
    mapping(address => uint256) public stakedAmount;
    
    // Governor management
    address[] public governorList;
    uint256 public constant MAX_GOVERNORS = 10; // Fixed maximum number of governors
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address protector;
        string actionType;
        string description;
        string proofHash; // IPFS hash containing video/image/documentation
        uint256 carbonOffset;
        uint256 createdAt;
        uint256 votingDeadline;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 governorYesVotes;
        uint256 governorNoVotes;
        bool executed;
        bool approved;
        mapping(address => bool) hasVoted;
        mapping(address => bool) governorHasVoted;
        address[] verifierVoters; // Track verifiers who voted
        address[] governorVoters; // Track governors who voted
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256[]) public userProposals;
    
    // Events
    event ProtectorRegistered(address indexed protector);
    event VerifierStaked(address indexed verifier, uint256 amount);
    event VerifierUnstaked(address indexed verifier, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed protector);
    event VoteCast(uint256 indexed proposalId, address indexed verifier, bool vote);
    event GovernorVoteCast(uint256 indexed proposalId, address indexed governor, bool vote);
    event ProposalExecuted(uint256 indexed proposalId, bool approved);
    event RewardDistributed(address indexed protector, uint256 amount, uint256 nftId);
    event VerifierRewarded(address indexed verifier, uint256 amount, uint256 proposalId);
    event GovernorRewarded(address indexed governor, uint256 amount, uint256 proposalId);

    constructor(address _ecoToken, address _ecoActionNFT, address[] memory _predefinedGovernors) Ownable(msg.sender) {
        ecoToken = EcoToken(_ecoToken);
        ecoActionNFT = EcoActionNFT(_ecoActionNFT);
        contractOwner = msg.sender;
        
        // Set predefined governors
        require(_predefinedGovernors.length <= MAX_GOVERNORS, "Too many governors");
        for (uint256 i = 0; i < _predefinedGovernors.length; i++) {
            require(_predefinedGovernors[i] != address(0), "Invalid governor address");
            require(!governors[_predefinedGovernors[i]], "Duplicate governor address");
            
            governors[_predefinedGovernors[i]] = true;
            governorList.push(_predefinedGovernors[i]);
        }
    }

    // Governor management functions
    function getGovernors() external view returns (address[] memory) {
        return governorList;
    }
    
    function getGovernorCount() external view returns (uint256) {
        return governorList.length;
    }
    
    function isGovernor(address account) external view returns (bool) {
        return governors[account];
    }
    
    // Register as a protector (free)
    function registerProtector() external {
        require(!protectors[msg.sender], "Already registered as protector");
        protectors[msg.sender] = true;
        emit ProtectorRegistered(msg.sender);
    }
    
    // Stake tokens to become a verifier
    function stakeToVerify() external {
        require(protectors[msg.sender], "Must be a protector first");
        require(!verifiers[msg.sender], "Already a verifier");
        require(ecoToken.balanceOf(msg.sender) >= VERIFIER_STAKE_AMOUNT, "Insufficient tokens");
        
        ecoToken.transferFrom(msg.sender, address(this), VERIFIER_STAKE_AMOUNT);
        stakedAmount[msg.sender] = VERIFIER_STAKE_AMOUNT;
        verifiers[msg.sender] = true;
        
        emit VerifierStaked(msg.sender, VERIFIER_STAKE_AMOUNT);
    }
    
    // Unstake and lose verifier status
    function unstakeVerifier() external {
        require(verifiers[msg.sender], "Not a verifier");
        
        uint256 amount = stakedAmount[msg.sender];
        stakedAmount[msg.sender] = 0;
        verifiers[msg.sender] = false;
        
        ecoToken.transfer(msg.sender, amount);
        emit VerifierUnstaked(msg.sender, amount);
    }
    
    // Submit proof for eco-friendly action
    function submitProposal(
        string memory actionType,
        string memory description,
        string memory proofHash,
        uint256 carbonOffset
    ) external {
        require(protectors[msg.sender], "Must be a registered protector");
        _proposalIds += 1;
        uint256 proposalId = _proposalIds;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.protector = msg.sender;
        proposal.actionType = actionType;
        proposal.description = description;
        proposal.proofHash = proofHash;
        proposal.carbonOffset = carbonOffset;
        proposal.createdAt = block.timestamp;
        proposal.votingDeadline = block.timestamp + VOTING_PERIOD;
        proposal.executed = false;
        proposal.approved = false;
        
        userProposals[msg.sender].push(proposalId);
        emit ProposalCreated(proposalId, msg.sender);
    }
    
    // Verifiers vote on proposals
    function vote(uint256 proposalId, bool approve) external {
        require(verifiers[msg.sender], "Must be a verifier");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp <= proposal.votingDeadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.verifierVoters.push(msg.sender); // Track voter
        
        if (approve) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        emit VoteCast(proposalId, msg.sender, approve);
    }
    
    // Governors vote on proposals (no staking required)
    function governorVote(uint256 proposalId, bool approve) external {
        require(governors[msg.sender], "Must be a governor");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp <= proposal.votingDeadline, "Voting period ended");
        require(!proposal.governorHasVoted[msg.sender], "Already voted");
        
        proposal.governorHasVoted[msg.sender] = true;
        proposal.governorVoters.push(msg.sender); // Track voter
        
        if (approve) {
            proposal.governorYesVotes++;
        } else {
            proposal.governorNoVotes++;
        }
        
        emit GovernorVoteCast(proposalId, msg.sender, approve);
    }
    
    // Execute proposal after voting period
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp > proposal.votingDeadline, "Voting still active");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        
        // Governor votes count as 2
        uint256 totalVerifierVotes = proposal.yesVotes + proposal.noVotes;
        uint256 totalGovernorVotes = proposal.governorYesVotes + proposal.governorNoVotes;
        uint256 totalYesVotes = proposal.yesVotes + (proposal.governorYesVotes * 2);
        uint256 totalNoVotes = proposal.noVotes + (proposal.governorNoVotes * 2);
        uint256 totalVotes = totalVerifierVotes + (totalGovernorVotes * 2);
        
        bool approved = totalVotes > 0 && totalYesVotes > totalNoVotes;
        proposal.approved = approved;
        
        if (approved) {
            // Mint reward tokens to protector
            ecoToken.mint(proposal.protector, REWARD_AMOUNT);
            
            // Mint NFT for the eco-action
            uint256 nftId = ecoActionNFT.mintActionNFT(
                proposal.protector,
                proposal.actionType,
                proposal.description,
                proposal.proofHash,
                proposal.carbonOffset
            );
            
            // Reward verifiers proportionally to their stake
            for (uint256 i = 0; i < proposal.verifierVoters.length; i++) {
                address voter = proposal.verifierVoters[i];
                uint256 voterStake = stakedAmount[voter];
                // Proportional reward: (stake / minimum_stake) * base_reward / 10
                uint256 proportionalReward = (voterStake * REWARD_AMOUNT) / (VERIFIER_STAKE_AMOUNT * 10);
                ecoToken.mint(voter, proportionalReward);
                emit VerifierRewarded(voter, proportionalReward, proposalId);
            }
            
            // Reward governors with fixed amount
            for (uint256 i = 0; i < proposal.governorVoters.length; i++) {
                address governor = proposal.governorVoters[i];
                ecoToken.mint(governor, GOVERNOR_REWARD);
                emit GovernorRewarded(governor, GOVERNOR_REWARD, proposalId);
            }
            
            emit RewardDistributed(proposal.protector, REWARD_AMOUNT, nftId);
        }
        
        emit ProposalExecuted(proposalId, approved);
    }

    // Return all proposal IDs
    function getAllProposals() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](_proposalIds);
        for (uint256 i = 0; i < _proposalIds; i++) {
            ids[i] = i + 1;
        }
        return ids;
    }
    
    // View functions
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        address protector,
        string memory actionType,
        string memory description,
        string memory proofHash,
        uint256 carbonOffset,
        uint256 createdAt,
        uint256 votingDeadline,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 governorYesVotes,
        uint256 governorNoVotes,
        bool executed,
        bool approved
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.protector,
            proposal.actionType,
            proposal.description,
            proposal.proofHash,
            proposal.carbonOffset,
            proposal.createdAt,
            proposal.votingDeadline,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.governorYesVotes,
            proposal.governorNoVotes,
            proposal.executed,
            proposal.approved
        );
    }
    
    function getProposalVoters(uint256 proposalId) external view returns (
        address[] memory verifierVoters,
        address[] memory governorVoters
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.verifierVoters, proposal.governorVoters);
    }
    
    function hasVoted(uint256 proposalId, address verifier) external view returns (bool) {
        return proposals[proposalId].hasVoted[verifier];
    }
    
    function governorHasVoted(uint256 proposalId, address governor) external view returns (bool) {
        return proposals[proposalId].governorHasVoted[governor];
    }
    
    function getUserProposals(address user) external view returns (uint256[] memory) {
        return userProposals[user];
    }
    
    function getActiveProposals() external view returns (uint256[] memory) {
        uint256 count = 0;
        uint256 totalProposals = _proposalIds;
        
        // Count active proposals
        for (uint256 i = 1; i <= totalProposals; i++) {
            if (!proposals[i].executed && block.timestamp <= proposals[i].votingDeadline) {
                count++;
            }
        }
        
        // Create array of active proposal IDs
        uint256[] memory activeProposals = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= totalProposals; i++) {
            if (!proposals[i].executed && block.timestamp <= proposals[i].votingDeadline) {
                activeProposals[index] = i;
                index++;
            }
        }
        return activeProposals;
    }
    
    function getExecutedProposals() external view returns (uint256[] memory) {
        uint256 count = 0;
        uint256 totalProposals = _proposalIds;
        
        // Count executed proposals
        for (uint256 i = 1; i <= totalProposals; i++) {
            if (proposals[i].executed) {
                count++;
            }
        }
        
        // Create array of executed proposal IDs
        uint256[] memory executedProposals = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= totalProposals; i++) {
            if (proposals[i].executed) {
                executedProposals[index] = i;
                index++;
            }
        }
        return executedProposals;
    }
    
    function getTotalProposals() external view returns (uint256) {
        return _proposalIds;
    }
    
    // Emergency functions
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause functionality
        // This would typically involve setting a paused state
    }
    
    function updateRewardAmount(uint256 newAmount) external onlyOwner {
        // Allow owner to adjust reward amount if needed
        // Note: This would require making REWARD_AMOUNT non-constant
    }
    
    // Additional utility functions
    function getContractBalance() external view returns (uint256) {
        return ecoToken.balanceOf(address(this));
    }
    
    function getUserStake(address user) external view returns (uint256) {
        return stakedAmount[user];
    }
    
    function isProtector(address account) external view returns (bool) {
        return protectors[account];
    }
    
    function isVerifier(address account) external view returns (bool) {
        return verifiers[account];
    }
}