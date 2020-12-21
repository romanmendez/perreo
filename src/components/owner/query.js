const OwnerQueryType = `
  owners: [Owner!]!
`;

const OwnerQueryResolver = {
  owners: async (parent, args, context) => {
    return await context.model.owner.find();
  },
};

module.exports = { OwnerQueryResolver, OwnerQueryType };
