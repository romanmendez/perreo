const { DogQueryType, DogQueryResolver } = require("./query");
const { DogMutationResolver, DogMutationType } = require("./mutation");
const {
  DogModel,
  DogType,
  DogInputType,
  VaccineType,
  VaccineInputType,
  NoteType,
  NoteInputType,
  DogResolver,
} = require("./model");

module.exports = {
  DogModel,
  DogType,
  VaccineType,
  VaccineInputType,
  NoteType,
  NoteInputType,
  DogResolver,
  DogQueryType,
  DogQueryResolver,
  DogMutationType,
  DogInputType,
  DogMutationResolver,
};
