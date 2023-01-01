import { Connection } from "mysql2/promise";
import { DbUser } from "./db-user.js";
import { User } from "./user.js";

export class UserRepository {
  async findUsers(connection: Connection): Promise<User[]> {
    const [rows] = await connection.query<DbUser[]>("SELECT * FROM `users`");
    return rows;
  }

  async findUserById(connection: Connection, id: number): Promise<User | null> {
    const [rows] = await connection.query<DbUser[]>(
      "SELECT * FROM `users` WHERE id = ?",
      [id]
    );
    if (rows.length === 1) {
      return rows[0];
    } else {
      return null;
    }
  }
}
