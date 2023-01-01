export const typeDefs = `#graphql
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
    posts(limit: Int, offset: Int): [Post]
    post(id: Int!): Post
    user(id: Int!): User
    currentUser: User
  }

  type Mutation {
    publishPost(content: String): Post
  }
`;
