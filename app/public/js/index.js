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

    // edit.htmlにアクセスしたら
    case '/edit.html':
      // URLからuidを取り出す
      const uid = window.location.search.split('?uid=')[1];

      // 保存ボタンがクリックされたとき
      document.getElementById('save-btn')
        .addEventListener('click', () => {
          return usersModule.saveUser(uid);
        });
      
      // キャンセルボタンがクリックされたとき
      document.getElementById('cancel-btn')
        .addEventListener('click', () => {
          return window.location.href = '/';
        });
      
      // 削除ボタンがクリックされたとき
      document.getElementById('delete-btn')
        .addEventListener('click', () => {
          return usersModule.deleteUser(uid);
        });

      return usersModule.setExistingValue(uid);

    // user.htmlにアクセスしたら
    case '/user.html':
      // URLからuidを取り出す
      const userId = window.location.search.split('?uid=')[1];

      // フォロー、フォロワーリンクのDOM作成
      const followingLink = `<a href="./following.html?uid=${userId}">フォロー一覧</a>`;
      const followerLink = `<a href="./follower.html?uid=${userId}">フォロワー一覧</a>`;

      document.getElementById('js-following-link').innerHTML = followingLink;
      document.getElementById('js-follower-link').innerHTML = followerLink;

      // 各値をセットする
      return {
        setExistingValue: usersModule.setExistingValue(userId),
        fetchAllUsersForUserPage: followingModule.fetchAllUsersForUserPage(userId),
      };
    
    // following.htmlにアクセスしたら
    case '/following.html':
      const followingpageUserId = window.location.search.split('?uid=')[1];

      // 各値をセットする
      return {
        setExistingValue: usersModule.setExistingValue(followingpageUserId),
        fetchAllUsersForUserPage: followingModule.fetchFollowingUsers(followingpageUserId),
      };

    default:
      break;
  }
})();