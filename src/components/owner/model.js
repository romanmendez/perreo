const { Schema, model } = require("mongoose");

const Owner = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    phone: [{ type: String, required: true }],
    dni: { type: String, required: true },
    dogs: { type: Schema.Types.ObjectId, ref: "dog" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
const ownerFields = `
  firstName: String!
  lastName: String!
  email: String
  phone: [String!]!
  dni: String!
`;
const OwnerInputType = `
  input OwnerInput {
    ${ownerFields}
  }
`;
const OwnerType = `
  type Owner {
    id: ID!
    ${ownerFields}
    dogs: [Dog]
  }
`;

const OwnerResolver = {
  dogs: async (parent, args, context) => {
    console.log(parent);
    return await context.model.dog.find({
      owner: parent._id,
    });
  },
};

const OwnerModel = model("owner", Owner);
module.exports = { OwnerModel, OwnerType, OwnerResolver };
