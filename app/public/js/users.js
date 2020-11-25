// 即時関数でモジュール化する
// グローバルなスコープではなく、
// このファイルのスコープになる
const usersModule = (() => {
  // ベースURLを設定
  const BASE_URL = 'http://localhost:3000/api/v1/users';

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
                      </tr>`;

        // beforeendで中身の末尾にデータを追加していく
        // insertAdjacentHTMLは既存のデータを保持する
        document.getElementById('users-list').insertAdjacentHTML('beforeend', body);
      }
    },
    // HTMLから送信されたデータを取得して、DBに保存する
    createUser: async () => {
      // フォームの値を取得する
      const name = document.getElementById('name');
      const profile = document.getElementById('profile');
      const dateOfBirth = document.getElementById('dateOfBirth');

      // リクエストボディを作成する
      const body = {
        name: name,
        profile: profile,
        date_of_birth: dateOfBirth
      };
    }
  }
})();