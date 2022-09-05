// const { createCanvas, loadImage } = require("canvas");
// const canvas = createCanvas(200, 200, "SVG");
// const ctx = canvas.getContext("2d");

// loadImage("./public/images/1.jpg").then((image) => {
//   ctx.drawImage(image, 50, 0, 70, 70);

//   //   console.log('<img src="' + canvas.toDataURL() + '" />');
// });

const { createCanvas, loadImage } = require("canvas");
const { getFips } = require("crypto");
const canvas = createCanvas(600, 600, "svg");
const ctx = canvas.getContext("2d");

// // Write "Awesome!"
// ctx.font = "30px Impact";
// ctx.rotate(0.1);
// ctx.fillText("Awesome!", 50, 100);

// // Draw line under text
const fs = require("fs");
// var text = ctx.measureText("Awesome!");
// ctx.strokeStyle = "rgba(0,0,0,0.5)";
// ctx.beginPath();
// ctx.lineTo(50, 102);
// ctx.lineTo(50 + text.width, 102);
// ctx.stroke();

// Draw cat with lime helmet
loadImage("0_cert_frame-min.jpg").then((image) => {
  ctx.drawImage(image, 0, 0, 600, 600);

  fs.writeFileSync("a3.svg", canvas.toBuffer("image/svg+xml"));
});
