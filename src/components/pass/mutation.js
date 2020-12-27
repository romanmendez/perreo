const formatDuration = require("date-fns/formatDuration");

const PassMutationType = `
  createPass(
    name: String!
    type: String!
    days: Int
    hours: Int!
    expiration: Date
    price: Int!
  ): Pass!
  sellPass(passId: String!, ownerId: String!): Owner!
  usePass(passId: String!): PassOwned!
`;

const PassMutationResolver = {
  createPass: async (parent, args, context) => {
    const { name, type, days, hours, expiration, price } = args;

    switch (type) {
      case "pack":
        if (!days)
          throw new Error(
            "Please provide the number of days this pack will last."
          );
        return await context.model.pass.create({
          name,
          type,
          days,
          hours,
          price,
        });
      case "subscription":
        if (!expiration)
          throw new Error(
            "You need to provide an expiration date for subscriptions."
          );
        return await context.model.pass.create({
          name,
          type,
          expiration,
          hours,
          price,
        });
      default:
        throw new Error("Unexpected pass type.");
    }
  },
  sellPass: async (parent, args, context) => {
    const owner = await context.model.owner.findById(args.ownerId);
    const pass = await context.model.pass.findById(args.passId);

    const sale = await context.model.passOwned.create({
      owner,
      pass,
      balance: pass.type === "pack" ? pass.days : null,
    });
    await owner.updateOne({
      $push: { passes: sale },
    });
    return sale;
  },
  usePass: async (parent, args, context) => {
    return await context.model.passOwned.findByIdAndUpdate(
      args.passId,
      { $inc: { balance: -1 } },
      { returnOriginal: false }
    );
  },
};

module.exports = { PassMutationResolver, PassMutationType };
