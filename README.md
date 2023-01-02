# graphql-sample-posts

GraphQLの練習用に作った簡易ブログ・掲示板もどき


## バックエンド( `/server` 内)

* ~話をややこしくしないためにORMを使わずに作ってみる~
    * prismaを使ったほうがはるかにすっきりするのでprismaを使うことにした
* 読み取りだけじゃなくて書き込みの処理も最低限作ってみる

### 準備

* `.env.sample` を `.env` としてコピーして適宜値を変える
* DBのセットアップ
    * `npx prisma migrate dev`
    * `npm seed`

### 開発

* `npm start`
* `http://localhost:4000/`　で試せる

### サンプル

```
query {
  currentUser {
    name
  }
}

query {
  posts {
    id
    content
    author {
      name
    }
  }
}

query {
  posts(limit: 2, offset: 2) {
    id
    content
    createdAt
    author {
      name
    }
  }
}

mutation Mutation {
  publishPost(content: "新しい投稿") {
    id
    author {
      name
    }
  }
}
```

## フロントエンド

coming soon...

## 参考にしたサイトのメモ

* https://zenn.dev/knaka0209/books/befdda3d27a264/viewer/caa2d8
* https://www.apollographql.com/docs/apollo-server/getting-started
* https://qiita.com/t-yng/items/0094f3b4816bdc27cf94
* https://www.wakuwakubank.com/posts/641-nodejs-graphql/#index_id6

mutation

* https://www.apollographql.com/docs/apollo-server/data/resolvers#the-contextvalue-argument
* https://zenn.dev/eringiv3/books/a85174531fd56a/viewer/9d538f
* https://zenn.dev/eringiv3/books/a85174531fd56a/viewer/953541
* https://suzukalight.com/blog/posts/2019-12-14-graphql-server-authentication

typescript

* https://dev.to/larswaechter/using-mysql-in-nodejs-with-typescript-ida

フロントエンド

* https://beamaker.jp/article/11
* https://zenn.dev/kimkiyong/articles/b92b1029093741
