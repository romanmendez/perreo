const { gql } = require("apollo-server");

const getSchemaFields = async (schema, query) => {
  const schemaData = await query({
    query: gql`
      query {
        __schema {
          types {
            name
            fields {
              name
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    `,
  });
  const schemaType = schemaData.data.__schema.types.find(
    (type) => type.name === schema
  );
  const schemaFields = {};
  if (schemaType && schemaType.fields) {
    schemaType.fields.forEach((field) => {
      schemaFields[field.name] = field.type.name;
    });
  }
  return Object.entries(schemaFields).map(([key, value]) => ({
    key: key,
    value: value,
  }));
};

module.exports = { getSchemaFields };
