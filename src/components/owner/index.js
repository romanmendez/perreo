const OwnerQuery = require("./query");
const OwnerMutation = require("./mutation");

const Owner = {
  dogs: async (parent, args, context) => {
    return await context.prisma.owner
      .findUnique({ where: { id: parent.id } })
      .dogs();
  },
  phone: async (parent, args, context) => {
    return await context.prisma.owner
      .finUnique({ where: { id: parent.id } })
      .phone();
  },
};

module.exports = { Owner, OwnerQuery, OwnerMutation };
