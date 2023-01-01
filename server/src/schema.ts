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
    posts: [Post]
    post(id: Int): Post
    users: [User]
    user(id: Int): User
  }

  type Mutation {
    publishPost(content: String): Post
  }
`;
