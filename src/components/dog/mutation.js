const { updateResolver } = require("../../../graphql/defaults");

const DogMutationType = `
  createDog(input: DogInput): Dog!
  updateDog(id: ID!, input: DogInput): Dog!
`;
const DogMutationResolver = {
  createDog: async (parent, args, context) => {
    const newDog = await context.model.dog.create({
      ...args.input,
    });
    if (args.input.profilePic) {
      const { public_id } = await context.utils.uploadProfilePic(
        args.profilePic,
        newDog._id
      );
    }
    return newDog;
  },
  updateDog: async (parent, args, context) => {
    const consolidatedArgs = { id: args.id, ...args.input };
    return await updateResolver("dog", consolidatedArgs, context);
  },
};

module.exports = { DogMutationType, DogMutationResolver };
