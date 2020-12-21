const { AttendanceQueryType, AttendanceQueryResolver } = require("./query");
const {
  AttendanceMutationResolver,
  AttendanceMutationType,
} = require("./mutation");
const { AttendanceModel, AttendanceType } = require("./model");

const Attendance = {
  dog: async (parent, args, context) => {
    const attendance = await context.model.attendance
      .findById(parent.id)
      .populate("dog");
    return attendance.dog;
  },
};

module.exports = {
  Attendance,
  AttendanceQueryType,
  AttendanceQueryResolver,
  AttendanceMutationResolver,
  AttendanceMutationType,
  AttendanceModel,
  AttendanceType,
};
