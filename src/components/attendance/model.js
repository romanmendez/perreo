const { Schema, model } = require("mongoose");
const { format, formatDistanceStrict } = require("date-fns");
const { DateTime } = require("luxon");

const Attendance = new Schema(
  {
    dog: { type: Schema.Types.ObjectId, ref: "dog", required: true },
    start: { type: Date, required: true },
    end: { type: Date },
    passUsed: { type: Schema.Types.ObjectId, ref: "pass" },
    payment: { type: Object },
    balance: { type: Number },
  },
  {
    timestamps: true,
  }
);

const PaymentType = `
  type Payment {
    id: ID!
    type: String!
    amount: Int!
  }
`;

const AttendanceType = `
    type Attendance {
      id: ID!
      dog: Dog!
      start: String!
      end: String
      totalTime: String!
      passUsed: PassOwned
      payment: Payment
      balance: Int
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
  passUsed: async (parent, args, context) => {
    return await context.model.passOwned.findById(parent.passUsed);
  },
  balance: async (parent, args, context) => {
    const att = await context.model.attendance.findById(parent.id);

    const { price } = await context.model.price.findOne({ name: "hour" });
    const { hours, minutes } = context.utils.duration(att);
    const attendanceTimeInMinutes = Number(hours) * 60 + Number(minutes);

    return Math.floor((attendanceTimeInMinutes / 60) * price);
  },
};

const AttendanceModel = model("attendance", Attendance);
module.exports = {
  AttendanceModel,
  AttendanceType,
  PaymentType,
  AttendanceResolver,
};
