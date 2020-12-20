const DogQuery = require("./query");
const DogMutation = require("./mutation");

const Dog = {
  breed: (parent, args, context) => {
    return context.prisma.dog.findUnique({ where: { id: parent.id } }).breed();
  },
};

module.exports = { Dog, DogQuery, DogMutation };
