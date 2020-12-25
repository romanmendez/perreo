const AttendanceQueryType = `
  attendances: [Attendance!]
  attendanceCurrently: [Attendance!]
`;

const AttendanceQueryResolver = {
  attendances: async (parent, args, context) => {
    const attendances = await context.model.attendance.find();
    return attendances;
  },
  attendanceCurrently: async (parent, args, context) => {
    return await context.model.attendance.find({ payment: null });
  },
};

module.exports = { AttendanceQueryResolver, AttendanceQueryType };
