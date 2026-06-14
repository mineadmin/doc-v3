# フロントエンド構成ガイド

MineAdmin フロントエンドは Vite をベースに構築されており、開発、テスト、本番などの様々な環境に対応した柔軟な環境変数構成システムを提供しています。

## 環境変数構成

### 構成ファイルの概要

プロジェクトでは、デフォルトで以下の環境構成ファイルが提供されています。

- `.env.development` - 開発環境構成
- `.env.production` - 本番環境構成

必要に応じて、以下のような追加の環境構成ファイルを作成できます。
- `.env.test` - テスト環境
- `.env.staging` - ステージング環境（プリリリース）
- `.env.local` - ローカル開発専用（git で無視されます）

::: tip ヒント
環境変数の構成は Vite の規則に従います。詳細は [Vite - 環境変数とモード](https://vitejs.dev/guide/env-and-mode.html) を参照してください。
:::

### 開発環境構成 (.env.development)

開発環境構成は主にローカル開発とデバッグに使用され、デバッグツールとプロキシ設定が含まれています。

::: code-group

```env [.env.development]
# ================================
# 基本アプリ構成
# ================================
# ページタイトル - ブラウザタブとページタイトルに表示されます
VITE_APP_TITLE = MineAdmin

# 開発サーバーポート
VITE_APP_PORT = 2888

# アプリルートパス - サブディレクトリにデプロイする場合は変更が必要
VITE_APP_ROOT_BASE = /

# ================================
# API インターフェース構成
# ================================
# バックエンド API アドレス - 開発環境では通常ローカルバックエンドサービスを指します
VITE_APP_API_BASEURL = http://127.0.0.1:9501

# ================================
# ルーティング構成
# ================================
# ルーティングモード：hash | history
# hash: # 付きのルーティングモード、互換性が高い
# history: HTML5 History API、サーバーサポートが必要
VITE_APP_ROUTE_MODE = hash

# ================================
# ストレージ構成
# ================================
# ローカルストレージプレフィックス - 複数プロジェクト間のストレージ競合を回避
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# プロキシ構成
# ================================
# 開発プロキシを有効にするか - 開発環境のクロスオリジン問題を解決
VITE_OPEN_PROXY = true

# プロキシプレフィックス - プロキシが必要なリクエストを識別するために使用
VITE_PROXY_PREFIX = /dev

# ================================
# デバッグツール
# ================================
# vConsole を有効にするか - モバイルデバッグツール
VITE_OPEN_vCONSOLE = false

# Vue DevTools を有効にするか - Vue 開発者ツール
VITE_OPEN_DEVTOOLS = false
```

:::

### 本番環境構成 (.env.production)

本番環境構成はパフォーマンスとセキュリティに重点を置き、デバッグ機能を削除し、ビルドオプションを最適化します。

::: code-group

```env [.env.production]
# ================================
# 基本アプリ構成
# ================================
# ページタイトル
VITE_APP_TITLE = MineAdmin

# アプリルートパス - 実際のデプロイパスに応じて調整
VITE_APP_ROOT_BASE = /

# ================================
# API インターフェース構成
# ================================
# 本番環境 API アドレス - 通常は相対パスまたは完全なドメイン名を使用
VITE_APP_API_BASEURL = /

# ================================
# ルーティング構成
# ================================
# 本番環境のルーティングモード
VITE_APP_ROUTE_MODE = hash

# ================================
# ストレージ構成
# ================================
# ストレージプレフィックス
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# プロキシ構成（本番環境では通常不要）
# ================================
VITE_OPEN_PROXY = false
VITE_PROXY_PREFIX = /prod

# ================================
# ビルド構成
# ================================
# ビルド時に Mock を有効にするか - 本番環境では無効を推奨
VITE_BUILD_MOCK = false

# source map を生成するか - ビルドサイズとデバッグ能力に影響
VITE_BUILD_SOURCEMAP = false

# ビルド圧縮方式 - gzip, brotli をサポート
VITE_BUILD_COMPRESS = gzip,brotli

# ビルド後に圧縮パッケージを生成するか - zip, tar をサポート
VITE_BUILD_ARCHIVE =
```

:::

## 構成項目詳細説明

### 基本構成項目

| 構成項目 | 型 | デフォルト値 | 説明 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | string | MineAdmin | アプリタイトル、ブラウザタブに表示 |
| `VITE_APP_PORT` | number | 2888 | 開発サーバーポート（開発環境のみ） |
| `VITE_APP_ROOT_BASE` | string | / | アプリデプロイのベースパス |

### API インターフェース構成

| 構成項目 | 型 | 説明 | 例 |
|--------|------|------|------|
| `VITE_APP_API_BASEURL` | string | バックエンド API ベースアドレス | `http://api.example.com` |

::: warning 注意
本番環境の API アドレス構成には特に注意が必要です。
- フロントエンドとバックエンドが同じドメインにデプロイされている場合は、相対パス `/` を使用
- クロスオリジンデプロイの場合は、完全な API アドレスを構成
- API サーバーが正しく CORS を構成していることを確認
:::

### ルーティング構成

| 構成項目 | 選択可能な値 | 説明 |
|--------|--------|------|
| `VITE_APP_ROUTE_MODE` | `hash` \| `history` | ルーティングモード選択 |

**ルーティングモード比較：**

| モード | 利点 | 欠点 | 適用シナリオ |
|------|------|------|----------|
| `hash` | 互換性が高く、サーバー構成不要 | URL に # が含まれ、SEO に不利 | 従来のデプロイ環境 |
| `history` | URL が簡潔で、SEO に有利 | サーバーサポートが必要で、構成が複雑 | モダンなデプロイ環境 |

### ストレージ構成

| 構成項目 | 説明 | 推奨値 |
|--------|------|--------|
| `VITE_APP_STORAGE_PREFIX` | ローカルストレージプレフィックス | プロジェクト固有の識別子 |

### プロキシ構成

| 構成項目 | 型 | 説明 |
|--------|------|------|
| `VITE_OPEN_PROXY` | boolean | 開発プロキシを有効にするか |
| `VITE_PROXY_PREFIX` | string | プロキシリクエストのプレフィックス識別子 |

### ビルド構成

| 構成項目 | 型 | 説明 |
|--------|------|------|
| `VITE_BUILD_MOCK` | boolean | ビルド時に Mock 機能を含めるか |
| `VITE_BUILD_SOURCEMAP` | boolean | source map を生成するか |
| `VITE_BUILD_COMPRESS` | string | 圧縮アルゴリズム、複数ある場合はカンマ区切り |
| `VITE_BUILD_ARCHIVE` | string | ビルド後に生成する圧縮パッケージ形式 |

## デプロイシナリオ構成

### シナリオ 1：サブディレクトリへのデプロイ

アプリケーションをサーバーのサブディレクトリ（例：`https://example.com/admin/`）にデプロイする場合：

```env
# ベースパスを設定
VITE_APP_ROOT_BASE = /admin/

# API アドレスをそれに応じて調整
VITE_APP_API_BASEURL = /admin/api/
```

### シナリオ 2：CDN デプロイ

CDN を使用して静的リソースを高速化する場合：

```env
# ベースパスを CDN アドレスに設定
VITE_APP_ROOT_BASE = https://cdn.example.com/admin/

# API アドレスは元のドメインを維持
VITE_APP_API_BASEURL = https://api.example.com/
```

### シナリオ 3：Docker デプロイ

Docker コンテナ化デプロイの構成：

```env
# 環境変数プレースホルダーを使用
VITE_APP_API_BASEURL = ${API_BASE_URL}
VITE_APP_TITLE = ${APP_TITLE:-MineAdmin}
```

### シナリオ 4：フロントエンド・バックエンド分離デプロイ

フロントエンドとバックエンドが完全に分離されたデプロイアーキテクチャ：

```env
# フロントエンド独立ドメイン
VITE_APP_ROOT_BASE = /

# バックエンド API 完全アドレス
VITE_APP_API_BASEURL = https://api.example.com/v1/

# history ルーティングモードを使用（Nginx 構成サポートが必要）
VITE_APP_ROUTE_MODE = history
```

## ベストプラクティス

### 1. 環境変数命名規則

- すべての環境変数はクライアントからアクセス可能にするために `VITE_` で始める必要があります
- すべて大文字とアンダースコアを使用して命名
- 機能モジュールごとにグループ化して命名

### 2. セキュリティに関する考慮事項

::: danger セキュリティ警告
- 環境変数に機密情報（キー、パスワードなど）を保存しないでください
- 本番環境の構成ファイルには開発デバッグ情報を含めないでください
- 使用しなくなった構成項目は定期的に確認して削除してください
:::

### 3. パフォーマンス最適化

```env
# 本番環境推奨構成
VITE_BUILD_SOURCEMAP = false          # パッケージサイズを削減
VITE_BUILD_COMPRESS = gzip,brotli     # 圧縮を有効化
VITE_OPEN_vCONSOLE = false            # デバッグツールを無効化
VITE_OPEN_DEVTOOLS = false            # 開発ツールを無効化
```

### 4. マルチ環境管理

`.env.staging` を作成してステージング（プリリリース）環境用に：

```env
# ステージング環境構成
VITE_APP_TITLE = MineAdmin (Staging)
VITE_APP_API_BASEURL = https://staging-api.example.com/
VITE_BUILD_SOURCEMAP = true           # デバッグ用に source map を保持
```

## よくある質問

### Q: 環境変数を変更しても反映されませんか？

**A:** 以下の点を確認してください：
1. 開発サーバーを再起動する
2. 環境変数名が `VITE_` で始まっているか
3. 構文形式が正しいか（余分なスペースがないか）

### Q: 本番環境で API リクエストが失敗しますか？

**A:** 以下の構成を確認してください：
1. `VITE_APP_API_BASEURL` が正しいか
2. バックエンドサービスに正しい CORS が構成されているか
3. ネットワークファイアウォールが該当ポートへのアクセスを許可しているか

### Q: コード内で環境変数を取得するにはどうすればよいですか？

**A:** `import.meta.env` を使用してアクセスします：

```typescript
// API ベースアドレスを取得
const apiBaseUrl = import.meta.env.VITE_APP_API_BASEURL

// アプリタイトルを取得
const appTitle = import.meta.env.VITE_APP_TITLE

// 開発環境かどうかを確認
const isDev = import.meta.env.DEV
```

### Q: history ルーティングモードでページリフレッシュ時に 404 エラーが発生しますか？

**A:** サーバーのリライトルールを構成する必要があります。Nginx の例：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

::: tip ヒント
デプロイに関するその他の問題については、[デプロイガイド](../../guide/start/deployment.md) の章を参照してください。
:::