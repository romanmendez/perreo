const { updateResolver } = require("../../../graphql/defaults.js");

const OwnerMutationType = `
  createOwner(
    firstName: String!
    lastName: String!
    email: String
    phone: Int!
    dni: String
    dogId: String!
  ): Owner!
  updateOwner(
    id: String!
    firstName: String
    lastName: String
    email: String
    phone: Int
    dni: String
    dogId: String
  ): Owner!
`;

const OwnerMutationResolver = {
  createOwner: async (parent, args, context) => {
    const { firstName, lastName, phone } = args;
    const dog = await context.model.dog.findById(args.dogId);

    return await context.model.owner.create({
      firstName,
      lastName,
      phone,
      roll: "owner",
      dogs: [dog],
    });
  },
  updateOwner: async (parent, args, context) =>
    await updateResolver("owner", args, context),
};

module.exports = { OwnerMutationResolver, OwnerMutationType };
