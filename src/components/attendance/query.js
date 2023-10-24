const { DateTime } = require("luxon");
const { totalHours } = require("@utils");
const jsDate = new Date();
jsDate.setTime(jsDate.getTime() + jsDate.getTimezoneOffset() * 60 * 1000);

const AttendanceQueryType = `
  getAllAttendances(from: Date, to: Date): [Attendance!]
  getCurrentAttendances: [Attendance!]
  getAttendanceByDog(dogId: String!): [Attendance!]
  getAttendanceByPassUsed(passOwnedId: String!): [Attendance!]
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

    return await context.model.attendance
      .find(query)
      .populate("passUsed")
      .populate("dog");
  },
  getCurrentAttendances: async (parent, args, context) => {
    return await context.model.attendance.find({ end: null });
  },
  getAttendanceByDog: async (parent, args, context) => {
    return await context.model.attendance.find({ dog: args.dogId });
  },
  getAttendanceByPassUsed: async (parent, args, context) => {
    return await context.model.attendance.find({ passUsed: args.passOwnedId });
  },
};

module.exports = { AttendanceQueryResolver, AttendanceQueryType };
