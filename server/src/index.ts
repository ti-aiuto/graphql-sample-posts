import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";

import * as dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import { User } from "./user.js";
import { DbUser } from "./db-user.js";

const connection = await mysql.createConnection({
  host: process.env.SAMPLE_POSTS_DATABASE_HOST,
  user: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  password: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  database: process.env.SAMPLE_POSTS_DATABASE_DATABASE,
});

const resolvers = {
  Query: {
    async users(): Promise<User[]> {
      const [rows] = await connection.query<DbUser[]>('SELECT * FROM `users`');
      return rows;
    }
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
