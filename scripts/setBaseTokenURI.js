const fs = require("fs");
const hre = require("hardhat");
const config = require("./config/config.default");
const path = require("path");
const xlsx = require("node-xlsx");

const newFileName = "20230601";

async function main() {
  await config.ConfigDefault();

  const env = JSON.parse(
    fs.readFileSync(path.join(__dirname, `config/${hre.network.name}.json`))
  );

  const sbcNFTAddress = hre.getAddress("SBCNFT");
  const SBCNFT = await hre.ethers.getContractFactory("SBCNFT");
  const sbcNFT = await SBCNFT.attach(sbcNFTAddress);

  // Mint
    // const tx = await sbcNFT.setBaseTokenURI("https://storage.cloud.google.com/sbcnft/metadata20240702/");
    // await tx.wait(1);
    console.log(await sbcNFT.tokenURI(1));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});