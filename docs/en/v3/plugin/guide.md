# Quick Start Guide

This guide will help you quickly create your first MineAdmin plugin, covering the complete process from environment preparation to plugin publishing.

## Prerequisites

Before you start, please ensure you have:

1. **Installed MineAdmin**: Ensure the MineAdmin system is running properly
2. **Familiar with the tech stack**:
   - PHP 8.1+ and the Hyperf framework
   - Vue 3 + TypeScript (for frontend development)
   - Composer package manager

## Environment Configuration

### 1. Obtain AccessToken

Access to the plugin marketplace and developer features requires an AccessToken:

1. Log in to the [MineAdmin official website](https://www.mineadmin.com/login)
2. Go to [Personal Center Settings](https://www.mineadmin.com/member/setting)
3. View and copy the AccessToken

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

## Creating Your First Plugin

### 1. Create a Plugin Using the Command Line

```bash
# Create a mixed-type plugin
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mix \
    --author "Your Name" \
    --description "My first MineAdmin plugin"
```

**Parameter Description**:
- `mycompany/hello-world`: Plugin path (namespace/plugin name)
- `--name`: Plugin display name
- `--type`: Plugin type (mix/backend/frontend)
- `--author`: Author name
- `--description`: Plugin description

### 2. Generated Directory Structure

After executing the command, the following will be generated under the `plugin/mycompany/hello-world/` directory:

```
plugin/mycompany/hello-world/
├── mine.json                    # Plugin configuration file
├── src/                         # Backend source code directory
│   ├── ConfigProvider.php       # Configuration provider
│   ├── InstallScript.php        # Installation script
│   └── UninstallScript.php      # Uninstallation script
├── web/                         # Frontend source code directory
└── Database/                    # Database related
    ├── Migrations/              # Database migrations
    └── Seeders/                 # Data seeders
```

## Developing Your Plugin

### 1. Configure Plugin Information

Edit the `mine.json` file to complete the plugin information:

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
      "Plugin\\Mycompany\\HelloWorld\\": "src"
    },
    "config": "Plugin\\Mycompany\\HelloWorld\\ConfigProvider"
  }
}
```

### 2. Implement the Configuration Provider

Edit `src/ConfigProvider.php`:

```php
<?php

namespace Plugin\Mycompany\HelloWorld;

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

Create the controller `src/Controller/HelloController.php`:

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
    console.error('Failed to fetch greeting:', error)
  }
}
</script>
```

## Installing and Testing the Plugin

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

# Test the API (in a new terminal)
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

# Download a remote plugin
php bin/hyperf.php mine-extension:download --name plugin-name

# Install a local plugin
php bin/hyperf.php mine-extension:install plugin/path --yes

# Uninstall a plugin
php bin/hyperf.php mine-extension:uninstall plugin/path --yes

# View local plugins
php bin/hyperf.php mine-extension:local-list
```

## Development and Debugging Tips

### 1. Log Debugging

Use the Hyperf logging system in your plugin:

```php
use Hyperf\Logger\LoggerFactory;

$logger = $container->get(LoggerFactory::class)->get('plugin');
$logger->info('Hello World Plugin Debug', ['data' => $someData]);
```

### 2. Configuration Hot Reload

Restart the service after modifying configurations during development:

```bash
# Restart the Hyperf service
php bin/hyperf.php start
```

### 3. Frontend Hot Reload

If using the MineAdmin frontend development environment:

```bash
# In the frontend project directory
npm run dev
```

## Next Steps

Now that you have created your first plugin! Next, you can:

1. [Learn more about the plugin structure](./structure.md)
2. [Learn the complete development process](./develop.md)
3. [Understand lifecycle management](./lifecycle.md)
4. [View more examples](./examples.md)

## Frequently Asked Questions

### Q: What if plugin installation fails?
A: Check if the `mine.json` configuration is correct, ensuring the PSR-4 autoloading path is correct.

### Q: How to debug a plugin?
A: Use the Hyperf logging system and debugging tools, check the log files in the `runtime/logs/` directory.

### Q: Frontend components not displaying?
A: Ensure frontend files are placed in the `web/` directory; plugins are automatically copied to the frontend project during installation.