import { Schema, model } from 'mongoose'

export const Dog = new Schema(
	{
		name: { type: String, required: true },
		breed: { type: String, required: true },
		sex: { type: String, required: true },
		dateOfBirth: { type: Date, required: true },
		vaccines: { type: Object },
		isFixed: { type: Boolean },
		lastHeat: { type: Date },
		chip: { type: String },
		scan: String,
		owners: [{ type: Schema.Types.ObjectId, ref: 'owner' }],
		passes: [{ type: Schema.Types.ObjectId, ref: 'pass_owned' }],
		notes: [{ type: Object }],
		isActive: { type: Boolean, default: true },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	},
)

// define common fields shared between types
export const dogFields = `
  name: String
  breed: String
  sex: String
  dateOfBirth: Date
  profilePic: String
  isFixed: Boolean
  lastHeat: Date
  chip: String
  scan: String
`
// define types
export const DogType = `
  type Dog {
    id: ID!
    ${dogFields}
    isActive: Boolean!
    notes: [Note]
    vaccines: [Vaccine]
    owners: [Owner]
    passes(isActive: Boolean): [PassOwned]
  }
  `
export const DogInputType = `
   input DogInput {
    _id: String
    ${dogFields}
    notes: [NoteInput]
    vaccines: [VaccineInput]
   }
`

export const DogResolver = {
	passes: (parent, args, context) => {
		if (args.isActive) return parent.passes.filter(pass => pass.isActive)
		if (args.isActive === false)
			return parent.passes.filter(pass => !pass.isActive)
		return parent.passes
	},
}

export const DogModel = model('dog', Dog)
