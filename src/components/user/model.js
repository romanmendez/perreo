const { Schema, model } = require("mongoose");

const UserType = `
  type User {
    name: String!
    email: String!
    password: String!
    salary: Int
    hoursPerWeek: Int
  }
`;

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String }, // monthly or daily
    password: { type: String, required: true },
    salary: { type: Number }, // number of months or days
    hoursPerWeek: { type: Number }, // number of hours determining part-time and full-time
  },
  {
    timestamps: true,
  }
);

const UserModel = model("staff", User);
module.exports = { UserType, UserModel };
