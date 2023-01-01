import { User } from "./user.js";

export interface Context {
  currentUser: User | null;
}
