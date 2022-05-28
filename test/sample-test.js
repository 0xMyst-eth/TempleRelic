const { expect } = require("chai");
const { ethers } = require("hardhat");

let Relic, relic, Items, items, Whitelister, whitelister;
let owner, add1, add2; 

describe("Greeter", function () {
  beforeEach("Initialise",async ()=>{
    [owner,add1, add2] = await ethers.getSigners();
    Relic = await ethers.getContractFactory("Relic");
    relic = await Relic.deploy();

    Items = await ethers.getContractFactory("RelicItems");
    items = await Items.deploy();

    Whitelister = await ethers.getContractFactory("DummyWhitelister");
    whitelister = await Whitelister.deploy();

    await relic.setItemContract(items.address);
    await items.setRelic(relic.address);
    await items.addWhitelister(whitelister.address);
    await relic.whitelistTemplar(add1.address);
    await whitelister.setRelicItems(items.address);
    await whitelister.whitelist(add1.address,0);


  });

  it("should mint", async ()=>{
    await relic.connect(add1).mintRelic();
    await items.connect(add1).mintFromUser(0);

    console.log("balance is ", await items.balanceOf(add1.address,0));

    await relic.connect(add1).batchEquipItems(0, [0],[1]);
  });
});
