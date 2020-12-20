module.exports = {
  createOwner: async (parent, args, context) => {
    const { name, phone } = args;
    const phoneNumber = await context.prisma.phone.create({
      data: { name: "main", number: phone },
    });

    return await context.prisma.owner.create({
      data: {
        name,
        phone: [phoneNumber],
        dogs: { connect: { id: args.dogId } },
      },
    });
  },
};
