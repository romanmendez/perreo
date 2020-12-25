const DogQueryType = `
  dogs: [Dog!]!
  dogsCurrently: [Dog!]
  dog(id: String!): Dog
`;

const DogQueryResolver = {
  dogs: async (parent, args, context) => await context.model.dog.find(),
  dogsCurrently: async (parent, args, context) => {
    const attendances = await context.model.attendance
      .find({ end: null })
      .populate("dog");
    return attendances.map((att) => att.dog);
  },
  dog: async (parent, args, context) =>
    await context.model.dog.findById(args.id),
};

module.exports = { DogQueryType, DogQueryResolver };
