const { createToken, getUserId } = require("./auth");
const { duration, timeFromNow, totalDuration } = require("./date-time");
const { uploadProfilePic, getProfilePic } = require("./image");

module.exports = {
  createToken,
  getUserId,
  duration,
  timeFromNow,
  totalDuration,
  uploadProfilePic,
  getProfilePic,
};
