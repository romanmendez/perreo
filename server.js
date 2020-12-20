const fs = require("fs");
const path = require("path");
const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const resolvers = require("./src/resolvers");
const { getUserId } = require("./utils/auth");

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "graphql/schema.graphql"),
    "utf8"
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId:
        req && req.headers.authorization
          ? getUserId(req.headers.authorization)
          : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
