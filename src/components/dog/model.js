const { Schema, model } = require("mongoose");
const moment = require("moment");

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

    return attendances.sort((a, b) => b.end.getTime() - a.end.getTime())[0];
  },
};

const DogModel = model("dog", Dog);
module.exports = { DogModel, DogType, DogResolver };
