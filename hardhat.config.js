require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const fs = require("fs");
const path = require("path");
const contractAddressDirectory = "./.contractAddress";

const constructGetAddressFiles = (networkName) => {
  if (!fs.existsSync(`${contractAddressDirectory}/${networkName}`)) {
    fs.mkdirSync(`${contractAddressDirectory}/${networkName}`, {
      recursive: true,
    });
  }
  return () => {
    return {
      sbcNFTAddressFile: `${contractAddressDirectory}/${networkName}/SBCNFT`,
    };
  };
};

const constructGetAddress = (networkName) => {
  return (contractName) => {
    return fs
      .readFileSync(
        `${contractAddressDirectory}/${networkName}/${contractName}`
      )
      .toString();
  };
};

extendEnvironment((hre) => {
  hre.getAddressFiles = constructGetAddressFiles(hre.network.name);
  hre.getAddress = constructGetAddress(hre.network.name);
});

task("verify-sbcnft", "Verify SBCNFT.sol").setAction(async (taskArgs, hre) => {
  const sbcNFTEnv = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `scripts/config/${hre.network.name}.json`)
    )
  );
  try {
    await hre.run("verify:verify", {
      address: hre.getAddress("SBCNFT"),
      constructorArguments: [
        sbcNFTEnv.name,
        sbcNFTEnv.symbol,
        sbcNFTEnv.baseTokenURI,
      ],
      contract: "contracts/SBCNFT.sol:SBCNFT",
    });
  } catch (err) {
    console.log(err);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  networks: {
    dev: {
      url: `http://127.0.0.1:8545`,
    },
    polygon: {
      url: `https://newest-silent-pond.matic.discover.quiknode.pro/9e3f34749691b7ecd24aad9ead57ce1eb1b12280/`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    mumbai: {
      url: `https://matic-mumbai.chainstacklabs.com`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.POLYSCAN_APIKEY,
  },
};
