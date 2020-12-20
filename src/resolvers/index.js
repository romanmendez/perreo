const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { InfoQuery } = require("../components/info");
const { Dog, DogMutation, DogQuery } = require("../components/dog");
const { UserQuery, UserMutation } = require("../components/user");
const { BreedMutation, BreedQuery } = require("../components/breed");
const {
  Attendance,
  AttendanceMutation,
  AttendanceQuery,
} = require("../components/attendance");
const { PassQuery, PassMutation } = require("../components/pass");
const { Owner, OwnerMutation, OwnerQuery } = require("../components/owner");

module.exports = {
  Query: {
    ...InfoQuery,
    ...UserQuery,
    ...BreedQuery,
    ...DogQuery,
    ...AttendanceQuery,
    ...PassQuery,
    ...OwnerQuery,
  },
  Mutation: {
    ...DogMutation,
    ...UserMutation,
    ...BreedMutation,
    ...AttendanceMutation,
    ...PassMutation,
    ...OwnerMutation,
  },
  Dog,
  Attendance,
  Owner,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // ast value is always in string format
      }
      return null;
    },
  }),
};
