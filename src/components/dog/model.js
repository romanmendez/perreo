const { Schema, model } = require("mongoose");
const formatRelative = require("date-fns/formatRelative");
const { es } = require("date-fns/locale");

const Dog = new Schema(
  {
    name: { type: String, required: true },
    breed: { type: String, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    vaccines: { type: Object },
    fixed: { type: Boolean },
    heat: { type: Date },
    chip: { type: String },
    scan: String,
    owners: [{ type: Schema.Types.ObjectId, ref: "owner" }],
    passes: [{ type: Schema.Types.ObjectId, ref: "pass_owned" }],
    notes: [{ type: Object }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// define common fields shared between types
const dogFields = `
  name: String
  breed: String
  sex: String
  dateOfBirth: Date
  profilePic: String
  fixed: Boolean
  heat: Date
  chip: String
  scan: String
`;
// define types
const DogType = `
  type Dog {
    id: ID!
    ${dogFields}
    isActive: Boolean!
    notes: [Note]
    vaccines: [Vaccine]
    owners: [Owner]
    passes(isActive: Boolean): [PassOwned]
  }
  `;
const DogInputType = `
   input DogInput {
    ${dogFields}
    notes: [NoteInput]
    vaccines: [VaccineInput]
   }
`;

const DogResolver = {
  passes: (parent, args, context) => {
    if (args.isActive) return parent.passes.filter((pass) => pass.isActive);
    if (args.isActive === false)
      return parent.passes.filter((pass) => !pass.isActive);
    return parent.passes;
  },
};

const DogModel = model("dog", Dog);
module.exports = {
  DogModel,
  DogType,
  DogInputType,
  DogResolver,
};
