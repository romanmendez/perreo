import { updateResolver, deleteResolver } from '#graphql/defaults'

export const AttendanceMutationType = `
  startAttendance(dogId: String!): Attendance!
  endAttendance(dogId: String!): Attendance!
  payAttendance(id: String!, passOwnedId: String, payment: Int, note: String): Attendance!
  cancelAttendanceBalance(id: String!): Attendance!
  createAttendance(dogId: String!, startTime: Date!, endTime: Date!): Attendance!
  updateAttendance(id: String!, startTime: Date, endTime: Date): Attendance!
  deleteAttendance(id: String!): Int!
`

export const AttendanceMutationResolver = {
	startAttendance: async (parent, args, context) => {
		// check to see if dog has already checked in
		const existingAttendance = await context.model.attendance.findOne({
			dog: args.dogId,
			endTime: null,
		})

		if (existingAttendance)
			throw new Error('This dog already has an active attendance.')

		// create new chekin
		const startTime = new Date()

		return await context.model.attendance.create({
			startTime,
			dog: args.dogId,
			payment: null,
			balance: 0,
		})
	},
	endAttendance: async (parent, args, context) => {
		const endTime = new Date()
		const price = await context.utils.getPrice(context)
		const attendance = await context.model.attendance.findOne({
			dog: args.dogId,
			endTime: null,
		})
		if (!attendance)
			throw new Error("This dog doesn't have any active attendances")

		return await context.model.attendance.findOneAndUpdate(
			{ _id: attendance._id },
			{
				endTime,
				balance: context.utils.balance(attendance.startTime, endTime, price),
			},
			{ returnOriginal: false },
		)
	},
	payAttendance: async (parent, args, context) => {
		const attendance = await context.model.attendance
			.findById(args.id)
			.populate('dog')
		const price = await context.utils.getPrice(context)

		if (args.passOwnedId) {
			if (attendance.passUsed) {
				throw new Error('This attendance already has a pass associated to it')
			} else {
				const passOwned = await context.model.passOwned.findById(
					args.passOwnedId,
				)
				const passIsOwnedByDog = attendance.dog.passes.includes(
					args.passOwnedId,
				)
				if (passIsOwnedByDog) {
					const { passUsed, balance } = await context.utils.usePassOwned(
						context,
						passOwned,
						attendance,
					)
					if (passUsed) {
						return await updateResolver(
							'attendance',
							{
								id: args.id,
								balance,
								passUsed: passOwned,
								$push: {
									notes: args.note,
								},
							},
							context,
						)
					} else {
						throw new Error(
							'The pass provided is expired or has already been completely used',
						)
					}
				} else {
					throw new Error(
						'The pass provided is not owned by the dog that created this attendance',
					)
				}
			}
		} else if (args.payment) {
			if (attendance.balance === 0)
				throw new Error("This attendance doesn't have a pending balance")
			if (args.payment > attendance.balance)
				throw new Error(
					`The payment amount of ${args.payment} is greater than the pending amount ${attendance.balance}`,
				)
			const payment = Number(args.payment)
			return await updateResolver(
				'attendance',
				{
					id: args.id,
					payment,
					balance: attendance.balance - payment,
				},
				context,
			)
		}
	},
	cancelAttendanceBalance: async (parent, args, context) => {
		return await updateResolver('attendance', { ...args, balance: 0 }, context)
	},
	createAttendance: async (parent, args, context) => {
		return await context.model.attendance.create({
			dog: args.dogId,
			...args,
		})
	},
	updateAttendance: async (parent, args, context) =>
		await updateResolver('attendance', args, context),
	deleteAttendance: async (parent, args, context) =>
		await deleteResolver('attendance', args, context),
}
