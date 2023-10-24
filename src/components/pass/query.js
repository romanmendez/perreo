const PassQueryType = `
  passes(filter: PassInput): [Pass!]!
  passesOwned: [PassOwned!]
  archivePasses: [Pass!]
`;

const PassQueryResolver = {
  passes: async (parent, args, context) => {
    return await context.model.pass.find({ ...args.filter, isActive: true });
  },
  passesOwned: async (parent, args, context) => {
    return await context.model.passOwned.find();
  },
  archivePasses: async (parent, args, context) => {
    return await context.model.pass.find({ isActive: false });
  },
};

module.exports = { PassQueryResolver, PassQueryType };
