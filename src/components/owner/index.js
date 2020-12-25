const { OwnerModel, OwnerType, OwnerResolver } = require("./model");
const { OwnerQueryType, OwnerQueryResolver } = require("./query");
const { OwnerMutationType, OwnerMutationResolver } = require("./mutation");

module.exports = {
  OwnerResolver,
  OwnerQueryType,
  OwnerQueryResolver,
  OwnerMutationType,
  OwnerMutationResolver,
  OwnerModel,
  OwnerType,
};
