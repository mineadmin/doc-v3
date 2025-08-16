# 快速入门指南

本指南将帮助您快速创建第一个 MineAdmin 插件，从环境准备到插件发布的完整流程。

## 前置要求

开始之前，请确保您已经：

1. **安装 MineAdmin**：确保 MineAdmin 系统正常运行
2. **熟悉技术栈**：
   - PHP 8.1+ 和 Hyperf 框架
   - Vue 3 + TypeScript (如需前端开发)
   - Composer 包管理器

## 环境配置

### 1. 获取 AccessToken

访问插件市场和开发者功能需要 AccessToken：

1. 登录 [MineAdmin 官网](https://www.mineadmin.com/login)
2. 进入 [个人中心设置](https://www.mineadmin.com/member/setting)
3. 查看并复制 AccessToken

### 2. 配置环境变量

在项目根目录的 `.env` 文件中添加：

```ini
# MineAdmin AccessToken
MINE_ACCESS_TOKEN=您的AccessToken
```

### 3. 初始化插件系统

如果是首次使用插件系统，需要初始化：

```bash
# 初始化插件扩展系统 (MineAdmin 3.0+ 版本已默认初始化)
php bin/hyperf.php mine-extension:initial
```

## 创建第一个插件

### 1. 使用命令行创建插件

```bash
# 创建一个混合型插件
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "我的第一个MineAdmin插件"
```

**参数说明**：
- `mycompany/hello-world`：插件路径 (命名空间/插件名)
- `--name`：插件显示名称
- `--type`：插件类型 (mixed/backend/frontend)
- `--author`：作者名称
- `--description`：插件描述

### 2. 生成的目录结构

命令执行后会在 `plugin/mycompany/hello-world/` 目录下生成：

```
plugin/mycompany/hello-world/
├── mine.json                    # 插件配置文件
├── src/                         # 后端源码目录
│   ├── ConfigProvider.php       # 配置提供者
│   ├── InstallScript.php        # 安装脚本
│   └── UninstallScript.php      # 卸载脚本
├── web/                         # 前端源码目录
└── Database/                    # 数据库相关
    ├── Migrations/              # 数据库迁移
    └── Seeders/                 # 数据填充
```

## 开发您的插件

### 1. 配置插件信息

编辑 `mine.json` 文件，完善插件信息：

```json
{
  "name": "mycompany/hello-world",
  "description": "我的第一个MineAdmin插件",
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

### 2. 实现配置提供者

编辑 `src/ConfigProvider.php`：

```php
<?php

namespace Plugin\MyCompany\HelloWorld;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => [
                // 依赖注入配置
            ],
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            'publish' => [
                // 配置文件发布设置
            ],
        ];
    }
}
```

### 3. 添加业务逻辑

创建控制器 `src/Controller/HelloController.php`：

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

### 4. 前端开发 (可选)

在 `web/` 目录下添加前端组件：

```vue
<!-- web/components/HelloWorld.vue -->
<template>
  <div class="hello-world">
    <h2>Hello World Plugin</h2>
    <p>{{ message }}</p>
    <el-button @click="fetchGreeting" type="primary">
      获取问候语
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('欢迎使用 Hello World 插件！')

const fetchGreeting = async () => {
  // 调用后端 API
  try {
    const response = await fetch('/hello-world/greeting')
    const data = await response.json()
    message.value = data.message
  } catch (error) {
    console.error('获取问候语失败:', error)
  }
}
</script>
```

## 安装和测试插件

### 1. 安装插件

```bash
# 安装插件到系统
php bin/hyperf.php mine-extension:install mycompany/hello-world --yes
```

### 2. 测试功能

启动开发服务器并测试 API：

```bash
# 启动服务
php bin/hyperf.php start

# 测试 API (新终端)
curl http://localhost:9501/hello-world/greeting
```

### 3. 检查安装状态

```bash
# 查看本地已安装插件
php bin/hyperf.php mine-extension:local-list
```

## 插件管理命令

### 常用命令总览

```bash
# 查看远程插件列表
php bin/hyperf.php mine-extension:list

# 下载远程插件
php bin/hyperf.php mine-extension:download --name plugin-name

# 安装本地插件
php bin/hyperf.php mine-extension:install plugin/path --yes

# 卸载插件
php bin/hyperf.php mine-extension:uninstall plugin/path --yes

# 查看本地插件
php bin/hyperf.php mine-extension:local-list
```

## 开发调试技巧

### 1. 日志调试

在插件中使用 Hyperf 日志系统：

```php
use Hyperf\Logger\LoggerFactory;

$logger = $container->get(LoggerFactory::class)->get('plugin');
$logger->info('Hello World Plugin Debug', ['data' => $someData]);
```

### 2. 配置热重载

开发期间修改配置后需要重启服务：

```bash
# 重启 Hyperf 服务
php bin/hyperf.php start
```

### 3. 前端热更新

如果使用 MineAdmin 前端开发环境：

```bash
# 在前端项目目录
npm run dev
```

## 下一步

现在您已经创建了第一个插件！接下来可以：

1. [深入了解插件结构](./structure.md)
2. [学习完整开发流程](./develop.md)
3. [了解生命周期管理](./lifecycle.md)
4. [查看更多示例](./examples.md)

## 常见问题

### Q: 插件安装失败怎么办？
A: 检查 `mine.json` 配置是否正确，确保 PSR-4 自动加载路径正确。

### Q: 如何调试插件？
A: 使用 Hyperf 的日志系统和调试工具，查看 `runtime/logs/` 目录下的日志文件。

### Q: 前端组件不显示？
A: 确保前端文件放在 `web/` 目录下，安装插件时会自动复制到前端项目。