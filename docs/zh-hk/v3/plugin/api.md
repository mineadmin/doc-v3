# API 參考文檔

本文檔詳細介紹 MineAdmin 插件系統的所有 API 接口、命令行工具和核心類庫。

## 命令行 API

### 插件管理命令

#### 1. mine-extension:initial

初始化插件擴展系統。

```bash
php bin/hyperf.php mine-extension:initial
```

**功能**: 
- 發佈 app-store 配置文件
- 初始化插件系統配置
- 創建必要的目錄結構

**實現類**: `Mine\AppStore\Command\InitialCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InitialCommand.php))

#### 2. mine-extension:list

查詢遠程插件列表。

```bash
php bin/hyperf.php mine-extension:list [options]
```

**參數**:
| 參數 | 類型 | 默認值 | 説明 |
|------|------|--------|------|
| --type | string | all | 篩選擴展類型 (mixed/backend/frontend) |
| --name | string | - | 篩選擴展名稱 |
| --category | string | - | 篩選分類 |
| --author | string | - | 篩選作者 |

**示例**:
```bash
# 查看所有插件
php bin/hyperf.php mine-extension:list

# 查看混合型插件
php bin/hyperf.php mine-extension:list --type=mixed

# 搜索特定插件
php bin/hyperf.php mine-extension:list --name=user-manager
```

**實現類**: `Mine\AppStore\Command\ListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/ListCommand.php))

#### 3. mine-extension:local-list

查詢本地所有插件。

```bash
php bin/hyperf.php mine-extension:local-list [options]
```

**參數**:
| 參數 | 類型 | 默認值 | 説明 |
|------|------|--------|------|
| --status | string | all | 篩選狀態 (installed/enabled/disabled) |
| --type | string | all | 篩選類型 |

**實現類**: `Mine\AppStore\Command\LocalListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/LocalListCommand.php))

#### 4. mine-extension:download

下載遠程插件到本地。

```bash
php bin/hyperf.php mine-extension:download --name=plugin-name [options]
```

**參數**:
| 參數 | 類型 | 必選 | 説明 |
|------|------|------|------|
| --name | string | 是 | 插件名稱 |
| --version | string | 否 | 指定版本 |
| --force | bool | 否 | 強制覆蓋已存在的插件 |

**實現類**: `Mine\AppStore\Command\DownloadCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/DownloadCommand.php))

#### 5. mine-extension:install

安裝指定插件。

```bash
php bin/hyperf.php mine-extension:install {path} [options]
```

**參數**:
| 參數 | 類型 | 必選 | 説明 |
|------|------|------|------|
| path | string | 是 | 插件路徑 (vendor/plugin-name) |
| --yes | bool | 否 | 跳過確認提示 |
| --force | bool | 否 | 強制重新安裝 |
| --skip-dependencies | bool | 否 | 跳過依賴檢查 |

**示例**:
```bash
# 安裝插件
php bin/hyperf.php mine-extension:install mineadmin/user-manager --yes

# 強制重新安裝
php bin/hyperf.php mine-extension:install mineadmin/user-manager --force
```

**實現類**: `Mine\AppStore\Command\InstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InstallCommand.php))

#### 6. mine-extension:uninstall

卸載指定插件。

```bash
php bin/hyperf.php mine-extension:uninstall {path} [options]
```

**參數**:
| 參數 | 類型 | 必選 | 説明 |
|------|------|------|------|
| path | string | 是 | 插件路徑 |
| --yes | bool | 否 | 跳過確認提示 |
| --force | bool | 否 | 強制卸載 (忽略錯誤) |
| --keep-data | bool | 否 | 保留用户數據 |

**實現類**: `Mine\AppStore\Command\UninstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/UninstallCommand.php))

#### 7. mine-extension:create

創建新插件。

```bash
php bin/hyperf.php mine-extension:create {path} [options]
```

**參數**:
| 參數 | 類型 | 默認值 | 説明 |
|------|------|--------|------|
| path | string | - | 插件路徑 (vendor/plugin-name) |
| --name | string | example | 插件顯示名稱 |
| --type | string | mixed | 插件類型 (mixed/backend/frontend) |
| --author | string | - | 作者名稱 |
| --description | string | - | 插件描述 |
| --license | string | MIT | 許可證類型 |

**示例**:
```bash
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "我的第一個插件"
```

**實現類**: `Mine\AppStore\Command\CreateCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/CreateCommand.php))

## 核心類庫 API

### Plugin 類

**文件位置**: `Mine\AppStore\Plugin` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Plugin.php))

插件系統的核心類，負責插件的加載和管理。

#### Plugin::init()

初始化插件系統，在應用啓動時調用。

```php
<?php

use Mine\AppStore\Plugin;

// 初始化插件系統
Plugin::init();
```

**功能**:
- 掃描 `plugin/` 目錄
- 加載已安裝的插件
- 註冊 ConfigProvider
- 自動加載插件類

#### Plugin::getInstalled()

獲取已安裝的插件列表。

```php
<?php

use Mine\AppStore\Plugin;

// 獲取所有已安裝插件
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

檢查插件是否已安裝。

```php
<?php

use Mine\AppStore\Plugin;

// 檢查插件是否已安裝
if (Plugin::isInstalled('vendor/plugin-name')) {
    // 插件已安裝
}
```

#### Plugin::getConfig()

獲取插件配置信息。

```php
<?php

use Mine\AppStore\Plugin;

// 獲取插件配置
$config = Plugin::getConfig('vendor/plugin-name');

// 返回 mine.json 解析後的數組
```

### ExtensionManager 類

**文件位置**: `app/Service/ExtensionManager.php`

負責插件的具體安裝、卸載、更新操作。

#### install()

安裝插件。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 安裝插件
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

卸載插件。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 卸載插件
$result = $manager->uninstall('vendor/plugin-name', [
    'force' => false,
    'keep_data' => false
]);
```

#### update()

更新插件。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 更新插件
$result = $manager->update('vendor/plugin-name');
```

### ConfigProvider 基類

所有插件的 ConfigProvider 都應該遵循以下接口：

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
            
            // 命令行命令
            'commands' => [
                CustomCommand::class,
            ],
            
            // 事件監聽器
            'listeners' => [
                CustomListener::class,
            ],
            
            // 中間件
            'middlewares' => [
                'http' => [
                    CustomMiddleware::class,
                ],
            ],
            
            // 配置文件發佈
            'publish' => [
                [
                    'id' => 'config-id',
                    'description' => '配置文件描述',
                    'source' => __DIR__ . '/../publish/config.php',
                    'destination' => BASE_PATH . '/config/autoload/plugin.php',
                ],
            ],
            
            // 進程配置
            'processes' => [
                CustomProcess::class,
            ],
        ];
    }
}
```

## HTTP API

### 插件管理接口

#### 獲取插件列表

```http
GET /admin/plugin/list
```

**請求參數**:
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
        "display_name": "插件顯示名稱",
        "version": "1.0.0",
        "description": "插件描述",
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

#### 安裝插件

```http
POST /admin/plugin/install
```

**請求參數**:
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

#### 卸載插件

```http
DELETE /admin/plugin/uninstall
```

**請求參數**:
```json
{
  "name": "vendor/plugin-name",
  "keep_data": false
}
```

#### 啓用/禁用插件

```http
PUT /admin/plugin/toggle-status
```

**請求參數**:
```json
{
  "name": "vendor/plugin-name",
  "status": "enabled"  // enabled | disabled
}
```

## 事件 API

### 插件事件系統

插件系統提供了豐富的事件鈎子，允許開發者在插件生命週期的關鍵節點執行自定義邏輯。

#### 事件類型

```php
<?php

namespace App\Event\Plugin;

// 插件安裝前事件
class BeforeInstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $config,
        public array $options = []
    ) {}
}

// 插件安裝後事件
class AfterInstallEvent
{
    public function __construct(
        public string $pluginName,
        public string $version,
        public bool $success,
        public ?string $error = null
    ) {}
}

// 插件卸載前事件
class BeforeUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $options = []
    ) {}
}

// 插件卸載後事件
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
            // 插件安裝成功後的處理
            $this->clearCache();
            $this->sendNotification($event->pluginName);
            $this->updateStatistics($event->pluginName);
        } else {
            // 安裝失敗的處理
            logger()->error('插件安裝失敗', [
                'plugin' => $event->pluginName,
                'error' => $event->error
            ]);
        }
    }
}
```

## 鈎子 API

### 插件鈎子系統

MineAdmin 提供了鈎子系統，允許插件在系統關鍵點注入自定義邏輯。

#### 註冊鈎子

```php
<?php

use App\Hook\HookManager;

// 在 ConfigProvider 中註冊鈎子
class ConfigProvider
{
    public function __invoke(): array
    {
        // 註冊鈎子
        HookManager::register('user.login.before', function($user) {
            // 用户登錄前的處理邏輯
            logger()->info('用户嘗試登錄', ['user_id' => $user->id]);
        });
        
        HookManager::register('user.login.after', function($user) {
            // 用户登錄後的處理邏輯
            $this->recordLoginHistory($user);
        });
        
        return [
            // ... 其他配置
        ];
    }
}
```

#### 觸發鈎子

```php
<?php

use App\Hook\HookManager;

// 在系統代碼中觸發鈎子
class UserService
{
    public function login(array $credentials): bool
    {
        // 登錄前鈎子
        HookManager::trigger('user.login.before', $user);
        
        // 執行登錄邏輯
        $result = $this->authenticate($credentials);
        
        if ($result) {
            // 登錄後鈎子
            HookManager::trigger('user.login.after', $user);
        }
        
        return $result;
    }
}
```

#### 可用鈎子列表

| 鈎子名稱 | 觸發時機 | 參數 |
|----------|----------|------|
| `user.login.before` | 用户登錄前 | User $user |
| `user.login.after` | 用户登錄後 | User $user |
| `user.logout.before` | 用户退出前 | User $user |
| `user.logout.after` | 用户退出後 | User $user |
| `menu.render.before` | 菜單渲染前 | array $menus |
| `menu.render.after` | 菜單渲染後 | array $menus |
| `permission.check.before` | 權限檢查前 | string $permission, User $user |
| `permission.check.after` | 權限檢查後 | bool $result, string $permission, User $user |

## 工具類 API

### PluginHelper 類

提供插件開發的常用工具方法。

```php
<?php

namespace App\Helper;

class PluginHelper
{
    /**
     * 獲取插件根路徑
     */
    public static function getPluginPath(string $pluginName): string
    {
        return BASE_PATH . '/plugin/' . str_replace('/', DIRECTORY_SEPARATOR, $pluginName);
    }
    
    /**
     * 獲取插件配置
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
     * 檢查插件是否已安裝
     */
    public static function isInstalled(string $pluginName): bool
    {
        $lockFile = self::getPluginPath($pluginName) . '/install.lock';
        return file_exists($lockFile);
    }
    
    /**
     * 獲取插件版本
     */
    public static function getVersion(string $pluginName): ?string
    {
        $config = self::getPluginConfig($pluginName);
        return $config['version'] ?? null;
    }
    
    /**
     * 獲取插件資源 URL
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

// 獲取插件路徑
$path = PluginHelper::getPluginPath('vendor/plugin-name');

// 檢查插件是否已安裝
if (PluginHelper::isInstalled('vendor/plugin-name')) {
    // 獲取插件版本
    $version = PluginHelper::getVersion('vendor/plugin-name');
    
    // 獲取資源 URL
    $cssUrl = PluginHelper::getAssetUrl('vendor/plugin-name', 'style.css');
}
```

## 錯誤碼參考

### 插件安裝錯誤碼

| 錯誤碼 | 説明 | 解決方案 |
|--------|------|----------|
| 10001 | 插件目錄不存在 | 檢查插件路徑是否正確 |
| 10002 | mine.json 文件不存在 | 確保插件包含配置文件 |
| 10003 | mine.json 格式錯誤 | 檢查 JSON 語法 |
| 10004 | 依賴插件未安裝 | 先安裝依賴插件 |
| 10005 | 版本衝突 | 解決版本兼容性問題 |
| 10006 | 數據庫遷移失敗 | 檢查數據庫連接和權限 |
| 10007 | 文件複製失敗 | 檢查文件權限 |
| 10008 | 安裝腳本執行失敗 | 查看安裝腳本錯誤日誌 |

### 插件卸載錯誤碼

| 錯誤碼 | 説明 | 解決方案 |
|--------|------|----------|
| 20001 | 插件未安裝 | 無需卸載 |
| 20002 | 存在依賴插件 | 先卸載依賴插件或使用強制卸載 |
| 20003 | 卸載腳本執行失敗 | 查看卸載腳本錯誤日誌 |
| 20004 | 數據庫清理失敗 | 手動清理數據庫數據 |
| 20005 | 文件刪除失敗 | 檢查文件權限 |

## 相關文檔

- [插件開發指南](./develop.md) - 詳細開發流程
- [插件結構説明](./structure.md) - 目錄結構規範
- [生命週期管理](./lifecycle.md) - 安裝卸載流程
- [示例代碼](./examples.md) - 實際案例