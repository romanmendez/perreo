import { Schema, model } from 'mongoose'

const passFields = `
  name: String
  totalDays: Int
  daysToExpiration: Int
  hoursPerDay: Int
  price: Int
`
export const PassInputType = `
  input PassInput {
    ${passFields}
  }
`
export const PassType = `
  type Pass {
    id: ID!
    ${passFields}
    isActive: Boolean!
  }
`
export const PassOwnedType = `
  type PassOwned {
    id: ID!
    pass: Pass!
    daysUsed: Int!
    startDate: Date
    expirationDate: Date
    isActive: Boolean!
  }
`

export const Pass = new Schema(
	{
		name: { type: String, required: true },
		totalDays: { type: Number, required: true },
		daysToExpiration: { type: Number, required: true },
		hoursPerDay: { type: Number, required: true },
		price: { type: Number, required: true },
		isActive: { type: Boolean, default: true },
	},
	{
		timestamps: true,
	},
)
export const PassOwned = new Schema(
	{
		pass: { type: Schema.Types.ObjectId, ref: 'pass', required: true },
		daysUsed: { type: Number, required: true },
		startDate: { type: Date, required: true },
		expirationDate: { type: Date },
		isActive: { type: Boolean, required: true },
	},
	{
		timestamps: true,
	},
)

export const PassOwnedResolver = {
	pass: async (parent, args, context) => {
		const pass = await context.model.pass.findOne({
			_id: parent.pass,
		})
		return pass
	},
}

export const PassModel = model('pass', Pass)
export const PassOwnedModel = model('pass_owned', PassOwned)
