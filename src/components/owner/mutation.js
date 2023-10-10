const { updateResolver } = require("../../../graphql/defaults.js");

const OwnerMutationType = `
  createOwner(input: OwnerInput): Owner!
  updateOwner(id: String!, input: OwnerInput): Owner!
`;

const OwnerMutationResolver = {
  createOwner: async (parent, args, context) => {
    const exists = await context.model.owner.exists({ dni: args.dni });
    if (exists) throw new Error("A user with this DNI already exists.");

    return await context.model.owner.create(args);
  },
  updateOwner: async (parent, args, context) =>
    await updateResolver("owner", args, context),
};

module.exports = { OwnerMutationResolver, OwnerMutationType };
