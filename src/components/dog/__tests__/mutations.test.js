const { fakeDogBuilder } = require("@test/builders");
const { query, mutate, gql } = require("@test/test-server");
const model = require("@db/models");

jest.mock("@db/models");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createDog mutations", () => {
  const [fakeDog] = fakeDogBuilder();
  const { name, breed, sex, dateOfBirth } = fakeDog;

  const createDogMutation = gql`
    mutation CreateDog($input: DogInput) {
      createDog(input: $input) {
        id
      }
    }
  `;
  test(`createDog calls the dog.create function and returns new document`, async () => {
    model.dog.create.mockReturnValueOnce(fakeDog);

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
    expect(data.createDog.id).toBe(fakeDog.id);
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
      ...fakeDog,
      name: updatedName,
    });
    const { data: updateData } = await mutate({
      mutation: updateDog,
      variables: { id: fakeDog.id, input: { name: updatedName } },
    });

    expect(model.dog.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(model.dog.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: fakeDog.id,
      },
      { name: updatedName },
      { returnOriginal: false }
    );
    expect(updateData.updateDog.id).toEqual(fakeDog.id);
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
      id: fakeDog.id,
      ...fakeDog,
      isActive: false,
    });
    const { data: archiveData } = await mutate({
      mutation: archiveDog,
      variables: { id: fakeDog.id },
    });

    expect(model.dog.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(model.dog.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: fakeDog.id,
      },
      { isActive: false },
      { returnOriginal: false }
    );
    expect(archiveData.archiveDog).toEqual({
      id: fakeDog.id,
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
      variables: { id: fakeDog.id },
    });

    expect(model.dog.deleteOne).toHaveBeenCalledTimes(1);
    expect(model.dog.deleteOne).toHaveBeenCalledWith({
      _id: fakeDog.id,
    });
    expect(deleteData.deleteDog).toEqual(true);
  });
});
