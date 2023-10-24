const formatDuration = require("date-fns/formatDuration");
const { updateResolver, deleteResolver } = require("@graphql/defaults");
const { DateTime } = require("luxon");

const PassMutationType = `
  createPass(input: PassInput!): Pass!
  sellPass(passId: String!, dogId: String!, startDate: String): PassOwned!
  updatePass(id: ID!, input: PassInput): Pass!
  archivePass(id: ID!): Pass!
`;

const PassMutationResolver = {
  createPass: async (parent, args, context) => {
    return await context.model.pass.create(args.input);
  },
  sellPass: async (parent, args, context) => {
    const dog = await context.model.dog.findById(args.dogId).populate({
      path: "passes",
      populate: {
        path: "pass",
      },
    });
    const passBeingPurchased = await context.model.pass.findById(args.passId);
    const startDate =
      DateTime.fromFormat(args.startDate, "dd/MM/yy") || DateTime.now();
    const [passAlreadyOwned] = dog.passes.filter(
      (passOwned) => passOwned.pass.name === passBeingPurchased.name
    );

    if (passAlreadyOwned)
      throw new Error(
        `${dog.name} already owns an active ${passBeingPurchased.name} pass`
      );

    const passOwned = await context.model.passOwned.create({
      pass: passBeingPurchased,
      daysUsed: 0,
      isActive: true,
      startDate,
      expirationDate: startDate
        .plus({ days: passBeingPurchased.daysToExpiration })
        .toISO(),
    });
    await updateResolver(
      "dog",
      { id: args.dogId, $push: { passes: passOwned } },
      context
    );
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
