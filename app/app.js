// Expressをインポート
const express = require('express');
const app = express();
// sqlite3をインポート
const sqlit3 = require('sqlite3');
const dbPath = 'app/db/database.sqlite3';
// 静的ファイルのためのインポート
const path = require('path');

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

// 単一のuserのAPI
app.get('/api/v1/users/:id', (req, res) => {
  // DBに接続
  const db = new sqlit3.Database(dbPath);

  // idを取り出す
  const id = req.params.id;

  // 単一なのでgetを使う
  // バッククォーテーションでテンプレートリテラルを使う
  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    // エラー処理については書かない
    // まずは正常系だけ
    res.json(row);
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

// ポート3000で公開、リクエストを受付
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listen on port: ' + port);