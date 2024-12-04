// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CrowdFunding.sol";

contract CrowdFundingTest is Test {
    CrowdFunding public crowdfunding;

    address public owner = address(0x1);
    address public backer1 = address(0x2);

    function setUp() public {
        crowdfunding = new CrowdFunding();
    }

    function testCreateCampaign() public {
        vm.prank(owner);
        uint256 campaignId =
            crowdfunding.createCampaign("Test Campaign", "Description", 10 ether, block.timestamp + 7 days, "image.jpg");

        CrowdFunding.CampaignView memory campaign = crowdfunding.getCampaign(campaignId);

        assertEq(campaign.owner, owner);
        assertEq(campaign.title, "Test Campaign");
        assertEq(campaign.description, "Description");
        assertEq(campaign.target, 10 ether);
        assertEq(campaign.amountCollected, 0);
        assertEq(campaign.deadline, block.timestamp + 7 days);
        assertEq(campaign.image, "image.jpg");
        assertEq(uint256(campaign.state), uint256(CrowdFunding.CampaignState.Active));
    }

    function testAddTier() public {
        vm.prank(owner);
        uint256 campaignId =
            crowdfunding.createCampaign("Test Campaign", "Description", 10 ether, block.timestamp + 7 days, "image.jpg");

        vm.prank(owner);
        crowdfunding.addTier(campaignId, "Silver", 1 ether);

        CrowdFunding.Tier[] memory tiers = crowdfunding.getTiers(campaignId);
        assertEq(tiers.length, 1);
        assertEq(tiers[0].name, "Silver");
        assertEq(tiers[0].amount, 1 ether);
    }

    function testFundTier() public {
        vm.prank(owner);
        uint256 campaignId =
            crowdfunding.createCampaign("Test Campaign", "Description", 10 ether, block.timestamp + 7 days, "image.jpg");

        vm.prank(owner);
        crowdfunding.addTier(campaignId, "Silver", 1 ether);

        vm.prank(backer1);
        vm.deal(backer1, 1 ether);
        crowdfunding.fund{value: 1 ether}(campaignId, 0);

        CrowdFunding.CampaignView memory campaign = crowdfunding.getCampaign(campaignId);

        assertEq(campaign.amountCollected, 1 ether); // Fix assertion
        assertEq(uint256(campaign.state), uint256(CrowdFunding.CampaignState.Active));
    }
}
