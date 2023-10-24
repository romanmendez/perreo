const { Schema, model } = require("mongoose");
const { format, formatDistanceStrict } = require("date-fns");
const { DateTime } = require("luxon");

const Attendance = new Schema(
  {
    dog: { type: Schema.Types.ObjectId, ref: "dog", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    passUsed: { type: Schema.Types.ObjectId, ref: "pass_owned" },
    payment: { type: Number },
    balance: { type: Number },
    notes: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

const AttendanceType = `
    type Attendance {
      id: ID!
      dog: Dog!
      startTime: Date!
      endTime: Date
      passUsed: PassOwned
      payment: Int
      balance: Int
      notes: [Note]
      totalTime: String!
    }
  `;

const AttendanceResolver = {
  totalTime: async (parent, args, context) => {
    const att = await context.model.attendance.findById(parent.id);
    const { hours, minutes } = context.utils.duration(
      att.startTime,
      att.endTime
    );
    return `${hours}h ${minutes}m`;
  },
};

const AttendanceModel = model("attendance", Attendance);
module.exports = {
  AttendanceModel,
  AttendanceType,
  AttendanceResolver,
};
