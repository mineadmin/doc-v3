# MineAdmin クイックインストールガイド

## 概要

MineAdmin は Hyperf フレームワークベースのエンタープライズ向け管理システムで、フロントエンドとバックエンドを分離したアーキテクチャを採用しています。このガイドでは、MineAdmin のクイックインストールと設定を説明し、最短時間でフル機能の管理システムを構築できるようにします。

### システムアーキテクチャ

- **バックエンド**: Hyperf ベースの PHP フレームワーク
- **フロントエンド**: Vue.js ベースのモダンシングルページアプリケーション
- **データベース**: MySQL、PostgreSQL などに対応
- **キャッシュ**: Redis 対応
- **コンテナ化**: Docker および Docker Compose 対応

## システム要件

### ソフトウェア環境

#### ローカル開発環境
- **PHP**: ≥ 8.1
- **Composer**: ≥ 2.0
- **Node.js**: ≥ 16.0（LTS バージョンを推奨）
- **pnpm**: ≥ 7.0
- **MySQL**: ≥ 5.7 または **PostgreSQL**: ≥ 10
- **Redis**: ≥ 5.0
- **Git**: バージョン管理用

#### Docker 環境（推奨）
- **Docker**: ≥ 20.0
- **Docker Compose**: ≥ 2.0

::: tip 環境選択のアドバイス
- **初心者ユーザー**: Docker Compose を推奨。環境設定が簡単です
- **開発者**: 必要に応じてローカル環境または Docker 環境を選択可能
- **本番環境**: Docker を使用したデプロイを推奨
:::

## インストール方式の選択

使用シナリオに応じて適切なインストール方式を選択してください：

| 使用シナリオ | 推奨方式 | メリット | 適切なユーザー |
|-------------|---------|---------|--------------|
| クイック体験/学習 | Docker Compose | ワンクリックデプロイ、環境分離 | 初心者 |
| 開発/デバッグ | ローカル環境 | 柔軟性が高く、デバッグしやすい | 開発者 |
| 本番デプロイ | Docker Build | カスタマイズ可能、拡張しやすい | 運用担当者 |

## クイックスタート

### ステップ 1：ソースコードのダウンロード

#### Git クローンを使用（推奨）

[Git](https://git-scm.com/) ツールがインストールされていることを確認し、以下のコマンドを実行します：

```bash
# メインブランチのクローン（標準バージョン）
git clone https://github.com/mineadmin/MineAdmin.git

# または指定ディレクトリにクローン
git clone https://github.com/mineadmin/MineAdmin.git your-project-name
```

#### ブランチ選択ガイド

MineAdmin は 2 つのメインブランチを提供しています。ニーズに応じて選択してください：

| ブランチ名 | 機能説明 | 適用シナリオ |
|-----------|---------|-------------|
| `master` | 標準バージョン、コア機能を含む | ほとんどのアプリケーションシナリオ |
| `master-department` | 拡張バージョン、部門管理、役職管理、データ権限などの高度な機能を含む | 複雑な権限管理が必要なエンタープライズアプリケーション |

```bash
# 拡張バージョンのブランチに切り替え
git checkout master-department
```

::: warning 重要な注意事項
プロジェクト開始前に必要なブランチを決定してください。後からの移行による不必要なトラブルを避けるためです。2 つのブランチではデータベース構造と機能に違いがあります。
:::

#### ダウンロード完了後の基本設定

```bash
# プロジェクトディレクトリに移動
cd MineAdmin  # または your-project-name

# 環境設定ファイルのコピー
cp .env.example .env
```

### ステップ 2：環境設定

`.env` ファイルを開き、以下の重要なパラメータを設定します：

```ini
# アプリケーション設定
APP_NAME=MineAdmin
APP_ENV=local
APP_DEBUG=true

# データベース設定
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mineadmin
DB_USERNAME=root
DB_PASSWORD=your_password
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci

# Redis 設定
REDIS_HOST=127.0.0.1
REDIS_AUTH=
REDIS_PORT=6379
REDIS_DB=0

# JWT 設定（手動生成が必要）
JWT_SECRET=your_jwt_secret_key
```

::: tip 設定のアドバイス
- 本番環境では必ず `APP_DEBUG=false` に設定してください
- 強力なパスワードを使用し、定期的にデータベースパスワードを変更することを推奨します
- JWT_SECRET はランダム生成された複雑な文字列を使用することを推奨します
:::

## インストール方式の詳細

### 方式 1：Docker Compose インストール（初心者推奨）

これは最も簡単なインストール方式で、クイック体験や開発環境に適しています。

#### メリット
- 環境が分離され、ホストマシンを汚染しない
- ワンクリックですべてのサービスを起動
- バージョンが統一され、環境の違いを回避

#### インストール手順

1. **サービスの起動**

```bash
# すべてのサービスをバックグラウンドで起動
docker-compose up -d

# サービスの状態を確認
docker-compose ps
```

2. **サービス準備完了の待機**

初回起動時はイメージのダウンロードが必要です。ログを確認するには以下のコマンドを使用します：

```bash
# すべてのサービスログを確認
docker-compose logs -f

# 特定のサービスログを確認
docker-compose logs -f mineadmin
```

3. **コンテナに入って初期化を実行**

```bash
# アプリケーションコンテナに入る
docker-compose exec mineadmin bash

# 依存関係のインストール（シナリオに応じて 2 択）

# 開発環境:
composer install -vvv

# 本番環境インストール:
composer install --no-dev --optimize-autoloader

# データベースマイグレーション
php bin/hyperf.php migrate

# データ投入
php bin/hyperf.php db:seed
```

### 方式 2：Docker セルフビルド

カスタムイメージが必要な上級ユーザー向けです。

```bash
# イメージのビルド
docker build -t mineadmin:latest .

# コンテナの起動
docker run -d \
  --name mineadmin \
  -p 9501:9501 \
  -v $(pwd):/opt/www \
  -e DB_HOST=your_db_host \
  -e DB_DATABASE=mineadmin \
  -e DB_USERNAME=your_username \
  -e DB_PASSWORD=your_password \
  -e REDIS_HOST=your_redis_host \
  mineadmin:latest
```

### 方式 3：ローカル環境インストール

深い開発やデバッグが必要な開発者向けです。

#### 前提条件の確認

インストール開始前に、環境が要件を満たしているか確認してください：

```bash
# PHP バージョンの確認
php --version

# Composer バージョンの確認
composer --version

# 拡張機能の確認
php -m | grep -E "(swoole|redis|pdo_mysql)"

# Node.js バージョンの確認
node --version

# pnpm バージョンの確認
pnpm --version
```

#### バックエンドのインストール

1. **PHP 依存関係のインストール**

```bash
# 依存関係のインストール（シナリオに応じて 2 択）

# 開発環境:
composer install -vvv

# 本番環境インストール:
composer install --no-dev --optimize-autoloader
```

2. **データベースの初期化**

```bash
# データベースの作成（オプション。手動でも作成可能）
mysql -u root -p -e "CREATE DATABASE mineadmin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# データベースマイグレーションの実行
php bin/hyperf.php migrate

# 初期データの投入
php bin/hyperf.php db:seed
```

3. **バックエンドサービスの起動**

```bash
# Hyperf サービスの起動
php bin/hyperf.php start
```

#### フロントエンドのインストール

1. **環境準備**

Node.js バージョン管理には [nvm](https://github.com/nvm-sh/nvm) の使用を推奨します：

```bash
# 推奨される Node.js バージョンのインストールと使用
nvm install 18
nvm use 18

# グローバルに pnpm をインストール（まだの場合）
npm install -g pnpm
```

2. **フロントエンド依存関係のインストール**

```bash
# フロントエンドディレクトリに移動
cd web

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

## インストールの確認

### サービス状態の確認

1. **バックエンドサービスの確認**

```bash
# Hyperf サービスが正常に起動しているか確認
curl http://localhost:9501/health

# またはブラウザでアクセス
# http://localhost:9501
```

2. **フロントエンドサービスの確認**

```bash
# フロントエンドはデフォルトで 3000 ポートで動作
curl http://localhost:3000

# またはブラウザでアクセス
# http://localhost:3000
```

3. **データベース接続の確認**

```bash
# データベース接続の確認
php bin/hyperf.php db:show
```

### システムへのログイン

インストール完了後、以下のデフォルトアカウントでログインします：

- **管理者アカウント**：admin
- **デフォルトパスワード**：123456

::: warning セキュリティに関する注意事項
初回ログイン後はすぐにデフォルトパスワードを変更し、システムの安全性を確保してください。
:::

## よくある問題の解決

### インストール中によく発生するエラー

#### 1. Composer 依存関係のインストール失敗

**エラー現象**：
```
Your requirements could not be resolved to an installable set of packages.
```

**解決策**：
```bash
# Composer キャッシュのクリア
composer clear-cache

# Composer の最新バージョンへの更新
composer self-update

# 再インストール
composer install --ignore-platform-reqs
```

#### 2. データベース接続失敗

**エラー現象**：
```
SQLSTATE[HY000] [2002] Connection refused
```

**解決策**：
1. データベースサービスが起動しているか確認
2. `.env` ファイルのデータベース設定を確認
3. データベースユーザーの権限を確認

```bash
# データベース接続のテスト
mysql -h 127.0.0.1 -P 3306 -u root -p
```

#### 3. Redis 接続失敗

**エラー現象**：
```
Connection refused [tcp://127.0.0.1:6379]
```

**解決策**：
```bash
# Redis サービスの状態確認
redis-cli ping

# Redis サービスの起動（システムによる）
# Ubuntu/Debian
sudo systemctl start redis-server

# CentOS/RHEL
sudo systemctl start redis

# macOS
brew services start redis
```

#### 4. フロントエンド依存関係のインストールが遅い

**解決策**：
```bash
# 淘宝ミラーソースの使用
pnpm config set registry https://registry.npmmirror.com

# または cnpm の使用
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### 5. ポート占有の問題

**ポート占有の確認**：
```bash
# 9501 ポートの確認（バックエンド）
lsof -i :9501
netstat -tulpn | grep :9501

# 3000 ポートの確認（フロントエンド）
lsof -i :3000
netstat -tulpn | grep :3000
```

**解決策**：
- ポートを占有しているプロセスを停止する
- または設定ファイルを変更して別のポートを使用する

### パフォーマンス最適化のアドバイス

#### 開発環境の最適化

```bash
# OPcache の有効化（PHP 設定）
echo "opcache.enable=1" >> /etc/php/8.1/cli/conf.d/99-opcache.ini

# PHP メモリ制限の増加
echo "memory_limit=512M" >> /etc/php/8.1/cli/conf.d/99-memory.ini
```

#### 本番環境の最適化

```bash
# 本番環境設定の使用
composer install --no-dev --optimize-autoloader

# 設定キャッシュのクリア
php bin/hyperf.php config:clear

# フロントエンドの本番ビルド
cd web && pnpm build
```