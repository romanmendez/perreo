const bcrypt = require("bcryptjs");
const { createToken } = require("@utils/auth");
const { updateResolver } = require("@graphql/defaults");

const UserMutationType = `
  createUser(email: String!, password: String!, name: String!, access: Int!): Auth!
  login(email: String!, password: String!): Auth!
  updateUser(id: String!, email: String, password: String, name: String, access: Int): User!
`;

const UserMutationResolver = {
  createUser: async (parent, args, context) => {
    const exists = await context.model.user.exists({ email: args.email });
    if (exists) throw new Error("A user with this email is already registed.");

    const password = await bcrypt.hash(args.password, 10);
    const user = await context.model.user.create({ ...args, password });

    const token = createToken(user);
    return { token, user };
  },
  login: async (parent, args, context) => {
    const user = await context.model.user.findOne({ email: args.email });
    if (!user) throw new Error("No user found with these credencials");

    const validPassword = await bcrypt.compare(args.password, user.password);
    if (!validPassword) throw new Error("Invalid password");

    const token = createToken(user);
    return { user, token };
  },
  updateUser: async (parent, args, context) =>
    await updateResolver("user", args, context),
};

module.exports = { UserMutationResolver, UserMutationType };
