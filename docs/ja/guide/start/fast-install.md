# クイックスタート

## コードのダウンロード

### git

Gitツールを使用して本プロジェクトをインストールします。ローカルに[Git](https://git-scm.com/)ツールがインストールされている必要があります。

まずコードをローカルにダウンロードするために、以下のコマンドを実行します。`YourProject`は新規作成するアプリケーション名のディレクトリです。指定しない場合、デフォルトでmineadminになります。

## ブランチの紹介
- `master`ブランチ：デフォルトのメインブランチで、最もよく使用されます
- `master-department`ブランチ：部門管理、職位管理、データ権限設定などの追加機能を含む部門ブランチです。

後々の不要なトラブルを避けるため、必要に応じて適切なブランチを選択して開発してください！！！

```sh [コードダウンロード]
git clone https://github.com/mineadmin/MineAdmin.git
```

ダウンロードが成功したら、プロジェクトディレクトリ内の`.env.example`ファイルを`.env`ファイルとしてコピーし、データベースとRedisの設定項目を適切に設定してください。

## バックエンド環境のインストール

### Composer

ローカル環境を使用している場合、`.env`ファイルを設定した後、[バックエンドインストール](#バックエンドインストール)を実行できます。

### Docker

Dockerで開発する場合、環境構築のためにさらにいくつかの手順が必要です。

#### Docker-compose (推奨)

MineAdminには既に完全な`docker-compose.yml`ファイルが準備されています。
プロジェクトディレクトリで以下のコマンドを実行するだけで環境構築が完了します。

```shell
docker-compose up -d
```

#### Docker Build

独自のコンテナイメージを構築したい場合、Dockerfileファイルも準備されています。プロジェクトディレクトリで以下の`イメージビルド`と`コンテナ実行`コマンドを実行するだけで環境構築が完了します。

```shell
# イメージビルド
docker build . -t mineadmin

# コンテナ起動
docker run -d --name mineadmin -p 9501:9501 -v .:/opt/www mineadmin 
```

### バックエンドシステムのインストール

以下のコマンドを実行してください。

::: code-group

```shell[Vendor再インストール]
composer install -vvv
```

```shell [データベースマイグレーション]
php bin/hyperf.php migrate
```

```shell [データシーディング]
php bin/hyperf.php db:seed
```

:::

## フロントエンドのインストール

ローカルのNodeマルチバージョン管理には[nvm](https://github.com/nvm-sh/nvm)の使用を推奨します。

`プロジェクトパス/web`ディレクトリに移動し、以下を実行します。

```shell
# フロントエンド依存ライブラリのインストール
pnpm i 
# ローカル開発サーバーの起動
pnpm dev
```