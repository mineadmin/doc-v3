# API 参考文档

本文档详细介绍 MineAdmin 插件系统的所有 API 接口、命令行工具和核心类库。

## 命令行 API

### 插件管理命令

#### 1. mine-extension:initial

初始化插件扩展系统。

```bash
php bin/hyperf.php mine-extension:initial
```

**功能**: 
- 发布 app-store 配置文件
- 初始化插件系统配置
- 创建必要的目录结构

**实现类**: `Mine\AppStore\Command\InitialCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InitialCommand.php))

#### 2. mine-extension:list

查询远程插件列表。

```bash
php bin/hyperf.php mine-extension:list [options]
```

**参数**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| --type | string | all | 筛选扩展类型 (mixed/backend/frontend) |
| --name | string | - | 筛选扩展名称 |
| --category | string | - | 筛选分类 |
| --author | string | - | 筛选作者 |

**示例**:
```bash
# 查看所有插件
php bin/hyperf.php mine-extension:list

# 查看混合型插件
php bin/hyperf.php mine-extension:list --type=mixed

# 搜索特定插件
php bin/hyperf.php mine-extension:list --name=user-manager
```

**实现类**: `Mine\AppStore\Command\ListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/ListCommand.php))

#### 3. mine-extension:local-list

查询本地所有插件。

```bash
php bin/hyperf.php mine-extension:local-list [options]
```

**参数**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| --status | string | all | 筛选状态 (installed/enabled/disabled) |
| --type | string | all | 筛选类型 |

**实现类**: `Mine\AppStore\Command\LocalListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/LocalListCommand.php))

#### 4. mine-extension:download

下载远程插件到本地。

```bash
php bin/hyperf.php mine-extension:download --name=plugin-name [options]
```

**参数**:
| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| --name | string | 是 | 插件名称 |
| --version | string | 否 | 指定版本 |
| --force | bool | 否 | 强制覆盖已存在的插件 |

**实现类**: `Mine\AppStore\Command\DownloadCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/DownloadCommand.php))

#### 5. mine-extension:install

安装指定插件。

```bash
php bin/hyperf.php mine-extension:install {path} [options]
```

**参数**:
| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| path | string | 是 | 插件路径 (vendor/plugin-name) |
| --yes | bool | 否 | 跳过确认提示 |
| --force | bool | 否 | 强制重新安装 |
| --skip-dependencies | bool | 否 | 跳过依赖检查 |

**示例**:
```bash
# 安装插件
php bin/hyperf.php mine-extension:install mineadmin/user-manager --yes

# 强制重新安装
php bin/hyperf.php mine-extension:install mineadmin/user-manager --force
```

**实现类**: `Mine\AppStore\Command\InstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InstallCommand.php))

#### 6. mine-extension:uninstall

卸载指定插件。

```bash
php bin/hyperf.php mine-extension:uninstall {path} [options]
```

**参数**:
| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| path | string | 是 | 插件路径 |
| --yes | bool | 否 | 跳过确认提示 |
| --force | bool | 否 | 强制卸载 (忽略错误) |
| --keep-data | bool | 否 | 保留用户数据 |

**实现类**: `Mine\AppStore\Command\UninstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/UninstallCommand.php))

#### 7. mine-extension:create

创建新插件。

```bash
php bin/hyperf.php mine-extension:create {path} [options]
```

**参数**:
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| path | string | - | 插件路径 (vendor/plugin-name) |
| --name | string | example | 插件显示名称 |
| --type | string | mixed | 插件类型 (mixed/backend/frontend) |
| --author | string | - | 作者名称 |
| --description | string | - | 插件描述 |
| --license | string | MIT | 许可证类型 |

**示例**:
```bash
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "我的第一个插件"
```

**实现类**: `Mine\AppStore\Command\CreateCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/CreateCommand.php))

## 核心类库 API

### Plugin 类

**文件位置**: `Mine\AppStore\Plugin` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Plugin.php))

插件系统的核心类，负责插件的加载和管理。

#### Plugin::init()

初始化插件系统，在应用启动时调用。

```php
<?php

use Mine\AppStore\Plugin;

// 初始化插件系统
Plugin::init();
```

**功能**:
- 扫描 `plugin/` 目录
- 加载已安装的插件
- 注册 ConfigProvider
- 自动加载插件类

#### Plugin::getInstalled()

获取已安装的插件列表。

```php
<?php

use Mine\AppStore\Plugin;

// 获取所有已安装插件
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

检查插件是否已安装。

```php
<?php

use Mine\AppStore\Plugin;

// 检查插件是否已安装
if (Plugin::isInstalled('vendor/plugin-name')) {
    // 插件已安装
}
```

#### Plugin::getConfig()

获取插件配置信息。

```php
<?php

use Mine\AppStore\Plugin;

// 获取插件配置
$config = Plugin::getConfig('vendor/plugin-name');

// 返回 mine.json 解析后的数组
```

### ExtensionManager 类

**文件位置**: `app/Service/ExtensionManager.php`

负责插件的具体安装、卸载、更新操作。

#### install()

安装插件。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 安装插件
$result = $manager->install('vendor/plugin-name', [
    'force' => false,
    'skip_dependencies' => false
]);

if ($result['success']) {
    echo "安装成功";
} else {
    echo "安装失败: " . $result['message'];
}
```

#### uninstall()

卸载插件。

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// 卸载插件
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

### ConfigProvider 基类

所有插件的 ConfigProvider 都应该遵循以下接口：

```php
<?php

namespace Plugin\Vendor\PluginName;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            // 依赖注入配置
            'dependencies' => [
                InterfaceA::class => ImplementationA::class,
            ],
            
            // 注解扫描路径
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
            
            // 事件监听器
            'listeners' => [
                CustomListener::class,
            ],
            
            // 中间件
            'middlewares' => [
                'http' => [
                    CustomMiddleware::class,
                ],
            ],
            
            // 配置文件发布
            'publish' => [
                [
                    'id' => 'config-id',
                    'description' => '配置文件描述',
                    'source' => __DIR__ . '/../publish/config.php',
                    'destination' => BASE_PATH . '/config/autoload/plugin.php',
                ],
            ],
            
            // 进程配置
            'processes' => [
                CustomProcess::class,
            ],
        ];
    }
}
```

## HTTP API

### 插件管理接口

#### 获取插件列表

```http
GET /admin/plugin/list
```

**请求参数**:
```json
{
  "page": 1,
  "pageSize": 15,
  "type": "mixed",
  "status": "enabled",
  "keyword": "search term"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "name": "vendor/plugin-name",
        "display_name": "插件显示名称",
        "version": "1.0.0",
        "description": "插件描述",
        "author": "作者名称",
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

#### 安装插件

```http
POST /admin/plugin/install
```

**请求参数**:
```json
{
  "name": "vendor/plugin-name",
  "version": "1.0.0",
  "force": false
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "安装成功",
  "data": {
    "plugin": "vendor/plugin-name",
    "version": "1.0.0",
    "installed_at": "2024-01-01 12:00:00"
  }
}
```

#### 卸载插件

```http
DELETE /admin/plugin/uninstall
```

**请求参数**:
```json
{
  "name": "vendor/plugin-name",
  "keep_data": false
}
```

#### 启用/禁用插件

```http
PUT /admin/plugin/toggle-status
```

**请求参数**:
```json
{
  "name": "vendor/plugin-name",
  "status": "enabled"  // enabled | disabled
}
```

## 事件 API

### 插件事件系统

插件系统提供了丰富的事件钩子，允许开发者在插件生命周期的关键节点执行自定义逻辑。

#### 事件类型

```php
<?php

namespace App\Event\Plugin;

// 插件安装前事件
class BeforeInstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $config,
        public array $options = []
    ) {}
}

// 插件安装后事件
class AfterInstallEvent
{
    public function __construct(
        public string $pluginName,
        public string $version,
        public bool $success,
        public ?string $error = null
    ) {}
}

// 插件卸载前事件
class BeforeUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $options = []
    ) {}
}

// 插件卸载后事件
class AfterUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public bool $success,
        public ?string $error = null
    ) {}
}
```

#### 事件监听器示例

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
            // 插件安装成功后的处理
            $this->clearCache();
            $this->sendNotification($event->pluginName);
            $this->updateStatistics($event->pluginName);
        } else {
            // 安装失败的处理
            logger()->error('插件安装失败', [
                'plugin' => $event->pluginName,
                'error' => $event->error
            ]);
        }
    }
}
```

## 钩子 API

### 插件钩子系统

MineAdmin 提供了钩子系统，允许插件在系统关键点注入自定义逻辑。

#### 注册钩子

```php
<?php

use App\Hook\HookManager;

// 在 ConfigProvider 中注册钩子
class ConfigProvider
{
    public function __invoke(): array
    {
        // 注册钩子
        HookManager::register('user.login.before', function($user) {
            // 用户登录前的处理逻辑
            logger()->info('用户尝试登录', ['user_id' => $user->id]);
        });
        
        HookManager::register('user.login.after', function($user) {
            // 用户登录后的处理逻辑
            $this->recordLoginHistory($user);
        });
        
        return [
            // ... 其他配置
        ];
    }
}
```

#### 触发钩子

```php
<?php

use App\Hook\HookManager;

// 在系统代码中触发钩子
class UserService
{
    public function login(array $credentials): bool
    {
        // 登录前钩子
        HookManager::trigger('user.login.before', $user);
        
        // 执行登录逻辑
        $result = $this->authenticate($credentials);
        
        if ($result) {
            // 登录后钩子
            HookManager::trigger('user.login.after', $user);
        }
        
        return $result;
    }
}
```

#### 可用钩子列表

| 钩子名称 | 触发时机 | 参数 |
|----------|----------|------|
| `user.login.before` | 用户登录前 | User $user |
| `user.login.after` | 用户登录后 | User $user |
| `user.logout.before` | 用户退出前 | User $user |
| `user.logout.after` | 用户退出后 | User $user |
| `menu.render.before` | 菜单渲染前 | array $menus |
| `menu.render.after` | 菜单渲染后 | array $menus |
| `permission.check.before` | 权限检查前 | string $permission, User $user |
| `permission.check.after` | 权限检查后 | bool $result, string $permission, User $user |

## 工具类 API

### PluginHelper 类

提供插件开发的常用工具方法。

```php
<?php

namespace App\Helper;

class PluginHelper
{
    /**
     * 获取插件根路径
     */
    public static function getPluginPath(string $pluginName): string
    {
        return BASE_PATH . '/plugin/' . str_replace('/', DIRECTORY_SEPARATOR, $pluginName);
    }
    
    /**
     * 获取插件配置
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
     * 检查插件是否已安装
     */
    public static function isInstalled(string $pluginName): bool
    {
        $lockFile = self::getPluginPath($pluginName) . '/install.lock';
        return file_exists($lockFile);
    }
    
    /**
     * 获取插件版本
     */
    public static function getVersion(string $pluginName): ?string
    {
        $config = self::getPluginConfig($pluginName);
        return $config['version'] ?? null;
    }
    
    /**
     * 获取插件资源 URL
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

// 获取插件路径
$path = PluginHelper::getPluginPath('vendor/plugin-name');

// 检查插件是否已安装
if (PluginHelper::isInstalled('vendor/plugin-name')) {
    // 获取插件版本
    $version = PluginHelper::getVersion('vendor/plugin-name');
    
    // 获取资源 URL
    $cssUrl = PluginHelper::getAssetUrl('vendor/plugin-name', 'style.css');
}
```

## 错误码参考

### 插件安装错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 10001 | 插件目录不存在 | 检查插件路径是否正确 |
| 10002 | mine.json 文件不存在 | 确保插件包含配置文件 |
| 10003 | mine.json 格式错误 | 检查 JSON 语法 |
| 10004 | 依赖插件未安装 | 先安装依赖插件 |
| 10005 | 版本冲突 | 解决版本兼容性问题 |
| 10006 | 数据库迁移失败 | 检查数据库连接和权限 |
| 10007 | 文件复制失败 | 检查文件权限 |
| 10008 | 安装脚本执行失败 | 查看安装脚本错误日志 |

### 插件卸载错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 20001 | 插件未安装 | 无需卸载 |
| 20002 | 存在依赖插件 | 先卸载依赖插件或使用强制卸载 |
| 20003 | 卸载脚本执行失败 | 查看卸载脚本错误日志 |
| 20004 | 数据库清理失败 | 手动清理数据库数据 |
| 20005 | 文件删除失败 | 检查文件权限 |

## 相关文档

- [插件开发指南](./develop.md) - 详细开发流程
- [插件结构说明](./structure.md) - 目录结构规范
- [生命周期管理](./lifecycle.md) - 安装卸载流程
- [示例代码](./examples.md) - 实际案例