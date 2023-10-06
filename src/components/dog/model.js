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

const VaccineType = `
  type Vaccine {
    parvovirus: Date,
    distemper: Date,
    multipurpose: Date,
    rabies: Date,
  }
`;

const DogType = `
  type Dog {
    id: ID!
    name: String!
    breed: String!
    sex: String!
    dateOfBirth: Date
    profilePic: String
    vaccines: Vaccine
    fixed: Boolean
    heat: Date
    chip: String
    scan: String
    owner: Owner!
    passes: [PassOwned!]
    notes: [String!]
  }
  `;

const DogResolver = {
  passes: async (parent, args, context) => {
    const passes = await context.model.passOwned.find({
      _id: parent.passes,
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
module.exports = { DogModel, DogType, VaccineType, DogResolver };
