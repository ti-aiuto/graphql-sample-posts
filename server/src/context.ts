import { UserModel } from "./user-model";

export interface Context {
  currentUser: UserModel | null;
}
