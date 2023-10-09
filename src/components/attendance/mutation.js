const { updateResolver, deleteResolver } = require("../../../graphql/defaults");
const { Duration } = require("luxon");
const { PassOwned } = require("../../../graphql/resolvers");

const AttendanceMutationType = `
  startAttendance(dogId: String!): Attendance!
  endAttendance(dogId: String!): Attendance!
  payAttendance(id: String!, passOwnedId: String, payment: Int): Attendance!
  createAttendance(dogId: String!, start: Date!, end: Date!): Attendance!
  updateAttendance(id: String!, start: Date, end: Date): Attendance!
  deleteAttendance(id: String!): Int!
`;

const AttendanceMutationResolver = {
  startAttendance: async (parent, args, context) => {
    // check to see if dog has already checked in
    const existingAttendance = await context.model.attendance.findOne({
      dog: args.dogId,
      end: null,
    });

    if (existingAttendance)
      throw new Error("This dog already has an active attendance.");

    // create new chekin
    const start = new Date();

    return await context.model.attendance.create({
      start,
      dog: args.dogId,
      payment: null,
      balance: 0,
    });
  },
  endAttendance: async (parent, args, context) => {
    const end = new Date();
    return await context.model.attendance.findOneAndUpdate(
      { dog: args.dogId },
      { end },
      { returnOriginal: false }
    );
  },
  payAttendance: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(args.id);
    const { price } = await context.model.price.findOne({ name: "hour" });
    const { hours, minutes } = context.utils.duration(attendance);
    const attendanceTimeInMinutes = Number(hours) * 60 + Number(minutes);

    let amountOwed;

    if (args.passOwnedId) {
      // get pass and convert time to minutes
      const passOwned = await context.model.passOwned
        .findById(args.passOwnedId)
        .populate("pass");
      if (passOwned.active) {
        const passOwnedTimeInMinutes = Number(passOwned.pass.hoursPerDay) * 60;
        const timeCoveredByPass =
          passOwnedTimeInMinutes - attendanceTimeInMinutes;
        if (timeCoveredByPass >= 0) {
          return await updateResolver(
            "attendance",
            { id: args.id, balance: 0, passUsed: args.passOwnedId },
            context
          );
        } else {
          amountOwed = (Math.abs(timeCoveredByPass) / 60) * price;
          return await updateResolver(
            "attendance",
            { id: args.id, balance: Math.floor(amountOwed) },
            context
          );
        }
      } else {
        const cash = Number(args.payment) || 0;
        amountOwed = (attendanceTimeInMinutes / 60) * price;
        return await updateResolver(
          "attendance",
          {
            id: args.id,
            balance: Math.floor(amountOwed) - Number(args.payment),
          },
          context
        );
      }
    }
  },
  createAttendance: async (parent, args, context) => {
    return await context.model.attendance.create({
      dog: args.dogId,
      ...args,
    });
  },
  updateAttendance: async (parent, args, context) =>
    await updateResolver("attendance", args, context),
  deleteAttendance: async (parent, args, context) =>
    await deleteResolver("attendance", args, context),
};

module.exports = { AttendanceMutationType, AttendanceMutationResolver };
