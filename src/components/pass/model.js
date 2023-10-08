const { Schema, model } = require("mongoose");

const PassType = `
  type Pass {
    id: ID!
    name: String!
    totalDays: Int!
    hoursPerDay: Int!
    price: Int!
  }
`;
const PassOwnedType = `
  type PassOwned {
    id: ID!
    pass: Pass!
    daysUsed: Int
    expiration: Date
    active: Boolean!
  }
`;

const Pass = new Schema(
  {
    name: { type: String, required: true },
    totalDays: { type: Number, required: true },
    hoursPerDay: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const PassOwned = new Schema({
  pass: { type: Schema.Types.ObjectId, ref: "pass", required: true },
  daysUsed: { type: Number, required: true },
  expiration: { type: Date },
  active: { type: Boolean, required: true },
});

const PassOwnedResolver = {
  pass: async (parent, args, context) => {
    const pass = await context.model.pass.findOne({
      _id: parent.pass,
    });
    return pass;
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
