const { createToken, getUserId } = require("./auth");
const {
  duration,
  timeFromNow,
  totalDuration,
  balance,
} = require("./date-time");
const { uploadProfilePic, getProfilePic } = require("./image");

module.exports = {
  createToken,
  getUserId,
  duration,
  balance,
  timeFromNow,
  totalDuration,
  uploadProfilePic,
  getProfilePic,
};
