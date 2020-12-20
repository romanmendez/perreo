module.exports = {
  breeds: async (parent, args, context) =>
    await context.prisma.breed.findMany(),
};
