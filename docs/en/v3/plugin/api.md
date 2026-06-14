# API Reference Documentation

This document details all API interfaces, command-line tools, and core class libraries of the MineAdmin plugin system.

## Command Line API

### Plugin Management Commands

#### 1. mine-extension:initial

Initialize the plugin extension system.

```bash
php bin/hyperf.php mine-extension:initial
```

**Functions**: 
- Publish app-store configuration files
- Initialize plugin system configuration
- Create necessary directory structures

**Implementation Class**: `Mine\AppStore\Command\InitialCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InitialCommand.php))

#### 2. mine-extension:list

Query the remote plugin list.

```bash
php bin/hyperf.php mine-extension:list [options]
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| --type | string | all | Filter extension type (mixed/backend/frontend) |
| --name | string | - | Filter extension name |
| --category | string | - | Filter category |
| --author | string | - | Filter author |

**Examples**:
```bash
# View all plugins
php bin/hyperf.php mine-extension:list

# View mixed-type plugins
php bin/hyperf.php mine-extension:list --type=mixed

# Search for a specific plugin
php bin/hyperf.php mine-extension:list --name=user-manager
```

**Implementation Class**: `Mine\AppStore\Command\ListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/ListCommand.php))

#### 3. mine-extension:local-list

Query all local plugins.

```bash
php bin/hyperf.php mine-extension:local-list [options]
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| --status | string | all | Filter status (installed/enabled/disabled) |
| --type | string | all | Filter type |

**Implementation Class**: `Mine\AppStore\Command\LocalListCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/LocalListCommand.php))

#### 4. mine-extension:download

Download a remote plugin locally.

```bash
php bin/hyperf.php mine-extension:download --name=plugin-name [options]
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| --name | string | Yes | Plugin name |
| --version | string | No | Specify version |
| --force | bool | No | Force overwrite existing plugin |

**Implementation Class**: `Mine\AppStore\Command\DownloadCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/DownloadCommand.php))

#### 5. mine-extension:install

Install a specified plugin.

```bash
php bin/hyperf.php mine-extension:install {path} [options]
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | string | Yes | Plugin path (vendor/plugin-name) |
| --yes | bool | No | Skip confirmation prompt |
| --force | bool | No | Force reinstallation |
| --skip-dependencies | bool | No | Skip dependency check |

**Examples**:
```bash
# Install a plugin
php bin/hyperf.php mine-extension:install mineadmin/user-manager --yes

# Force reinstallation
php bin/hyperf.php mine-extension:install mineadmin/user-manager --force
```

**Implementation Class**: `Mine\AppStore\Command\InstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/InstallCommand.php))

#### 6. mine-extension:uninstall

Uninstall a specified plugin.

```bash
php bin/hyperf.php mine-extension:uninstall {path} [options]
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | string | Yes | Plugin path |
| --yes | bool | No | Skip confirmation prompt |
| --force | bool | No | Force uninstall (ignore errors) |
| --keep-data | bool | No | Keep user data |

**Implementation Class**: `Mine\AppStore\Command\UninstallCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/UninstallCommand.php))

#### 7. mine-extension:create

Create a new plugin.

```bash
php bin/hyperf.php mine-extension:create {path} [options]
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| path | string | - | Plugin path (vendor/plugin-name) |
| --name | string | example | Plugin display name |
| --type | string | mixed | Plugin type (mixed/backend/frontend) |
| --author | string | - | Author name |
| --description | string | - | Plugin description |
| --license | string | MIT | License type |

**Examples**:
```bash
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "My first plugin"
```

**Implementation Class**: `Mine\AppStore\Command\CreateCommand` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Command/CreateCommand.php))

## Core Class Library API

### Plugin Class

**File Location**: `Mine\AppStore\Plugin` ([GitHub](https://github.com/mineadmin/appstore/blob/3.0/src/Plugin.php))

The core class of the plugin system, responsible for plugin loading and management.

#### Plugin::init()

Initialize the plugin system, called when the application starts.

```php
<?php

use Mine\AppStore\Plugin;

// Initialize the plugin system
Plugin::init();
```

**Functions**:
- Scan the `plugin/` directory
- Load installed plugins
- Register ConfigProvider
- Autoload plugin classes

#### Plugin::getInstalled()

Get the list of installed plugins.

```php
<?php

use Mine\AppStore\Plugin;

// Get all installed plugins
$plugins = Plugin::getInstalled();

// Return format
[
    'vendor/plugin-name' => [
        'name' => 'vendor/plugin-name',
        'version' => '1.0.0',
        'path' => '/path/to/plugin',
        'config' => [...], // mine.json configuration
        'status' => 'enabled'
    ]
]
```

#### Plugin::isInstalled()

Check if a plugin is installed.

```php
<?php

use Mine\AppStore\Plugin;

// Check if the plugin is installed
if (Plugin::isInstalled('vendor/plugin-name')) {
    // Plugin is installed
}
```

#### Plugin::getConfig()

Get plugin configuration information.

```php
<?php

use Mine\AppStore\Plugin;

// Get plugin configuration
$config = Plugin::getConfig('vendor/plugin-name');

// Returns the parsed array of mine.json
```

### ExtensionManager Class

**File Location**: `app/Service/ExtensionManager.php`

Responsible for specific plugin installation, uninstallation, and update operations.

#### install()

Install a plugin.

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// Install plugin
$result = $manager->install('vendor/plugin-name', [
    'force' => false,
    'skip_dependencies' => false
]);

if ($result['success']) {
    echo "Installation successful";
} else {
    echo "Installation failed: " . $result['message'];
}
```

#### uninstall()

Uninstall a plugin.

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// Uninstall plugin
$result = $manager->uninstall('vendor/plugin-name', [
    'force' => false,
    'keep_data' => false
]);
```

#### update()

Update a plugin.

```php
<?php

use App\Service\ExtensionManager;

$manager = new ExtensionManager();

// Update plugin
$result = $manager->update('vendor/plugin-name');
```

### ConfigProvider Base Class

All plugin ConfigProviders should adhere to the following interface:

```php
<?php

namespace Plugin\Vendor\PluginName;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            // Dependency injection configuration
            'dependencies' => [
                InterfaceA::class => ImplementationA::class,
            ],
            
            // Annotation scan paths
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            
            // Command line commands
            'commands' => [
                CustomCommand::class,
            ],
            
            // Event listeners
            'listeners' => [
                CustomListener::class,
            ],
            
            // Middleware
            'middlewares' => [
                'http' => [
                    CustomMiddleware::class,
                ],
            ],
            
            // Configuration file publishing
            'publish' => [
                [
                    'id' => 'config-id',
                    'description' => 'Configuration file description',
                    'source' => __DIR__ . '/../publish/config.php',
                    'destination' => BASE_PATH . '/config/autoload/plugin.php',
                ],
            ],
            
            // Process configuration
            'processes' => [
                CustomProcess::class,
            ],
        ];
    }
}
```

## HTTP API

### Plugin Management Interfaces

#### Get Plugin List

```http
GET /admin/plugin/list
```

**Request Parameters**:
```json
{
  "page": 1,
  "pageSize": 15,
  "type": "mixed",
  "status": "enabled",
  "keyword": "search term"
}
```

**Response Example**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "name": "vendor/plugin-name",
        "display_name": "Plugin Display Name",
        "version": "1.0.0",
        "description": "Plugin description",
        "author": "Author Name",
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

#### Install Plugin

```http
POST /admin/plugin/install
```

**Request Parameters**:
```json
{
  "name": "vendor/plugin-name",
  "version": "1.0.0",
  "force": false
}
```

**Response Example**:
```json
{
  "code": 200,
  "message": "Installation successful",
  "data": {
    "plugin": "vendor/plugin-name",
    "version": "1.0.0",
    "installed_at": "2024-01-01 12:00:00"
  }
}
```

#### Uninstall Plugin

```http
DELETE /admin/plugin/uninstall
```

**Request Parameters**:
```json
{
  "name": "vendor/plugin-name",
  "keep_data": false
}
```

#### Enable/Disable Plugin

```http
PUT /admin/plugin/toggle-status
```

**Request Parameters**:
```json
{
  "name": "vendor/plugin-name",
  "status": "enabled"  // enabled | disabled
}
```

## Event API

### Plugin Event System

The plugin system provides rich event hooks, allowing developers to execute custom logic at key points in the plugin lifecycle.

#### Event Types

```php
<?php

namespace App\Event\Plugin;

// Before plugin install event
class BeforeInstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $config,
        public array $options = []
    ) {}
}

// After plugin install event
class AfterInstallEvent
{
    public function __construct(
        public string $pluginName,
        public string $version,
        public bool $success,
        public ?string $error = null
    ) {}
}

// Before plugin uninstall event
class BeforeUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public array $options = []
    ) {}
}

// After plugin uninstall event
class AfterUninstallEvent
{
    public function __construct(
        public string $pluginName,
        public bool $success,
        public ?string $error = null
    ) {}
}
```

#### Event Listener Example

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
            // Processing after successful plugin installation
            $this->clearCache();
            $this->sendNotification($event->pluginName);
            $this->updateStatistics($event->pluginName);
        } else {
            // Processing for installation failure
            logger()->error('Plugin installation failed', [
                'plugin' => $event->pluginName,
                'error' => $event->error
            ]);
        }
    }
}
```

## Hook API

### Plugin Hook System

MineAdmin provides a hook system that allows plugins to inject custom logic at key system points.

#### Register Hooks

```php
<?php

use App\Hook\HookManager;

// Register hooks in ConfigProvider
class ConfigProvider
{
    public function __invoke(): array
    {
        // Register hooks
        HookManager::register('user.login.before', function($user) {
            // Processing logic before user login
            logger()->info('User attempting login', ['user_id' => $user->id]);
        });
        
        HookManager::register('user.login.after', function($user) {
            // Processing logic after user login
            $this->recordLoginHistory($user);
        });
        
        return [
            // ... other configuration
        ];
    }
}
```

#### Triggering Hooks

```php
<?php

use App\Hook\HookManager;

// Triggering hooks in system code
class UserService
{
    public function login(array $credentials): bool
    {
        // Before login hook
        HookManager::trigger('user.login.before', $user);
        
        // Execute login logic
        $result = $this->authenticate($credentials);
        
        if ($result) {
            // After login hook
            HookManager::trigger('user.login.after', $user);
        }
        
        return $result;
    }
}
```

#### Available Hook List

| Hook Name | Trigger Timing | Parameters |
|-----------|----------------|------------|
| `user.login.before` | Before user login | User $user |
| `user.login.after` | After user login | User $user |
| `user.logout.before` | Before user logout | User $user |
| `user.logout.after` | After user logout | User $user |
| `menu.render.before` | Before menu rendering | array $menus |
| `menu.render.after` | After menu rendering | array $menus |
| `permission.check.before` | Before permission check | string $permission, User $user |
| `permission.check.after` | After permission check | bool $result, string $permission, User $user |

## Utility Class API

### PluginHelper Class

Provides common utility methods for plugin development.

```php
<?php

namespace App\Helper;

class PluginHelper
{
    /**
     * Get the plugin root path
     */
    public static function getPluginPath(string $pluginName): string
    {
        return BASE_PATH . '/plugin/' . str_replace('/', DIRECTORY_SEPARATOR, $pluginName);
    }
    
    /**
     * Get plugin configuration
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
     * Check if the plugin is installed
     */
    public static function isInstalled(string $pluginName): bool
    {
        $lockFile = self::getPluginPath($pluginName) . '/install.lock';
        return file_exists($lockFile);
    }
    
    /**
     * Get the plugin version
     */
    public static function getVersion(string $pluginName): ?string
    {
        $config = self::getPluginConfig($pluginName);
        return $config['version'] ?? null;
    }
    
    /**
     * Get the plugin asset URL
     */
    public static function getAssetUrl(string $pluginName, string $asset): string
    {
        return "/plugin/{$pluginName}/assets/{$asset}";
    }
}
```

### Usage Examples

```php
<?php

use App\Helper\PluginHelper;

// Get plugin path
$path = PluginHelper::getPluginPath('vendor/plugin-name');

// Check if the plugin is installed
if (PluginHelper::isInstalled('vendor/plugin-name')) {
    // Get plugin version
    $version = PluginHelper::getVersion('vendor/plugin-name');
    
    // Get asset URL
    $cssUrl = PluginHelper::getAssetUrl('vendor/plugin-name', 'style.css');
}
```

## Error Code Reference

### Plugin Installation Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| 10001 | Plugin directory does not exist | Check if the plugin path is correct |
| 10002 | mine.json file does not exist | Ensure the plugin includes the configuration file |
| 10003 | mine.json format error | Check JSON syntax |
| 10004 | Dependent plugin not installed | Install the dependency plugin first |
| 10005 | Version conflict | Resolve version compatibility issues |
| 10006 | Database migration failed | Check database connection and permissions |
| 10007 | File copy failed | Check file permissions |
| 10008 | Installation script execution failed | Check the installation script error log |

### Plugin Uninstallation Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| 20001 | Plugin not installed | No need to uninstall |
| 20002 | Dependent plugins exist | Uninstall dependent plugins first or use force uninstall |
| 20003 | Uninstall script execution failed | Check the uninstall script error log |
| 20004 | Database cleanup failed | Manually clean up database data |
| 20005 | File deletion failed | Check file permissions |

## Related Documentation

- [Plugin Development Guide](./develop.md) - Detailed development process
- [Plugin Structure Description](./structure.md) - Directory structure specification
- [Lifecycle Management](./lifecycle.md) - Installation and uninstallation process
- [Example Code](./examples.md) - Practical cases