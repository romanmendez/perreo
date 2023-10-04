const { Schema, model } = require("mongoose");

const PassType = `
  type Pass {
    id: ID!
    name: String!
    time: [Int!]
    experation: Date
    price: Int!
  }
`;
const PassOwnedType = `
  type PassOwned {
    id: ID!
    pass: Pass!
    active: Boolean!
    balance: [Int]
  }
`;

const Pass = new Schema(
  {
    name: { type: String, required: true },
    time: [{ type: Number, required: true }],
    expiration: { type: Date },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const PassOwned = new Schema({
  pass: { type: Schema.Types.ObjectId, ref: "pass" },
  active: { type: Boolean, required: true },
  balance: { type: Number },
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
