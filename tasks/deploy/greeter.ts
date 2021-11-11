import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { ContractFactory } from "ethers";

import { Greeter } from "../../src/types/Greeter";
// import { Greeter__factory } from "../../types/factories/Greeter__factory";

task("deploy:Greeter")
  .setAction(async function (_, { ethers }) {
    const greeterFactory: ContractFactory = await ethers.getContractFactory("Greeter");
    const greeter: Greeter = <Greeter>await greeterFactory.deploy("Hello Crypto!");
    await greeter.deployed();
    console.log("Greeter deployed to: ", greeter.address);
  });