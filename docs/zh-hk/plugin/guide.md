# 快速入門指南

本指南將幫助您快速創建第一個 MineAdmin 插件，從環境準備到插件發佈的完整流程。

## 前置要求

開始之前，請確保您已經：

1. **安裝 MineAdmin**：確保 MineAdmin 系統正常運行
2. **熟悉技術棧**：
   - PHP 8.1+ 和 Hyperf 框架
   - Vue 3 + TypeScript (如需前端開發)
   - Composer 包管理器

## 環境配置

### 1. 獲取 AccessToken

訪問插件市場和開發者功能需要 AccessToken：

1. 登錄 [MineAdmin 官網](https://www.mineadmin.com/login)
2. 進入 [個人中心設置](https://www.mineadmin.com/member/setting)
3. 查看並複製 AccessToken

### 2. 配置環境變量

在項目根目錄的 `.env` 文件中添加：

```ini
# MineAdmin AccessToken
MINE_ACCESS_TOKEN=您的AccessToken
```

### 3. 初始化插件系統

如果是首次使用插件系統，需要初始化：

```bash
# 初始化插件擴展系統 (MineAdmin 3.0+ 版本已默認初始化)
php bin/hyperf.php mine-extension:initial
```

## 創建第一個插件

### 1. 使用命令行創建插件

```bash
# 創建一個混合型插件
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "我的第一個MineAdmin插件"
```

**參數説明**：
- `mycompany/hello-world`：插件路徑 (命名空間/插件名)
- `--name`：插件顯示名稱
- `--type`：插件類型 (mixed/backend/frontend)
- `--author`：作者名稱
- `--description`：插件描述

### 2. 生成的目錄結構

命令執行後會在 `plugin/mycompany/hello-world/` 目錄下生成：

```
plugin/mycompany/hello-world/
├── mine.json                    # 插件配置文件
├── src/                         # 後端源碼目錄
│   ├── ConfigProvider.php       # 配置提供者
│   ├── InstallScript.php        # 安裝腳本
│   └── UninstallScript.php      # 卸載腳本
├── web/                         # 前端源碼目錄
└── Database/                    # 數據庫相關
    ├── Migrations/              # 數據庫遷移
    └── Seeders/                 # 數據填充
```

## 開發您的插件

### 1. 配置插件信息

編輯 `mine.json` 文件，完善插件信息：

```json
{
  "name": "mycompany/hello-world",
  "description": "我的第一個MineAdmin插件",
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

### 2. 實現配置提供者

編輯 `src/ConfigProvider.php`：

```php
<?php

namespace Plugin\MyCompany\HelloWorld;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => [
                // 依賴注入配置
            ],
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            'publish' => [
                // 配置文件發佈設置
            ],
        ];
    }
}
```

### 3. 添加業務邏輯

創建控制器 `src/Controller/HelloController.php`：

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

### 4. 前端開發 (可選)

在 `web/` 目錄下添加前端組件：

```vue
<!-- web/components/HelloWorld.vue -->
<template>
  <div class="hello-world">
    <h2>Hello World Plugin</h2>
    <p>{{ message }}</p>
    <el-button @click="fetchGreeting" type="primary">
      獲取問候語
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('歡迎使用 Hello World 插件！')

const fetchGreeting = async () => {
  // 調用後端 API
  try {
    const response = await fetch('/hello-world/greeting')
    const data = await response.json()
    message.value = data.message
  } catch (error) {
    console.error('獲取問候語失敗:', error)
  }
}
</script>
```

## 安裝和測試插件

### 1. 安裝插件

```bash
# 安裝插件到系統
php bin/hyperf.php mine-extension:install mycompany/hello-world --yes
```

### 2. 測試功能

啓動開發服務器並測試 API：

```bash
# 啓動服務
php bin/hyperf.php start

# 測試 API (新終端)
curl http://localhost:9501/hello-world/greeting
```

### 3. 檢查安裝狀態

```bash
# 查看本地已安裝插件
php bin/hyperf.php mine-extension:local-list
```

## 插件管理命令

### 常用命令總覽

```bash
# 查看遠程插件列表
php bin/hyperf.php mine-extension:list

# 下載遠程插件
php bin/hyperf.php mine-extension:download --name plugin-name

# 安裝本地插件
php bin/hyperf.php mine-extension:install plugin/path --yes

# 卸載插件
php bin/hyperf.php mine-extension:uninstall plugin/path --yes

# 查看本地插件
php bin/hyperf.php mine-extension:local-list
```

## 開發調試技巧

### 1. 日誌調試

在插件中使用 Hyperf 日誌系統：

```php
use Hyperf\Logger\LoggerFactory;

$logger = $container->get(LoggerFactory::class)->get('plugin');
$logger->info('Hello World Plugin Debug', ['data' => $someData]);
```

### 2. 配置熱重載

開發期間修改配置後需要重啓服務：

```bash
# 重啓 Hyperf 服務
php bin/hyperf.php start
```

### 3. 前端熱更新

如果使用 MineAdmin 前端開發環境：

```bash
# 在前端項目目錄
npm run dev
```

## 下一步

現在您已經創建了第一個插件！接下來可以：

1. [深入瞭解插件結構](./structure.md)
2. [學習完整開發流程](./develop.md)
3. [瞭解生命週期管理](./lifecycle.md)
4. [查看更多示例](./examples.md)

## 常見問題

### Q: 插件安裝失敗怎麼辦？
A: 檢查 `mine.json` 配置是否正確，確保 PSR-4 自動加載路徑正確。

### Q: 如何調試插件？
A: 使用 Hyperf 的日誌系統和調試工具，查看 `runtime/logs/` 目錄下的日誌文件。

### Q: 前端組件不顯示？
A: 確保前端文件放在 `web/` 目錄下，安裝插件時會自動複製到前端項目。