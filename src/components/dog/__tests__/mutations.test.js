const { ApolloServer, gql } = require("apollo-server");
const model = require("@db/models");
const resolvers = require("@graphql/resolvers");
const utils = require("@utils/index");
const types = require("@graphql/types");
const { fakeDogBuilder } = require("@test/builders");
const { createTestClient } = require("apollo-server-testing");

jest.mock("@db/models");

beforeEach(() => {
  jest.clearAllMocks();
});

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

describe("createDog mutations", () => {
  const dogs = fakeDogBuilder(2);
  const { name, breed, sex, dateOfBirth } = dogs[0];

  const createDogMutation = gql`
    mutation CreateDog($input: DogInput) {
      createDog(input: $input) {
        id
      }
    }
  `;
  test(`createDog returns a dog ID`, async () => {
    model.dog.create.mockReturnValueOnce({ id: 1, ...dogs[0] });

    const { data, errors } = await mutate({
      mutation: createDogMutation,
      variables: { input: { name, breed, sex, dateOfBirth } },
    });

    expect(model.dog.create).toHaveBeenCalledTimes(1);
    expect(model.dog.create).toHaveBeenCalledWith({
      name,
      breed,
      sex,
      dateOfBirth,
    });
    expect(data.createDog.id).toBe("1");
    expect(errors).toBeFalsy();
  });

  test("createDog with missing required field return error", async () => {
    const { data, errors } = await mutate({
      mutation: createDogMutation,
      variables: { input: { name } },
    });
    expect(model.dog.create).toHaveBeenCalledTimes(1);
    expect(model.dog.create).toHaveBeenCalledWith({
      name,
    });
    expect(data).toBeNull();
    expect(errors).toBeDefined();
  });
});

describe("update, archive and delete dog", () => {
  const [fakeDog] = fakeDogBuilder(1);
  const { name, breed, sex, dateOfBirth } = fakeDog;
  const fakeDogID = "1";

  test("update dog name returns new dog name", async () => {
    const updateDog = gql`
      mutation UpdateDog($id: ID!, $input: DogInput) {
        updateDog(id: $id, input: $input) {
          id
          name
        }
      }
    `;

    const updatedName = "Max";
    model.dog.findOneAndUpdate.mockReturnValueOnce({
      id: fakeDogID,
      ...fakeDog,
      name: updatedName,
    });
    const { data: updateData } = await mutate({
      mutation: updateDog,
      variables: { id: fakeDogID, input: { name: updatedName } },
    });

    expect(model.dog.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(model.dog.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: fakeDogID,
      },
      { name: updatedName },
      { returnOriginal: false }
    );
    expect(updateData.updateDog.id).toEqual(fakeDogID);
    expect(updateData.updateDog.name).toEqual(updatedName);
  });

  test("archive dog turn isActive to false", async () => {
    const archiveDog = gql`
      mutation ArchiveDog($id: ID!) {
        archiveDog(id: $id) {
          id
          isActive
        }
      }
    `;
    model.dog.findOneAndUpdate.mockReturnValueOnce({
      id: fakeDogID,
      ...fakeDog,
      isActive: false,
    });
    const { data: archiveData } = await mutate({
      mutation: archiveDog,
      variables: { id: fakeDogID },
    });

    expect(model.dog.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(model.dog.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: fakeDogID,
      },
      { isActive: false },
      { returnOriginal: false }
    );
    expect(archiveData.archiveDog).toEqual({
      id: fakeDogID,
      isActive: false,
    });
  });
  test("delete dog returns true and eliminates dog from db", async () => {
    const deleteDog = gql`
      mutation DeleteDog($id: ID!) {
        deleteDog(id: $id)
      }
    `;

    model.dog.deleteOne.mockReturnValueOnce({ ok: true });

    const { data: deleteData } = await mutate({
      mutation: deleteDog,
      variables: { id: fakeDogID },
    });

    expect(model.dog.deleteOne).toHaveBeenCalledTimes(1);
    expect(model.dog.deleteOne).toHaveBeenCalledWith({
      _id: fakeDogID,
    });
    expect(deleteData.deleteDog).toEqual(true);
  });
});
