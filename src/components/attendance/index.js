const { AttendanceQueryType, AttendanceQueryResolver } = require("./query");
const {
  AttendanceMutationResolver,
  AttendanceMutationType,
} = require("./mutation");
const {
  AttendanceModel,
  AttendanceType,
  AttendanceResolver,
} = require("./model");

module.exports = {
  AttendanceModel,
  AttendanceType,
  AttendanceResolver,
  AttendanceQueryType,
  AttendanceQueryResolver,
  AttendanceMutationType,
  AttendanceMutationResolver,
};
