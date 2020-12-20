module.exports = {
  dogs: async (parent, args, context) => await context.prisma.dog.findMany(),
};
