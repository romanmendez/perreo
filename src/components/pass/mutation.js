const PassMutationType = `
  createPass(
    name: String!
    duration: String!
    expiration: String
    limit: String
    price: Int!
  ): Pass!
`;

const PassMutationResolver = {
  createPass: async (parent, args, context) => {
    return await context.model.pass.create(args);
  },
};

module.exports = { PassMutationResolver, PassMutationType };
