const {
  DogType,
  DogInputType,
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
  OwnerQueryFilterType,
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
  UserQueryType,
  UserMutationType,
} = require("../src/components/user");
const {
  VaccineType,
  VaccineInputType,
  NoteType,
  NoteInputType,
  AuthType,
  AddressType,
} = require("../src/components/other");

module.exports = `
  scalar Date
  ${OwnerQueryFilterType}
  ${DogInputType}
  ${NoteInputType}
  ${VaccineInputType}
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
  ${NoteType}
  ${AttendanceType}
  ${OwnerType}
  ${PassType}
  ${PassOwnedType}
  ${UserType}
  ${AuthType}
  ${AddressType}
`;
