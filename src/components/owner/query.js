module.exports = {
  owners: async (parent, args, context) => {
    return await context.prisma.owner.findMany();
  },
};
