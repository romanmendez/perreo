const { updateResolver } = require("../../../graphql/defaults");

const DogMutationType = `
  createDog(
    name: String!
    breed: String!
    sex: String!
    ownerId: String!
    vaccines: [String!]
    fixed: Boolean
    heat: Date
    chip: String
    scan: String
    note: String
  ): Dog!
  updateDog(
    id: String!
    name: String
    breed: String
    sex: String
    vaccines: [String!]
    fixed: Boolean
    heat: Date
    chip: String
    scan: String
    note: String
  ): Dog!
  addOwnerToDog(dogId: String!, ownerId: String!): Dog!
`;
const DogMutationResolver = {
  createDog: async (parent, args, context) => {
    // const { userId } = context;
    // if (!userId) throw new Error("You must be logged in to add a new dog.");
    const owner = await context.model.owner.findById(args.ownerId);
    if (!owner)
      throw new Error(
        "No owners found with this idea. You need a valid owner to register a dog."
      );

    const newDog = await context.model.dog.create({ ...args, owners: [owner] });
    await owner.updateOne({
      $push: { dogs: newDog },
    });
    return newDog;
  },
  updateDog: async (parent, args, context) =>
    await updateResolver("dog", args, context),
  addOwnerToDog: async (parent, args, context) => {
    const owner = await context.model.owner.findById(args.ownerId);
    const dog = await context.model.dog.findById(args.dogId);

    await owner.updateOne({ $push: { dogs: dog } });
    return await dog.updateOne(
      { $push: { owners: owner } },
      { returnOriginal: false }
    );
  },
};

module.exports = { DogMutationType, DogMutationResolver };
