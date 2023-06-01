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

  const addressNameList = xlsx.parse(
    `${__dirname}/../transferedNFTDOCs/${newFileName}.xlsx`
  )[0].data;

  // Check address
  let mintTo = "";
  for (let i = 1; i < addressNameList.length; i++) {
    mintTo = addressNameList[i][2].trim(" ");
    if (!hre.ethers.utils.isAddress(mintTo)) {
      console.log(
        `${addressNameList[i][1]} 地址錯誤！: ${addressNameList[i][2]}`
      );
      return;
    }
  }

  // Mint
  let totalSupply = 0;
  for (let i = 1; i < addressNameList.length; i++) {
    if (addressNameList[i].length === 0) {
      continue;
    }
    mintTo = addressNameList[i][2].trim(" ");
    const tx = await sbcNFT.mint(mintTo);
    await tx.wait(1);
    totalSupply = await sbcNFT.totalSupply();
    console.log(
      `Mint token ID: ${totalSupply} token to ${mintTo}, Name: ${addressNameList[i][1]}`
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
