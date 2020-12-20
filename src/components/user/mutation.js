const bcrypt = require("bcryptjs");
const { createToken } = require("../../../utils/auth");

module.exports = {
  signup: async (parent, args, context) => {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({
      data: { ...args, password },
    });

    const token = createToken(user);
    return { token, user };
  },
  login: async (parent, args, context) => {
    const user = await context.prisma.user.findUnique({
      where: { username: args.username },
    });
    if (!user) throw new Error("No user found with these credencials");

    const validPassword = bcrypt.compare(args.password, user.password);
    if (!validPassword) throw new Error("Invalid password");

    const token = createToken(user);
    return { user, token };
  },
  deleteUser: async (parent, args, context) => {
    const user = await context.prisma.user.delete({
      where: { id: args.id },
    });
    return user;
  },
};
