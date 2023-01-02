import { UserModel } from "./user-model";

export interface PostModel {
  id: number;
  authorId: number;
  author?: UserModel;
  content: string;
  createdAt: string;
}
