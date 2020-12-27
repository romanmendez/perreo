const { DateTime } = require("luxon");

const DogQueryType = `
  dogs: [Dog!]!
  dogsCurrently: [Dog!]
  dog(id: String!): Dog
  dogsToday: [Dog!]
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
  dogsToday: async (parent, args, context) => {
    const today = DateTime.local().startOf("day");
    const attendances = await context.model.attendance
      .find({
        start: { $gte: today },
      })
      .populate("dog");
    const dogs = attendances.reduce((dogs, att) => {
      return dogs.includes(att.dog) ? dogs : [...dogs, att.dog];
    }, []);
    return dogs;
  },
};

module.exports = { DogQueryType, DogQueryResolver };
