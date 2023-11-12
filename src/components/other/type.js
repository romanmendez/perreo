const vaccineFields = `
  name: String!
  dateAdministered: Date!
  nextDue: Date
`
const noteFields = `
  key: String!
  value: String!
  isActive: Boolean!
`
export const VaccineType = `
  type Vaccine {
    ${vaccineFields}
  }
`
export const VaccineInputType = `
  input VaccineInput {
    ${vaccineFields}
  }
`
export const NoteType = `
  type Note {
    ${noteFields}
  }
`
export const NoteInputType = `
  input NoteInput {
    ${noteFields}
  }
`
export const AddressType = `
  type Address {
    id: ID!
    street: String!
    number: String
    zipcode: String!
    city: String!
    country: String!
  }
`
export const AuthType = `
  type Auth {
    token: String!
  }
`
