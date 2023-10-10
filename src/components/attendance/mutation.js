const { updateResolver, deleteResolver } = require("../../../graphql/defaults");
const { Duration } = require("luxon");
const { PassOwned } = require("../../../graphql/resolvers");
const { AttendanceModel, AttendanceResolver } = require("./model");

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
    const { price } = await context.model.price.findOne({ name: "hour" });
    const attendance = await context.model.attendance.findOne({
      dog: args.dogId,
      end: null,
    });

    return await context.model.attendance.findOneAndUpdate(
      { _id: attendance._id },
      { end, balance: context.utils.balance(attendance.start, end, price) },
      { returnOriginal: false }
    );
  },
  payAttendance: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(args.id);
    const { price } = await context.model.price.findOne({ name: "hour" });
    const { hours, minutes } = context.utils.duration(
      attendance.start,
      attendance.end
    );
    const attendanceTimeInMinutes = Number(hours) * 60 + Number(minutes);

    let balance;
    if (args.passOwnedId) {
      if (attendance.passUsed)
        throw new Error("This attendance already has a pass associated to it");
      // get pass and convert time to minutes
      const passOwned = await context.model.passOwned
        .findById(args.passOwnedId)
        .populate("pass");
      if (passOwned.active) {
        const passOwnedTimeInMinutes = Number(passOwned.pass.hoursPerDay) * 60;
        const timeNotCoveredByPass =
          attendanceTimeInMinutes - passOwnedTimeInMinutes;
        balance =
          timeNotCoveredByPass > 0
            ? Math.floor((Math.abs(timeNotCoveredByPass) / 60) * price)
            : 0;

        return await updateResolver(
          "attendance",
          {
            id: args.id,
            balance,
            passUsed: args.passOwnedId,
          },
          context
        );
      }
    } else if (args.payment) {
      if (attendance.balance === 0)
        throw new Error("This attendance doesn't have a pending balance");
      if (args.payment > attendance.balance)
        throw new Error(
          `The payment amount of ${args.payment} is greater than the pending amount ${attendance.balance}`
        );
      const payment = Number(args.payment);
      return await updateResolver(
        "attendance",
        {
          id: args.id,
          payment,
          balance: attendance.balance - payment,
        },
        context
      );
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
