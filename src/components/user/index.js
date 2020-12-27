const {
  UserModel,
  UserResolver,
  UserType,
  AuthType,
  AddressType,
} = require("./model");
const { UserQueryType, UserQueryResolver } = require("./query");
const { UserMutationResolver, UserMutationType } = require("./mutation");

module.exports = {
  UserModel,
  UserResolver,
  UserType,
  AddressType,
  AuthType,
  UserQueryResolver,
  UserQueryType,
  UserMutationResolver,
  UserMutationType,
};
