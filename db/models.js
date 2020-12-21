const { AttendanceModel } = require("../src/components/attendance");
const { DogModel } = require("../src/components/dog");
const { OwnerModel } = require("../src/components/owner");
const { PassModel } = require("../src/components/pass");
const { UserModel } = require("../src/components/user");

module.exports = {
  attendance: AttendanceModel,
  dog: DogModel,
  owner: OwnerModel,
  pass: PassModel,
  user: UserModel,
};
