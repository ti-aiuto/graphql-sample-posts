import { RowDataPacket } from "mysql2";

export interface DbPost extends RowDataPacket {
  id: number;
  author_id: number;
  content: string;
  created_at: Date;
}
