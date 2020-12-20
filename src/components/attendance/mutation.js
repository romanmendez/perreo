const _ = require("lodash");

module.exports = {
  startAttendance: async (parent, args, context) => {
    const start = new Date();
    return await context.prisma.attendance.create({
      data: {
        start: { start },
        dog: { connect: { id: Number(args.dogId) } },
      },
    });
  },
  endAttendance: async (parent, args, context) => {
    const end = new Date();
    return await context.prisma.attendance.update({
      data: { end },
      where: { id: args.id },
    });
  },
  updateAttendance: async (parent, args, context) => {
    const data = _.omit(args, ["id"]);
    return await context.prisma.attendance.update({
      data,
      where: { id: args.id },
    });
  },
};
