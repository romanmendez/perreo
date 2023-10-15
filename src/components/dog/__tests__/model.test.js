const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const mongoose = require("mongoose");
const { fakerES: faker } = require("@faker-js/faker");
const { fakeDogBuilder } = require("@test/builders");
const resolvers = require("@graphql/resolvers");
const model = require("@db/models");
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

beforeAll(() =>
  mongoose.connect("mongodb://localhost:27017/perreo_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
);
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

const { query, mutate } = createTestClient(server);

test("dogs used passes resolver", async () => {
  const [fakeDog] = fakeDogBuilder(1);
  const createDogMutation = gql`
    mutation CreateDog($input: DogInput) {
      createDog(input: $input) {
        name
        breed
        sex
        dateOfBirth
        profilePic
        fixed
        heat
        chip
        scan
      }
    }
  `;

  const { data } = await mutate({
    mutation: createDogMutation,
    variables: { input: newDog },
  });
  expect(data.createDog.name).toEqual(fakeDog.name);
});
