import _ from 'lodash'

export async function updateResolver(model, args, context) {
	const data = _.omit(args, ['id'])
	return await context.model[model].findOneAndUpdate({ _id: args.id }, data, {
		returnOriginal: false,
	})
}

export async function deleteResolver(model, args, context) {
	const { ok } = await context.model[model].deleteOne({ _id: args.id })
	if (!ok) throw new Error('No record was found with this ID')
	return ok
}
