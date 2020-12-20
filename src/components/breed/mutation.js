module.exports = {
  createBreed: async (parent, args, context) => {
    const { userId } = context;
    if (!userId) throw new Error("You need to be logged in to add a breed");

    return await context.prisma.breed.create({
      data: { ...args },
    });
  },
};
