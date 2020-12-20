const AttendanceQuery = require("./query");
const AttendanceMutation = require("./mutation");

const Attendance = {
  dog: (parent, args, context) => {
    return context.prisma.attendance
      .findUnique({ where: { id: parent.id } })
      .dog();
  },
};

module.exports = { Attendance, AttendanceQuery, AttendanceMutation };
