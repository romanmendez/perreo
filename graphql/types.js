const { InfoQueryType } = require("../src/components/info");
const {
  DogType,
  DogMutationType,
  DogQueryType,
} = require("../src/components/dog");
const {
  AttendanceType,
  AttendanceMutationType,
  AttendanceQueryType,
} = require("../src/components/attendance");
const {
  OwnerType,
  OwnerMutationType,
  OwnerQueryType,
} = require("../src/components/owner");
const {
  PassType,
  PassQueryType,
  PassMutationType,
} = require("../src/components/pass");
const {
  UserType,
  UserQueryType,
  UserMutationType,
} = require("../src/components/user");

module.exports = `
  scalar Date
  type Query {
    ${InfoQueryType}
    ${DogQueryType}
    ${AttendanceQueryType}
    ${OwnerQueryType}
    ${PassQueryType}
    ${UserQueryType}
  }
  type Mutation {
    ${DogMutationType}
    ${AttendanceMutationType}
    ${OwnerMutationType}
    ${PassMutationType}
    ${UserMutationType}
  }
  ${DogType}
  ${AttendanceType}
  ${OwnerType}
  ${PassType}
  ${UserType}
`;
