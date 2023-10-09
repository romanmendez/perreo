const { updateResolver, deleteResolver } = require("../../../graphql/defaults");
const { Duration } = require("luxon");
const { PassOwned } = require("../../../graphql/resolvers");

const AttendanceMutationType = `
  startAttendance(dogId: String!): Attendance!
  endAttendance(dogId: String!): Attendance!
  payAttendance(id: String!, passOwnedId: String, cash: Int): Attendance!
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
    const attendance = await context.model.attendance.findOne({
      dog: args.dogId,
      end: null,
    });
    const newAttendance = { ...attendance._doc, end };
    const { hours, minutes } = context.utils.duration(newAttendance);

    const attendanceTimeInMinutes = Number(hours) * 60 + Number(minutes);
    const { price } = await context.model.price.findOne({ name: "hour" });
    const balance = (attendanceTimeInMinutes / 60) * price;
    console.log(balance, price);

    return await updateResolver(
      "attendance",
      { id: attendance._id, balance },
      context
    );
  },
  payAttendance: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(args.id);

    const { hours, minutes } = context.utils.duration(attendance);
    const attendanceTimeInMinutes = Number(hours) * 60 + Number(minutes);
    const price = await context.model.price.find({ name: "hour" });
    // convert total times to minutes

    let newAttendance;
    let amountOwed;

    if (args.passOwnedId) {
      // get pass and convert time to minutes
      const passOwned = await context.model.passOwned
        .findById(args.passOwnedId)
        .populate("pass");
      const passOwnedTimeInMinutes = Number(passOwned.pass.hoursPerDay) * 60;
      if (passOwned.active) {
        const balance = passOwnedTimeInMinutes - attendanceTimeInMinutes;
        if (balance >= 0) {
          newAttendance = await updateResolver(
            "attendance",
            { id: args.id, balance: 0 },
            context
          );
        } else {
          amountOwed = (balance / 60) * price;
          newAttendance = await updateResolver(
            "attendance",
            { balance: amountOwed },
            context
          );
        }
      } else {
        const cash = Number(args.cash) || 0;
        amountOwed = (attendanceTimeInMinutes / 60) * price;
        newAttendance = await updateResolver(
          "attendance",
          { balance: amountOwed - Number(args.cash) },
          context
        );
      }
    }
    return newAttendance;
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
