const { updateResolver } = require("../../../graphql/defaults.js");

const OwnerMutationType = `
  createOwner(input: OwnerInput): Owner!
  addDogToOwner(ownerId: String!, dogId: String!): Owner!
  updateOwner(id: String!, input: OwnerInput): Owner!
`;

const OwnerMutationResolver = {
  createOwner: async (parent, args, context) => {
    const exists = await context.model.owner.exists({ dni: args.dni });
    if (exists) throw new Error("A user with this DNI already exists.");

    return await context.model.owner.create(args);
  },
  addDogToOwner: async (parent, args, context) => {
    const owner = await context.model.owner.findById(args.ownerId);
    const dog = await context.model.dog.findById(args.dogId);
    const dogOwners = [...new Set([...dog.owners, args.ownerId])];
    const ownerDogs = [...new Set([...owner.dogs, args.dogId])];

    await updateResolver("dog", { id: args.dogId, owners: dogOwners }, context);
    return await updateResolver(
      "owner",
      { id: args.ownerId, dogs: ownerDogs },
      context
    );
  },
  updateOwner: async (parent, args, context) =>
    await updateResolver("owner", args, context),
};

module.exports = { OwnerMutationResolver, OwnerMutationType };
