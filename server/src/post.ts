import { User } from "./user";

export interface Post {
  id: number;
  author: User;
  content: string;
  createdAt: string;
}
