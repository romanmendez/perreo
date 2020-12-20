module.exports = {
  createPass: async (parent, args, context) => {
    return await context.prisma.pass.create({ data: { ...args } });
  },
};
