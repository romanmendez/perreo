const { AttendanceQueryType, AttendanceQueryResolver } = require("./query");
const {
  AttendanceMutationResolver,
  AttendanceMutationType,
} = require("./mutation");
const {
  AttendanceModel,
  AttendanceType,
  PaymentType,
  AttendanceResolver,
} = require("./model");

module.exports = {
  AttendanceModel,
  AttendanceType,
  PaymentType,
  AttendanceResolver,
  AttendanceQueryType,
  AttendanceQueryResolver,
  AttendanceMutationType,
  AttendanceMutationResolver,
};
