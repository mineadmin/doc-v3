# Quick Start Guide

This guide will help you quickly create your first MineAdmin plugin, covering the complete process from environment setup to plugin publishing.

## Prerequisites

Before you begin, ensure you have:

1. **Installed MineAdmin**: Make sure the MineAdmin system is running properly
2. **Familiarity with the tech stack**:
   - PHP 8.1+ and Hyperf framework
   - Vue 3 + TypeScript (if frontend development is needed)
   - Composer package manager

## Environment Configuration

### 1. Obtain AccessToken

AccessToken is required for plugin marketplace and developer features:

1. Log in to [MineAdmin Official Website](https://www.mineadmin.com/login)
2. Go to [Personal Center Settings](https://www.mineadmin.com/member/setting)
3. View and copy your AccessToken

### 2. Configure Environment Variables

Add the following to the `.env` file in the project root directory:

```ini
# MineAdmin AccessToken
MINE_ACCESS_TOKEN=YourAccessToken
```

### 3. Initialize the Plugin System

If using the plugin system for the first time, initialization is required:

```bash
# Initialize the plugin extension system (MineAdmin 3.0+ versions are initialized by default)
php bin/hyperf.php mine-extension:initial
```

## Create Your First Plugin

### 1. Create a Plugin Using Command Line

```bash
# Create a mixed-type plugin
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "My first MineAdmin plugin"
```

**Parameter Explanation**:
- `mycompany/hello-world`: Plugin path (namespace/plugin name)
- `--name`: Plugin display name
- `--type`: Plugin type (mixed/backend/frontend)
- `--author`: Author name
- `--description`: Plugin description

### 2. Generated Directory Structure

After execution, the following structure will be generated in `plugin/mycompany/hello-world/`:

```
plugin/mycompany/hello-world/
├── mine.json                    # Plugin configuration file
├── src/                         # Backend source directory
│   ├── ConfigProvider.php       # Configuration provider
│   ├── InstallScript.php        # Installation script
│   └── UninstallScript.php      # Uninstallation script
├── web/                         # Frontend source directory
└── Database/                    # Database related
    ├── Migrations/              # Database migrations
    └── Seeders/                 # Data seeders
```

## Develop Your Plugin

### 1. Configure Plugin Information

Edit the `mine.json` file to complete plugin information:

```json
{
  "name": "mycompany/hello-world",
  "description": "My first MineAdmin plugin",
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
      "Plugin\\MyCompany\\HelloWorld\\": "src"
    },
    "config": "Plugin\\MyCompany\\HelloWorld\\ConfigProvider"
  }
}
```

### 2. Implement the Configuration Provider

Edit `src/ConfigProvider.php`:

```php
<?php

namespace Plugin\MyCompany\HelloWorld;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => [
                // Dependency injection configuration
            ],
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            'publish' => [
                // Configuration file publishing settings
            ],
        ];
    }
}
```

### 3. Add Business Logic

Create a controller `src/Controller/HelloController.php`:

```php
<?php

namespace Plugin\MyCompany\HelloWorld\Controller;

use Hyperf\HttpServer\Annotation\Controller;
use Hyperf\HttpServer\Annotation\GetMapping;

#[Controller(prefix: '/hello-world')]
class HelloController
{
    #[GetMapping('/greeting')]
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

### 4. Frontend Development (Optional)

Add frontend components in the `web/` directory:

```vue
<!-- web/components/HelloWorld.vue -->
<template>
  <div class="hello-world">
    <h2>Hello World Plugin</h2>
    <p>{{ message }}</p>
    <el-button @click="fetchGreeting" type="primary">
      Get Greeting
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Welcome to the Hello World plugin!')

const fetchGreeting = async () => {
  // Call backend API
  try {
    const response = await fetch('/hello-world/greeting')
    const data = await response.json()
    message.value = data.message
  } catch (error) {
    console.error('Failed to get greeting:', error)
  }
}
</script>
```

## Install and Test the Plugin

### 1. Install the Plugin

```bash
# Install the plugin into the system
php bin/hyperf.php mine-extension:install mycompany/hello-world --yes
```

### 2. Test Functionality

Start the development server and test the API:

```bash
# Start the service
php bin/hyperf.php start

# Test the API (new terminal)
curl http://localhost:9501/hello-world/greeting
```

### 3. Check Installation Status

```bash
# View locally installed plugins
php bin/hyperf.php mine-extension:local-list
```

## Plugin Management Commands

### Common Command Overview

```bash
# View remote plugin list
php bin/hyperf.php mine-extension:list

# Download remote plugin
php bin/hyperf.php mine-extension:download --name plugin-name

# Install local plugin
php bin/hyperf.php mine-extension:install plugin/path --yes

# Uninstall plugin
php bin/hyperf.php mine-extension:uninstall plugin/path --yes

# View local plugins
php bin/hyperf.php mine-extension:local-list
```

## Development Debugging Tips

### 1. Log Debugging

Use Hyperf's logging system in your plugin:

```php
use Hyperf\Logger\LoggerFactory;

$logger = $container->get(LoggerFactory::class)->get('plugin');
$logger->info('Hello World Plugin Debug', ['data' => $someData]);
```

### 2. Configuration Hot Reload

Restart the service after modifying configurations during development:

```bash
# Restart Hyperf service
php bin/hyperf.php start
```

### 3. Frontend Hot Updates

If using MineAdmin frontend development environment:

```bash
# In the frontend project directory
npm run dev
```

## Next Steps

Now you've created your first plugin! Next you can:

1. [Learn more about plugin structure](./structure.md)
2. [Understand the complete development process](./develop.md)
3. [Learn about lifecycle management](./lifecycle.md)
4. [View more examples](./examples.md)

## Frequently Asked Questions

### Q: What if plugin installation fails?
A: Check if the `mine.json` configuration is correct and ensure PSR-4 autoload paths are properly set.

### Q: How to debug plugins?
A: Use Hyperf's logging system and debugging tools, check log files in the `runtime/logs/` directory.

### Q: Frontend components not displaying?
A: Ensure frontend files are placed in the `web/` directory, they will be automatically copied to the frontend project during plugin installation.