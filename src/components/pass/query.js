module.exports = {
  passes: async (parent, args, context) => {
    return await context.prisma.pass.findMany();
  },
};
