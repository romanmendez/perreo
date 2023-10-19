const formatDuration = require("date-fns/formatDuration");
const { updateResolver, deleteResolver } = require("@graphql/defaults");

const PassMutationType = `
  createPass(input: PassInput!): Pass!
  sellPass(passId: String!, dogId: String!): PassOwned!
  updatePass(id: ID!, input: PassInput): Pass!
  archivePass(id: ID!): Pass!
`;

const PassMutationResolver = {
  createPass: async (parent, args, context) => {
    return await context.model.pass.create(args.input);
  },
  sellPass: async (parent, args, context) => {
    const dog = await context.model.dog.findById(args.dogId);
    const pass = await context.model.pass.findById(args.passId);

    const passOwned = await context.model.passOwned.create({
      pass,
      daysUsed: 0,
      active: true,
    });
    const dogUpdate = await dog.updateOne({
      $push: { passes: passOwned },
    });
    return passOwned;
  },
  updatePass: async (parent, args, context) => {
    return await updateResolver(
      "pass",
      { id: args.id, ...args.input },
      context
    );
  },
  archivePass: async (parent, args, context) => {
    return await updateResolver(
      "pass",
      { id: args.id, isActive: false },
      context
    );
  },
};

module.exports = { PassMutationResolver, PassMutationType };
