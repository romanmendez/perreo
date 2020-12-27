const { createToken, getUserId } = require("./auth");
const { duration, timeFromNow, totalDuration } = require("./date-time");

module.exports = {
  createToken,
  getUserId,
  duration,
  timeFromNow,
  totalDuration,
};
