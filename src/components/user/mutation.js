const bcrypt = require("bcryptjs");
const { createToken } = require("../../../utils/auth");
const { updateResolver } = require("../../../graphql/defaults");

const UserMutationType = `
  signup(email: String!, password: String!, name: String!): User!
  login(email: String!, password: String!): User!
  updateUser(email: String, password: String, name: String, salary: Int, hoursPerWeek: Int): User!
`;

const UserMutationResolver = {
  signup: async (parent, args, context) => {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.model.user.create({ ...args, password });

    const token = createToken(user);
    return { token, user };
  },
  login: async (parent, args, context) => {
    const user = await context.model.user.findOne({ username: args.username });
    if (!user) throw new Error("No user found with these credencials");

    const validPassword = bcrypt.compare(args.password, user.password);
    if (!validPassword) throw new Error("Invalid password");

    const token = createToken(user);
    return { user, token };
  },
  updateUser: async (parent, args, context) =>
    await updateResolver("user", args, context),
};

module.exports = { UserMutationResolver, UserMutationType };
