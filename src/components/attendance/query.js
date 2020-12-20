module.exports = {
  attendances: async (parent, args, context) => {
    return await context.prisma.attendance.findMany();
  },
};
