const { Schema, model } = require("mongoose");
const { format, formatDistanceStrict } = require("date-fns");
const { DateTime } = require("luxon");

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
      start: String!
      end: String
      hours: Int!
      validPasses: [PassOwned!]
      payment: Pass
    }
  `;

const AttendanceResolver = {
  start: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(parent.id);
    return format(attendance.start, "dd/MM/yyyy H:mm");
  },
  end: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(parent.id);
    return attendance.end
      ? format(attendance.end, "dd/MM/yyyy H:mm")
      : "active";
  },
  dog: async (parent, args, context) => {
    const attendance = await context.model.attendance
      .findById(parent.id)
      .populate("dog");
    return attendance.dog;
  },
  hours: async (parent, args, context) => {
    const att = await context.model.attendance.findById(parent.id);
    const { hours } = context.utils.duration(att);
    return Math.ceil(hours);
  },
  validPasses: async (parent, args, context) => {
    const attendance = await context.model.attendance.findById(parent.id);
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
    const duration = context.utils.duration(attendance);
    const validOwnedPasses = dog.owners.reduce((passes, owner) => {
      const valid = owner.passes.filter((passOwned) => {
        return passOwned.pass.hours > duration.hours;
      });
      return [...passes, ...valid];
    }, []);
    return validOwnedPasses;
  },
};

const AttendanceModel = model("attendance", Attendance);
module.exports = { AttendanceModel, AttendanceType, AttendanceResolver };
