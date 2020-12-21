const { ApolloServer } = require("apollo-server");
const resolvers = require("./graphql/resolvers");
const model = require("./db/models");
const { getUserId } = require("./utils/auth");
const types = require("./graphql/types");

require("./db/config");

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      model,
      userId:
        req && req.headers.authorization
          ? getUserId(req.headers.authorization)
          : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
