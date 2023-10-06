const { updateResolver, deleteResolver } = require("../../../graphql/defaults");

const AttendanceMutationType = `
  startAttendance(dogId: String!): Attendance!
  endAttendance(dogId: String!): Attendance!
  createAttendance(dogId: String!, startDate: Date!, endDate: Date!): Attendance!
  updateAttendance(id: String!, start: Date, end: Date): Attendance!
  closeAttendance(id: String!, passOwnedId: String!): Attendance!
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
    const attendance = await context.model.attendance.findOneAndUpdate(
      { dog: args.dogId },
      { end },
      { returnOriginal: false }
    );
    return attendance;
  },
  createAttendance: async (parent, args, context) => {
    const dog = await context.model.dog.findById(args.dogId);
    return await context.model.attendance.create({
      start: args.startDate,
      end: args.endDate,
      dog,
    });
  },
  updateAttendance: async (parent, args, context) =>
    await updateResolver("attendance", args, context),
  deleteAttendance: async (parent, args, context) =>
    await deleteResolver("attendance", args, context),
};

module.exports = { AttendanceMutationType, AttendanceMutationResolver };
