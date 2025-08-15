# mine.json 説明と例

アプリケーション設定ファイルの完全な例と説明

---

## 属性リストの説明

| パラメータ                  | 説明                                    | 例                    |
|-------------------------|---------------------------------------|-----------------------|
| name                    | **ユーザー名前空間/アプリケーション識別子** で構成される       | mine-admin/apps-store | 
| description             | アプリケーションの紹介                          | MineAdminアプリケーションマーケット可視化プラグイン    |
| version                | アプリケーションの現在のバージョン                   | 1.0.0                 |
| type                   | アプリケーションタイプ：mixed（完全アプリ）、backend（バックエンド）、frontend（フロントエンド） | mixed                |                                  | 1.0.0                 |
| author                 | アプリケーションの作者情報                        | -                     |
| package.dependencies   | アプリケーションのフロントエンド依存設定情報。インストール時に必要な依存パッケージとバージョンを指定可能 | -                     |
| composer               | バックエンドのcomposer設定。詳細は以下の表を参照          | -                     |

## composer設定の説明
| パラメータ       | 説明                    | 例                                             |
|--------------|-----------------------|------------------------------------------------|
| require      | バックエンドの依存関係とバージョンを設定。アプリケーションインストール時に実行 | "hyperf/async_queue": "3.1.*"  **非同期キュー依存関係とバージョンを指定** | 
| psr-4        | プラグインコードディレクトリの名前空間を設定         | "Plugin\\MineAdmin\\AppStore\\": "src"         |
| script       | 実行するスクリプトコマンド               | 以下の例ファイルでは、非同期キューの設定ファイルを公開するコマンドを実行                         |
| config       | hyperf設定ファイルのサービスプロバイダー       | -                                              |

## mine.json ファイルの内容

以下は例です

```json  [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdminアプリケーションマーケット可視化プラグイン",
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