const { GraphQLScalarType } = require("graphql");
const { format } = require("date-fns");
const { Kind } = require("graphql/language");
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
  UserResolver: User,
  UserMutationResolver,
  UserQueryResolver,
} = require("../src/components/user");

module.exports = {
  Query: {
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
  Owner,
  Attendance,
  PassOwned,
  User,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    // value from client
    parseValue(value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date;
    },

    // value to client
    serialize(value) {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        throw new Error("Invalid date");
      }
      return format(value, "dd/MM/yyyy");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // ast value is always in string format
      }
      return null;
    },
  }),
};
