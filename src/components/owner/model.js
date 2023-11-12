import { Schema, model } from 'mongoose'

export const Owner = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String },
		phone: [{ type: String, required: true }],
		dni: { type: String, required: true },
		dogs: [{ type: Schema.Types.ObjectId, ref: 'dog' }],
		isActive: { type: Boolean, default: true },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	},
)
export const ownerFields = `
  firstName: String
  lastName: String
  email: String
  phone: [String!]
  dni: String
`
export const OwnerInputType = `
  input OwnerInput {
    ${ownerFields}
  }
`
export const OwnerType = `
  type Owner {
    id: ID!
    ${ownerFields}
    isActive: Boolean!
    dogs: [Dog]
  }
`

export const OwnerResolver = {
	dogs: async (parent, args, context) => {
		return await context.model.dog.find({ _id: parent.dogs })
	},
}

export const OwnerModel = model('owner', Owner)
