const {
  DogType,
  DogInputType,
  VaccineType,
  VaccineInputType,
  NoteType,
  NoteInputType,
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
  AddressType,
  AuthType,
  UserQueryType,
  UserMutationType,
} = require("../src/components/user");

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
