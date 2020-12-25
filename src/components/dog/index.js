const { DogQueryType, DogQueryResolver } = require("./query");
const { DogMutationResolver, DogMutationType } = require("./mutation");
const { DogModel, DogType, DogResolver } = require("./model");

module.exports = {
  DogModel,
  DogType,
  DogResolver,
  DogQueryType,
  DogQueryResolver,
  DogMutationType,
  DogMutationResolver,
};
