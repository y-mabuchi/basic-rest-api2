// 即時関数でモジュール化してあげる
// URLに応じて実行する関数を切り替える
const indexModule = (() => {
  const path = window.location.pathname;

  const createFollowerLink = (uid) => {
    return `<a href="./follower.html?uid=${uid}">フォロワー一覧</a>`;
  };

  const createFollowingLink = (uid) => {
    return `<a href="./following.html?uid=${uid}">フォロー一覧</a>`;
  };

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
      document.getElementById('js-following-link').innerHTML = createFollowingLink(userId);
      document.getElementById('js-follower-link').innerHTML = createFollowerLink(userId);

      // 各値をセットする
      return {
        setExistingValue: usersModule.setExistingValue(userId),
        fetchAllUsersForUserPage: followingModule.fetchAllUsersForUserPage(userId),
      };
    
    // following.htmlにアクセスしたら
    case '/following.html':
      const followingpageUserId = window.location.search.split('?uid=')[1];

      document.getElementById('js-follower-link').innerHTML = createFollowerLink(followingpageUserId);

      // 各値をセットする
      return {
        setExistingValue: usersModule.setExistingValue(followingpageUserId),
        fetchAllUsersForUserPage: followingModule.fetchFollowingUsers(followingpageUserId),
      };
    
    // follower.htmlにアクセスしたら
    case '/follower.html':
      const followerpageUserId = window.location.search.split('?uid=')[1];

      document.getElementById('js-following-link').innerHTML = createFollowingLink(followerpageUserId);

      // 各値をセットする
      return {
        setExistingValue: usersModule.setExistingValue(followerpageUserId),
        fetchAllUsersForUserPage: followingModule.fetchAllFollowers(followerpageUserId),
      };
    
    // user_info.htmlにアクセスしたら
    case '/user_info.html':
      // クエリパラメータを取得して、最初の?を除去
      const query = window.location.search.substring(1);
      const queryObj = {};
      // 複数パラメータを分割します
      const parameters = query.split('&');

      // クエリごとオブジェクトに格納します
      parameters.map(param => {
        const element = param.split('=');
        const key = element[0];
        const value = element[1];
        queryObj[key] = value;
      });

      const from = queryObj.from;
      const to = queryObj.to;

      return {
        setExistingValue: usersModule.setExistingValue(to),
        createActionButton: followingModule.createActionButton(from, to),
      }

    default:
      break;
  }
})();