const { Schema, model } = require("mongoose");

const PassType = `
  type Pass {
    id: ID!
    name: String!
    type: String!
    days: Int!
    hours: Int!
    expiration: Date
    price: Int!
  }
`;
const PassOwnedType = `
  type PassOwned {
    id: ID!
    owner: Owner!
    pass: Pass!
    balance: Int
  }
`;

const Pass = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    days: { type: Number, required: true },
    hours: { type: Number, required: true },
    expiration: { type: Date },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const PassOwned = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "owner" },
  pass: { type: Schema.Types.ObjectId, ref: "pass" },
  balance: { type: Number },
});

const PassOwnedResolver = {
  owner: async (parent, args, context) => {
    const sale = await context.model.passOwned
      .findById(parent.id)
      .populate("owner");
    return sale.owner;
  },
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
