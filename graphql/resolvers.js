const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { InfoQueryResolver } = require("../src/components/info");
const {
  Dog,
  DogMutationResolver,
  DogQueryResolver,
} = require("../src/components/dog");
const {
  Attendance,
  AttendanceMutationResolver,
  AttendanceQuery,
} = require("../src/components/attendance");
const {
  PassQueryResolver,
  PassMutationResolver,
} = require("../src/components/pass");
const {
  Owner,
  OwnerMutationResolver,
  OwnerQueryResolver,
} = require("../src/components/owner");
const {
  UserMutationResolver,
  UserQueryResolver,
} = require("../src/components/user");

module.exports = {
  Query: {
    ...InfoQueryResolver,
    ...DogQueryResolver,
    ...AttendanceQuery,
    ...PassQueryResolver,
    ...OwnerQueryResolver,
    ...UserQueryResolver,
  },
  Mutation: {
    ...DogMutationResolver,
    ...AttendanceMutationResolver,
    ...PassMutationResolver,
    ...OwnerMutationResolver,
    ...UserMutationResolver,
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
