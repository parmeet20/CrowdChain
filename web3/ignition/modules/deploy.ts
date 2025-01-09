import { ethers } from "hardhat";

const main = async () => {
    const Cont = await ethers.getContractFactory("CrowdFunding");
    const deploted = await Cont.deploy();
    console.log(`DEPLOYED AT ADDRESS -> ${await deploted.getAddress()}`)
}
main().then(() => console.log("\nSUCCESS")).catch((e) => console.log(e));