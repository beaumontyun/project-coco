const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Handsoff = await ethers.getContractFactory("Handsoff");
    const handsoff = await Handsoff.deploy();
    await handsoff.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

    const metadataURI = 'cid/test.png';

    // balanceOf - ERC721 method
    let balance = await handsoff.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await handsoff.payToMint(recipient, metadataURI, {value: ethers.utils.parseEther('0.08')});

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await handsoff.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await handsoff.isContentOwned(metadataURI)).to.equal(true);
  });
});
