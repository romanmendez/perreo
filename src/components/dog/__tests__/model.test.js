const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const { fakeDogBuilder, getSchemaFields } = require("@test");
const cases = require("jest-in-case");
const resolvers = require("@graphql/resolvers");
const model = require("@db/models");
const utils = require("@utils/index");
const types = require("@graphql/types");
const { DogModel } = require("@dog");

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      utils,
      model,
    };
  },
});

const { query, mutate } = createTestClient(server);

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/perreo_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

const [fakeDog] = fakeDogBuilder(1);
const createDogMutation = gql`
  mutation CreateDog($input: DogInput) {
    createDog(input: $input) {
      id
    }
  }
`;

const dogQuery = gql`
  query DogQuery {
    dogs {
      name
      breed
      sex
      dateOfBirth
      fixed
      heat
      chip
      scan
      isActive
      notes {
        key
        value
        isActive
      }
      vaccines {
        name
        dateAdministered
        nextDue
      }
      owners {
        firstName
        lastName
        email
        phone
        dni
      }
    }
  }
`;
