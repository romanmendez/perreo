const AttendanceQueryType = `
  attendances: [Attendance!]!
`;

const AttendanceQueryResolver = {
  attendances: async (parent, args, context) => {
    return await context.model.attendance.find();
  },
};

module.exports = { AttendanceQueryResolver, AttendanceQueryType };
