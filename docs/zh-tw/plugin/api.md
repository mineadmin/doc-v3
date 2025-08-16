# API 參考文件

本文件詳細介紹 MineAdmin 外掛系統的所有 API 介面、命令列工具和核心類庫。

## 命令列 API

### 外掛管理命令

#### 1. mine-extension:initial

初始化外掛擴充套件系統。

```bash
php bin/hyperf.php mine-extension:initial
```

**功能**: 
- 釋出 app-store 配置檔案
- 初始化外掛系統配置
- 建立必要的目錄結構

**實現類**: `Mine\AppStore\Command\InitialCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InitialCommand.php))

#### 2. mine-extension:list

查詢遠端外掛列表。

```bash
php bin/hyperf.php mine-extension:list [options]
```

**引數**:
| 引數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| --type | string | all | 篩選擴充套件型別 (mixed/backend/frontend) |
| --name | string | - | 篩選副檔名稱 |
| --category | string | - | 篩選分類 |
| --author | string | - | 篩選作者 |

**示例**:
```bash
# 檢視所有外掛
php bin/hyperf.php mine-extension:list

# 檢視混合型外掛
php bin/hyperf.php mine-extension:list --type=mixed

# 搜尋特定外掛
php bin/hyperf.php mine-extension:list --name=user-manager
```

**實現類**: `Mine\AppStore\Command\ListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/ListCommand.php))

#### 3. mine-extension:local-list

查詢本地所有外掛。

```bash
php bin/hyperf.php mine-extension:local-list [options]
```

**引數**:
| 引數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| --status | string | all | 篩選狀態 (installed/enabled/disabled) |
| --type | string | all | 篩選型別 |

**實現類**: `Mine\AppStore\Command\LocalListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/LocalListCommand.php))

#### 4. mine-extension:download

下載遠端外掛到本地。

```bash
php bin/hyperf.php mine-extension:download --name=plugin-name [options]
```

**引數**:
| 引數 | 型別 | 必選 | 說明 |
|------|------|------|------|
| --name | string | 是 | 外掛名稱 |
| --version | string | 否 | 指定版本 |
| --force | bool | 否 | 強制覆蓋已存在的外掛 |

**實現類**: `Mine\AppStore\Command\DownloadCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/DownloadCommand.php))

#### 5. mine-extension:install

安裝指定外掛。

```bash
php bin/hyperf.php mine-extension:install {path} [options]
```

**引數**:
| 引數 | 型別 | 必選 | 說明 |
|------|------|------|------|
| path | string | 是 | 外掛路徑 (vendor/plugin-name) |
| --yes | bool | 否 | 跳過確認提示 |
| --force | bool | 否 | 強制重新安裝 |
| --skip-dependencies | bool | 否 | 跳過依賴檢查 |

**示例**:
```bash
# 安裝外掛
php bin/hyperf.php mine-extension:install mineadmin/user-manager --yes

# 強制重新安裝
php bin/hyperf.php mine-extension:install mineadmin/user-manager --force
```

**實現類**: `Mine\AppStore\Command\InstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InstallCommand.php))

#### 6. mine-extension:uninstall

解除安裝指定外掛。

```bash
php bin/hyperf.php mine-extension:uninstall {path} [options]
```

**引數**:
| 引數 | 型別 | 必選 | 說明 |
|------|------|------|------|
| path | string | 是 | 外掛路徑 |
| --yes | bool | 否 | 跳過確認提示 |
| --force | bool | 否 | 強制解除安裝 (忽略錯誤) |
| --keep-data | bool | 否 | 保留使用者資料 |

**實現類**: `Mine\AppStore\Command\UninstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/UninstallCommand.php))

#### 7. mine-extension:create

建立新外掛。

```bash
php bin/hyperf.php mine-extension:create {path} [options]
```

**引數**:
| 引數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| path | string | - | 外掛路徑 (vendor/plugin-name) |
| --name | string | example | 外掛顯示名稱 |
| --type | string | mixed | 外掛型別 (mixed/backend/frontend) |
| --author | string | - | 作者名稱 |
| --description | string | - | 外掛描述 |
| --license | string | MIT | 許可證型別 |

**示例**:
```bash
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "我的第一個外掛"
```

**實現類**: `Mine\AppStore\Command\CreateCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/CreateCommand.php))

## 核心類庫 API

### Plugin 類

**檔案位置**: `Mine\AppStore\Plugin` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Plugin.php))

外掛系統的核心類，負責外掛的載入和管理。

#### Plugin::init()

初始化外掛系統，在應用啟動時呼叫。

```php
<?php

use Mine\AppStore\Plugin;

// 初始化外掛系統
Plugin::init();
```

**功能**:
- 掃描 `plugin/` 目錄
- 載入已安裝的外掛
- 註冊 ConfigProvider
- 自動載入外掛類

#### Plugin::getInstalled()

獲取已安裝的外掛列表。

```php
<?php

use Mine\AppStore\Plugin;

// 獲取所有已安裝外掛
$plugins = Plugin::getInstalled();

// 返回格式
[
    'vendor/plugin-name' => [
        'name' => 'vendor/plugin-name',
        'version' => '1.0.0',
        'path' => '/path/to/plugin',
        'config' => [...], // mine.json 配置
        'status' => 'enabled'
    ]
]
```

#### Plugin::isInstalled()

檢查外掛是否已安裝。

```php
<?php

use Mine\AppStore\Plugin;

// 檢查外掛是否已安裝
if (Plugin::isInstalled('vendor/plugin-name')) {
    // 外掛已安裝
}
```

#### Plugin::getConfig()

獲取外掛配置資訊。

```php
<?php

use Mine\AppStore\Plugin;

// 獲取外掛配置
$config = Plugin::getConfig('vendor/plugin-name');

// 返回 mine.json 解析後的陣列
```

### ExtensionManager 類

**檔案位置**: `app/Service/ExtensionManager.php`

負責外掛的具體安裝、解除安裝、更新操作。

#### install()

安裝外掛。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 安裝外掛
$result = $manager->install('vendor/plugin-name', [
    'force' => false,
    'skip_dependencies' => false
]);

if ($result['success']) {
    echo "安裝成功";
} else {
    echo "安裝失敗: " . $result['message'];
}
```

#### uninstall()

解除安裝外掛。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 解除安裝外掛
$result = $manager->uninstall('vendor/plugin-name', [
    'force' => false,
    'keep_data' => false
]);
```

#### update()

更新外掛。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 更新外掛
$result = $manager->update('vendor/plugin-name');
```

### ConfigProvider 基類

所有外掛的 ConfigProvider 都應該遵循以下介面：

```php
<?php

namespace Plugin\Vendor\PluginName;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            // 依賴注入配置
            'dependencies' => [
                InterfaceA::class => ImplementationA::class,
            ],
            
            // 註解掃描路徑
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            
            // 命令列命令
            'commands' => [
                CustomCommand::class,
            ],
            
            // 事件監聽器
            'listeners' => [
                CustomListener::class,
            ],
            
            // 中介軟體
            'middlewares' => [
                'http' => [
                    CustomMiddleware::class,
                ],
            ],
            
            // 配置檔案釋出
            'publish' => [
                [
                    'id' => 'config-id',
                    'description' => '配置檔案描述',
                    'source' => __DIR__ . '/../publish/config.php',
                    'destination' => BASE_PATH . '/config/autoload/plugin.php',
                ],
            ],
            
            // 程序配置
            'processes' => [
                CustomProcess::class,
            ],
        ];
    }
}
```

## HTTP API

### 外掛管理介面

#### 獲取外掛列表

```http
GET /admin/plugin/list
```

**請求引數**:
```json
{
  "page": 1,
  "pageSize": 15,
  "type": "mixed",
  "status": "enabled",
  "keyword": "search term"
}
```

**響應示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "name": "vendor/plugin-name",
        "display_name": "外掛顯示名稱",
        "version": "1.0.0",
        "description": "外掛描述",
        "author": "作者名稱",
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

#### 安裝外掛

```http
POST /admin/plugin/install
```

**請求引數**:
```json
{
  "name": "vendor/plugin-name",
  "version": "1.0.0",
  "force": false
}
```

**響應示例**:
```json
{
  "code": 200,
  "message": "安裝成功",
  "data": {
    "plugin": "vendor/plugin-name",
    "version": "1.0.0",
    "installed_at": "2024-01-01 12:00:00"
  }
}
```

#### 解除安裝外掛

```http
DELETE /admin/plugin/uninstall
```

**請求引數**:
```json
{
  "name": "vendor/plugin-name",
  "keep_data": false
}
```

#### 啟用/停用外掛

```http
PUT /admin/plugin/toggle-status
```

**請求引數**:
```json
{
  "name": "vendor/plugin-name",
  "status": "enabled"  // enabled | disabled
}
```

## 事件 API

### 外掛事件系統

外掛系統提供了豐富的事件鉤子，允許開發者在外掛生命週期的關鍵節點執行自定義邏輯。

#### 事件型別

```php
<?php

namespace App\Event\Plugin;

// 外掛安裝前事件
class BeforeInstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $config,
        public array $options = []
    ) {}
}

// 外掛安裝後事件
class AfterInstallEvent
{
    public function __construct(
        public string $pluginName,
        public string $version,
        public bool $success,
        public ?string $error = null
    ) {}
}

// 外掛解除安裝前事件
class BeforeUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $options = []
    ) {}
}

// 外掛解除安裝後事件
class AfterUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public bool $success,
        public ?string $error = null
    ) {}
}
```

#### 事件監聽器示例

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
            // 外掛安裝成功後的處理
            $this->clearCache();
            $this->sendNotification($event->pluginName);
            $this->updateStatistics($event->pluginName);
        } else {
            // 安裝失敗的處理
            logger()->error('外掛安裝失敗', [
                'plugin' => $event->pluginName,
                'error' => $event->error
            ]);
        }
    }
}
```

## 鉤子 API

### 外掛鉤子系統

MineAdmin 提供了鉤子系統，允許外掛在系統關鍵點注入自定義邏輯。

#### 註冊鉤子

```php
<?php

use App\Hook\HookManager;

// 在 ConfigProvider 中註冊鉤子
class ConfigProvider
{
    public function __invoke(): array
    {
        // 註冊鉤子
        HookManager::register('user.login.before', function($user) {
            // 使用者登入前的處理邏輯
            logger()->info('使用者嘗試登入', ['user_id' => $user->id]);
        });
        
        HookManager::register('user.login.after', function($user) {
            // 使用者登入後的處理邏輯
            $this->recordLoginHistory($user);
        });
        
        return [
            // ... 其他配置
        ];
    }
}
```

#### 觸發鉤子

```php
<?php

use App\Hook\HookManager;

// 在系統程式碼中觸發鉤子
class UserService
{
    public function login(array $credentials): bool
    {
        // 登入前鉤子
        HookManager::trigger('user.login.before', $user);
        
        // 執行登入邏輯
        $result = $this->authenticate($credentials);
        
        if ($result) {
            // 登入後鉤子
            HookManager::trigger('user.login.after', $user);
        }
        
        return $result;
    }
}
```

#### 可用鉤子列表

| 鉤子名稱 | 觸發時機 | 引數 |
|----------|----------|------|
| `user.login.before` | 使用者登入前 | User $user |
| `user.login.after` | 使用者登入後 | User $user |
| `user.logout.before` | 使用者退出前 | User $user |
| `user.logout.after` | 使用者退出後 | User $user |
| `menu.render.before` | 選單渲染前 | array $menus |
| `menu.render.after` | 選單渲染後 | array $menus |
| `permission.check.before` | 許可權檢查前 | string $permission, User $user |
| `permission.check.after` | 許可權檢查後 | bool $result, string $permission, User $user |

## 工具類 API

### PluginHelper 類

提供外掛開發的常用工具方法。

```php
<?php

namespace App\Helper;

class PluginHelper
{
    /**
     * 獲取外掛根路徑
     */
    public static function getPluginPath(string $pluginName): string
    {
        return BASE_PATH . '/plugin/' . str_replace('/', DIRECTORY_SEPARATOR, $pluginName);
    }
    
    /**
     * 獲取外掛配置
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
     * 檢查外掛是否已安裝
     */
    public static function isInstalled(string $pluginName): bool
    {
        $lockFile = self::getPluginPath($pluginName) . '/install.lock';
        return file_exists($lockFile);
    }
    
    /**
     * 獲取外掛版本
     */
    public static function getVersion(string $pluginName): ?string
    {
        $config = self::getPluginConfig($pluginName);
        return $config['version'] ?? null;
    }
    
    /**
     * 獲取外掛資源 URL
     */
    public static function getAssetUrl(string $pluginName, string $asset): string
    {
        return "/plugin/{$pluginName}/assets/{$asset}";
    }
}
```

### 使用示例

```php
<?php

use App\Helper\PluginHelper;

// 獲取外掛路徑
$path = PluginHelper::getPluginPath('vendor/plugin-name');

// 檢查外掛是否已安裝
if (PluginHelper::isInstalled('vendor/plugin-name')) {
    // 獲取外掛版本
    $version = PluginHelper::getVersion('vendor/plugin-name');
    
    // 獲取資源 URL
    $cssUrl = PluginHelper::getAssetUrl('vendor/plugin-name', 'style.css');
}
```

## 錯誤碼參考

### 外掛安裝錯誤碼

| 錯誤碼 | 說明 | 解決方案 |
|--------|------|----------|
| 10001 | 外掛目錄不存在 | 檢查外掛路徑是否正確 |
| 10002 | mine.json 檔案不存在 | 確保外掛包含配置檔案 |
| 10003 | mine.json 格式錯誤 | 檢查 JSON 語法 |
| 10004 | 依賴外掛未安裝 | 先安裝依賴外掛 |
| 10005 | 版本衝突 | 解決版本相容性問題 |
| 10006 | 資料庫遷移失敗 | 檢查資料庫連線和許可權 |
| 10007 | 檔案複製失敗 | 檢查檔案許可權 |
| 10008 | 安裝指令碼執行失敗 | 檢視安裝指令碼錯誤日誌 |

### 外掛解除安裝錯誤碼

| 錯誤碼 | 說明 | 解決方案 |
|--------|------|----------|
| 20001 | 外掛未安裝 | 無需解除安裝 |
| 20002 | 存在依賴外掛 | 先解除安裝依賴外掛或使用強制解除安裝 |
| 20003 | 解除安裝指令碼執行失敗 | 檢視解除安裝指令碼錯誤日誌 |
| 20004 | 資料庫清理失敗 | 手動清理資料庫資料 |
| 20005 | 檔案刪除失敗 | 檢查檔案許可權 |

## 相關文件

- [外掛開發指南](./develop.md) - 詳細開發流程
- [外掛結構說明](./structure.md) - 目錄結構規範
- [生命週期管理](./lifecycle.md) - 安裝解除安裝流程
- [示例程式碼](./examples.md) - 實際案例