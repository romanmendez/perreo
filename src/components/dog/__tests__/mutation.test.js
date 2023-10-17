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

describe("createDog tests", () => {
  const [fakeDog1, fakeDog2] = fakeDogBuilder(2);
  const { name, breed, sex, dateOfBirth } = fakeDog1;

  const createDogMutation = gql`
    mutation CreateDog($input: DogInput) {
      createDog(input: $input) {
        id
      }
    }
  `;

  test("createDog with all required fields returns new dog id", async () => {
    const { data, errors } = await mutate({
      mutation: createDogMutation,
      variables: { input: { name, breed, sex, dateOfBirth } },
    });
    // create second dog for later test
    await mutate({
      mutation: createDogMutation,
      variables: { input: fakeDog2 },
    });
    expect(data.createDog.id).toHaveLength(24);
    expect(errors).toBeFalsy();
  });
  test("createDog with missing required field return error", async () => {
    const { data, errors } = await mutate({
      mutation: createDogMutation,
      variables: { input: { name } },
    });
    expect(data).toBeNull();
    expect(errors).toBeDefined();
  });
});

describe("update, archive and delete dog", () => {
  const queryDogs = gql`
    query QueryDogs {
      dogs {
        id
        name
      }
    }
  `;

  test("update dog name returns new dog name", async () => {
    const { data: queryData } = await query({
      query: queryDogs,
    });
    const queriedDogID = queryData.dogs[0].id;

    const updateDog = gql`
      mutation UpdateDog($id: ID!, $input: DogInput) {
        updateDog(id: $id, input: $input) {
          id
          name
        }
      }
    `;
    const updatedName = "Max";
    const { data: updateData } = await mutate({
      mutation: updateDog,
      variables: { id: queriedDogID, input: { name: updatedName } },
    });
    expect(updateData.updateDog.id).toEqual(queriedDogID);
    expect(updateData.updateDog.name).toEqual(updatedName);
  });
  test("archive dog turn isActive to false", async () => {
    const { data: queryData } = await query({
      query: queryDogs,
    });
    const queriedDogID = queryData.dogs[0].id;

    const archiveDog = gql`
      mutation ArchiveDog($id: ID!) {
        archiveDog(id: $id) {
          id
          isActive
        }
      }
    `;
    const { data: updateData } = await mutate({
      mutation: archiveDog,
      variables: { id: queriedDogID },
    });
    expect(updateData.archiveDog.id).toEqual(queriedDogID);
    expect(updateData.archiveDog.isActive).toBeFalsy();
  });
  test("delete dog returns true and eliminates dog from db", async () => {
    const { data: queryData } = await query({
      query: queryDogs,
    });
    const queriedDogID = queryData.dogs[0].id;

    const deleteDog = gql`
      mutation DeleteDog($id: ID!) {
        deleteDog(id: $id)
      }
    `;
    const { data: updateData } = await mutate({
      mutation: deleteDog,
      variables: { id: queriedDogID },
    });
    expect(updateData.deleteDog).toBe(true);
  });
});
