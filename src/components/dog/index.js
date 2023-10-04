const { DogQueryType, DogQueryResolver } = require("./query");
const { DogMutationResolver, DogMutationType } = require("./mutation");
const { DogModel, DogType, VaccineType, DogResolver } = require("./model");

module.exports = {
  DogModel,
  DogType,
  VaccineType,
  DogResolver,
  DogQueryType,
  DogQueryResolver,
  DogMutationType,
  DogMutationResolver,
};
