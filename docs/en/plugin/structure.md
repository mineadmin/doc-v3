# Plugin Directory Structure

A detailed explanation of MineAdmin plugin's standard directory structure, file specifications, and organizational approach.

## Standard Directory Structure

A complete MineAdmin plugin directory structure is as follows:

```
plugin/vendor/plugin-name/           # Plugin root directory
├── mine.json                        # Core plugin configuration file ⭐
├── README.md                        # Plugin documentation
├── LICENSE                          # License file
├── composer.json                    # Composer dependency config (optional)
├── src/                            # Backend source directory ⭐
│   ├── ConfigProvider.php          # Configuration provider ⭐
│   ├── InstallScript.php           # Installation script ⭐
│   ├── UninstallScript.php         # Uninstallation script ⭐
│   ├── Controller/                 # Controller directory
│   │   ├── AdminController.php     # Admin controller
│   │   └── ApiController.php       # API controller
│   ├── Service/                    # Service layer directory
│   │   └── ExampleService.php      # Business service class
│   ├── Repository/                 # Repository layer directory
│   │   └── ExampleRepository.php   # Data repository class
│   ├── Model/                      # Model directory
│   │   └── Example.php             # Data model
│   ├── Request/                    # Request validation directory
│   │   ├── CreateRequest.php       # Create request validation
│   │   └── UpdateRequest.php       # Update request validation
│   ├── Resource/                   # Resource transformation directory
│   │   └── ExampleResource.php     # Resource transformation class
│   ├── Middleware/                 # Middleware directory
│   │   └── ExampleMiddleware.php   # Custom middleware
│   ├── Command/                    # Command line directory
│   │   └── ExampleCommand.php      # Custom command
│   ├── Listener/                   # Event listener directory
│   │   └── ExampleListener.php     # Event listener
│   └── Exception/                  # Exception handling directory
│       └── ExampleException.php    # Custom exception
├── web/                            # Frontend source directory ⭐
│   ├── views/                      # Page components directory
│   │   ├── index.vue               # Main page
│   │   ├── list.vue                # List page
│   │   └── form.vue                # Form page
│   ├── components/                 # Common components directory
│   │   └── ExampleComponent.vue    # Shared component
│   ├── api/                        # API interface directory
│   │   └── example.js              # Interface definition
│   ├── router/                     # Routing configuration directory
│   │   └── index.js                # Routing configuration
│   ├── store/                      # State management directory
│   │   └── example.js              # State management
│   └── assets/                     # Static resources directory
│       ├── images/                 # Image resources
│       └── styles/                 # Style files
├── Database/                       # Database-related directory ⭐
│   ├── Migrations/                 # Database migration files
│   │   └── 2024_01_01_000000_create_example_table.php
│   └── Seeders/                    # Data seeder files
│       └── ExampleSeeder.php       # Data seeder class
├── config/                         # Configuration file directory
│   └── example.php                 # Plugin configuration file
├── publish/                        # Publish files directory
│   ├── config/                     # Configuration file templates
│   │   └── example.php             # Configuration file template
│   └── assets/                     # Static resource templates
├── tests/                          # Test files directory
│   ├── Unit/                       # Unit tests
│   ├── Feature/                    # Feature tests
│   └── TestCase.php                # Test base class
├── docs/                           # Documentation directory
│   ├── installation.md             # Installation docs
│   ├── usage.md                    # Usage docs
│   └── api.md                      # API docs
└── .gitignore                      # Git ignore file
```

## Core File Details

### 1. mine.json (Plugin Configuration File)

**File Path**: `mine.json` ([Configuration Details](./mineJson.md))

Core configuration file defining plugin metadata, dependencies and loading configuration:

```json
{
  "name": "vendor/plugin-name",
  "description": "Plugin description",
  "version": "1.0.0",
  "type": "mixed",
  "author": [
    {
      "name": "Author Name",
      "email": "author@example.com",
      "role": "developer"
    }
  ],
  "keywords": ["mineadmin", "plugin"],
  "homepage": "https://github.com/vendor/plugin-name",
  "license": "MIT",
  "require": {
    "php": ">=8.1",
    "hyperf/framework": "^3.0"
  },
  "package": {
    "dependencies": {
      "vue": "^3.0",
      "element-plus": "^2.0"
    }
  },
  "composer": {
    "require": {
      "hyperf/async-queue": "^3.0"
    },
    "psr-4": {
      "Plugin\\Vendor\\PluginName\\": "src"
    },
    "config": "Plugin\\Vendor\\PluginName\\ConfigProvider"
  }
}
```

### 2. ConfigProvider.php (Configuration Provider)

**File Path**: `src/ConfigProvider.php`
**Implementation**: Based on Hyperf ConfigProvider mechanism ([GitHub](https://github.com/hyperf/hyperf/blob/master/src/config-provider/src/ConfigProvider.php))

> ⚠️ **Note**: The `publish` feature in ConfigProvider has issues in plugin system, recommend handling config publishing in InstallScript.

```php
<?php

namespace Plugin\Vendor\PluginName;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => [],
            'annotations' => [
                'scan' => [
                    'paths' => [__DIR__],
                ],
            ],
            'commands' => [],
            'listeners' => [],
            // publish feature not recommended in plugins
            // Handle config publishing in InstallScript instead
        ];
    }
}
```

### 3. InstallScript.php (Installation Script) ⭐

**File Path**: `src/InstallScript.php`
**Execution Timing**: When running `mine-extension:install` command
**Importance**: Recommended for handling config publishing, environment checks and database migrations

```php
<?php

namespace Plugin\Vendor\PluginName;

use Hyperf\Contract\ApplicationInterface;
use Hyperf\Database\Commands\Migrations\MigrateCommand;

class InstallScript
{
    public function handle(): bool
    {
        // 1. Environment checks
        if (!$this->checkEnvironment()) {
            echo "Environment check failed\n";
            return false;
        }
        
        // 2. Publish config files
        $this->publishConfig();
        
        // 3. Run database migrations
        $this->runMigrations();
        
        // 4. Initialize data
        $this->seedData();
        
        echo "Plugin installed successfully\n";
        return true;
    }
    
    protected function checkEnvironment(): bool
    {
        // Check PHP version
        if (version_compare(PHP_VERSION, '8.1.0', '<')) {
            echo "PHP version needs >= 8.1\n";
            return false;
        }
        
        // Check required extensions
        $requiredExtensions = ['redis', 'pdo', 'json'];
        foreach ($requiredExtensions as $ext) {
            if (!extension_loaded($ext)) {
                echo "Missing PHP extension: {$ext}\n";
                return false;
            }
        }
        
        return true;
    }
    
    protected function publishConfig(): void
    {
        $source = __DIR__ . '/../publish/config/plugin.php';
        $target = BASE_PATH . '/config/autoload/plugin.php';
        
        if (!file_exists($target)) {
            copy($source, $target);
            echo "Config file published: {$target}\n";
        }
    }
    
    protected function runMigrations(): void
    {
        $migrationPath = __DIR__ . '/../Database/Migrations';
        
        if (is_dir($migrationPath)) {
            // Execute migration command
            $container = \Hyperf\Context\ApplicationContext::getContainer();
            $application = $container->get(ApplicationInterface::class);
            $application->setAutoExit(false);
            
            $input = new \Symfony\Component\Console\Input\ArrayInput([
                'command' => 'migrate',
                '--path' => $migrationPath,
            ]);
            
            $output = new \Symfony\Component\Console\Output\BufferedOutput();
            $application->run($input, $output);
            
            echo "Database migrations completed\n";
        }
    }
    
    protected function seedData(): void
    {
        // Initialize default data
        // e.g. create default configs, menus etc.
    }
}
```

### 4. UninstallScript.php (Uninstallation Script) ⭐

**File Path**: `src/UninstallScript.php`
**Execution Timing**: When running `mine-extension:uninstall` command
**Importance**: Cleans up config files, database tables and related resources

```php
<?php

namespace Plugin\Vendor\PluginName;

use Hyperf\DbConnection\Db;

class UninstallScript
{
    public function handle(): bool
    {
        // 1. Backup important data (optional)
        $this->backupData();
        
        // 2. Drop database tables
        $this->dropTables();
        
        // 3. Clean up config files
        $this->removeConfig();
        
        // 4. Clear cache
        $this->clearCache();
        
        echo "Plugin uninstalled\n";
        return true;
    }
    
    protected function backupData(): void
    {
        // Backup important data to specified directory
        $backupPath = BASE_PATH . '/runtime/backup/plugin_' . date('YmdHis') . '.sql';
        // Implement backup logic
    }
    
    protected function dropTables(): void
    {
        // Drop plugin-created database tables
        $tables = ['plugin_example_table', 'plugin_settings'];
        
        foreach ($tables as $table) {
            if (Db::schema()->hasTable($table)) {
                Db::schema()->drop($table);
                echo "Dropped table: {$table}\n";
            }
        }
    }
    
    protected function removeConfig(): void
    {
        $configFile = BASE_PATH . '/config/autoload/plugin.php';
        
        if (file_exists($configFile)) {
            unlink($configFile);
            echo "Config file removed: {$configFile}\n";
        }
    }
    
    protected function clearCache(): void
    {
        // Clear plugin-related cache
        $redis = \Hyperf\Context\ApplicationContext::getContainer()
            ->get(\Hyperf\Redis\Redis::class);
        
        $redis->del('plugin:cache:*');
        echo "Cache cleared\n";
    }
}
```

## Directory Structure Diagram

```plantuml
@startuml
!define FOLDER rectangle
!define FILE rectangle

FOLDER "Plugin Root" as root {
  FILE "mine.json" as config
  FOLDER "src/" as src {
    FILE "ConfigProvider.php" as provider
    FILE "InstallScript.php" as install
    FILE "UninstallScript.php" as uninstall
    FOLDER "Controller/" as controller
    FOLDER "Service/" as service
    FOLDER "Model/" as model
  }
  FOLDER "web/" as web {
    FOLDER "views/" as views
    FOLDER "components/" as components
    FOLDER "api/" as api
  }
  FOLDER "Database/" as database {
    FOLDER "Migrations/" as migrations
    FOLDER "Seeders/" as seeders
  }
}

config --> provider : Config loading
provider --> install : Called during install
provider --> uninstall : Called during uninstall
web --> views : Frontend pages
database --> migrations : Database schema
database --> seeders : Initial data

@enduml
```

## Structure Differences by Plugin Type

### Mixed (Hybrid Plugin)
Contains complete `src/` and `web/` directories, providing full frontend+backend functionality.

### Backend (Backend Plugin)
Only contains `src/` directory, focused on API services and business logic:

```
plugin/vendor/backend-plugin/
├── mine.json
├── src/
│   ├── ConfigProvider.php
│   ├── Controller/
│   ├── Service/
│   └── Model/
└── Database/
```

### Frontend (Frontend Plugin)
Only contains `web/` directory, focused on UI and interactions:

```
plugin/vendor/frontend-plugin/
├── mine.json
├── web/
│   ├── views/
│   ├── components/
│   └── assets/
└── src/
    └── ConfigProvider.php  # Minimal config
```

## Naming Conventions

### 1. Directory Naming
- Use lowercase with hyphens: `user-management`
- Avoid underscores and spaces

### 2. File Naming
- PHP class files use PascalCase: `UserController.php`
- Vue components use PascalCase: `UserList.vue`
- Config files use lowercase: `user.php`

### 3. Namespace Standards
Follow PSR-4 autoloading:

```php
// Plugin path: plugin/mineadmin/user-manager/
// Namespace: Plugin\MineAdmin\UserManager\
namespace Plugin\MineAdmin\UserManager\Controller;
```

## File Permissions and Security

### 1. File Permissions
```bash
# Set appropriate permissions
find plugin/ -type f -name "*.php" -exec chmod 644 {} \;
find plugin/ -type d -exec chmod 755 {} \;
```

### 2. Security Considerations
- Use environment variables for sensitive configs
- Avoid hardcoding secrets
- Validate and filter user input
- Use HTTPS for sensitive data

## Best Practices

### 1. File Organization
- Organize by feature modules
- Maintain clear structure
- Use meaningful filenames

### 2. Code Standards
- Follow PSR-12 coding standard
- Add proper comments
- Use type declarations

### 3. Version Control
- Use `.gitignore` for unnecessary files
- Create clear commit messages
- Use semantic versioning

## Example Project Structure

View official plugin structures:

**App-Store Plugin**: MineAdmin official app store plugin demonstrating standard hybrid structure

## FAQ

### Q: Where should plugin directories be placed?
A: Plugins should be placed in project root's `plugin/` directory, organized as `vendor/plugin-name`.

### Q: How to handle plugin dependencies?
A: Declare dependencies in `mine.json`'s `require` field.

### Q: Where do frontend files go after installation?
A: Files under `web/` are copied to frontend project's corresponding locations.

### Q: How are database migrations executed?
A: Call migration logic in `InstallScript.php` or use Hyperf's migration commands.