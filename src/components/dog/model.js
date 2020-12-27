const { Schema, model } = require("mongoose");
const formatRelative = require("date-fns/formatRelative");
const { es } = require("date-fns/locale");

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
    owners: [{ type: Schema.Types.ObjectId, ref: "owner" }],
    notes: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

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
    lastAttendance: Attendance
    lastSeen: String
    weekDuration: String
    owners: [Owner!]
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
  owners: async (parent, args, context) => {
    const owners = await context.model.owner.find({ dogs: { _id: parent.id } });
    return owners;
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
    console.log(lastAttendance);
    if (!lastAttendance) return null;
    if (!lastAttendance.end) return "active";
    return formatRelative(lastAttendance.end, new Date(), {
      weekStartsOn: 1,
      locale: es,
    });
  },
};

const DogModel = model("dog", Dog);
module.exports = { DogModel, DogType, DogResolver };
