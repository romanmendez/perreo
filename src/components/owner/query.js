const OwnerQueryType = `
  owners(filter: OwnerInput): [Owner!]!
`;

const OwnerQueryResolver = {
  owners: async (parent, args, context) => {
    const query = {};
    if (args.filter) {
      const { id, firstName, lastName, dni } = args.filter;

      if (id) query._id = id;
      if (firstName) query.firstName = firstName;
      if (lastName) query.lastName = lastName;
      if (dni) query.dni = dni;
    }
    return await context.model.owner.find(query);
  },
};

module.exports = { OwnerQueryResolver, OwnerQueryType };
