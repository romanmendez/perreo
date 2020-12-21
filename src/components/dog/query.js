const DogQueryType = `
  dogs: [Dog!]!
`;

const DogQueryResolver = {
  dogs: async (parent, args, context) => await context.model.dog.find(),
};

module.exports = { DogQueryType, DogQueryResolver };
