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
    notes: [String],
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
    usedPasses: [PassOwned]
    activePasses: [PassOwned]
  }
  `;
const DogInputType = `
   input DogInput {
    ${dogFields}
    note: NoteInput
    vaccine: VaccineInput
   }
`;

const DogResolver = {
  usedPasses: async (parent, args, context) => {
    const passes = await context.model.passOwned.find({
      _id: parent.passes,
      active: false,
    });
    return passes;
  },
  activePasses: async (parent, args, context) => {
    const passes = await context.model.passOwned.find({
      _id: parent.passes,
      active: true,
    });
    return passes;
  },
  owners: async (parent, args, context) => {
    return await context.model.owner.find({ _id: parent.owners });
  },
  profilePic: async (parent, args, context) => {
    return await context.utils.getProfilePic(`${parent.id}/profile`);
  },
};

const DogModel = model("dog", Dog);
module.exports = {
  DogModel,
  DogType,
  DogInputType,
  DogResolver,
};
