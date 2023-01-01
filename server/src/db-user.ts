import { RowDataPacket } from "mysql2";

export interface DbUser extends RowDataPacket {
  id: number;
  name: string;
}
