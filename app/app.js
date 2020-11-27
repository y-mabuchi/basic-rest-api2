// Expressをインポート
const express = require('express');
const app = express();
// sqlite3をインポート
const sqlit3 = require('sqlite3');
const dbPath = 'app/db/database.sqlite3';
// 静的ファイルのためのインポート
const path = require('path');
// リクエストのbodyをパースするためにインポート
const bodyParser = require('body-parser');

// リクエストのbodyをパースする
app.use(bodyParser.urlencoded({ extended: true }));
// リクエストのJSONを扱えるように設定する
app.use(bodyParser.json());

// 静的ファイルを設定
app.use(express.static(path.join(__dirname, 'public')));

// usersを全件取得
app.get('/api/v1/users', (req, res) => {
  // DBに接続
  const db = new sqlit3.Database(dbPath);

  // 全件取得なのでallを使う
  db.all('SELECT * FROM users', (err, rows) => {
    // エラー処理については書かない
    // まずは正常系だけ
    res.json(rows);
  });

  // DBをクローズ
  db.close();
});

// followingを取得する
app.get('/api/v1/users/:id/following', (req, res) => {
  // DBに接続
  const db = new sqlit3.Database(dbPath);
  // idを取得
  const id = req.params.id;

  // SQL文を作成する
  const sql = `SELECT * FROM following LEFT JOIN users ON following.followed_id = users.id WHERE following_id=${id}`;

  // 全件取得なのでallを使う
  db.all(sql, (err, rows) => {
    if (!rows) {
      res.status(404).send({ message: 'Not found.' });
    } else {
      res.status(200).json(rows);
    }
  });

  // DBをクローズ
  db.close();
});

// フォローしているユーザー情報を取得
app.get('/api/v1/users/:id/following/:followed_id', (req, res) => {
  // DBに接続
  const db = new sqlit3.Database(dbPath);

  // パラメータを取得
  const id = req.params.id;
  const followedId = req.params.followed_id;
  
  // SQLを作成
  const sql = `SELECT * FROM following LEFT JOIN users ON following.followed_id=users.id WHERE following_id=${id} AND followed_id=${followedId};`;

  // クエリ実行(単一データなのでdb.get())
  db.get(sql, (err, row) => {
    if (!row) {
      res.status(404).send({ error: 'User is not found.' });
    } else {
      // データを返す
      res.status(200).json(row);
    }
  });
});

// 単一のuserのAPI
app.get('/api/v1/users/:id', (req, res) => {
  // DBに接続
  const db = new sqlit3.Database(dbPath);

  // paramsで渡ってきたパラメータを取得できる
  // 今回は、「:id」なので、params.idで取得する
  const id = req.params.id;

  // 単一なのでgetを使う
  // バッククォーテーションでテンプレートリテラルを使う
  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    // 見つからなかった場合
    if (!row) {
      res.status(404).send({ error: '指定されたユーザーが見つかりません。' });
    } else {
      // 正常なので、ステータスコード200を設定後、JSONを返す
      res.status(200).json(row);
    }
  });

  // DBをクローズ
  db.close();
});

// 検索のAPI
// ex) /api/v1/serach?q=keyword
app.get('/api/v1/search', (req, res) => {
  // DBに接続
  const db = new sqlit3.Database(dbPath);

  // クエリの中身を取得する
  const keyword = req.query.q;

  // 複数取得するのでallを使う
  // バッククォーテーションでテンプレートリテラルを使う
  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    // エラー処理については書かない
    // まずは正常系だけ
    res.json(rows);
  });

  // DBをクローズ
  db.close();
});

// DBクエリを実行する関数を作成する（非同期処理のため）
const run = async (sql, db) => {
  // DBの処理が成功したのか、失敗したのか待ちたいので、Promiseを返す
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        // rejectメソッドを返して関数が終了する
        // 使用する側でtry-catchできるようにエラーを設定
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
};

// ユーザー作成用のAPI
// runでawaitを使いたいので、asyncにする
app.post('/api/v1/users', async (req, res) => {
  // 名前がnullか空だったら
  if (!req.body.name || req.body.name === '') {
    res.status(400).send({ error: 'ユーザー名が指定されていません。' });
  } else {
    // DBに接続
    const db = new sqlit3.Database(dbPath);

    // name,profile,date_of_birthの値が来る
    const name = req.body.name;
    // 三項演算子で、存在していれば値を入れて、そうでなければ空文字を入れる
    const profile = req.body.profile ? req.body.profile : '';
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : '';

    // awaitにしているので、rejectかresolveが返ってくるまで待つ
    // すべて文字列型で渡すので、変数の前後をダブルクォーテーションで囲う
    try {
      await run(
        `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
        db,
      );
      // データ作成の成功なので、ステータスコードは201
      res.status(201).send({ message: '新規ユーザーを作成しました。' });
    } catch (e) {
      // runファンクションでエラーを設定しているので
      // runが失敗するとこちらに制御が移る
      res.status(500).send({ error: e });
    }

    // DBをクローズ
    db.close();
  }
});

// ユーザーデータを更新する
app.put('/api/v1/users/:id', async (req, res) => {
  // 名前がnullか空だったら
  if (!req.body.name || req.body.name === '') {
    res.status(400).send({ error: 'ユーザー名が指定されていません。' });
  } else {
    // DBに接続
    const db = new sqlit3.Database(dbPath);
    const id = req.params.id;

    // 現在のユーザー情報を取得して、リクエストにデータが入っていたらそれらを
    // そうでなければ、元のデータを使うようにする
    db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
      if (!row) {
        res.status(404).send({ error: '指定されたユーザーが見つかりません。' });
      } else {
        const name = req.body.name ? req.body.name : row.name;
        const profile = req.body.profile ? req.body.profile : row.profile;
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth;

        try {
          await run(
            `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
            db,
          );
          res.status(200).send({ message: 'ユーザー情報を更新しました' });
        } catch (e) {
          res.status(500).send({error: e})
        }
      }
    });
    // DBをクローズ
    db.close();
  }
});

// ユーザー情報の削除用API
app.delete('/api/v1/users/:id', async (req, res) => {
  // DBに接続
  const db = new sqlit3.Database(dbPath);
  const id = req.params.id;


  // 現在のユーザー情報を取得して、リクエストにデータが入っていたらそれらを
  // そうでなければ、元のデータを使うようにする
  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
    if (!row) {
      res.status(404).send({ error: 'Not Found!' });
    } else {
      try {
        await run(
          `DELETE FROM users WHERE id=${id}`,
          db
        );
        res.status(200).send({ message: 'ユーザーを削除しました。' });
      } catch (e) {
        res.status(500).send({ error: e });
      }
    }

    // DBをクローズ
    db.close();
  });
});

// ポート3000で公開、リクエストを受付
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listen on port: ' + port);