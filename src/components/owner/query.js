export const OwnerQueryType = `
  owners(filter: OwnerInput): [Owner!]!
  archiveOwners: [Owner!]
`

export const OwnerQueryResolver = {
	owners: async (parent, args, context) => {
		return await context.model.owner.find({ ...args.filter, isActive: true })
	},
	archiveOwners: async (parent, args, context) => {
		return await context.model.owner.find({ isActive: false })
	},
}
