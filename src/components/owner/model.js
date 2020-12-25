const { Schema, model } = require("mongoose");

const OwnerType = `
  type Owner {
    id: ID!
    firstName: String!
    lastName: String!
    email: String
    dni: String!
    phone: [String!]!
    passes: [PassOwned!]
    dogs: [Dog!]
  }
`;

const OwnerResolver = {
  dogs: async (parent, args, context) => {
    const owner = await context.model.owner
      .findById(parent.id)
      .populate("dogs");
    return owner.dogs;
  },
  passes: async (parent, args, context) => {
    const owner = await context.model.owner
      .findById(parent.id)
      .populate("passes");
    return owner.passes;
  },
};

const Owner = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    phone: [{ type: String, required: true }],
    dni: { type: String, required: true },
    dogs: [{ type: Schema.Types.ObjectId, ref: "dog" }],
    passes: [{ type: Schema.Types.ObjectId, ref: "pass_owned" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const OwnerModel = model("owner", Owner);
module.exports = { OwnerModel, OwnerType, OwnerResolver };
