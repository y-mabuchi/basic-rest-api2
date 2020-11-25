// 即時関数でモジュール化してあげる
const indexModule = (() => {
  // 検索ボタンをクリックしたときのイベントリスナーの設定
  document.getElementById('search-btn')
    .addEventListener('click', () => {
      return searchModule.searchUsers();
    });

  // UsersモジュールのfetchAllUsersメソッドを呼び出す
  return usersModule.fetchAllUsers();
})();