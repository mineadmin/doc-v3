# Plugin Lifecycle Management

Detailed introduction to MineAdmin plugin lifecycle management, covering the complete process of installation, enabling, disabling, updating, and uninstallation.

## Lifecycle Overview

The lifecycle of a MineAdmin plugin includes the following stages:

```plantuml
@startuml
!define RECTANGLE class

state "Uninstalled" as uninstalled
state "Downloaded" as downloaded  
state "Installed" as installed
state "Enabled" as enabled
state "Disabled" as disabled
state "Update Needed" as needUpdate
state "Uninstalled" as uninstalled2

[*] --> uninstalled
uninstalled --> downloaded : mine-extension:download
downloaded --> installed : mine-extension:install
installed --> enabled : Auto-enable
enabled --> disabled : Disable plugin
disabled --> enabled : Enable plugin
enabled --> needUpdate : New version detected
needUpdate --> enabled : mine-extension:update
enabled --> uninstalled2 : mine-extension:uninstall
disabled --> uninstalled2 : mine-extension:uninstall
uninstalled2 --> [*]

note right of installed : Execute InstallScript
note right of uninstalled2 : Execute UninstallScript

@enduml
```

## Plugin Discovery and Loading

### 1. Plugin Discovery Mechanism

**Core Implementation**: `Plugin::init()` method called in `bin/hyperf.php` ([GitHub](https://github.com/mineadmin/mineadmin/blob/master/bin/hyperf.php))

```plantuml
@startuml
participant "Application" as app
participant "Plugin::init()" as plugin
participant "ConfigProvider" as config
participant "Hyperf Container" as container

app -> plugin : Called on application startup
plugin -> plugin : Scan plugin/ directory
plugin -> plugin : Read mine.json configuration
plugin -> config : Load ConfigProvider
config -> container : Register services with container
container -> app : Services available

note right of plugin : Only load installed plugins\n(install.lock file exists)

@enduml
```

### 2. Loading Process Details

1. **Scan Plugin Directory**: Iterate through all subdirectories under `plugin/`
2. **Check Installation Status**: Verify if `install.lock` file exists
3. **Read Configuration**: Parse `mine.json` configuration file
4. **Load ConfigProvider**: Register plugin services into the Hyperf container
5. **Register Routes**: Automatically register controller routes
6. **Load Middleware**: Register plugin middleware
7. **Register Event Listeners**: Load event listeners

## Download Phase

### Command Usage

```bash
# Download a specific plugin
php bin/hyperf.php mine-extension:download --name plugin-name

# View downloadable plugins list
php bin/hyperf.php mine-extension:list
```

### Download Process

1. **Validate AccessToken**: Check the `MINE_ACCESS_TOKEN` environment variable
2. **Request Remote Repository**: Fetch plugin information from the official MineAdmin repository
3. **Download Plugin Package**: Download the compressed package to a local temporary directory
4. **Extract Files**: Extract to `plugin/vendor/plugin-name/` directory
5. **Verify Integrity**: Check if `mine.json` file exists and is properly formatted

### Implementation Principle

**Core Service**: App-Store component ([GitHub](https://github.com/mineadmin/appstore)) provides download functionality

```php
// Pseudo-code example
class DownloadService 
{
    public function download(string $pluginName): bool
    {
        // 1. Validate access token
        $this->validateAccessToken();
        
        // 2. Get plugin info
        $pluginInfo = $this->getPluginInfo($pluginName);
        
        // 3. Download plugin package
        $packagePath = $this->downloadPackage($pluginInfo['download_url']);
        
        // 4. Extract to target directory
        $this->extractPackage($packagePath, $this->getPluginPath($pluginName));
        
        return true;
    }
}
```

## Installation Phase

### Command Usage

```bash
# Install a plugin
php bin/hyperf.php mine-extension:install vendor/plugin-name --yes

# Force reinstallation
php bin/hyperf.php mine-extension:install vendor/plugin-name --force
```

### Installation Process Details

> ⚠️ **Important Note**: Configuration file publishing, environment detection, and database migrations should be handled in `InstallScript`, not relying on ConfigProvider's publish functionality.

```plantuml
@startuml
start

:Check plugin directory;
if (Directory exists?) then (yes)
  :Read mine.json configuration;
  if (Configuration valid?) then (yes)
    :Check dependencies;
    if (Dependencies met?) then (yes)
      :Install Composer dependencies;
      :Copy frontend files;
      #pink:Execute InstallScript;
      note right
        Handle in InstallScript:
        - Environment detection
        - Configuration file publishing
        - Database migrations
        - Initial data seeding
      end note
      if (InstallScript successful?) then (yes)
        :Create install.lock;
        :Register in plugin list;
        :Trigger installation event;
        :Clear cache;
        stop
      else (failed)
        :Rollback operations;
        :Clean temporary files;
        stop
      endif
    else (not met)
      :Prompt to install dependency plugins;
      stop
    endif
  else (invalid)
    :Report configuration error;
    stop
  endif
else (no)
  :Report plugin not found;
  stop
endif

@enduml
```

### 1. Prerequisite Checks

```php
// Installation check logic
class InstallChecker
{
    public function check(string $pluginPath): array
    {
        $errors = [];
        
        // Check plugin directory
        if (!is_dir($pluginPath)) {
            $errors[] = 'Plugin directory does not exist';
        }
        
        // Check mine.json
        $configPath = $pluginPath . '/mine.json';
        if (!file_exists($configPath)) {
            $errors[] = 'mine.json configuration file does not exist';
        }
        
        // Check dependencies
        $config = json_decode(file_get_contents($configPath), true);
        foreach ($config['require'] ?? [] as $dependency => $version) {
            if (!$this->isDependencyMet($dependency, $version)) {
                $errors[] = "Dependency {$dependency} version {$version} not satisfied";
            }
        }
        
        return $errors;
    }
}
```

### 2. Composer Dependency Installation

The installation process handles the plugin's Composer dependencies:

```json
// composer configuration in mine.json
{
  "composer": {
    "require": {
      "hyperf/async-queue": "^3.0",
      "symfony/console": "^6.0"
    },
    "psr-4": {
      "Plugin\\Vendor\\PluginName\\": "src"
    }
  }
}
```

The system will automatically execute:
```bash
composer require hyperf/async-queue:^3.0 symfony/console:^6.0
```

### 3. InstallScript Handling ⭐

> **Best Practice**: Database migrations, configuration publishing, and environment detection should be handled in `InstallScript`:

```php
// Handle all installation logic in InstallScript
class InstallScript
{
    public function handle(): bool
    {
        // 1. Environment detection
        if (!$this->checkEnvironment()) {
            echo "Environment requirements not met\n";
            return false;
        }
        
        // 2. Publish configuration files (do not use ConfigProvider's publish)
        $this->publishConfig();
        
        // 3. Execute database migrations
        if (!$this->runMigrations()) {
            echo "Database migration failed\n";
            return false;
        }
        
        // 4. Initialize data
        $this->seedData();
        
        return true;
    }
    
    private function publishConfig(): void
    {
        $source = __DIR__ . '/../publish/config/plugin.php';
        $target = BASE_PATH . '/config/autoload/plugin.php';
        
        if (!file_exists($target)) {
            copy($source, $target);
            echo "Configuration file published\n";
        }
    }
    
    private function runMigrations(): bool
    {
        $migrationPath = __DIR__ . '/../Database/Migrations';
        
        if (is_dir($migrationPath)) {
            // Use Hyperf's migration command
            $container = \Hyperf\Context\ApplicationContext::getContainer();
            $application = $container->get(\Hyperf\Contract\ApplicationInterface::class);
            
            $input = new \Symfony\Component\Console\Input\ArrayInput([
                'command' => 'migrate',
                '--path' => $migrationPath,
            ]);
            
            $output = new \Symfony\Component\Console\Output\BufferedOutput();
            $exitCode = $application->run($input, $output);
            
            return $exitCode === 0;
        }
        
        return true;
    }
}
```

### 4. Frontend File Copying

Copy files from the `web/` directory to the frontend project:

```
plugin/vendor/plugin-name/web/    →    Frontend project corresponding directory
├── views/example.vue             →    src/views/plugin/vendor/plugin-name/example.vue
├── components/ExampleComp.vue    →    src/components/plugin/vendor/plugin-name/ExampleComp.vue
└── api/example.js                →    src/api/plugin/vendor/plugin-name/example.js
```

### 5. Configuration File Publishing ⚠️

> **Note**: The `publish` functionality in ConfigProvider is unreliable in the plugin system and should be handled manually in InstallScript:

```php
// Not recommended: ConfigProvider's publish may not take effect
'publish' => [
    // This method may not execute in plugins
]

// Recommended: Publish manually in InstallScript
protected function publishConfig(): void
{
    $configs = [
        [
            'source' => __DIR__ . '/../publish/config/plugin.php',
            'target' => BASE_PATH . '/config/autoload/plugin.php',
        ],
        [
            'source' => __DIR__ . '/../publish/config/routes.php',
            'target' => BASE_PATH . '/config/routes/plugin.php',
        ],
    ];
    
    foreach ($configs as $config) {
        if (!file_exists($config['target'])) {
            copy($config['source'], $config['target']);
            echo "Configuration file published: {$config['target']}\n";
        }
    }
}
```

### 6. Creating the Installation Lock File

After successful installation, create the `install.lock` file to mark the installation status:

```
plugin/vendor/plugin-name/install.lock
```

File content contains installation information:
```json
{
  "installed_at": "2024-01-01 12:00:00",
  "version": "1.0.0",
  "installer": "admin",
  "checksum": "abc123..."
}
```

## Enable/Disable Management

### Plugin Status Control

MineAdmin supports temporarily disabling plugins without uninstalling them:

```bash
# Disable a plugin
php bin/hyperf.php mine-extension:disable vendor/plugin-name

# Enable a plugin  
php bin/hyperf.php mine-extension:enable vendor/plugin-name

# Check plugin status
php bin/hyperf.php mine-extension:status vendor/plugin-name
```

### Status Management Mechanism

Status information is stored in the `install.lock` file:

```json
{
  "installed_at": "2024-01-01 12:00:00",
  "version": "1.0.0",
  "status": "enabled",  // enabled | disabled
  "disabled_at": null,
  "disabled_reason": null
}
```

## Update Phase

### Update Check

```bash
# Check for plugin updates
php bin/hyperf.php mine-extension:check-updates

# Update a specific plugin
php bin/hyperf.php mine-extension:update vendor/plugin-name

# Update all plugins
php bin/hyperf.php mine-extension:update-all
```

### Update Process

```plantuml
@startuml
start

:Check remote version;
if (New version available?) then (yes)
  :Backup current plugin;
  :Download new version;
  :Verify integrity;
  :Execute pre-update script;
  :Replace plugin files;
  :Execute database migrations;
  :Update configuration files;
  :Execute post-update script;
  if (Update successful?) then (yes)
    :Update version information;
    :Clean backup;
    :Trigger update event;
    stop
  else (failed)
    :Restore backup;
    :Report error;
    stop
  endif
else (no)
  :No update needed;
  stop
endif

@enduml
```

### Version Compatibility Handling

Version compatibility is checked during updates:

```php
class UpdateManager
{
    public function checkCompatibility(string $currentVersion, string $newVersion): bool
    {
        // Check major version compatibility
        $current = $this->parseVersion($currentVersion);
        $new = $this->parseVersion($newVersion);
        
        // Different major versions may contain breaking changes
        if ($current['major'] !== $new['major']) {
            return $this->checkBreakingChanges($currentVersion, $newVersion);
        }
        
        return true;
    }
}
```

## Uninstallation Phase

### Command Usage

```bash
# Uninstall a plugin
php bin/hyperf.php mine-extension:uninstall vendor/plugin-name --yes

# Force uninstall (ignore errors)
php bin/hyperf.php mine-extension:uninstall vendor/plugin-name --force
```

### Uninstallation Process

```plantuml
@startuml
start

:Check plugin status;
if (Plugin installed?) then (yes)
  :Check dependencies;
  if (Other plugins depend on it?) then (yes)
    :Show dependency conflict;
    if (Force uninstall?) then (yes)
      :Continue uninstall;
    else (no)
      :Cancel uninstall;
      stop
    endif
  endif
  
  :Execute UninstallScript;
  :Delete database tables;
  :Clean configuration files;
  :Delete frontend files;
  :Clear cache;
  :Remove Composer dependencies;
  :Delete plugin directory;
  :Clean registration info;
  :Trigger uninstall event;
  stop
else (no)
  :Plugin not installed;
  stop
endif

@enduml
```

### Uninstallation Script Execution

```php
// UninstallScript example
class UninstallScript
{
    public function handle(): bool
    {
        try {
            // 1. Clean database
            $this->cleanDatabase();
            
            // 2. Clean configuration files
            $this->cleanConfigFiles();
            
            // 3. Clean cached data
            $this->cleanCache();
            
            // 4. Clean log files
            $this->cleanLogs();
            
            // 5. Execute custom cleanup logic
            $this->customCleanup();
            
            return true;
        } catch (\Exception $e) {
            logger()->error('Plugin uninstall failed: ' . $e->getMessage());
            return false;
        }
    }
    
    private function cleanDatabase(): void
    {
        // Delete plugin-related tables
        DB::statement('DROP TABLE IF EXISTS plugin_example');
        
        // Clean configuration data
        DB::table('system_config')->where('key', 'like', 'plugin.example.%')->delete();
    }
}
```

## Error Handling and Rollback

### Installation Error Rollback

If an error occurs during the installation, the system will automatically roll back:

```php
class InstallRollback
{
    public function rollback(string $pluginPath, array $operations): void
    {
        foreach (array_reverse($operations) as $operation) {
            try {
                switch ($operation['type']) {
                    case 'database':
                        $this->rollbackDatabase($operation['data']);
                        break;
                    case 'files':
                        $this->rollbackFiles($operation['data']);
                        break;
                    case 'config':
                        $this->rollbackConfig($operation['data']);
                        break;
                }
            } catch (\Exception $e) {
                logger()->error('Rollback operation failed: ' . $e->getMessage());
            }
        }
    }
}
```

### Dependency Conflict Handling

Strategy for handling dependency conflicts between plugins:

```php
class DependencyResolver
{
    public function resolveConflicts(array $conflicts): array
    {
        $solutions = [];
        
        foreach ($conflicts as $conflict) {
            $solution = match($conflict['type']) {
                'version_conflict' => $this->resolveVersionConflict($conflict),
                'circular_dependency' => $this->resolveCircularDependency($conflict),
                'missing_dependency' => $this->resolveMissingDependency($conflict),
                default => null
            };
            
            if ($solution) {
                $solutions[] = $solution;
            }
        }
        
        return $solutions;
    }
}
```

## Event System

Each stage of the plugin lifecycle triggers corresponding events:

### Event List

```php
// Plugin lifecycle events
class PluginEvents
{
    const BEFORE_INSTALL = 'plugin.before_install';
    const AFTER_INSTALL = 'plugin.after_install';
    const BEFORE_UNINSTALL = 'plugin.before_uninstall';
    const AFTER_UNINSTALL = 'plugin.after_uninstall';
    const BEFORE_UPDATE = 'plugin.before_update';
    const AFTER_UPDATE = 'plugin.after_update';
    const ENABLED = 'plugin.enabled';
    const DISABLED = 'plugin.disabled';
}
```

### Event Listener Example

```php
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;

#[Listener]
class PluginInstallListener implements ListenerInterface
{
    public function listen(): array
    {
        return [
            PluginEvents::AFTER_INSTALL,
        ];
    }

    public function process(object $event): void
    {
        // Post-installation logic
        logger()->info('Plugin installation complete', [
            'plugin' => $event->getPluginName(),
            'version' => $event->getVersion()
        ]);
        
        // Clear cache
        $this->clearCache($event->getPluginName());
        
        // Send notification
        $this->sendNotification($event);
    }
}
```

## Status Query

### View Plugin Status

```bash
# View status of all local plugins
php bin/hyperf.php mine-extension:local-list

# View remotely available plugins
php bin/hyperf.php mine-extension:list

# View specific plugin details
php bin/hyperf.php mine-extension:info vendor/plugin-name
```

### Status Information Structure

```json
{
  "name": "vendor/plugin-name",
  "version": "1.0.0",
  "status": "enabled",
  "installed_at": "2024-01-01 12:00:00",
  "last_updated": "2024-01-15 10:30:00",
  "dependencies": [
    "vendor/dependency-plugin"
  ],
  "dependents": [
    "vendor/dependent-plugin"
  ],
  "file_integrity": "valid",
  "database_status": "migrated"
}
```

## Best Practices

### 1. Install Script Design

- Achieve idempotence: consistent results with multiple executions
- Provide detailed error messages
- Support transaction rollback
- Log operations

### 2. Uninstall Script Design  

- Completely clean plugin data
- Provide option to backup important user data
- Handle dependencies
- Graceful degradation

### 3. Version Management

- Follow semantic versioning conventions
- Provide upgrade path descriptions
- Mark breaking changes
- Maintain a changelog

## Related Documentation

- [Plugin Development Guide](./develop.md) - Development process
- [Plugin Structure Description](./structure.md) - Directory structure
- [API Reference](./api.md) - Interface documentation
- [Example Code](./examples.md) - Practical examples