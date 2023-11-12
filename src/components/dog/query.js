import { DateTime } from 'luxon'

export const DogQueryType = `
  dogs(filter: DogInput): [Dog!]!
  dogsCurrently: [Dog!]
  dogsToday: [Dog!]
  archiveDogs: [Dog!]
`

export const DogQueryResolver = {
	dogs: async (parent, args, context) => {
		return await context.model.dog
			.find({ ...args.filter, isActive: true })
			.populate('passes')
			.populate('owners')
	},
	dogsCurrently: async (parent, args, context) => {
		const attendances = await context.model.attendance
			.find({ end: null })
			.populate('dog')
		return attendances.map(att => att.dog)
	},
	dogsToday: async (parent, args, context) => {
		const today = DateTime.local().startOf('day')
		const attendances = await context.model.attendance
			.find({
				start: { $gte: today },
			})
			.populate('dog')
		const dogs = attendances.reduce((dogs, att) => {
			return dogs.includes(att.dog) ? dogs : [...dogs, att.dog]
		}, [])
		return dogs
	},
	archiveDogs: async (parent, args, context) => {
		return await context.model.dog.find({ isActive: false })
	},
}
