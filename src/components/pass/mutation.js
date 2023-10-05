const formatDuration = require("date-fns/formatDuration");

const PassMutationType = `
  createPass(
    name: String!
    totalDays: Int
    hoursPerDay: Int!
    price: Int!
    expiration: Date
  ): Pass!
  sellPass(passId: String!, dogId: String!): PassOwned!
  usePass(passId: String!): PassOwned!
`;

const PassMutationResolver = {
  createPass: async (parent, args, context) => {
    return await context.model.pass.create(args);
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
    console.log(passOwned, dogUpdate);
    return passOwned;
  },
  usePass: async (parent, args, context) => {
    return await context.model.passOwned.findByIdAndUpdate(
      args.passId,
      { $inc: { daysUsed: +1 } },
      { returnOriginal: false }
    );
  },
};

module.exports = { PassMutationResolver, PassMutationType };
