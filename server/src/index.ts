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
import { Context } from "./context.js";

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
    async posts(parent, { limit, offset }): Promise<Post[]> {
      return postRepository.findPosts(connection, limit, offset);
    },
    currentUser(parent, args, { currentUser }: Context): User | null {
      return currentUser;
    },
  },
  Post: {
    async author(parent: Post): Promise<User> {
      // TODO: ここがn+1になる
      // https://engineering.mercari.com/blog/entry/20210818-mercari-shops-nestjs-graphql-server/#dataloader-for-batch-request
      return userRepository.findUserById(connection, parent.authorId);
    },
  },
  Mutation: {
    publishPost(parent, { content }, { currentUser }: Context): Promise<Post> {
      // TODO: ここでログイン状態のチェックが要りそう
      return postRepository.create(connection, {
        content,
        authorId: currentUser.id,
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  async context({ req }): Promise<Context> {
    // TODO: ここでreq.headers['x-token']などでユーザを検索する
    // とりあえずダミーユーザにしておく
    return {
      currentUser: await userRepository.findUserById(connection, 1),
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
