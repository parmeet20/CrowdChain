// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CrowdFunding{
    struct Campaign{
        uint id;
        string name;
        string description;
        uint256 goal;
        uint256 fundRaised;
        address owner;
        bool isClosed;
    }
    address payable public owner;
    uint public campaignCount;
    mapping(uint=>Campaign) public campaigns;
    constructor(){
        campaignCount = 0;
        owner = payable(msg.sender);
    }
    function createCampaign(string memory _name,string memory _description,uint _goal)public{
        campaignCount++;
        Campaign memory cp = Campaign(campaignCount,_name,_description,_goal,0,msg.sender,false);
        campaigns[campaignCount] = cp;
    }
    function fundCampaign(uint _campaignId)public payable {
        Campaign storage cp = campaigns[_campaignId];
        require(!cp.isClosed,"Campaign is closed");
        require(msg.value>=0,"Must send Ether to fund the campaign");
        cp.fundRaised += msg.value;
        if(cp.goal<=cp.fundRaised){
            cp.isClosed = true;
        }
    }
    function getAllCampaigns()public view returns(Campaign[] memory) {
        Campaign[] memory cp = new Campaign[](campaignCount);
        for(uint i = 1; i <= campaignCount; i++){
            cp[i-1] = campaigns[i];
        }
        return cp;
    }
    function getCampaign(uint _id)public view returns(Campaign memory){
        return campaigns[_id];
    }
    function withdrawFunds(uint _id)public {
        Campaign storage cp = campaigns[_id];
        require(msg.sender == cp.owner,"Only owner can withdwaw funds");
        require(cp.isClosed,"Campaign is not closed yet");
        require(cp.fundRaised>0,"No funds to withdraw");
        uint amount = cp.fundRaised;
        payable(cp.owner).transfer(amount);
    }
}