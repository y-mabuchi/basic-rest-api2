// 即時関数でモジュール化する
// グローバルなスコープではなく、
// このファイルのスコープになる
const usersModule = (() => {
  // ベースURLを設定
  const BASE_URL = 'http://localhost:3000/api/v1/users';

  // ヘッダーの設定
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // エラー処理の共通化
  const handleError = async (res) => {
    // jsonメソッドは非同期処理なので、awaitで処理を待つ
    const resJson = await res.json();

    switch (res.status) {
      case 200:
        alert(resJson.message);
        // トップページへ遷移させる
        window.location.href = '/';
        break;
      case 201:
        alert(resJson.message);
        // トップページへ遷移させる
        window.location.href = '/';
        break;
      case 400:
        // リクエストのパラメータ間違い
        alert(resJson.error);
        break;
      case 404:
        // 指定したリソースが見つからない
        alert(resJson.error);
        break;
      case 500:
        // サーバーの内部エラー
        alert(resJson.error);
        break;
      default:
        alert('なんらかのエラーが発生しました。');
        break;
    }

  };

  // usersModuleの中で使えるメソッドを定義していく
  return {
    // awaitを使いたいので、asyncを使う
    fetchAllUsers: async () => {
      // fetchメソッドは、何も指定しなければ、GETメソッドを投げる
      // 非同期処理になるので、awaitを使って結果を待つ
      // resはJSONで返ってくる
      const res = await fetch(BASE_URL)

      // そのままではJSONを読めないのでパースする
      // userオブジェクトの配列で返ってくる
      const users = await res.json();

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // テンプレートリテラルでHTMLを作成
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                        <td><a href="edit.html?uid=${user.id}">編集</a></td>
                      </tr>`;

        // beforeendで中身の末尾にデータを追加していく
        // insertAdjacentHTMLは既存のデータを保持する
        document.getElementById('users-list').insertAdjacentHTML('beforeend', body);
      }
    },
    // HTMLから送信されたデータを取得して、DBに保存する
    createUser: async () => {
      // フォームの値を取得する
      const name = document.getElementById('name').value;
      const profile = document.getElementById('profile').value;
      const dateOfBirth = document.getElementById('date-of-birth').value;

      // リクエストボディを作成する
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth
      };

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: headers,
        // bodyはJavaScriptのオブジェクトなので、
        // JSON.stringifyでJSONに変換してあげる
        body: JSON.stringify(body)
      });

      return handleError(res);
    },
    // ユーザー情報をフォームに入力する
    setExistingValue: async (uid) => {
      const res = await fetch(BASE_URL + '/' + uid);
      const resJson = await res.json();

      document.getElementById('name').value = resJson.name;
      document.getElementById('profile').value = resJson.profile;
      document.getElementById('date-of-birth').value = resJson.date_of_birth;
    },
    // データを編集する
    saveUser: async (uid) => {
      // フォームの値を取得する
      const name = document.getElementById('name').value;
      const profile = document.getElementById('profile').value;
      const dateOfBirth = document.getElementById('date-of-birth').value;

      // リクエストボディを作成する
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth
      };

      const res = await fetch(BASE_URL + '/' + uid, {
        method: 'PUT',
        headers: headers,
        // bodyはJavaScriptのオブジェクトなので、
        // JSON.stringifyでJSONに変換してあげる
        body: JSON.stringify(body)
      });

      return handleError(res);
    },
    // 削除用の関数
    deleteUser: async (uid) => {
      const ret = window.confirm('このユーザーを削除しますか？');

      if (!ret) {
        return false;
      } else {
        const res = await fetch(BASE_URL + '/' + uid, {
          method: 'DELETE',
          headers: headers
        });

        return handleError(res);
      }
    }
  }
})();