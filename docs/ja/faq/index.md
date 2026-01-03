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

---

## WindowsでDockerを使用すると起動が遅いのはなぜですか？

### 原因分析

WindowsシステムでDockerを使用する際、起動速度が遅い主な原因はDockerのファイルシステム特性によるものです。DockerはWindows上で仮想化技術（WSL2やHyper-Vなど）を使用して動作しており、バインドマウント方式でWindowsホストのディレクトリをコンテナ内にマウントすると、クロスファイルシステムアクセスのオーバーヘッドが発生します。

特に大量の小さなファイルを含むディレクトリ（`vendor`ディレクトリには数千の依存パッケージファイルが含まれ、`runtime`ディレクトリにはログやキャッシュファイルが含まれる）をマウントする場合、各ファイルの読み書きは以下を経由する必要があります：
1. コンテナ内のファイルシステム
2. Docker仮想化層
3. Windowsホストのファイルシステム

このようなクロスファイルシステムでの頻繁なI/O操作は、パフォーマンスを著しく低下させ、アプリケーションの起動が遅くなります。

### 解決策

頻繁に変更する必要のないディレクトリをDockerの名前付きボリューム（named volumes）で管理し、これらのディレクトリをDocker内部のファイルシステムで完全に管理することで、クロスファイルシステムアクセスを回避します。同時に、必要なソースコードディレクトリのみをマウントすることで、パフォーマンスと開発の利便性のバランスを実現します。

`docker-compose.yml`で以下のように設定します：

```yaml
services:
  hyperf:
    volumes:
      # vendorとruntimeを名前付きボリュームに保存し、クロスファイルシステムアクセスを回避
      - vendor_data:/www/vendor
      - runtime_data:/www/runtime
      # 必要なソースコードディレクトリのみをマウント
      - ./app:/www/app
      - ./config:/www/config
      - ./bin:/www/bin
      - ./plugin:/www/plugin
      - ./databases:/www/databases
      - ./storage:/www/storage
      - ./web:/www/web
      - ./composer.json:/www/composer.json
      - ./composer.lock:/www/composer.lock
      - ./.env:/www/.env

# 名前付きボリュームの定義
volumes:
  vendor_data:
  runtime_data:
```

**設定の説明：**
- `vendor_data` と `runtime_data` はDockerの名前付きボリュームで、データはDocker管理領域に保存され、ネイティブに近いI/Oパフォーマンスを実現
- ソースコードディレクトリ（`app`、`config`など）は引き続きホストにマウントされ、リアルタイムでの編集とデバッグが可能
- `composer.json`、`composer.lock`、`.env` は個別にマウントされ、依存関係の設定と環境変数をリアルタイムで同期可能

この設定により、アプリケーションの起動速度が大幅に向上します。