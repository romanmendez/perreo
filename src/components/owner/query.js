const OwnerQueryType = `
  owners: [Owner!]!
  owner(dni: String): Owner
`;

const OwnerQueryResolver = {
  owners: async (parent, args, context) => {
    return await context.model.owner.find();
  },
  owner: async (parent, args, context) => {
    return await context.model.owner.findOne({ dni: args.dni });
  },
};

module.exports = { OwnerQueryResolver, OwnerQueryType };
