const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const model = require("@db/models");
const resolvers = require("@graphql/resolvers");
const utils = require("@utils/index");
const types = require("@graphql/types");

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

beforeAll(() =>
  mongoose.connect("mongodb://localhost:27017/perreo_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
);
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

module.exports = { query, mutate, gql };
