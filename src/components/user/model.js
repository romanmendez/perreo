const { Schema, model } = require("mongoose");

const UserType = `
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    address: Address
    access: Int!
  }
`;
const User = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: { type: String, required: true },
    locale: { type: String, required: true },
    address: { type: Object, required: true },
    access: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const UserResolver = {
  address: async (parent, args, context) => {
    const info = await context.model.info.findById(parent.id);
    return info.address;
  },
};

const UserModel = model("user", User);
module.exports = { UserType, UserModel, UserResolver };
