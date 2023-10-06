const { Schema, model } = require("mongoose");
const { format, formatDistanceStrict } = require("date-fns");
const { DateTime } = require("luxon");

const Attendance = new Schema(
  {
    dog: { type: Schema.Types.ObjectId, ref: "dog", required: true },
    start: { type: Date, required: true },
    end: { type: Date },
    payment: { type: Schema.Types.ObjectId, ref: "pass" },
    balance: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const AttendanceType = `
    type Attendance {
      id: ID!
      dog: Dog!
      start: String!
      end: String
      totalTime: String!
      payment: Pass
      balance: Int!
    }
  `;

const AttendanceResolver = {
  start: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(parent.id);
    return format(attendance.start, "dd/MM/yyyy H:mm");
  },
  end: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(parent.id);
    return attendance.end ? format(attendance.end, "dd/MM/yyyy H:mm") : null;
  },
  dog: async (parent, args, context) => {
    return await context.model.dog.findById(parent.dog);
  },
  totalTime: async (parent, args, context) => {
    const att = await context.model.attendance.findById(parent.id);
    const { hours, minutes } = context.utils.duration(att);

    return `${hours}:${minutes}`;
  },
};

const AttendanceModel = model("attendance", Attendance);
module.exports = { AttendanceModel, AttendanceType, AttendanceResolver };
