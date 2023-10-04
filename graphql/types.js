const {
  DogType,
  VaccineType,
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
  PassOwnedType,
  PassQueryType,
  PassMutationType,
} = require("../src/components/pass");
const {
  UserType,
  AddressType,
  AuthType,
  UserQueryType,
  UserMutationType,
} = require("../src/components/user");

module.exports = `
  scalar Date
  type Query {
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
  ${VaccineType}
  ${AttendanceType}
  ${OwnerType}
  ${PassType}
  ${PassOwnedType}
  ${UserType}
  ${AuthType}
  ${AddressType}
`;
