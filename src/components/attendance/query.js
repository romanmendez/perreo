const { DateTime } = require("luxon");
const { totalHours } = require("../../../utils");
const jsDate = new Date();
jsDate.setTime(jsDate.getTime() + jsDate.getTimezoneOffset() * 60 * 1000);

const AttendanceQueryType = `
  attendances(from: Date, to: Date): [Attendance!]
  attendanceCurrently: [Attendance!]
  attendancesDay(fromNow: Int): [Attendance!]
  attendancesWeek(fromNow: Int): [Attendance!]
  attendancesMonth(fromNow: Int): [Attendance!]
  hoursDay(fromNow: Int): Int!
  hoursWeek(fromNow: Int): Int!
  hoursMonth(fromNow: Int): Int!
`;

const AttendanceQueryResolver = {
  attendances: async (parent, args, context) => {
    const { from, to } = args;
    const filter = {
      end: { $lte: to || new Date() },
    };
    if (from) filter.start = { $gt: from };

    const attendances = await context.model.attendance.find(filter);
    return attendances;
  },
  attendanceCurrently: async (parent, args, context) => {
    return await context.model.attendance.find({ payment: null });
  },
  attendancesDay: async (parent, args, context) => {
    const { fromNow } = args;
    const { start, end } = context.utils.timeFromNow(fromNow, "day");
    return await context.model.attendance.find({
      start: { $gte: start, $lte: end },
    });
  },
  attendancesWeek: async (parent, args, context) => {
    const { fromNow } = args;
    const { start, end } = context.utils.timeFromNow(fromNow, "week");
    return await context.model.attendance.find({
      start: { $gte: start, $lte: end },
    });
  },
  attendancesMonth: async (parent, args, context) => {
    const { fromNow } = args;
    const { start, end } = context.utils.timeFromNow(fromNow, "month");
    return await context.model.attendance.find({
      start: { $gte: start, $lte: end },
    });
  },
  hoursDay: async (parent, args, context) => {
    const attendancesDay = await AttendanceQueryResolver.attendancesDay(
      parent,
      args,
      context
    );
    const { hours } = context.utils.totalDuration(attendancesDay);
    return hours || 0;
  },
  hoursWeek: async (parent, args, context) => {
    const { fromNow } = args;
    const attendancesWeek = await AttendanceQueryResolver.attendancesWeek(
      parent,
      args,
      context
    );
    const { hours } = context.utils.totalDuration(attendancesWeek);
    return hours || 0;
  },
  hoursMonth: async (parent, args, context) => {
    const { fromNow } = args;
    const attendancesMonth = await AttendanceQueryResolver.attendancesMonth(
      parent,
      args,
      context
    );
    const { hours } = context.utils.totalDuration(attendancesMonth);
    return hours || 0;
  },
};

module.exports = { AttendanceQueryResolver, AttendanceQueryType };
