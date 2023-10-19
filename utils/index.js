const { createToken, getUserId } = require("./auth");
const {
  duration,
  timeFromNow,
  totalDuration,
  balance,
  getPrice,
  usePassOwned,
} = require("./date-time");
const { uploadProfilePic, getProfilePic } = require("./image");

module.exports = {
  createToken,
  getUserId,
  duration,
  balance,
  getPrice,
  usePassOwned,
  timeFromNow,
  totalDuration,
  uploadProfilePic,
  getProfilePic,
};
