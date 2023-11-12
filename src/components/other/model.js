import { Schema, model } from 'mongoose'

export const BusinessData = new Schema(
	{
		key: { type: String, required: true },
		value: { type: Number, required: true },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	},
)

export const BusinessDataModel = model('business_data', BusinessData)
