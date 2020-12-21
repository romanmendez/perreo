const { Schema, model } = require("mongoose");

const AttendanceType = `
  type Attendance {
    id: ID!
    dog: Dog!
    start: Date!
    end: Date
    payment: Pass
  }
`;

const Attendance = new Schema(
  {
    dog: { type: Schema.Types.ObjectId, ref: "dog", required: true },
    start: { type: Date, required: true },
    end: { type: Date },
    payment: { type: Schema.Types.ObjectId, ref: "pass" },
  },
  {
    timestamps: true,
  }
);

const AttendanceModel = model("attendance", Attendance);
module.exports = { AttendanceModel, AttendanceType };
