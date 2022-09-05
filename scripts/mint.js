const fs = require("fs");
const hre = require("hardhat");
const config = require("./config/config.default");
const path = require("path");

async function main() {
  await config.ConfigDefault();

  const env = JSON.parse(
    fs.readFileSync(path.join(__dirname, `config/${hre.network.name}.json`))
  );

  const sbcNFTAddress = hre.getAddress("SBCNFT");
  const SBCNFT = await hre.ethers.getContractFactory("SBCNFT");
  const sbcNFT = await SBCNFT.attach(sbcNFTAddress);

  let totalSupply = 0;
  for (let i = 0; i < env.tokenQuantity; i++) {
    const tx = await sbcNFT.mint(env.mintTo);
    await tx.wait(env.waitBlock);
    totalSupply = await sbcNFT.totalSupply();
    console.log(`Mint token ID: ${totalSupply} token to ${env.mintTo}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
