# API リファレンスドキュメント

本ドキュメントでは、MineAdmin プラグインシステムのすべての API インターフェース、コマンドラインツール、およびコアクラスライブラリについて詳しく説明します。

## コマンドライン API

### プラグイン管理コマンド

#### 1. mine-extension:initial

プラグイン拡張システムを初期化します。

```bash
php bin/hyperf.php mine-extension:initial
```

**機能**:
- app-store 設定ファイルを公開
- プラグインシステム設定を初期化
- 必要なディレクトリ構造を作成

**実装クラス**: `Mine\AppStore\Command\InitialCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InitialCommand.php))

#### 2. mine-extension:list

リモートプラグイン一覧を照会します。

```bash
php bin/hyperf.php mine-extension:list [options]
```

**パラメータ**:
| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| --type | string | all | 拡張タイプをフィルタ (mixed/backend/frontend) |
| --name | string | - | 拡張名をフィルタ |
| --category | string | - | カテゴリをフィルタ |
| --author | string | - | 作者をフィルタ |

**例**:
```bash
# すべてのプラグインを表示
php bin/hyperf.php mine-extension:list

# ハイブリッドタイプのプラグインを表示
php bin/hyperf.php mine-extension:list --type=mixed

# 特定のプラグインを検索
php bin/hyperf.php mine-extension:list --name=user-manager
```

**実装クラス**: `Mine\AppStore\Command\ListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/ListCommand.php))

#### 3. mine-extension:local-list

ローカルのすべてのプラグインを照会します。

```bash
php bin/hyperf.php mine-extension:local-list [options]
```

**パラメータ**:
| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| --status | string | all | ステータスをフィルタ (installed/enabled/disabled) |
| --type | string | all | タイプをフィルタ |

**実装クラス**: `Mine\AppStore\Command\LocalListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/LocalListCommand.php))

#### 4. mine-extension:download

リモートプラグインをローカルにダウンロードします。

```bash
php bin/hyperf.php mine-extension:download --name=plugin-name [options]
```

**パラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|------|------|------|------|
| --name | string | はい | プラグイン名 |
| --version | string | いいえ | バージョン指定 |
| --force | bool | いいえ | 既存のプラグインを強制的に上書き |

**実装クラス**: `Mine\AppStore\Command\DownloadCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/DownloadCommand.php))

#### 5. mine-extension:install

指定されたプラグインをインストールします。

```bash
php bin/hyperf.php mine-extension:install {path} [options]
```

**パラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|------|------|------|------|
| path | string | はい | プラグインパス (vendor/plugin-name) |
| --yes | bool | いいえ | 確認プロンプトをスキップ |
| --force | bool | いいえ | 強制的に再インストール |
| --skip-dependencies | bool | いいえ | 依存関係チェックをスキップ |

**例**:
```bash
# プラグインをインストール
php bin/hyperf.php mine-extension:install mineadmin/user-manager --yes

# 強制的に再インストール
php bin/hyperf.php mine-extension:install mineadmin/user-manager --force
```

**実装クラス**: `Mine\AppStore\Command\InstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InstallCommand.php))

#### 6. mine-extension:uninstall

指定されたプラグインをアンインストールします。

```bash
php bin/hyperf.php mine-extension:uninstall {path} [options]
```

**パラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|------|------|------|------|
| path | string | はい | プラグインパス |
| --yes | bool | いいえ | 確認プロンプトをスキップ |
| --force | bool | いいえ | 強制アンインストール (エラーを無視) |
| --keep-data | bool | いいえ | ユーザーデータを保持 |

**実装クラス**: `Mine\AppStore\Command\UninstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/UninstallCommand.php))

#### 7. mine-extension:create

新しいプラグインを作成します。

```bash
php bin/hyperf.php mine-extension:create {path} [options]
```

**パラメータ**:
| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| path | string | - | プラグインパス (vendor/plugin-name) |
| --name | string | example | プラグイン表示名 |
| --type | string | mixed | プラグインタイプ (mixed/backend/frontend) |
| --author | string | - | 作者名 |
| --description | string | - | プラグイン説明 |
| --license | string | MIT | ライセンスタイプ |

**例**:
```bash
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "私の最初のプラグイン"
```

**実装クラス**: `Mine\AppStore\Command\CreateCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/CreateCommand.php))

## コアクラスライブラリ API

### Plugin クラス

**ファイル位置**: `Mine\AppStore\Plugin` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Plugin.php))

プラグインシステムの中核クラスで、プラグインのロードと管理を担当します。

#### Plugin::init()

プラグインシステムを初期化し、アプリケーション起動時に呼び出されます。

```php
<?php

use Mine\AppStore\Plugin;

// プラグインシステムを初期化
Plugin::init();
```

**機能**:
- `plugin/` ディレクトリをスキャン
- インストール済みプラグインをロード
- ConfigProvider を登録
- プラグインクラスを自動ロード

#### Plugin::getInstalled()

インストール済みプラグインの一覧を取得します。

```php
<?php

use Mine\AppStore\Plugin;

// インストール済みプラグインをすべて取得
$plugins = Plugin::getInstalled();

// 戻り値の形式
[
    'vendor/plugin-name' => [
        'name' => 'vendor/plugin-name',
        'version' => '1.0.0',
        'path' => '/path/to/plugin',
        'config' => [...], // mine.json 設定
        'status' => 'enabled'
    ]
]
```

#### Plugin::isInstalled()

プラグインがインストール済みかどうかを確認します。

```php
<?php

use Mine\AppStore\Plugin;

// プラグインがインストール済みか確認
if (Plugin::isInstalled('vendor/plugin-name')) {
    // プラグインはインストール済み
}
```

#### Plugin::getConfig()

プラグインの設定情報を取得します。

```php
<?php

use Mine\AppStore\Plugin;

// プラグイン設定を取得
$config = Plugin::getConfig('vendor/plugin-name');

// mine.json をパースした配列を返す
```

### ExtensionManager クラス

**ファイル位置**: `app/Service/ExtensionManager.php`

プラグインの具体的なインストール、アンインストール、更新操作を担当します。

#### install()

プラグインをインストールします。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// プラグインをインストール
$result = $manager->install('vendor/plugin-name', [
    'force' => false,
    'skip_dependencies' => false
]);

if ($result['success']) {
    echo "インストール成功";
} else {
    echo "インストール失敗: " . $result['message'];
}
```

#### uninstall()

プラグインをアンインストールします。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// プラグインをアンインストール
$result = $manager->uninstall('vendor/plugin-name', [
    'force' => false,
    'keep_data' => false
]);
```

#### update()

プラグインを更新します。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// プラグインを更新
$result = $manager->update('vendor/plugin-name');
```

### ConfigProvider 基底クラス

すべてのプラグインの ConfigProvider は、以下のインターフェースに従う必要があります：

```php
<?php

namespace Plugin\Vendor\PluginName;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            // 依存注入設定
            'dependencies' => [
                InterfaceA::class => ImplementationA::class,
            ],
            
            // アノテーションスキャンパス
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            
            // コマンドラインコマンド
            'commands' => [
                CustomCommand::class,
            ],
            
            // イベントリスナー
            'listeners' => [
                CustomListener::class,
            ],
            
            // ミドルウェア
            'middlewares' => [
                'http' => [
                    CustomMiddleware::class,
                ],
            ],
            
            // 設定ファイル公開
            'publish' => [
                [
                    'id' => 'config-id',
                    'description' => '設定ファイルの説明',
                    'source' => __DIR__ . '/../publish/config.php',
                    'destination' => BASE_PATH . '/config/autoload/plugin.php',
                ],
            ],
            
            // プロセス設定
            'processes' => [
                CustomProcess::class,
            ],
        ];
    }
}
```

## HTTP API

### プラグイン管理インターフェース

#### プラグイン一覧取得

```http
GET /admin/plugin/list
```

**リクエストパラメータ**:
```json
{
  "page": 1,
  "pageSize": 15,
  "type": "mixed",
  "status": "enabled",
  "keyword": "検索語"
}
```

**レスポンス例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "name": "vendor/plugin-name",
        "display_name": "プラグイン表示名",
        "version": "1.0.0",
        "description": "プラグイン説明",
        "author": "作者名",
        "type": "mixed",
        "status": "enabled",
        "installed_at": "2024-01-01 12:00:00",
        "updated_at": "2024-01-15 10:30:00"
      }
    ],
    "total": 1
  }
}
```

#### プラグインインストール

```http
POST /admin/plugin/install
```

**リクエストパラメータ**:
```json
{
  "name": "vendor/plugin-name",
  "version": "1.0.0",
  "force": false
}
```

**レスポンス例**:
```json
{
  "code": 200,
  "message": "インストール成功",
  "data": {
    "plugin": "vendor/plugin-name",
    "version": "1.0.0",
    "installed_at": "2024-01-01 12:00:00"
  }
}
```

#### プラグインアンインストール

```http
DELETE /admin/plugin/uninstall
```

**リクエストパラメータ**:
```json
{
  "name": "vendor/plugin-name",
  "keep_data": false
}
```

#### プラグイン有効化/無効化

```http
PUT /admin/plugin/toggle-status
```

**リクエストパラメータ**:
```json
{
  "name": "vendor/plugin-name",
  "status": "enabled"  // enabled | disabled
}
```

## イベント API

### プラグインイベントシステム

プラグインシステムは豊富なイベントフックを提供し、開発者がプラグインライフサイクルの重要なポイントでカスタムロジックを実行できるようにします。

#### イベントタイプ

```php
<?php

namespace App\Event\Plugin;

// プラグインインストール前イベント
class BeforeInstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $config,
        public array $options = []
    ) {}
}

// プラグインインストール後イベント
class AfterInstallEvent
{
    public function __construct(
        public string $pluginName,
        public string $version,
        public bool $success,
        public ?string $error = null
    ) {}
}

// プラグインアンインストール前イベント
class BeforeUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $options = []
    ) {}
}

// プラグインアンインストール後イベント
class AfterUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public bool $success,
        public ?string $error = null
    ) {}
}
```

#### イベントリスナー例

```php
<?php

namespace App\Listener\Plugin;

use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;
use App\Event\Plugin\AfterInstallEvent;

#[Listener]
class PluginInstallListener implements ListenerInterface
{
    public function listen(): array
    {
        return [
            AfterInstallEvent::class,
        ];
    }

    public function process(object $event): void
    {
        if ($event->success) {
            // プラグインインストール成功後の処理
            $this->clearCache();
            $this->sendNotification($event->pluginName);
            $this->updateStatistics($event->pluginName);
        } else {
            // インストール失敗時の処理
            logger()->error('プラグインインストール失敗', [
                'plugin' => $event->pluginName,
                'error' => $event->error
            ]);
        }
    }
}
```

## フック API

### プラグインフックシステム

MineAdmin はフックシステムを提供し、プラグインがシステムの重要なポイントにカスタムロジックを注入できるようにします。

#### フックの登録

```php
<?php

use App\Hook\HookManager;

// ConfigProvider でフックを登録
class ConfigProvider
{
    public function __invoke(): array
    {
        // フックを登録
        HookManager::register('user.login.before', function($user) {
            // ユーザーログイン前の処理ロジック
            logger()->info('ユーザーがログインを試行', ['user_id' => $user->id]);
        });
        
        HookManager::register('user.login.after', function($user) {
            // ユーザーログイン後の処理ロジック
            $this->recordLoginHistory($user);
        });
        
        return [
            // ... その他の設定
        ];
    }
}
```

#### フックのトリガー

```php
<?php

use App\Hook\HookManager;

// システムコード内でフックをトリガー
class UserService
{
    public function login(array $credentials): bool
    {
        // ログイン前フック
        HookManager::trigger('user.login.before', $user);
        
        // ログインロジックを実行
        $result = $this->authenticate($credentials);
        
        if ($result) {
            // ログイン後フック
            HookManager::trigger('user.login.after', $user);
        }
        
        return $result;
    }
}
```

#### 利用可能なフック一覧

| フック名 | トリガー時機 | パラメータ |
|----------|----------|------|
| `user.login.before` | ユーザーログイン前 | User $user |
| `user.login.after` | ユーザーログイン後 | User $user |
| `user.logout.before` | ユーザーログアウト前 | User $user |
| `user.logout.after` | ユーザーログアウト後 | User $user |
| `menu.render.before` | メニューレンダリング前 | array $menus |
| `menu.render.after` | メニューレンダリング後 | array $menus |
| `permission.check.before` | 権限チェック前 | string $permission, User $user |
| `permission.check.after` | 権限チェック後 | bool $result, string $permission, User $user |

## ユーティリティクラス API

### PluginHelper クラス

プラグイン開発のための一般的なユーティリティメソッドを提供します。

```php
<?php

namespace App\Helper;

class PluginHelper
{
    /**
     * プラグインのルートパスを取得
     */
    public static function getPluginPath(string $pluginName): string
    {
        return BASE_PATH . '/plugin/' . str_replace('/', DIRECTORY_SEPARATOR, $pluginName);
    }
    
    /**
     * プラグイン設定を取得
     */
    public static function getPluginConfig(string $pluginName): ?array
    {
        $configPath = self::getPluginPath($pluginName) . '/mine.json';
        
        if (!file_exists($configPath)) {
            return null;
        }
        
        return json_decode(file_get_contents($configPath), true);
    }
    
    /**
     * プラグインがインストール済みか確認
     */
    public static function isInstalled(string $pluginName): bool
    {
        $lockFile = self::getPluginPath($pluginName) . '/install.lock';
        return file_exists($lockFile);
    }
    
    /**
     * プラグインバージョンを取得
     */
    public static function getVersion(string $pluginName): ?string
    {
        $config = self::getPluginConfig($pluginName);
        return $config['version'] ?? null;
    }
    
    /**
     * プラグインのリソース URL を取得
     */
    public static function getAssetUrl(string $pluginName, string $asset): string
    {
        return "/plugin/{$pluginName}/assets/{$asset}";
    }
}
```

### 使用例

```php
<?php

use App\Helper\PluginHelper;

// プラグインパスを取得
$path = PluginHelper::getPluginPath('vendor/plugin-name');

// プラグインがインストール済みか確認
if (PluginHelper::isInstalled('vendor/plugin-name')) {
    // プラグインバージョンを取得
    $version = PluginHelper::getVersion('vendor/plugin-name');
    
    // リソース URL を取得
    $cssUrl = PluginHelper::getAssetUrl('vendor/plugin-name', 'style.css');
}
```

## エラーコードリファレンス

### プラグインインストールエラーコード

| エラーコード | 説明 | 解決策 |
|--------|------|----------|
| 10001 | プラグインディレクトリが存在しない | プラグインパスが正しいか確認 |
| 10002 | mine.json ファイルが存在しない | プラグインに設定ファイルが含まれていることを確認 |
| 10003 | mine.json のフォーマットが不正 | JSON 構文を確認 |
| 10004 | 依存プラグインがインストールされていない | まず依存プラグインをインストール |
| 10005 | バージョン競合 | バージョンの互換性問題を解決 |
| 10006 | データベースマイグレーション失敗 | データベース接続と権限を確認 |
| 10007 | ファイルコピー失敗 | ファイル権限を確認 |
| 10008 | インストールスクリプト実行失敗 | インストールスクリプトのエラーログを確認 |

### プラグインアンインストールエラーコード

| エラーコード | 説明 | 解決策 |
|--------|------|----------|
| 20001 | プラグインがインストールされていない | アンインストール不要 |
| 20002 | 依存プラグインが存在する | まず依存プラグインをアンインストールするか、強制アンインストールを使用 |
| 20003 | アンインストールスクリプト実行失敗 | アンインストールスクリプトのエラーログを確認 |
| 20004 | データベースクリーンアップ失敗 | データベースデータを手動でクリーンアップ |
| 20005 | ファイル削除失敗 | ファイル権限を確認 |

## 関連ドキュメント

- [プラグイン開発ガイド](./develop.md) - 詳細な開発フロー
- [プラグイン構造説明](./structure.md) - ディレクトリ構造規範
- [ライフサイクル管理](./lifecycle.md) - インストール/アンインストールフロー
- [サンプルコード](./examples.md) - 実際の事例