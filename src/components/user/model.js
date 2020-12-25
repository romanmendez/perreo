const { Schema, model } = require("mongoose");

const AuthType = `
  type Auth {
    token: String!
    user: User!
  }
`;

const UserType = `
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
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
    access: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("user", User);
module.exports = { AuthType, UserType, UserModel };
