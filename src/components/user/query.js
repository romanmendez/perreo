module.exports = {
  users: async (parent, args, context) => await context.prisma.user.findMany(),
};
