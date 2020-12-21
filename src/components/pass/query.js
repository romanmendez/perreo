const PassQueryType = `
  passes: [Pass!]!
`;

const PassQueryResolver = {
  passes: async (parent, args, context) => {
    return await context.model.pass.find();
  },
};

module.exports = { PassQueryResolver, PassQueryType };
