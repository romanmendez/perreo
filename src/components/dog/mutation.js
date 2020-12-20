module.exports = {
  createDog: async (parent, args, context) => {
    // const { userId } = context;
    // if (!userId) throw new Error("You must be logged in to add a new dog.");

    const newDog = await context.prisma.dog.create({
      data: {
        name: args.name,
        sex: args.sex,
        breed: { connect: { id: Number(args.breedId) } },
      },
    });
    console.log(newDog);
    return newDog;
  },
  deleteDog: async (parent, args, context) => {
    const { userId } = context;
    if (!userId) throw new Error("You must be logged in to delete a dog.");

    return await context.prisma.dog.delete({ where: { id: args.id } });
  },
};
