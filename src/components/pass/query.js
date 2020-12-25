const PassQueryType = `
  passes: [Pass!]!
  ownedPasses: [PassOwned!]
`;

const PassQueryResolver = {
  passes: async (parent, args, context) => {
    return await context.model.pass.find();
  },
  ownedPasses: async (parent, args, context) => {
    return await context.model.passOwned.find();
  },
};

module.exports = { PassQueryResolver, PassQueryType };
