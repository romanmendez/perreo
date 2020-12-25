const { UserModel, UserType, AuthType } = require("./model");
const { UserQueryType, UserQueryResolver } = require("./query");
const { UserMutationResolver, UserMutationType } = require("./mutation");

module.exports = {
  UserModel,
  UserType,
  AuthType,
  UserQueryResolver,
  UserQueryType,
  UserMutationResolver,
  UserMutationType,
};
