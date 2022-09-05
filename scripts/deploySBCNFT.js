const fs = require("fs");
const hre = require("hardhat");
const config = require("./config/config.default");
const path = require("path");
const addressFiles = hre.getAddressFiles();

async function main() {
  await config.ConfigDefault();

  const env = JSON.parse(
    fs.readFileSync(path.join(__dirname, `config/${hre.network.name}.json`))
  );

  const SBCNFT = await hre.ethers.getContractFactory("SBCNFT");
  const sbcNFT = await SBCNFT.deploy(env.name, env.symbol, env.baseTokenURI);

  await sbcNFT.deployed();

  console.log("SBCNFT deployed to:", sbcNFT.address);
  console.log(`owner is: ${await sbcNFT.owner()}`);

  fs.writeFileSync(addressFiles.sbcNFTAddressFile, sbcNFT.address);

  // Set Minter
  const accounts = await hre.ethers.getSigners();
  const minterRoleString = hre.ethers.utils.keccak256(
    hre.ethers.utils.toUtf8Bytes("MINTER_ROLE")
  );
  await sbcNFT.grantRole(minterRoleString, accounts[0].address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
