# クイックスタートガイド

このガイドは、環境準備からプラグイン公開までの完全な流れを通じて、最初のMineAdminプラグインを素早く作成するのに役立ちます。

## 前提条件

始める前に、以下の準備が整っていることを確認してください：

1. **MineAdminのインストール**：MineAdminシステムが正常に動作していること
2. **技術スタックの理解**：
   - PHP 8.1+ および Hyperf フレームワーク
   - Vue 3 + TypeScript（フロントエンド開発が必要な場合）
   - Composer パッケージマネージャー

## 環境設定

### 1. AccessTokenの取得

プラグインマーケットと開発者機能にアクセスするにはAccessTokenが必要です：

1. [MineAdmin公式サイト](https://www.mineadmin.com/login)にログイン
2. [個人センター設定](https://www.mineadmin.com/member/setting)に移動
3. AccessTokenを確認してコピー

### 2. 環境変数の設定

プロジェクトルートディレクトリの `.env` ファイルに以下を追加：

```ini
# MineAdmin AccessToken
MINE_ACCESS_TOKEN=あなたのAccessToken
```

### 3. プラグインシステムの初期化

初めてプラグインシステムを使用する場合は、初期化が必要です：

```bash
# プラグイン拡張システムの初期化（MineAdmin 3.0+ バージョンはデフォルトで初期化済み）
php bin/hyperf.php mine-extension:initial
```

## 最初のプラグインの作成

### 1. コマンドラインを使用したプラグイン作成

```bash
# ハイブリッド型プラグインの作成
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mix \
    --author "Your Name" \
    --description "私の最初のMineAdminプラグイン"
```

**パラメータ説明**：
- `mycompany/hello-world`：プラグインパス（名前空間/プラグイン名）
- `--name`：プラグイン表示名
- `--type`：プラグインタイプ（mix/backend/frontend）
- `--author`：作者名
- `--description`：プラグイン説明

### 2. 生成されるディレクトリ構造

コマンド実行後、`plugin/mycompany/hello-world/` ディレクトリに以下が生成されます：

```
plugin/mycompany/hello-world/
├── mine.json                    # プラグイン設定ファイル
├── src/                         # バックエンドソースコードディレクトリ
│   ├── ConfigProvider.php       # 設定プロバイダー
│   ├── InstallScript.php        # インストールスクリプト
│   └── UninstallScript.php      # アンインストールスクリプト
├── web/                         # フロントエンドソースコードディレクトリ
└── Database/                    # データベース関連
    ├── Migrations/              # データベースマイグレーション
    └── Seeders/                 # データシーダー
```

## プラグインの開発

### 1. プラグイン情報の設定

`mine.json` ファイルを編集してプラグイン情報を充実させます：

```json
{
  "name": "mycompany/hello-world",
  "description": "私の最初のMineAdminプラグイン",
  "version": "1.0.0",
  "type": "mixed",
  "author": [
    {
      "name": "Your Name",
      "role": "developer"
    }
  ],
  "composer": {
    "psr-4": {
      "Plugin\\Mycompany\\HelloWorld\\": "src"
    },
    "config": "Plugin\\Mycompany\\HelloWorld\\ConfigProvider"
  }
}
```

### 2. 設定プロバイダーの実装

`src/ConfigProvider.php` を編集：

```php
<?php

namespace Plugin\Mycompany\HelloWorld;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => [
                // 依存性注入の設定
            ],
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            'publish' => [
                // 設定ファイル公開設定
            ],
        ];
    }
}
```

### 3. ビジネスロジックの追加

コントローラー `src/Controller/HelloController.php` を作成：

```php
<?php

namespace Plugin\Mycompany\HelloWorld\Controller;

use Hyperf\HttpServer\Annotation\Controller;
use Hyperf\HttpServer\Annotation\GetMapping;

#[Controller(prefix: '/hello-world')]
class HelloController
{
    #[GetMapping('greeting')]
    public function greeting(): array
    {
        return [
            'code' => 200,
            'message' => 'Hello from MineAdmin Plugin!',
            'data' => [
                'plugin' => 'hello-world',
                'timestamp' => time()
            ]
        ];
    }
}
```

### 4. フロントエンド開発（オプション）

`web/` ディレクトリにフロントエンドコンポーネントを追加：

```vue
<!-- web/components/HelloWorld.vue -->
<template>
  <div class="hello-world">
    <h2>Hello World Plugin</h2>
    <p>{{ message }}</p>
    <el-button @click="fetchGreeting" type="primary">
      挨拶を取得
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello World プラグインへようこそ！')

const fetchGreeting = async () => {
  // バックエンドAPIを呼び出す
  try {
    const response = await fetch('/hello-world/greeting')
    const data = await response.json()
    message.value = data.message
  } catch (error) {
    console.error('挨拶の取得に失敗:', error)
  }
}
</script>
```

## プラグインのインストールとテスト

### 1. プラグインのインストール

```bash
# システムにプラグインをインストール
php bin/hyperf.php mine-extension:install mycompany/hello-world --yes
```

### 2. 機能のテスト

開発サーバーを起動してAPIをテスト：

```bash
# サービスを起動
php bin/hyperf.php start

# APIをテスト（新しいターミナル）
curl http://localhost:9501/hello-world/greeting
```

### 3. インストール状態の確認

```bash
# ローカルにインストールされたプラグインを表示
php bin/hyperf.php mine-extension:local-list
```

## プラグイン管理コマンド

### よく使うコマンド一覧

```bash
# リモートプラグインリストを表示
php bin/hyperf.php mine-extension:list

# リモートプラグインをダウンロード
php bin/hyperf.php mine-extension:download --name plugin-name

# ローカルプラグインをインストール
php bin/hyperf.php mine-extension:install plugin/path --yes

# プラグインをアンインストール
php bin/hyperf.php mine-extension:uninstall plugin/path --yes

# ローカルプラグインを表示
php bin/hyperf.php mine-extension:local-list
```

## 開発デバッグのヒント

### 1. ログデバッグ

プラグインでHyperfログシステムを使用：

```php
use Hyperf\Logger\LoggerFactory;

$logger = $container->get(LoggerFactory::class)->get('plugin');
$logger->info('Hello World Plugin Debug', ['data' => $someData]);
```

### 2. 設定のホットリロード

開発中に設定を変更した後はサービスの再起動が必要：

```bash
# Hyperfサービスを再起動
php bin/hyperf.php start
```

### 3. フロントエンドのホットアップデート

MineAdminフロントエンド開発環境を使用する場合：

```bash
# フロントエンドプロジェクトディレクトリで
npm run dev
```

## 次のステップ

これで最初のプラグインが作成できました！次は以下のことができます：

1. [プラグイン構造の詳細](./structure.md)を学ぶ
2. [完全な開発フロー](./develop.md)を学ぶ
3. [ライフサイクル管理](./lifecycle.md)を理解する
4. [その他の例](./examples.md)を参照する

## よくある質問

### Q: プラグインのインストールに失敗した場合は？
A: `mine.json` の設定が正しいか確認し、PSR-4オートロードパスが正しいことを確認してください。

### Q: プラグインをデバッグするには？
A: Hyperfのログシステムとデバッグツールを使用し、`runtime/logs/` ディレクトリ内のログファイルを確認してください。

### Q: フロントエンドコンポーネントが表示されない？
A: フロントエンドファイルが `web/` ディレクトリに配置されていることを確認してください。プラグインインストール時に自動的にフロントエンドプロジェクトにコピーされます。