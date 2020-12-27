const { DogMutationResolver, DogModel } = require("..");
const {
  ownerBuilder,
  contextBuilder,
  parentBuilder,
  dogBuilder,
} = require("utils/builders");
const { OwnerModel } = require("../../owner");

function createDogBuild() {
  const context = contextBuilder();
  const parent = parentBuilder();
  const args = { ownerId: "1" };
  const oldFakeDog = dogBuilder();
  const fakeOwner = ownerBuilder({
    overrides: { _id: args.ownerId, dogs: oldFakeDog },
  });
  const newFakeDog = dogBuilder({ overrides: { owners: [fakeOwner] } });
  const updatedFakeOwner = { ...fakeOwner, dogs: [oldFakeDog, newFakeDog] };

  return {
    context,
    parent,
    args,
    oldFakeDog,
    newFakeDog,
    fakeOwner,
    updatedFakeOwner,
  };
}

beforeEach(() => jest.resetAllMocks());

test(`createDog finds the owner and updates it`, async () => {
  const {
    context,
    parent,
    args,
    oldFakeDog,
    newFakeDog,
    fakeOwner,
    updatedFakeOwner,
  } = createDogBuild();

  const OwnerSpy = jest.spyOn(OwnerModel, "updateOne");
  const DogSpy = jest.spyOn(DogModel, "create");
  context.model.owner.findById.mockResolvedValueOnce(OwnerModel);
  context.model.dog.create.mockResolvedValueOnce(DogModel);

  const result = await DogMutationResolver.createDog(parent, args, context);

  expect(context.model.owner.findById).toHaveBeenCalledWith(args.ownerId);
  expect(context.model.owner.findById).toHaveBeenCalledTimes(1);
  expect(OwnerModel.updateOne).toHaveBeenCalledWith({
    $push: { dogs: newFakeDog },
  });
  expect(OwnerSpy.updateOne).toHaveBeenCalledTimes(1);
  expect(fakeOwner).toEqual(updatedFakeOwner);
});

test(`createDog returns a new dog object`, async () => {
  const {
    context,
    parent,
    args,
    oldFakeDog,
    newFakeDog,
    fakeOwner,
    updatedFakeOwner,
  } = createDogBuild();

  context.model.owner.findById.mockResolvedValueOnce(fakeOwner);
  context.model.dog.create.mockResolvedValueOnce(newFakeDog);
  fakeOwner.updateOne.mockResolvedValueOnce(updatedFakeOwner);

  const result = await DogMutationResolver.createDog(parent, args, context);
  expect(context.model.dog.create).toHaveBeenCalledWith({
    ...args,
    owners: [fakeOwner],
  });
  expect(context.model.dog.create).toHaveBeenCalledTimes(1);
  expect(result).toEqual(newFakeDog);
});
