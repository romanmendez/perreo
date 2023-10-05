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
    owner: { type: Object, required: true },
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
    attendances: [Attendance!]
    lastAttendance: Attendance
    lastSeen: String
    weekDuration: String
    owner: Owner!
    passes: [PassOwned!]
    notes: [String!]
  }
  `;

const DogResolver = {
  attendances: async (parent, args, context) => {
    const attendances = await context.model.attendance.find({
      dog: { _id: parent.id },
    });
    return attendances;
  },
  lastAttendance: async (parent, args, context) => {
    const attendances = await context.model.attendance.find({
      dog: { _id: parent.id },
    });
    if (!attendances.length) return null;

    return attendances.sort((a, b) => b.start.getTime() - a.start.getTime())[0];
  },
  lastSeen: async (parent, args, context) => {
    const lastAttendance = await DogResolver.lastAttendance(
      parent,
      args,
      context
    );
    if (!lastAttendance) return null;
    if (!lastAttendance.end) return "active";
    return formatRelative(lastAttendance.end, new Date(), {
      weekStartsOn: 1,
      locale: es,
    });
  },
  passes: async (parent, args, context) => {
    const passes = await context.model.passOwned.find({
      _id: parent.passes,
    });
    return passes;
  },
  profilePic: async (parent, args, context) => {
    return await context.utils.getProfilePic(`${parent.id}/profile`);
  },
};

const DogModel = model("dog", Dog);
module.exports = { DogModel, DogType, VaccineType, DogResolver };
