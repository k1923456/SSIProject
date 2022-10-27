const fs = require("fs");
const xlsx = require("node-xlsx");
const previousTimeString = "20220928";
const timeString = "20221024";
const newFileName = "1024";

async function main() {
  const addressNameList = xlsx.parse(
    `${__dirname}/../transferedNFTDOCs/${newFileName}.xlsx`
  )[0].data;

  const mintedNFT = JSON.parse(
    fs
      .readFileSync(`${__dirname}/../mintedNFTs/${previousTimeString}.json`)
      .toString()
  );
  const newMintedNFT = Object.assign({}, mintedNFT);

  for (let i = 1; i < addressNameList.length; i++) {
    newMintedNFT[Object.keys(mintedNFT).length + i] = {
      name: `企業ESG永續規劃師研習證書 #${Object.keys(mintedNFT).length + i}`,
      description: "",
      attributes: {
        姓名: addressNameList[i][1],
        證照名稱: "企業ESG永續規劃師研習證書",
        發證日期: "2022 年 10 月 22 日",
        發證單位: "財團法人商業發展研究院",
      },
      animation_url: ``,
      background_color: "79b47c",
    };
  }
  fs.writeFileSync(
    `${__dirname}/../mintedNFTs/${timeString}.json`,
    JSON.stringify(newMintedNFT, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
