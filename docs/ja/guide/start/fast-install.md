# MineAdmin クイックインストールガイド

## 概要

MineAdmin は Hyperf フレームワークをベースにしたエンタープライズ向けバックエンド管理システムで、フロントエンドとバックエンドが分離されたアーキテクチャを採用しています。このガイドでは、MineAdmin の迅速なインストールと設定を完了させ、最短時間で機能が充実した管理システムを構築する手順を説明します。

### システムアーキテクチャ

- **バックエンド**: Hyperf ベースの PHP フレームワーク
- **フロントエンド**: Vue.js ベースのモダンなシングルページアプリケーション
- **データベース**: MySQL、PostgreSQL などをサポート
- **キャッシュ**: Redis をサポート
- **コンテナ化**: Docker と Docker Compose をサポート

## システム要件

### ソフトウェア環境

#### ローカル開発環境
- **PHP**: ≥ 8.1
- **Composer**: ≥ 2.0
- **Node.js**: ≥ 16.0（LTS バージョンの使用を推奨）
- **pnpm**: ≥ 7.0
- **MySQL**: ≥ 5.7 または **PostgreSQL**: ≥ 10
- **Redis**: ≥ 5.0
- **Git**: バージョン管理用

#### Docker 環境（推奨）
- **Docker**: ≥ 20.0
- **Docker Compose**: ≥ 2.0

::: tip 環境選択のアドバイス
- **初心者ユーザー**: Docker Compose の使用を推奨、環境設定がより簡単
- **開発者**: 必要に応じてローカル環境または Docker 環境を選択
- **本番環境**: Docker を使用したデプロイを推奨
:::

## インストール方法の選択

使用シナリオに応じて適切なインストール方法を選択してください:

| 使用シナリオ | 推奨方法 | 利点 | 対象ユーザー |
|---------|---------|------|---------|
| クイック体験/学習 | Docker Compose | ワンクリックデプロイ、環境分離 | 初心者 |
| 開発デバッグ | ローカル環境 | 柔軟性が高く、デバッグが容易 | 開発者 |
| 本番デプロイ | Docker Build | カスタマイズ可能、拡張容易 | 運用担当者 |

## クイックスタート

### ステップ1: ソースコードのダウンロード

#### Git クローンを使用（推奨）

[Git](https://git-scm.com/) ツールがインストールされていることを確認し、次のコマンドを実行:

```bash
# メインブランチをクローン（標準バージョン）
git clone https://github.com/mineadmin/MineAdmin.git

# または特定のディレクトリにクローン
git clone https://github.com/mineadmin/MineAdmin.git your-project-name
```

#### ブランチ選択ガイド

MineAdmin は2つの主要ブランチを提供しており、必要に応じて選択してください:

| ブランチ名 | 特徴説明 | 適用シナリオ |
|---------|---------|---------|
| `master` | 標準バージョン、コア機能を含む | ほとんどのアプリケーションシナリオ |
| `master-department` | 拡張バージョン、部門管理、職位管理、データ権限などの高度な機能を含む | 複雑な権限管理が必要なエンタープライズアプリケーション |

```bash
# 拡張バージョンブランチに切り替え
git checkout master-department
```

::: warning 重要なお知らせ
プロジェクト開始前に必要なブランチを決定し、後期の移行による不必要なトラブルを避けてください。2つのブランチのデータベース構造と機能には違いがあります。
:::

#### ダウンロード完了後の基本設定

```bash
# プロジェクトディレクトリに移動
cd MineAdmin  # または your-project-name

# 環境設定ファイルをコピー
cp .env.example .env
```

### ステップ2: 環境設定

`.env` ファイルを開き、以下の主要パラメータを設定:

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

::: tip 設定アドバイス
- 本番環境では必ず `APP_DEBUG=false` を設定
- 強力なパスワードを使用し、定期的にデータベースパスワードを変更することを推奨
- JWT_SECRET にはランダムに生成した複雑な文字列を使用することを推奨
:::

## インストール方法の詳細

### 方法1: Docker Compose インストール（初心者向け推奨）

最も簡単なインストール方法で、クイック体験や開発環境に適しています。

#### 利点
- 環境が分離され、ホストマシンを汚染しない
- すべてのサービスをワンクリックで起動
- バージョンが統一され、環境の差異を回避

#### インストール手順

1. **サービスの起動**

```bash
# バックグラウンドで全てのサービスを起動
docker-compose up -d

# サービス状態を確認
docker-compose ps
```

2. **サービスの準備待機**

初回起動時はイメージのダウンロードが必要なため、しばらくお待ちください。以下のコマンドでログを確認できます:

```bash
# 全てのサービスのログを確認
docker-compose logs -f

# 特定のサービスのログを確認
docker-compose logs -f mineadmin
```

3. **コンテナ内で初期化を実行**

```bash
# アプリケーションコンテナに入る
docker-compose exec mineadmin bash

# バックエンド依存関係をインストール
composer install --no-dev --optimize-autoloader

# データベースマイグレーション
php bin/hyperf.php migrate

# データシード
php bin/hyperf.php db:seed
```

### 方法2: Docker セルフビルド

カスタムイメージが必要な上級ユーザー向け。

```bash
# イメージをビルド
docker build -t mineadmin:latest .

# コンテナを起動
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

### 方法3: ローカル環境インストール

深い開発とデバッグが必要な開発者向け。

#### 前提条件のチェック

インストール開始前に、環境が要件を満たしていることを確認:

```bash
# PHP バージョンを確認
php --version

# Composer バージョンを確認
composer --version

# 拡張機能を確認
php -m | grep -E "(swoole|redis|pdo_mysql)"

# Node.js バージョンを確認
node --version

# pnpm バージョンを確認
pnpm --version
```

#### バックエンドインストール

1. **PHP 依存関係のインストール**

```bash
# 依存パッケージをインストール（開発環境）
composer install -vvv

# 本番環境インストール（オプション）
composer install --no-dev --optimize-autoloader
```

2. **データベース初期化**

```bash
# データベースを作成（オプション、手動でも作成可能）
mysql -u root -p -e "CREATE DATABASE mineadmin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# データベースマイグレーションを実行
php bin/hyperf.php migrate

# 初期データをシード
php bin/hyperf.php db:seed
```

3. **バックエンドサービスの起動**

```bash
# Hyperf サービスを起動
php bin/hyperf.php start
```

#### フロントエンドインストール

1. **環境準備**

Node.js バージョン管理には [nvm](https://github.com/nvm-sh/nvm) の使用を推奨:

```bash
# 推奨 Node.js バージョンをインストールして使用
nvm install 18
nvm use 18

# pnpm をグローバルにインストール（未インストールの場合）
npm install -g pnpm
```

2. **フロントエンド依存関係のインストール**

```bash
# フロントエンドディレクトリに移動
cd web

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

## インストールの検証

### サービス状態の確認

1. **バックエンドサービスの検証**

```bash
# Hyperf サービスが正常に起動しているか確認
curl http://localhost:9501/health

# またはブラウザでアクセス
# http://localhost:9501
```

2. **フロントエンドサービスの検証**

```bash
# フロントエンドはデフォルトで3000ポートで実行
curl http://localhost:3000

# またはブラウザでアクセス
# http://localhost:3000
```

3. **データベース接続の検証**

```bash
# データベース接続を確認
php bin/hyperf.php db:show
```

### システムへのログイン

インストール完了後、以下のデフォルトアカウントでログイン:

- **管理者アカウント**: admin
- **デフォルトパスワード**: 123456

::: warning セキュリティ注意事項
初回ログイン後、すぐにデフォルトパスワードを変更し、システムの安全性を確保してください。
:::

## よくある問題の解決

### インストール中の一般的なエラー

#### 1. Composer 依存関係のインストール失敗

**エラー現象**:
```
Your requirements could not be resolved to an installable set of packages.
```

**解決方法**:
```bash
# Composer キャッシュをクリア
composer clear-cache

# Composer を最新バージョンに更新
composer self-update

# 再インストール
composer install --ignore-platform-reqs
```

#### 2. データベース接続失敗

**エラー現象**:
```
SQLSTATE[HY000] [2002] Connection refused
```

**解決方法**:
1. データベースサービスが起動しているか確認
2. `.env` ファイルのデータベース設定を検証
3. データベースユーザー権限を確認

```bash
# データベース接続をテスト
mysql -h 127.0.0.1 -P 3306 -u root -p
```

#### 3. Redis 接続失敗

**エラー現象**:
```
Connection refused [tcp://127.0.0.1:6379]
```

**解決方法**:
```bash
# Redis サービス状態を確認
redis-cli ping

# Redis サービスを起動（システムによって異なる）
# Ubuntu/Debian
sudo systemctl start redis-server

# CentOS/RHEL
sudo systemctl start redis

# macOS
brew services start redis
```

#### 4. フロントエンド依存関係のインストールが遅い

**解決方法**:
```bash
# 淘宝ミラーソースを使用
pnpm config set registry https://registry.npmmirror.com

# または cnpm を使用
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### 5. ポート使用中の問題

**ポート使用状況を確認**:
```bash
# 9501 ポート（バックエンド）を確認
lsof -i :9501
netstat -tulpn | grep :9501

# 3000 ポート（フロントエンド）を確認
lsof -i :3000
netstat -tulpn | grep :3000
```

**解決方法**:
- ポートを使用しているプロセスを停止
- または設定ファイルを変更して他のポートを使用

### パフォーマンス最適化のアドバイス

#### 開発環境の最適化

```bash
# OPcache を有効化（PHP 設定）
echo "opcache.enable=1" >> /etc/php/8.1/cli/conf.d/99-opcache.ini

# PHP メモリ制限を増加
echo "memory_limit=512M" >> /etc/php/8.1/cli/conf.d/99-memory.ini
```

#### 本番環境の最適化

```bash
# 本番環境設定を使用
composer install --no-dev --optimize-autoloader

# 設定キャッシュをクリア
php bin/hyperf.php config:clear

# フロントエンド本番バージョンをビルド
cd web && pnpm build
```