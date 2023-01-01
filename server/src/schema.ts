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
  }

  type Mutation {
    publishPost(content: String): Post
  }
`;
