import { Schema, model } from 'mongoose'

export const Attendance = new Schema(
	{
		dog: { type: Schema.Types.ObjectId, ref: 'dog', required: true },
		startTime: { type: Date, required: true },
		endTime: { type: Date },
		passUsed: { type: Schema.Types.ObjectId, ref: 'pass_owned' },
		payment: { type: Number },
		balance: { type: Number },
		notes: [{ type: Object }],
	},
	{
		timestamps: true,
	},
)

export const AttendanceType = `
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
  `

export const AttendanceResolver = {
	totalTime: async (parent, args, context) => {
		const att = await context.model.attendance.findById(parent.id)
		const { hours, minutes } = context.utils.duration(
			att.startTime,
			att.endTime,
		)
		return `${hours}h ${minutes}m`
	},
}

export const AttendanceModel = model('attendance', Attendance)
