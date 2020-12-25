const { Schema, model } = require("mongoose");
const moment = require("moment");

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

const AttendanceType = `
    type Attendance {
      id: ID!
      dog: Dog!
      start: Date!
      end: Date
      date(format: String!): String
      timeDisplay: String
      durationMs: Int!
      validPasses: [PassOwned!]
      payment: Pass
    }
  `;

const AttendanceResolver = {
  dog: async (parent, args, context) => {
    const attendance = await context.model.attendance
      .findById(parent.id)
      .populate("dog");
    return attendance.dog;
  },
  date: async (parent, args, context) => {
    const format = {
      short: "DD/MM/YYYY",
      long: "Do MMMM YYYY",
    };
    const attendance = await context.model.attendance.findById(parent.id);
    const date = moment(attendance.start).format(format[args.format]);
    return date;
  },
  timeDisplay: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(parent.id);
    const start = moment(attendance.start);
    const end = attendance.end ? moment(attendance.end) : moment();

    const duration = moment.utc(end.diff(start));
    const hours = duration.format("H");
    const minutes = duration.format("mm");

    const hoursDisplay = hours > 0 ? hours + "h" : "";
    const minutesDisplay = minutes > 0 ? minutes + "m" : "";

    return `${
      minutesDisplay ? hoursDisplay + " " : hoursDisplay
    }${minutesDisplay}`;
  },
  durationMs: async (parent, args, context) => {
    const { start, end } = await context.model.attendance.findById(parent.id);
    const duration = context.utils.durationMs(start, end);
    return duration;
  },
  validPasses: async (parent, args, context) => {
    const { start, end } = await context.model.attendance.findById(parent.id);
    const dog = await context.model.dog.findById(parent.dog).populate({
      path: "owners",
      select: "passes",
      populate: {
        path: "passes",
        model: "pass_owned",
        populate: {
          path: "pass",
          model: "pass",
        },
      },
    });
    const duration = context.utils.durationMs(start, end);
    const validOwnedPasses = dog.owners.reduce((passes, owner) => {
      const valid = owner.passes.filter((passOwned) => {
        return passOwned.pass.durationMs > duration;
      });
      return [...passes, ...valid];
    }, []);
    return validOwnedPasses;
  },
};

const AttendanceModel = model("attendance", Attendance);
module.exports = { AttendanceModel, AttendanceType, AttendanceResolver };
