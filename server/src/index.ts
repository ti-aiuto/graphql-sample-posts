import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
type User {
    id: Int!
    name: String!
  }

  type Post {
    id: Int!
    author: User!
    content: String!
    createdAt: String!
  }

  type Query {
    posts: [Post]
    post(id: Int): Post
  }
`;

const resolvers = {
  Query: {},
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
