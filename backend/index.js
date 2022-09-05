const express = require("express");
const path = require("path");
const moment = require("moment");
const { HOST } = require("./src/constants");
const db = require("./src/database");

const PORT = process.env.PORT || 5000;

const app = express()
  .set("port", PORT)
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

// Static public files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.send("Get ready for OpenSea!");
});

app.get("/api/token/:token_id/metadata.json", function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString();
  const person = db[tokenId];
  const bdayParts = person.birthday.split(" ");
  const day = parseInt(bdayParts[1]);
  const month = parseInt(bdayParts[0]);
  const data = {
    name: "ISO 14067:2018 碳足跡管理與計算基礎課程研習證書 #1",
    attributes: {
      姓名: "陳振豪",
      證照名稱: "ISO 14067:2018 碳足跡管理與計算基礎課程研習證書",
      領證日期: "2022 年 5 月 25 日",
      發證單位: "財團法人商業發展研究院",
    },
    animation_url: `https://drive.google.com/uc?export=download&id=1d4W_nyNQtLJD3JBxkufu32y6C9qePxvt`,
  };
  res.send(data);
});

app.listen(app.get("port"), function () {
  console.log("Node app is running on port", app.get("port"));
});
