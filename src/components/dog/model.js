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
    owner: { type: Schema.Types.ObjectId, ref: "owner" },
    passes: [{ type: Schema.Types.ObjectId, ref: "pass_owned" }],
    notes: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const vaccineFields = `
  name: String!
  dateAdministered: Date!
  nextDue: Date
`;
const VaccineType = `
  type Vaccine {
    ${vaccineFields}
  }
`;
const VaccineInputType = `
  input VaccineInput {
    ${vaccineFields}
  }
`;
const noteFields = `
  color: String!
  text: String!
  active: Boolean!
`;
const NoteType = `
  type Note {
    ${noteFields}
  }
`;
const NoteInputType = `
  input NoteInput {
    ${noteFields}
  }
`;
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

const DogType = `
  type Dog {
    id: ID!
    ${dogFields}
    notes: [Note]
    vaccines: [Vaccine]
    owner: Owner
    usedPasses: [PassOwned]
    activePasses: [PassOwned]
  }
  `;

const DogInputType = `
   input DogInput {
    ${dogFields}
    owner: String
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
  owner: async (parent, args, context) => {
    return await context.model.owner.findById(parent.owner);
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
  VaccineType,
  VaccineInputType,
  NoteType,
  NoteInputType,
  DogResolver,
};
