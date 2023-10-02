const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

function uploadProfilePic(img, dogId) {
  const imgPath = path.join(__dirname, `../public/images/dogs/${dogId}`);
  if (!fs.existsSync(imgPath)) fs.mkdirSync(imgPath);
  sharp(img)
    .resize({ width: 34 })
    .toFormat("png")
    .toFile(path.join(imgPath, "profile.png"));
}

async function getProfilePic(pic) {}

module.exports = { uploadProfilePic, getProfilePic };
