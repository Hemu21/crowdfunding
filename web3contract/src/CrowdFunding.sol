// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Pragma statements
// Import statements
// Interfaces
// Libraries
// Contracts
// Errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions

/**
 * @title CrowdFunding contract
 * @author Hemanth Kumar
 * @notice This contract is used to create a crowdfunding campaign
 */
contract CrowdFunding {
    // Errors
    error CrowdFunding__NotCampaignOwner();
    error CrowdFunding__CampaignNotActive(uint256 id);
    error CrowdFunding__AmountMustBeGreaterThanZero();
    error CrowdFunding__InvalidTier();
    error CrowdFunding__IncorrectAmount();
    error CrowdFunding__CampaignNotSuccessful();
    error CrowdFunding__NoFundsToWithdraw();
    error CrowdFunding__RefundsNotAvailable();
    error CrowdFunding__NoContributionToRefund();
    error CrowdFunding__DeadlineShouldBeInTheFuture();

    // Type declarations
    enum CampaignState {
        Active,
        Successful,
        Failed
    }

    struct Tier {
        string name;
        uint256 amount;
        uint256 backers;
    }

    struct Backer {
        uint256 totalContribution;
        mapping(uint256 => bool) fundedTiers;
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        CampaignState state;
        Tier[] tiers;
        mapping(address => Backer) backers;
    }

    struct AllCampaigns {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        uint256 donators;
        CampaignState state;
        uint256 tiers;
    }

    struct CampaignView {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        CampaignState state;
        Tier[] tiers;
    }

    // State variables
    uint256 private s_numberOfCampaigns = 0;
    mapping(uint256 => Campaign) private s_campaigns;

    // Modifiers
    modifier onlyOwner(uint256 _id) {
        if (msg.sender != s_campaigns[_id].owner) {
            revert CrowdFunding__NotCampaignOwner();
        }
        _;
    }

    modifier campaignOpen(uint256 _id) {
        if (s_campaigns[_id].state != CampaignState.Active) {
            revert CrowdFunding__CampaignNotActive(_id);
        }
        _;
    }

    modifier deadlineInFuture(uint256 _deadline) {
        if (_deadline <= block.timestamp) {
            revert CrowdFunding__DeadlineShouldBeInTheFuture();
        }
        _;
    }

    // Functions

    // Create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public deadlineInFuture(_deadline) returns (uint256) {
        Campaign storage campaign = s_campaigns[s_numberOfCampaigns];
        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.state = CampaignState.Active;

        s_numberOfCampaigns++;

        return s_numberOfCampaigns - 1;
    }

    function addTier(
        uint256 _id,
        string memory _name,
        uint256 _amount
    ) public onlyOwner(_id) campaignOpen(_id) {
        if (_amount == 0) {
            revert CrowdFunding__AmountMustBeGreaterThanZero();
        }
        s_campaigns[_id].tiers.push(Tier(_name, _amount, 0));
    }

    function fund(
        uint256 _id,
        uint256 _tierIndex
    ) public payable campaignOpen(_id) {
        if (_tierIndex >= s_campaigns[_id].tiers.length) {
            revert CrowdFunding__InvalidTier();
        }
        Tier memory tier = s_campaigns[_id].tiers[_tierIndex];

        if (msg.value != tier.amount) {
            revert CrowdFunding__IncorrectAmount();
        }

        tier.backers++;
        s_campaigns[_id].backers[msg.sender].totalContribution += msg.value;
        s_campaigns[_id].backers[msg.sender].fundedTiers[_tierIndex] = true;

        s_campaigns[_id].donators.push(msg.sender);
        s_campaigns[_id].amountCollected += msg.value;

        _updateCampaignState(_id);
    }

    // Withdraw funds from a successful campaign
    function withdraw(uint256 _id) public onlyOwner(_id) {
        _updateCampaignState(_id);
        Campaign storage campaign = s_campaigns[_id];
        if (campaign.state != CampaignState.Successful) {
            revert CrowdFunding__CampaignNotSuccessful();
        }

        uint256 balance = campaign.amountCollected;
        if (balance == 0) {
            revert CrowdFunding__NoFundsToWithdraw();
        }

        campaign.amountCollected = 0;
        payable(campaign.owner).transfer(balance);
    }

    // Request a refund for failed campaigns
    function refund(uint256 _id) public {
        _updateCampaignState(_id);
        Campaign storage campaign = s_campaigns[_id];
        if (campaign.state != CampaignState.Failed) {
            revert CrowdFunding__RefundsNotAvailable();
        }

        uint256 contribution = s_campaigns[_id]
            .backers[msg.sender]
            .totalContribution;
        if (contribution == 0) {
            revert CrowdFunding__NoContributionToRefund();
        }

        s_campaigns[_id].backers[msg.sender].totalContribution = 0;
        payable(msg.sender).transfer(contribution);
    }

    // Get all tiers for a campaign
    function getTiers(uint256 _id) public view returns (Tier[] memory) {
        return s_campaigns[_id].tiers;
    }

    // campaign update
    function updateCampaign(
        uint256 _id,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public onlyOwner(_id) deadlineInFuture(_deadline) {
        s_campaigns[_id].title = _title;
        s_campaigns[_id].description = _description;
        s_campaigns[_id].target = _target;
        s_campaigns[_id].deadline = _deadline;
        s_campaigns[_id].image = _image;
    }

    // Get campaign details
    function getCampaigns() public view returns (AllCampaigns[] memory) {
        AllCampaigns[] memory allCampaigns = new AllCampaigns[](
            s_numberOfCampaigns
        );
        for (uint256 i = 0; i < s_numberOfCampaigns; i++) {
            allCampaigns[i].owner = s_campaigns[i].owner;
            allCampaigns[i].title = s_campaigns[i].title;
            allCampaigns[i].description = s_campaigns[i].description;
            allCampaigns[i].target = s_campaigns[i].target;
            allCampaigns[i].deadline = s_campaigns[i].deadline;
            allCampaigns[i].amountCollected = s_campaigns[i].amountCollected;
            allCampaigns[i].image = s_campaigns[i].image;
            allCampaigns[i].donators = s_campaigns[i].donators.length;
            allCampaigns[i].state = s_campaigns[i].state;
            allCampaigns[i].tiers = s_campaigns[i].tiers.length;
        }

        return allCampaigns;
    }

    // Internal function to update the state of a campaign
    function _updateCampaignState(uint256 _id) internal {
        Campaign storage campaign = s_campaigns[_id];

        if (campaign.state == CampaignState.Active) {
            if (block.timestamp >= campaign.deadline) {
                campaign.state = campaign.amountCollected >= campaign.target
                    ? CampaignState.Successful
                    : CampaignState.Failed;
            } else {
                campaign.state = campaign.amountCollected >= campaign.target
                    ? CampaignState.Successful
                    : CampaignState.Active;
            }
        }
    }

    // get the number of campaigns
    function getNumberOfCampaigns() public view returns (uint256) {
        return s_numberOfCampaigns;
    }

    // get campaign details
    function getCampaign(
        uint256 _id
    ) public view returns (CampaignView memory) {
        CampaignView memory campaignView = CampaignView({
            owner: s_campaigns[_id].owner,
            title: s_campaigns[_id].title,
            description: s_campaigns[_id].description,
            target: s_campaigns[_id].target,
            deadline: s_campaigns[_id].deadline,
            amountCollected: s_campaigns[_id].amountCollected,
            image: s_campaigns[_id].image,
            donators: s_campaigns[_id].donators,
            state: s_campaigns[_id].state,
            tiers: s_campaigns[_id].tiers
        });
        return campaignView;
    }

    // get the number of backers
    function getNumberOfBackers(uint256 _id) public view returns (uint256) {
        return s_campaigns[_id].donators.length;
    }

    // get the backers for a campaign
    function getBackers(uint256 _id) public view returns (address[] memory) {
        return s_campaigns[_id].donators;
    }

    // get the total contribution of a backer
    function getTotalContribution(
        uint256 _id,
        address _backer
    ) public view returns (uint256) {
        return s_campaigns[_id].backers[_backer].totalContribution;
    }

    // get the funded tiers of a backer
    function getFundedTiers(
        uint256 _id,
        address _backer
    ) public view returns (bool[] memory) {
        bool[] memory fundedTiers = new bool[](s_campaigns[_id].tiers.length);
        for (uint256 i = 0; i < s_campaigns[_id].tiers.length; i++) {
            fundedTiers[i] = s_campaigns[_id].backers[_backer].fundedTiers[i];
        }
        return fundedTiers;
    }
}
