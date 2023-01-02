import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";

import * as dotenv from "dotenv";
dotenv.config();

import { Context } from "./context.js";

import { Post, PrismaClient, User } from "@prisma/client";
import { PostModel } from "./post-model.js";
import { UserModel } from "./user-model.js";
const prisma = new PrismaClient();

function prismaPostToPostModel(prismaPost: Post): PostModel {
  return {
    id: prismaPost.id,
    authorId: prismaPost.id,
    content: prismaPost.content,
    createdAt: prismaPost.createdAt.toISOString(),
  };
}

function prismaUserToUserModel(prismaUser: User): UserModel {
  return { id: prismaUser.id, name: prismaUser.name };
}

const resolvers = {
  Query: {
    async posts(parent, { limit, offset }): Promise<PostModel[]> {
      const prismaPosts = await prisma.post.findMany({
        orderBy: { id: "desc" },
        take: limit ?? 100,
        skip: offset ?? 0,
      });
      return prismaPosts.map(prismaPostToPostModel);
    },
    currentUser(parent, args, { currentUser }: Context): UserModel | null {
      return currentUser;
    },
  },
  Post: {
    async author(parent: Post): Promise<UserModel> {
      // TODO: 普通に作るとここがn+1になるがprismaのfindUniqueなら回避できるとかなんとか
      // https://engineering.mercari.com/blog/entry/20210818-mercari-shops-nestjs-graphql-server/#dataloader-for-batch-request
      const prismaUser = await prisma.user.findUnique({
        where: { id: parent.authorId },
      });
      return prismaUserToUserModel(prismaUser);
    },
  },
  Mutation: {
    async publishPost(
      parent,
      { content },
      { currentUser }: Context
    ): Promise<PostModel> {
      // TODO: ここでログイン状態のチェックが要りそう
      const prismaPost = await prisma.post.create({
        data: {
          content,
          authorId: currentUser.id,
          createdAt: new Date(),
        },
      });
      return prismaPostToPostModel(prismaPost);
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
    const prismaUser = await prisma.user.findUnique({ where: { id: 1 } });
    return {
      currentUser: prismaUserToUserModel(prismaUser),
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
