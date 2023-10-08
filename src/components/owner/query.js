const OwnerQueryType = `
  owners(filter: OwnerFilter): [Owner!]!
  owner(dni: String): Owner
`;

const OwnerQueryFilterType = `
  input OwnerFilter {
    id: ID
    firstName: String
    lastName: String
    dni: String
  }
`;

const OwnerQueryResolver = {
  owners: async (parent, args, context) => {
    const query = {};
    const { id, firstName, lastName, dni } = args.filter;

    if (args.filter) {
      if (id) query._id = id;
      if (firstName) query.firstName = firstName;
      if (lastName) query.lastName = lastName;
      if (dni) query.dni = dni;
    }
    return await context.model.owner.find(query);
  },
  owner: async (parent, args, context) => {
    return await context.model.owner.findOne({ dni: args.dni });
  },
};

module.exports = { OwnerQueryResolver, OwnerQueryType, OwnerQueryFilterType };
