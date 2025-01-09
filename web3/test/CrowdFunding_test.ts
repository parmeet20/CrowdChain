import { expect } from 'chai'
import { Signer } from 'ethers'
import { ethers } from 'hardhat'
import { CrowdFunding } from '../typechain-types';
describe('CrowdFundingTests', () => {
    let contract: CrowdFunding;
    let owner: Signer;
    let funder1: Signer;
    beforeEach(async () => {
        const cont = await ethers.getContractFactory("CrowdFunding");
        contract = await cont.deploy();
        [owner, funder1] = await ethers.getSigners();
    })
    describe('deployments', () => {
        it('should set the owner', async () => {
            const contOwner = await contract.owner();
            const ownerAddress = await owner.getAddress();
            expect(contOwner).to.equal(ownerAddress);
        })
    })
    describe('creation', () => {
        it('should create new campaign', async () => {
            const camp = await contract.connect(owner).createCampaign("My campaign", "My new campaign", ethers.parseUnits("10", 18));
            await camp.wait();
            expect(await contract.campaignCount()).to.equal(1);
        })
    })
    describe('fund', () => {
        it('should fund ether and owner can withdraw funds', async () => {
            const camp1 = await contract.connect(funder1).createCampaign("My campaign", "My new campaign", ethers.parseUnits("10", 18));
            await camp1.wait();
            expect(await contract.campaignCount()).to.equal(1);
    
            const ethAmount = ethers.parseUnits("10", 18);
            const tx = await contract.connect(funder1).fundCampaign(1, { value: ethAmount });
            await tx.wait();
    

            const camp = await contract.getCampaign(1);
            expect(camp.isClosed).to.equal(true);
            expect(camp.owner).to.equal(await funder1.getAddress());
            const tx1 = await contract.connect(funder1).withdrawFunds(1);
            await tx1.wait();
    
        });
    });
    
})