const { updateResolver } = require("../../../graphql/defaults");

const DogMutationType = `
  createDog(
    name: String!
    breed: String!
    sex: String!
    vaccines: [String!]
    fixed: Boolean
    heat: Date
    chip: String
    scan: String
    note: String
  ): Dog!
  updateDog(
    id: String!
    name: String
    breed: String
    sex: String
    vaccines: [String!]
    fixed: Boolean
    heat: Date
    chip: String
    scan: String
    note: String
  ): Dog!
`;
const DogMutationResolver = {
  createDog: async (parent, args, context) => {
    // const { userId } = context;
    // if (!userId) throw new Error("You must be logged in to add a new dog.");

    const newDog = await context.model.dog.create({ ...args });
    return newDog;
  },
  updateDog: async (parent, args, context) =>
    await updateResolver("dog", args, context),
};

module.exports = { DogMutationType, DogMutationResolver };
