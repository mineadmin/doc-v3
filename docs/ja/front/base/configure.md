# 設定

## 環境変数の設定

デフォルトでは `開発環境` と `本番環境` の2種類の環境設定ファイルが用意されています。必要に応じて拡張する場合は、コピーを作成して自身のニーズに合わせて変更してください。

詳細については [Vite - 環境変数とモード](https://cn.vitejs.dev/guide/env-and-mode) の章を参照してください。

::: code-group

```YAML [.env.development]
# ページタイトル
VITE_APP_TITLE = MineAdmin
  # ポート
VITE_APP_PORT = 2888
  # アプリケーションのルートパス
VITE_APP_ROOT_BASE = /
  # APIリクエストのベースURL（axiosのbaseURLパラメータに設定されます）
VITE_APP_API_BASEURL = http://127.0.0.1:9501
  # ルーティングモード: history と hash の2種類、デフォルトはhash（#付き）
VITE_APP_ROUTE_MODE = hash

  # ストレージのプレフィックス
VITE_APP_STORAGE_PREFIX = mine_

  # プロキシを有効にするかどうか
VITE_OPEN_PROXY = true
  # プロキシのプレフィックス識別子
VITE_PROXY_PREFIX = /dev
  # vConsoleを有効にするかどうか（モバイルデバッグ時に有効化可能）
VITE_OPEN_vCONSOLE = false
  # 開発者ツールを有効にするかどうか
VITE_OPEN_DEVTOOLS = false

```

```YAML [.env.production]
# ページタイトル
VITE_APP_TITLE = MineAdmin
  # アプリケーションのルートパス
VITE_APP_ROOT_BASE = /
  # APIリクエストのベースURL（axiosのbaseURLパラメータに設定されます）
VITE_APP_API_BASEURL = /
  # ルーティングモード: history と hash の2種類、デフォルトはhash（#付き）
VITE_APP_ROUTE_MODE = hash

  # ストレージのプレフィックス
VITE_APP_STORAGE_PREFIX = mine_

  # プロキシを有効にするかどうか
VITE_OPEN_PROXY = true
  # プロキシのプレフィックス識別子
VITE_PROXY_PREFIX = /prod

  # ビルド時にMockを有効にするかどうか
VITE_BUILD_MOCK = false
  # ビルド時にsourcemapを生成するかどうか
VITE_BUILD_SOURCEMAP = false
  # ビルド時に圧縮を有効にするかどうか（gzipとbrotliをサポート）
VITE_BUILD_COMPRESS = gzip,brotli
  # ビルド後にアーカイブを生成するかどうか（zipとtarをサポート）
VITE_BUILD_ARCHIVE =

```
:::