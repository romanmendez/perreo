export const PassQueryType = `
  passes(filter: PassInput): [Pass!]!
  passesOwned: [PassOwned!]
  archivePasses: [Pass!]
`

export const PassQueryResolver = {
	passes: async (parent, args, context) => {
		return await context.model.pass.find({ ...args.filter, isActive: true })
	},
	passesOwned: async (parent, args, context) => {
		return await context.model.passOwned.find()
	},
	archivePasses: async (parent, args, context) => {
		return await context.model.pass.find({ isActive: false })
	},
}
