const { DateTime } = require("luxon");
const { totalHours } = require("../../../utils");
const jsDate = new Date();
jsDate.setTime(jsDate.getTime() + jsDate.getTimezoneOffset() * 60 * 1000);

const AttendanceQueryType = `
  getAllAttendances(from: Date, to: Date): [Attendance!]
  getCurrentAttendaces: [Attendance!]
`;

const AttendanceQueryResolver = {
  getAllAttendances: async (parent, args, context) => {
    let query = {};
    if (args.from || args.to) {
      query.start = {};
      if (args.from) {
        query.start.$gte = new Date(args.from);
      }
      if (args.to) {
        query.start.$lte = new Date(args.to);
      }
    }

    return await context.model.attendance.find(query);
  },
  getCurrentAttendaces: async (parent, args, context) => {
    return await context.model.attendance.find({ end: null });
  },
};

module.exports = { AttendanceQueryResolver, AttendanceQueryType };
