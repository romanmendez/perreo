const { Schema, model } = require("mongoose");

const PassType = `
  type Pass {
    name: String!
    type: String!
    duration: Int
    overtime: Int
    price: Int!
  }
`;

const Pass = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // monthly or daily
    duration: { type: Number, required: true }, // number of months or days
    hours: { type: Number, required: true }, // number of hours determining part-time and full-time
    price: { type: Number, required: true },
    overtime: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const PassModel = model("passType", Pass);
module.exports = { PassModel, PassType };
