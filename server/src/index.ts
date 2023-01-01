import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.SAMPLE_POSTS_DATABASE_HOST,
  user: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  password: process.env.SAMPLE_POSTS_DATABASE_USERNAME,
  database: process.env.SAMPLE_POSTS_DATABASE_DATABASE,
});

const resolvers = {
  Query: {},
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
