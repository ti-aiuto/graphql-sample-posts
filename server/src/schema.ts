export const typeDefs = `#graphql
  type User {
    id: Int!
    name: String!
  }

  type Post {
    id: Int!
    authorId: Int!
    author: User!
    content: String!
    createdAt: String!
  }

  type Query {
    posts(limit: Int, offset: Int): [Post]
    currentUser: User
  }

  type Mutation {
    publishPost(content: String): Post
  }
`;
