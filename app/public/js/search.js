// 即時関数でモジュール化してあげる
const searchModule = (() => {
  const BASE_URL = 'http://localhost:3000/api/v1/search';

  return {
    searchUsers: async () => {
      // 検索窓に入力した情報を取得したい
      const query = document.getElementById('search').value;

      // クエリパラメータqに追加してフェッチする
      const res = await fetch(BASE_URL + '?q=' + query);
      // jsonメソッドでオブジェクト化してあげる
      const result = await res.json();

      // letでbodyを宣言する
      let body = '';

      for (let i = 0; i < result.length; i++) {
        const user = result[i];
        body += `<tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.profile}</td>
                  <td>${user.date_of_birth}</td>
                  <td>${user.created_at}</td>
                  <td>${user.updated_at}</td>
                </tr>`;
      };

      document.getElementById('users-list').innerHTML = body;
    }
  }
})();