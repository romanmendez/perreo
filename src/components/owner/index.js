const { OwnerModel, OwnerType, OwnerResolver } = require("./model");
const {
  OwnerQueryType,
  OwnerQueryFilterType,
  OwnerQueryResolver,
} = require("./query");
const { OwnerMutationType, OwnerMutationResolver } = require("./mutation");

module.exports = {
  OwnerQueryType,
  OwnerQueryFilterType,
  OwnerQueryResolver,
  OwnerMutationType,
  OwnerMutationResolver,
  OwnerModel,
  OwnerType,
  OwnerResolver,
};
