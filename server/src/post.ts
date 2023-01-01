import { User } from "./user";

export interface Post {
  id: number;
  authorId: number;
  author?: User;
  content: string;
  createdAt: string;
}
