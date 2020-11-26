// 即時関数でモジュール化してあげる
// URLに応じて実行する関数を切り替える
const indexModule = (() => {
  const path = window.location.pathname;

  switch (path) {
    // ルートにアクセスしたら
    case '/':
      // 検索ボタンをクリックしたときのイベントリスナーの設定
      document.getElementById('search-btn')
        .addEventListener('click', () => {
          return searchModule.searchUsers();
        });

      // UsersモジュールのfetchAllUsersメソッドを呼び出す
      return usersModule.fetchAllUsers();
    
    // create.htmlにアクセスしたら
    case '/create.html':
      // 保存ボタンがクリックされたとき
      document.getElementById('save-btn')
        .addEventListener('click', () => {
          return usersModule.createUser();
        });
      
      // キャンセルボタンがクリックされたとき
      document.getElementById('cancel-btn')
        .addEventListener('click', () => {
          return window.location.href = '/';
        });
      
      break;

    default:
      break;
  }

})();