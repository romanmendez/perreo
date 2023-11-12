import { updateResolver, deleteResolver } from '#graphql/defaults'

export const DogMutationType = `
  createDog(input: DogInput): Dog!
  updateDog(id: ID!, input: DogInput): Dog!
  archiveDog(id: ID!): Dog!
  deleteDog(id: ID!): Boolean!
`
export const DogMutationResolver = {
	createDog: async (parent, args, context) => {
		const newDog = await context.model.dog.create({
			...args.input,
		})
		if (args.input.profilePic) {
			const { public_id } = await context.utils.uploadProfilePic(
				args.profilePic,
				newDog._id,
			)
		}
		return newDog
	},
	updateDog: async (parent, args, context) => {
		const consolidatedArgs = { id: args.id, ...args.input }
		return await updateResolver('dog', consolidatedArgs, context)
	},
	archiveDog: async (parent, args, context) => {
		return await updateResolver(
			'dog',
			{ id: args.id, isActive: false },
			context,
		)
	},
	deleteDog: async (parent, args, context) => {
		return await deleteResolver('dog', args, context)
	},
}
