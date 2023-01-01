import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";

import * as dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import { User } from "./user.js";
import { DbUser } from "./db-user.js";
import { Post } from "./post.js";
import { DbPost } from "./db-post.js";

const connection = await mysql.createConnection({
  host: process.env.SAMPLE_POSTS_DATABASE_HOST,
  user: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  password: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  database: process.env.SAMPLE_POSTS_DATABASE_DATABASE,
});

const resolvers = {
  Query: {
    async users(): Promise<User[]> {
      const [rows] = await connection.query<DbUser[]>("SELECT * FROM `users`");
      return rows;
    },
    async user(_, args): Promise<User | null> {
      const [rows] = await connection.query<DbUser[]>(
        "SELECT * FROM `users` WHERE id = ?",
        [args.id]
      );
      if (rows.length === 1) {
        return rows[0];
      } else {
        return null;
      }
    },
    async posts(): Promise<Post[]> {
      const [rows] = await connection.query<DbPost[]>("SELECT * FROM `posts`");
      return rows.map((row) => {
        return {
          id: row.id,
          authorId: row.author_id,
          content: row.content,
          createdAt: row.created_at,
        };
      });
    },
  },
  Post: {
    async author(parent: Post): Promise<User> {
      const [rows] = await connection.query<DbUser[]>(
        "SELECT * FROM `users` WHERE id = ?",
        [parent.authorId]
      );
      if (rows.length === 1) {
        return rows[0];
      } else {
        return null;
      }
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
