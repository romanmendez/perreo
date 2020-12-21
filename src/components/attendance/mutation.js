const { updateResolver, deleteResolver } = require("../../../graphql/defaults");

const AttendanceMutationType = `
  startAttendance(dogId: String!): Attendance!
  endAttendance(id: String!): Attendance!
  updateAttendance(id: String!, start: Date, end: Date): Attendance!
  deleteAttendance(id: String!): Int!
`;

const AttendanceMutationResolver = {
  startAttendance: async (parent, args, context) => {
    const start = new Date();
    const dog = await context.model.dog.findById(args.dogId);

    return await context.model.attendance.create({
      start,
      dog,
    });
  },
  endAttendance: async (parent, args, context) => {
    const end = new Date();
    const attendance = await context.model.attendance.findOneAndUpdate(
      { _id: args.id },
      { end },
      { returnOriginal: false }
    );
    console.log(attendance);
    return attendance;
  },
  updateAttendance: async (parent, args, context) =>
    await updateResolver("attendance", args, context),
  deleteAttendance: async (parent, args, context) =>
    await deleteResolver("attendance", args, context),
};

module.exports = { AttendanceMutationType, AttendanceMutationResolver };
