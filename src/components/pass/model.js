const { Schema, model } = require("mongoose");

const PassType = `
  type Pass {
    id: ID!
    name: String!
    totalDays: Int!
    hoursPerDay: Int!
    expiration: Date
    price: Int!
  }
`;
const PassOwnedType = `
  type PassOwned {
    id: ID!
    pass: Pass!
    daysUsed: Int
    active: Boolean!
  }
`;

const Pass = new Schema(
  {
    name: { type: String, required: true },
    totalDays: { type: Number, required: true },
    hoursPerDay: { type: Number, required: true },
    expiration: { type: Date },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const PassOwned = new Schema({
  pass: { type: Schema.Types.ObjectId, ref: "pass" },
  daysUsed: { type: Number, required: true },
  active: { type: Boolean, required: true },
});

const PassOwnedResolver = {
  pass: async (parent, args, context) => {
    const sale = await context.model.passOwned
      .findById(parent.id)
      .populate("pass");
    return sale.pass;
  },
};

const PassModel = model("pass", Pass);
const PassOwnedModel = model("pass_owned", PassOwned);
module.exports = {
  PassModel,
  PassType,
  PassOwnedModel,
  PassOwnedType,
  PassOwnedResolver,
};
