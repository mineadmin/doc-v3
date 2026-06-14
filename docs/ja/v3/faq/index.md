# よくある質問

---

## インストール成功後にエラー `DNS Lookup resolve failed` が発生

`.env` ファイル内の `mysql` と `redis` の設定が正しいか、正常に接続できるかを確認してください。

---

## 購入したプラグインが使用できない

有料プラグインの場合は、QQグループまたはWeChatグループで管理者に連絡し、注文番号を提供してください。管理者が対応するプラグインのアフターサポートグループに招待します。

---



## SwooleからSwowに切り替える方法

::: warning

Swowのインストールは [Swow公式ドキュメント](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E3%81%99%E3%82%8B%E6%93%8D%E4%BD%9C%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0) を参照してください。

:::

1. プロジェクトディレクトリの `.github/ci/server.php` をコピーして `config/autoload/server.php` を上書きします。
2. プロジェクトディレクトリの `.github/ci/hyperf.php` をコピーして `bin/hyperf.php` を上書きします。

再起動すれば完了です。

---


## プラグインインストール後、gitにコミットし、本番環境でコードをpull（または他の人がpull）した際、フロントエンドからプラグインのバックエンドAPIにアクセスするとnot foundエラーが発生

1. `plugin/mine-admin` 以下のプラグインディレクトリにある `install.lock` は必ずコミットしてください。これがないとプラグインのルートが認識されません。
2. `gitignore` に `*.lock` が含まれている場合、その行を削除してください。


---


## 画像やファイルをアップロードしてアクセスするとNot Foundエラーが発生

1. 本番環境では、Nginxプロキシの使用を推奨します。

  Nginxプロキシを使用する場合は、以下の設定を参考にしてください（env設定とアップロードディレクトリのパーミッションに注意）。以下のパスはあくまで例であり、実際のデプロイ環境に合わせて調整してください。
  リソースURLが `https://example.com/uploads/**/****.png` の場合を想定します。
```nginx
# uploads内の画像リソースをプロキシ
location /uploads/ {
    alias /www/wwwroot/MineAdmin/storage/uploads/;
    expires 30d;
    add_header Cache-Control "public";
    add_header Access-Control-Allow-Origin *;
    
    # 画像ファイルのみ許可
    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|bmp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 他のファイルタイプへのアクセスを防止
    location ~* \.(php|html|htm|js|css)$ {
        deny all;
    }
}
```
::: warning

すべての設定が正しいにもかかわらずアクセスできず、403 Forbiddenが発生する場合は、`uploads` ディレクトリのパーミッションが755に設定されているか、所有者が `www` であるかを確認してください。

:::

2. 開発環境では、`/config/autoload/server.php` に以下のように設定します。
```php
'settings' => [
  // 外部からのアクセスを有効化
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```
`.env` ファイルの `APP_DEBUG` を `true` に変更し、設定後サービスを再起動してください。

---

## Windows環境でDocker起動がなぜこんなに遅いのか

### 原因分析

Windows環境でDockerを使用する場合、起動速度が遅い主な原因はDockerのファイルシステム特性にあります。DockerはWindows上で動作する際、仮想化技術（WSL2やHyper-Vなど）を利用しており、Windowsホストのディレクトリをコンテナにバインドマウントすると、ファイルシステム間のアクセスオーバーヘッドが発生します。

特に、多数の小ファイルを含むディレクトリ（例：数万もの依存パッケージファイルが含まれる `vendor` ディレクトリや、ログやキャッシュファイルが含まれる `runtime` ディレクトリ）をマウントする場合、ファイルの読み書きのたびに以下の処理を経由する必要があります。
1. コンテナ内のファイルシステム
2. Docker仮想化レイヤー
3. Windowsホストのファイルシステム

このようなファイルシステム間の頻繁なI/O処理によりパフォーマンスが著しく低下し、アプリケーションの起動が遅くなります。

### 解決策

Dockerの名前付きボリューム（named volumes）を利用して、頻繁に変更する必要のないディレクトリを管理します。これにより、それらのディレクトリはDocker内部のファイルシステムで完全に管理され、ファイルシステム間のアクセスを回避できます。同時に、必要なソースコードディレクトリのみをマウントし、パフォーマンスと開発の利便性のバランスを実現します。

`docker-compose.yml` に以下の設定を行います。

```yaml
services:
  hyperf:
    volumes:
      # 名前付きボリュームを使用してvendorとruntimeを保存し、ファイルシステム間のアクセスを回避
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

# 名前付きボリュームを定義
volumes:
  vendor_data:
  runtime_data:
```

**設定の説明:**
- `vendor_data` と `runtime_data` はDockerの名前付きボリュームです。データはDockerが管理する領域に保存され、I/Oパフォーマンスはネイティブに近くなります。
- ソースコードディレクトリ（`app`、`config` など）は引き続きホストにマウントされ、リアルタイムでの編集やデバッグが容易になります。
- `composer.json`、`composer.lock`、`.env` は個別にマウントし、依存関係の設定や環境変数の変更をリアルタイムで同期できます。

この設定により、アプリケーションの起動速度を大幅に向上させることができます。

---

## スケジュールタスク-Commandタイプ、初回のみ成功し、以降は全て失敗する問題。

呼び出し先に `--disable-event-dispatcher: true` の設定を追加する必要があります。
つまり、crontabテーブルのvalue値は以下のようにします。
```json
{"command":"mine:xxx","--disable-event-dispatcher":true}
```

詳細ドキュメント：https://hyperf.wiki/3.1/#/zh-cn/crontab