const { OwnerModel, OwnerType } = require("./model");
const { OwnerQueryType, OwnerQueryResolver } = require("./query");
const { OwnerMutationType, OwnerMutationResolver } = require("./mutation");

const Owner = {
  dogs: async (parent, args, context) => {
    const owner = await context.model.owner
      .findById(parent.id)
      .populate("dogs");
    return owner.dogs;
  },
};

module.exports = {
  Owner,
  OwnerQueryType,
  OwnerQueryResolver,
  OwnerMutationType,
  OwnerMutationResolver,
  OwnerModel,
  OwnerType,
};
