# よくある質問

---

## インストール成功後にエラー `DNS Lookup resolve failed` が発生する

`.env` ファイル内の `mysql` と `redis` の設定が正しいか、正常に接続できるか確認してください

---

## 購入したプラグインが使えない

有料プラグインの場合、QQグループまたはWeChatグループで管理者に連絡し、注文番号を提供してください。管理者が対応するプラグインのアフターサービスグループに招待します

---

## Swoole から Swow に切り替える方法

::: warning

Swow のインストールについては [Swow 公式ドキュメント](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F) を参照してください

:::

1. プロジェクトディレクトリにある `.github/ci/server.php` を `config/autoload/server.php` に上書きコピー
2. プロジェクトディレクトリにある `.github/ci/hyperf.php` を `bin/hyperf.php` に上書きコピー

再起動すれば完了です

---

## プラグインをインストール後、gitにコミットして本番環境でコードをプル（または他の人がコードをプル）した際、フロントエンドからプラグインのAPIにアクセスするとnot foundになる

1. plugin/mine-admin以下のプラグイン内のinstall.lockは必ずコミットする必要があります。そうしないとプラグインのルートが認識されません
2. gitignoreに*.lockが含まれている場合はこの行を削除してください

---

## 画像やファイルをアップロードした後、アクセスするとNot Foundになる問題

1. 本番環境では、nginxプロキシを使用することを推奨します。

  Nginxプロキシの設定は以下の例を参考にしてください（env設定とアップロードディレクトリの権限に注意）。以下のパスはあくまで例ですので、実際の環境に合わせて調整してください。
  リソースURLが https://example.com/uploads/**/****.png の場合：
```nginx
# uploads内の画像リソースをプロキシ
location /uploads/ {
    alias /mineadmin/storage/uploads/; # 例示パス。実際の環境に合わせて調整
    expires 7d;
    add_header Cache-Control "public";  # すべてのユーザーと中間キャッシュサーバー（CDNなど）がこのリソースをキャッシュできるようにし、効率を向上
    add_header Access-Control-Allow-Origin https://example.com;  # https://example.com ドメインのウェブページのみがこのリソースにクロスオリジンリクエストできるようにし、セキュリティ向上
}
```

::: warning

すべての設定が正しいことを確認しても、依然としてアクセスできず **403 Forbidden** が表示される場合は、`uploads` ディレクトリのパーミッションが **755** に設定されているか、所有者が `www` であるかを確認してください。

:::

2. 開発環境では、/config/autoload/server.phpに以下のように設定：
```php
'settings' => [
  // 外部からのアクセスを許可
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```
.envファイルでAPP_DEBUGをtrueに変更し、設定後にサービスを再起動してください。