async function ConfigDefault() {
  const hre = require("hardhat");
  const fs = require("fs");
  const path = require("path");
  const networkName = hre.network.name;
  const accounts = await hre.ethers.getSigners();

  if (!fs.existsSync(path.join(__dirname, `${hre.network.name}.json`))) {
    switch (networkName) {
      case "polygon":
        fs.writeFileSync(
          path.join(__dirname, `${hre.network.name}.json`),
          JSON.stringify(
            {
              name: process.env.NAME,
              symbol: process.env.SYMBOL,
              baseTokenURI: process.env.BASE_TOKEN_URI,
              tokenQuantity: parseInt(process.env.TOKEN_QUANTITY, 10),
              mintTo: process.env.MINT_TO,
              waitBlock: 3,
            },
            null,
            4
          )
        );
        break;
      case "mumbai":
        fs.writeFileSync(
          path.join(__dirname, `${hre.network.name}.json`),
          JSON.stringify(
            {
              name: process.env.NAME,
              symbol: process.env.SYMBOL,
              baseTokenURI: process.env.BASE_TOKEN_URI,
              tokenQuantity: parseInt(process.env.TOKEN_QUANTITY, 10),
              mintTo: process.env.MINT_TO,
              waitBlock: 3,
            },
            null,
            4
          )
        );
        break;
      default:
        fs.writeFileSync(
          path.join(__dirname, `${hre.network.name}.json`),
          JSON.stringify(
            {
              name: "TestSBCNFT",
              symbol: "TSBCNFT",
              baseTokenURI: "http://test/",
              tokenQuantity: 10,
              mintTo: accounts[0].address,
              waitBlock: 1,
            },
            null,
            4
          )
        );
        break;
    }
    console.log(
      `\x1B[33mConfig file for ${networkName} doesn't exist. Default config file is created as ${hre.network.name}.json at ./config\x1B[0m`
    );

    console.log(
      `\x1B[33mPlease replace the null parameters to yours in config file\x1B[0m`
    );
  }
}

module.exports = { ConfigDefault };
