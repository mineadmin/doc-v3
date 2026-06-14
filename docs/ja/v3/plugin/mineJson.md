# mine.json の説明とサンプル

アプリケーション設定ファイルの完全なサンプルと説明

---

## プロパティ一覧の説明

| パラメータ              | 説明                                        | サンプル                   |
|----------------------|---------------------------------------------|------------------------|
| name                 | **ユーザー名前空間/アプリケーション識別子** で構成          | mine-admin/apps-store  |
| description          | アプリケーションの紹介                           | MineAdminアプリ市場可視化プラグイン |
| version              | アプリケーションの現在のバージョン番号                | 1.0.0                  |
| type                 | アプリケーションのタイプ: mixed（完全アプリ）、backend（バックエンド）、frontend（フロントエンド） | mixed                 |
| author               | アプリケーションの作者情報                        | -                      |
| package.dependencies | アプリケーションのフロントエンド依存関係設定。インストール時に必要な依存パッケージとバージョンを指定可能 | -                      |
| composer             | バックエンドのcomposer設定。詳細は以下の表を参照       | -                      |

## composer設定の説明

| パラメータ    | 説明                          | サンプル                                                   |
|------------|-----------------------------|----------------------------------------------------------|
| require    | バックエンドの依存関係とバージョンを設定。インストール時に実行 | "hyperf/async_queue": "3.1.*"  **非同期キュー依存とバージョンを指定** |
| psr-4      | プラグインコードディレクトリの名前空間を設定       | "Plugin\\MineAdmin\\AppStore\\": "src"                   |
| script     | 実行するスクリプトコマンド              | 下記のサンプルファイルのように、非同期キューの設定ファイルを公開する場合など         |
| config     | hyperf設定ファイルのサービスプロバイダー    | -                                                        |

## mine.json ファイルの内容

以下はサンプルです

```json  [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdminアプリ市場可視化プラグイン",
  "version": "1.0.0",
  "type": "mixed",
  "author": [
    {
      "name": "zds",
      "role": "developer"
    }
  ],
  "package": {
    "dependencies": {

    }
  },
  "composer": {
    "require": {
    },
    "psr-4": {
      "Plugin\\MineAdmin\\AppStore\\": "src"
    },
    "script": {
      "publishAsyncQueue": "php bin/hyperf.php vendor:publish hyperf/async-queue"
    },
    "config": "Plugin\\MineAdmin\\AppStore\\ConfigProvider"
  }
}
```