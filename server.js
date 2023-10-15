require("module-alias/register");
const { ApolloServer } = require("apollo-server");
const resolvers = require("./graphql/resolvers");
const model = require("./db/models");
const utils = require("./utils");
const types = require("./graphql/types");

require("./db/config");

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      utils,
      model,
      userId:
        req && req.headers.authorization
          ? utils.getUserId(req.headers.authorization)
          : null,
      locale: req.headers["Accept-Language"],
    };
  },
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
