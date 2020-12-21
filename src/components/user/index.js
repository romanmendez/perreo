const { UserModel, UserType } = require("./model");
const { UserQueryType, UserQueryResolver } = require("./query");
const { UserMutationResolver, UserMutationType } = require("./mutation");

module.exports = {
  UserModel,
  UserType,
  UserQueryResolver,
  UserQueryType,
  UserMutationResolver,
  UserMutationType,
};
