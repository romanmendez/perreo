const { Schema, model } = require("mongoose");

const DogType = `
  type Dog {
    id: ID!
    name: String!
    breed: String!
    sex: String!
    vaccines: [String!]
    fixed: Boolean
    heat: Date
    chip: String
    scan: String
    attendances: [Attendance!]
    owners: [Owner!]
    notes: [String!]
  }
  `;
const Dog = new Schema(
  {
    name: { type: String, required: true },
    breed: { type: String, required: true },
    sex: { type: Object, required: true },
    vaccines: Object,
    fixed: { type: Boolean },
    heat: { type: Date },
    chip: { type: String },
    scan: String,
    attendances: [{ type: Schema.Types.ObjectId, ref: "attendance" }],
    owners: [{ type: Schema.Types.ObjectId, ref: "owner" }],
    notes: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const DogModel = model("dog", Dog);
module.exports = { DogModel, DogType };
