const { DateTime, Duration } = require("luxon");

function daysBetween(start, end) {
  return start.getDate() - end.getDate() * 24 * 60 * 60000;
}

function duration(startTime, endTime) {
  const start = DateTime.fromJSDate(startTime);
  const end = DateTime.fromJSDate(endTime || new Date());
  const diff = end.diff(start, ["hours", "minutes"]);

  const hours = String(Math.floor(diff.hours)).padStart(2, "0");
  const minutes = String(Math.floor(diff.minutes) % 60).padStart(2, "0");

  return { hours, minutes };
}

function balance(startTime, endTime, price) {
  const { hours, minutes } = duration(startTime, endTime);
  const attendanceTimeInMinutes = Number(hours) * 60 + Number(minutes);
  return Math.floor((attendanceTimeInMinutes / 60) * price);
}

async function getPrice(context) {
  const { value: price } = await context.model.data.findOne({
    key: "pricePerHour",
  });
  return price;
}

function timeFromNow(number, period) {
  const start = DateTime.local()
    .startOf(period)
    .plus({ [`${period}s`]: -number || 0 });
  const end = DateTime.local()
    .endOf(period)
    .plus({ [`${period}s`]: -number || 0 });
  return { start, end };
}

function totalDuration(attendancesArray) {
  const durations = attendancesArray.map((att) => {
    return duration(att.start, att.end);
  });
  const sum = durations.reduce((sum, dur) => {
    Duration.fromObject(dur);
    return sum.plus(dur);
  }, Duration.fromObject({}));
  return sum.normalize().toObject();
}

module.exports = { duration, timeFromNow, totalDuration, balance, getPrice };
