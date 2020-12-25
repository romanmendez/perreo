const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { InfoQueryResolver } = require("../src/components/info");
const {
  DogResolver: Dog,
  DogMutationResolver,
  DogQueryResolver,
} = require("../src/components/dog");
const {
  AttendanceResolver: Attendance,
  AttendanceMutationResolver,
  AttendanceQueryResolver,
} = require("../src/components/attendance");
const {
  PassOwnedResolver: PassOwned,
  PassQueryResolver,
  PassMutationResolver,
} = require("../src/components/pass");
const {
  OwnerResolver: Owner,
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
    ...AttendanceQueryResolver,
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
  PassOwned,
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
