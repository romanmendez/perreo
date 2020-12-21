const UserQueryType = `
  users: [User!]!
`;

const UserQueryResolver = {
  users: async (parent, args, context) => await context.model.user.find(),
};

module.exports = { UserQueryResolver, UserQueryType };
