const followingModule = (() => {
  // ベースURLの宣言
  const BASE_URL = 'http://localhost:3000/api/v1/users';

  // ヘッダーの設定
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // フォローしているか判定します
  const isFollow = async (userId, followedId) => {
    // APIからユーザーリストを取得
    const url = `${BASE_URL}/${userId}/following/${followedId}`;
    const res = await fetch(url);

    // データが存在しているかどうかをreturn
    return res.status === 200;
  };

  return {
    // ユーザーページ用のユーザー一覧を表示します
    fetchAllUsersForUserPage: async (uid) => {
      // APIを叩く
      const res = await fetch(BASE_URL);

      // JSONをパース
      const users = await res.json();

      // 自分以外のユーザーにフィルター
      const filterdUsers = users.filter(user => user.id.toString() !== uid);

      // フォローボタンを宣言
      const followButton = '<button id="follow-btn">Follow</button>';

      // フォロー解除ボタンを宣言
      const unFollowButton = '<button id="unfollow-btn">UnFollow</button>';

      // ユーザー一覧を表示
      filterdUsers.map( async (user) => {
        // フォローしているかチェック
        const isFollowResult = await isFollow(uid, user.id);

        // ボタンを制御
        const btn =  (isFollowResult) ? followButton : unFollowButton;

        // bodyを組み立て
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                        <td>-</td>
                      </tr>`;

        // users-listにDOMを追加
        document.getElementById('users-list').insertAdjacentHTML('beforeend', body);
      });
    },

    // フォローしているユーザー一覧を表示します
    fetchFollowingUsers: async (uid) => {
      // APIを叩く
      const uri = `${BASE_URL}/${uid}/following`;
      const res = await fetch(uri);

      // JSONをパース
      const followingUsers = await res.json();

      // エラーチェック
      if (res.status === 404 || res.status === 500) {
        alert(followingUsers.error);
        return;
      }

      // フォロー一覧を表示
      followingUsers.map(user => {
        // bodyを組み立て
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                        <td><button>フォローを解除する</button></td>
                      </tr>`;

        // users-listに追加
        document.getElementById('users-list').insertAdjacentHTML('beforeend', body);
      });
    },

    // フォロワー一覧を表示します
    fetchAllFollowers: async (uid) => {
      // APIを叩く
      const url = `${BASE_URL}/${uid}/followers`;
      const res = await fetch(url);

      // JSONをパース
      const followers = await res.json();

      // エラーチェック
      if (res.status === 404 || res.status === 500) {
        alert(followers.error);
        return;
      }

      // フォロワー一覧を表示
      followers.map(user => {
        // bodyを組み立て
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                        <td>-</td>
                      </tr>`;

        // users-listに追加
        document.getElementById('users-list').insertAdjacentHTML('beforeend', body);
      });
    }
  }
})();