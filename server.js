import { ApolloServer } from 'apollo-server'
import { GraphQLScalarType } from 'graphql'
import { DateTime } from 'luxon'
import { Kind } from 'graphql/language/index.js'
import {
	AttendanceModel,
	AttendanceType,
	AttendanceResolver as Attendance,
} from '#src/components/attendance/model'
import {
	AttendanceMutationType,
	AttendanceMutationResolver,
} from '#src/components/attendance/mutation'
import {
	AttendanceQueryType,
	AttendanceQueryResolver,
} from '#src/components/attendance/query'
import {
	DogModel,
	DogResolver as Dog,
	DogType,
	DogInputType,
} from '#src/components/dog/model'
import {
	DogMutationType,
	DogMutationResolver,
} from '#src/components/dog/mutation'
import { DogQueryType, DogQueryResolver } from '#src/components/dog/query'
import {
	OwnerModel,
	OwnerType,
	OwnerInputType,
	OwnerResolver as Owner,
} from '#src/components/owner/model'
import {
	OwnerMutationType,
	OwnerMutationResolver,
} from '#src/components/owner/mutation'
import { OwnerQueryType, OwnerQueryResolver } from '#src/components/owner/query'
import {
	PassModel,
	PassOwnedModel,
	PassType,
	PassInputType,
	PassOwnedType,
	PassOwnedResolver as PassOwned,
} from '#src/components/pass/model'
import { PassQueryType, PassQueryResolver } from '#src/components/pass/query'
import {
	PassMutationType,
	PassMutationResolver,
} from '#src/components/pass/mutation'
import { BusinessDataModel } from '#src/components/other/model'
import {
	VaccineType,
	VaccineInputType,
	NoteType,
	NoteInputType,
	AuthType,
	AddressType,
} from '#src/components/other/type'
import utils from '#utils/helpers'
import './db/config.js'

const server = new ApolloServer({
	typeDefs: `scalar Date
  ${PassInputType}
  ${OwnerInputType}
  ${DogInputType}
  ${NoteInputType}
  ${VaccineInputType}
  type Query {
    ${DogQueryType}
    ${AttendanceQueryType}
    ${OwnerQueryType}
    ${PassQueryType}
  }
  type Mutation {
    ${DogMutationType}
    ${AttendanceMutationType}
    ${OwnerMutationType}
    ${PassMutationType}
  }
  ${DogType}
  ${VaccineType}
  ${NoteType}
  ${AttendanceType}
  ${OwnerType}
  ${PassType}
  ${PassOwnedType}
  ${AuthType}
  ${AddressType}
`,
	resolvers: {
		Query: {
			...DogQueryResolver,
			...AttendanceQueryResolver,
			...PassQueryResolver,
			...OwnerQueryResolver,
		},
		Mutation: {
			...DogMutationResolver,
			...AttendanceMutationResolver,
			...PassMutationResolver,
			...OwnerMutationResolver,
		},
		Dog,
		Owner,
		Attendance,
		PassOwned,
		Date: new GraphQLScalarType({
			name: 'Date',
			description: 'Date custom scalar type',
			// value from client
			parseValue(value) {
				const date = new Date(value)
				if (isNaN(date.getTime())) {
					throw new Error('Invalid date')
				}
				return date
			},

			// value to client
			serialize(value) {
				if (!(value instanceof Date) || isNaN(value.getTime())) {
					throw new Error('Invalid date')
				}
				return value
			},
			parseLiteral(ast) {
				if (ast.kind === Kind.STRING) {
					let dt
					if (ast.value.includes(' ')) {
						dt = DateTime.fromFormat(ast.value, 'MM/yyyy HH:mm')
					} else {
						dt = DateTime.fromFormat(ast.value, 'MM/yyyy')
					}
					if (!dt.isValid) {
						throw new Error('Invalid date')
					}
					return dt.toJSDate() // convert it back to a native JavaScript Date
				}
				return null
			},
		}),
	},
	context: ({ req }) => {
		return {
			...req,
			utils,
			model: {
				attendance: AttendanceModel,
				dog: DogModel,
				owner: OwnerModel,
				pass: PassModel,
				passOwned: PassOwnedModel,
				data: BusinessDataModel,
			},
			userId:
				req && req.headers.authorization
					? utils.getUserId(req.headers.authorization)
					: null,
			locale: req.headers['Accept-Language'],
		}
	},
})

server.listen().then(({ url }) => console.log(`Server listening on ${url}`))
