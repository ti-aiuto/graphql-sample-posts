import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";

import * as dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import { User } from "./user.js";
import { Post } from "./post.js";
import { UserRepository } from "./user-repository.js";
import { PostRepository } from "./post-repository.js";

const connection = await mysql.createConnection({
  host: process.env.SAMPLE_POSTS_DATABASE_HOST,
  user: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  password: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  database: process.env.SAMPLE_POSTS_DATABASE_DATABASE,
});

const userRepository = new UserRepository();
const postRepository = new PostRepository();

const resolvers = {
  Query: {
    async users(): Promise<User[]> {
      return userRepository.findUsers(connection);
    },
    async user(_, args): Promise<User | null> {
      return userRepository.findUserById(connection, args.id);
    },
    async posts(): Promise<Post[]> {
      return postRepository.findPosts(connection);
    },
    async post(_, args): Promise<Post | null> {
      return postRepository.findPostById(connection, args.id);
    },
  },
  Post: {
    async author(parent: Post): Promise<User> {
      // ここがn+1になる
      // https://engineering.mercari.com/blog/entry/20210818-mercari-shops-nestjs-graphql-server/#dataloader-for-batch-request
      return userRepository.findUserById(connection, parent.authorId);
    },
  },
  Mutation: {},
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  async context() {
    return {};
  },
});

console.log(`🚀  Server ready at: ${url}`);
