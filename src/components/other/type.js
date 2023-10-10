const vaccineFields = `
  name: String!
  dateAdministered: Date!
  nextDue: Date
`;
const noteFields = `
  key: String!
  value: String!
  active: Boolean!
`;
const VaccineType = `
  type Vaccine {
    ${vaccineFields}
  }
`;
const VaccineInputType = `
  input VaccineInput {
    ${vaccineFields}
  }
`;
const NoteType = `
  type Note {
    ${noteFields}
  }
`;
const NoteInputType = `
  input NoteInput {
    ${noteFields}
  }
`;
const AddressType = `
  type Address {
    id: ID!
    street: String!
    number: String
    zipcode: String!
    city: String!
    country: String!
  }
`;
const AuthType = `
  type Auth {
    token: String!
    user: User!
  }
`;

module.exports = {
  VaccineInputType,
  VaccineType,
  NoteInputType,
  NoteType,
  AuthType,
  AddressType,
};
