import { Connection } from "mysql2/promise";
import { DbPost } from "./db-post.js";
import { Post } from "./post.js";

export class PostRepository {
  async findPosts(connection: Connection): Promise<Post[]> {
    const [rows] = await connection.query<DbPost[]>("SELECT * FROM `posts`");
    return rows.map((row) => this.dbPostToPost(row));
  }

  async findPostById(connection: Connection, id: number): Promise<Post | null> {
    const [rows] = await connection.query<DbPost[]>(
      "SELECT * FROM `posts` WHERE  id = ?",
      [id]
    );
    if (rows.length === 1) {
      return this.dbPostToPost(rows[0]);
    } else {
      return null;
    }
  }

  private dbPostToPost(dbPost: DbPost): Post {
    return {
      id: dbPost.id,
      authorId: dbPost.author_id,
      content: dbPost.content,
      createdAt: dbPost.created_at,
    };
  }
}
