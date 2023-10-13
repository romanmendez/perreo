const { Schema, model } = require("mongoose");

const passFields = `
  name: String
  totalDays: Int
  hoursPerDay: Int
  price: Int
`;
const PassInputType = `
  input PassInput {
    ${passFields}
  }
`;
const PassType = `
  type Pass {
    id: ID!
    ${passFields}
    isActive: Boolean!
  }
`;
const PassOwnedType = `
  type PassOwned {
    id: ID!
    pass: Pass!
    daysUsed: Int!
    createdAt: Date
    expirationDate: Date
    active: Boolean!
  }
`;

const Pass = new Schema(
  {
    name: { type: String, required: true },
    totalDays: { type: Number, required: true },
    hoursPerDay: { type: Number, required: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
const PassOwned = new Schema(
  {
    pass: { type: Schema.Types.ObjectId, ref: "pass", required: true },
    daysUsed: { type: Number, required: true },
    startDate: { type: Date, required: true },
    expirationDate: { type: Date },
    active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

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
  PassInputType,
  PassOwnedModel,
  PassOwnedType,
  PassOwnedResolver,
};
