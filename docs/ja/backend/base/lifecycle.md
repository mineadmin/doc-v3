# ライフサイクル

::: tip

Swoole であろうと Swow であろうと、MineAdmin では Hyperf によって [symfony/console](https://github.com/symfony/console) コンポーネントを介して統合されています。
起動コマンドは `php bin/hyperf.php start` です。

MineAdmin は [PHP](https://php.net) + ([Swoole](https://swoole.com) または [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf) 上で構築されて動作します。
MineAdmin のライフサイクルを完全に理解するためには、基盤となるアーキテクチャのライフサイクルを理解することが極めて重要です。

本記事では、上記の基盤アーキテクチャのライフサイクルについては改めて説明しません。興味があれば各自で研究・学習してください。
本記事では、より業務に関連するライフサイクルの説明に重点を置きます。

:::

## デュアルトークン認証リフレッシュ

デュアルトークン機構とは、ユーザーログイン時に従来の `Access Token` に加えて、追加の `Refresh Token` を導入する仕組みです。`Access Token` は主にユーザー認証とセッション維持に使用され、
`Refresh Token` は `Access Token` の有効期限が切れた後に新しい `Access Token` を再取得するために使用されます。この設計により、セキュリティを確保しつつ、
より優れたユーザー体験を提供できます。

::: tip

デフォルトで提供されるアプリケーション認証機構は、2つのトークンによる相互リフレッシュ認証で実装されています。
つまり `AccessToken` と `RefreshToken` です。

JWT の生成と認証に関しては、MineAdmin が [lcobucci/jwt](https://github.com/lcobucci/jwt) コンポーネントを統合して実現しています。

:::

---

### シーケンス図

```plantuml
participant "クライアント" as Client
participant "サーバー" as Server

Client -> Server : ログインリクエスト
Server -> Client : ログイン成功、access_token と refresh_token を返却
Client -> Local : access_token と refresh_token をローカルに保存

Client -> Server : リクエスト送信
Server -> Client : 401 エラーコードを返却、かつローカルの refresh_token が有効期限内
Client -> Queue : リクエスト情報を一時保存
Client -> Server : refresh_token を使用して新しいトークンを取得
alt トークン更新APIが401を返した場合
    Client -> Local : ローカルキャッシュをクリア
    Client -> Server : ログインページにリダイレクト
else トークン更新成功
    Client -> Local : ローカルトークンを更新
    Client -> Server : 失敗したリクエストを再試行
end
```

### フローチャート

```plantuml
start
:ログイン成功;
->
:access_token と refresh_token をローカルに保存;
->
:リクエスト送信;
if (リクエスト失敗、code = 401 かつローカルの refresh_token が有効期限内) then (yes)
->
:リクエスト情報をキューに一時保存;
->
:refresh_token を使用して新しいトークンを取得;
if (トークン更新APIが401を返した) then (yes)
->
:ローカルキャッシュをクリア、ログインページにリダイレクト;
else (no)
->
:ローカルトークンを更新、失敗したリクエストを再試行;
endif
else (no)
endif
```

### 解説

ログイン成功後、access token と refresh token をローカルに保存します。

リクエストが失敗し、エラーコードが401で、かつローカルの refresh_token が有効期限内の場合、まず現在のリクエスト情報をキューに一時保存します。このキューは、複数のリクエストが同時にトークンを更新しようとするのを防ぐためのものです。

その後、refresh token を使用して新しい access_token と refresh_token を取得します。

トークン更新APIも401エラーコードを返した場合、access_token と refresh_token の両方が有効期限切れであることを意味し、ローカルキャッシュをクリアしてログインページにリダイレクトする必要があります。

トークン更新が成功した場合は、ローカルトークンを更新し、以前失敗したリクエストを再試行します。

---