const formatDuration = require("date-fns/formatDuration");
const { updateResolver, deleteResolver } = require("../../../graphql/defaults");

const PassMutationType = `
  createPass(input: PassInput!): Pass!
  sellPass(passId: String!, dogId: String!): PassOwned!
  usePassOwned(passOwnedId: String! attendanceMinutes: Int!): PassOwned!
  updatePass(id: ID!, input: PassInput): Pass!
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
  usePassOwned: async (parent, args, context) => {
    // get passOwned and check if it's active
    const passOwned = await context.model.passOwned
      .findById(args.passOwnedId)
      .populate("pass");
    if (!passOwned.active) {
      return null;
    } else {
      // if passOwned is active, caculate balance remaining after using hours from pass
      const passOwnedTimeInMinutes = Number(passOwned.pass.hoursPerDay) * 60;
      const timeNotCoveredByPass =
        args.attendanceMinutes - passOwnedTimeInMinutes;
      const balance =
        timeNotCoveredByPass > 0
          ? Math.floor((Math.abs(timeNotCoveredByPass) / 60) * price)
          : 0;

      // check daysUsed in pass and set as inactive if it's the last day
      const lastDay = passOwned.daysUsed === passOwned.pass.totalDays - 1;
      // update daysUsed in passOwned
      const usedPassOwned = await updateResolver(
        "passOwned",
        {
          id: args.passOwnedId,
          daysUsed: passOwned.daysUsed + 1,
          active: !lastDay,
        },
        context
      );
      return { passOwned: usedPassOwned, balance };
    }
  },
  updatePass: async (parent, args, context) => {
    return await updateResolver(
      "pass",
      { id: args.id, ...args.input },
      context
    );
  },
};

module.exports = { PassMutationResolver, PassMutationType };
