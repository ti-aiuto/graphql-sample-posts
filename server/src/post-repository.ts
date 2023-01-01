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

  async create(connection: Connection, post: Partial<Post>): Promise<Post> {
    await connection.query(
      "INSERT INTO posts (author_id, content, created_at) VALUES (?, ?, ?)",
      [post.authorId, post.content, new Date()]
    );
    // 同一コネクション内で実行すれば自分が直前にinsertしたものの値が返る
    const [rows] = await connection.query(
      "SELECT LAST_INSERT_ID() AS generated_id"
    );
    // 確実に取得できる前提
    const generatedId = rows[0]["generated_id"];
    return this.findPostById(connection, generatedId);
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
