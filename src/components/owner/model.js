const { Schema, model } = require("mongoose");

const OwnerType = `
  type Owner {
    id: ID!
    firstName: String!
    lastName: String!
    email: String
    dni: String
    phone: [String!]!
    passes: [Pass!]
    dogs: [Dog!]!
  }
`;

const Owner = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    phone: [{ type: String, required: true }],
    dni: { type: String },
    dogs: [{ type: Schema.Types.ObjectId, ref: "dog", required: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const OwnerModel = model("owner", Owner);
module.exports = { OwnerModel, OwnerType };
