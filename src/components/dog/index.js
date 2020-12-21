const { DogQueryType, DogQueryResolver } = require("./query");
const { DogMutationResolver, DogMutationType } = require("./mutation");
const { DogModel, DogType } = require("./model");

const Dog = {
  breed: (parent, args, context) => {
    return context.model.dog.findUnique({ where: { id: parent.id } }).breed();
  },
  attendances: async (parent, args, context) => {
    const attendances = context.model.attendance.find({
      dog: { _id: parent.id },
    });
    return attendances;
  },
};

module.exports = {
  Dog,
  DogQueryType,
  DogQueryResolver,
  DogMutationResolver,
  DogMutationType,
  DogModel,
  DogType,
};
