# ライフサイクル

::: tip

Swoole であれ Swow であれ、MineAdmin では Hyperf が [symfony/console](https://github.com/symfony/console) コンポーネントを通じて統合されています。
起動コマンド: `php bin/hyperf.php start`

MineAdmin は [PHP](https://php.net) + ([Swoole](https://swoole.com) または [Swow](https://github.com/swow/swow)) + [Hyperf](https://github.com/hyperf/hyperf)
上で構築・実行されています。MineAdmin のライフサイクルを完全に理解するには、基盤となるアーキテクチャのライフサイクルを理解することが極めて重要です。

本稿では上記の基盤アーキテクチャのライフサイクルについては改めて説明しません。興味があれば各自で調査・学習してください。
本稿では、ビジネスに関連するライフサイクルの説明に重点を置きます。

:::


## デュアルトークン認証リフレッシュ

デュアルトークン方式とは、ユーザーログインプロセスにおいて、従来の `Access Token` に加えて、追加の `Refresh Token` を導入することを指します。`Access Token` は主にユーザー認証とユーザーセッションの維持に使用され、
`Refresh Token` は `Access Token` の有効期限が切れた後に新しい `Access Token` を再取得するために使用されます。この設計により、セキュリティを確保しながら、
優れたユーザーエクスペリエンスを提供できます。

::: tip

デフォルトで提供されるアプリケーション認証メカニズムは、いずれも2つのトークンによるインタラクティブなリフレッシュ認証を実装しています。
すなわち、`AccessToken` と `RefreshToken` です。

Jwt の生成と認証は、MineAdmin が [lcobucci/jwt](https://github.com/lcobucci/jwt) コンポーネントを統合することによって一元的に実装されています。

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
Server -> Client : 401 エラーコードを返却、かつローカルの refresh_token が未期限切れ
Client -> Queue : リクエスト情報を一時保存
Client -> Server : refresh_token を使用して新しいトークンと交換
alt トークン交換APIが401を返却
    Client -> Local : ローカルキャッシュをクリア
    Client -> Server : ログインページにリダイレクト
else トークン交換成功
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
if (リクエスト失敗、code = 401 かつ ローカルの refresh_token が未期限切れ) then (はい)
->
:リクエスト情報をキューに一時保存;
->
:refresh_token で新しいトークンと交換;
if (トークン交換APIが401を返却) then (はい)
->
:ローカルキャッシュをクリア、ログインページにリダイレクト;
else (いいえ)
->
:ローカルトークンを更新、失敗したリクエストを再試行;
endif
else (いいえ)
endif
```

### 解説

ログイン成功後、access token と refresh token をローカルに保存します。

あるリクエストが失敗し、エラーコードが 401 で、かつローカルの refresh_token が期限切れでない場合、まず現在のリクエスト情報をキューに一時保存する必要があります。このキューは、同一タイミングで複数のリクエストが同時にトークンをリフレッシュするのを防ぐためのものです。

その後、refresh token を使用して新しい access_token と refresh_token と交換します。

トークン交換のAPIも同じく 401 エラーコードを返す場合、access_token と refresh_token の両方が期限切れであることを意味するため、ローカルキャッシュをクリアし、ログインページにリダイレクトする必要があります。

トークン交換が成功した場合は、ローカルトークンを更新し、以前失敗したリクエストを再試行します。

---