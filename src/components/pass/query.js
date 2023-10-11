const PassQueryType = `
  passes(filter: PassInput): [Pass!]!
  ownedPasses: [PassOwned!]
  archivePasses: [Pass!]
`;

const PassQueryResolver = {
  passes: async (parent, args, context) => {
    return await context.model.pass.find({ ...args.filter, isActive: true });
  },
  ownedPasses: async (parent, args, context) => {
    return await context.model.passOwned.find();
  },
  archivePasses: async (parent, args, context) => {
    return await context.model.pass.find({ isActive: false });
  },
};

module.exports = { PassQueryResolver, PassQueryType };
