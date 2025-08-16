# 快速入門指南

本指南將幫助您快速建立第一個 MineAdmin 外掛，從環境準備到外掛釋出的完整流程。

## 前置要求

開始之前，請確保您已經：

1. **安裝 MineAdmin**：確保 MineAdmin 系統正常執行
2. **熟悉技術棧**：
   - PHP 8.1+ 和 Hyperf 框架
   - Vue 3 + TypeScript (如需前端開發)
   - Composer 包管理器

## 環境配置

### 1. 獲取 AccessToken

訪問外掛市場和開發者功能需要 AccessToken：

1. 登入 [MineAdmin 官網](https://www.mineadmin.com/login)
2. 進入 [個人中心設定](https://www.mineadmin.com/member/setting)
3. 檢視並複製 AccessToken

### 2. 配置環境變數

在專案根目錄的 `.env` 檔案中新增：

```ini
# MineAdmin AccessToken
MINE_ACCESS_TOKEN=您的AccessToken
```

### 3. 初始化外掛系統

如果是首次使用外掛系統，需要初始化：

```bash
# 初始化外掛擴充套件系統 (MineAdmin 3.0+ 版本已預設初始化)
php bin/hyperf.php mine-extension:initial
```

## 建立第一個外掛

### 1. 使用命令列建立外掛

```bash
# 建立一個混合型外掛
php bin/hyperf.php mine-extension:create mycompany/hello-world \
    --name "Hello World" \
    --type mixed \
    --author "Your Name" \
    --description "我的第一個MineAdmin外掛"
```

**引數說明**：
- `mycompany/hello-world`：外掛路徑 (名稱空間/外掛名)
- `--name`：外掛顯示名稱
- `--type`：外掛型別 (mixed/backend/frontend)
- `--author`：作者名稱
- `--description`：外掛描述

### 2. 生成的目錄結構

命令執行後會在 `plugin/mycompany/hello-world/` 目錄下生成：

```
plugin/mycompany/hello-world/
├── mine.json                    # 外掛配置檔案
├── src/                         # 後端原始碼目錄
│   ├── ConfigProvider.php       # 配置提供者
│   ├── InstallScript.php        # 安裝指令碼
│   └── UninstallScript.php      # 解除安裝指令碼
├── web/                         # 前端原始碼目錄
└── Database/                    # 資料庫相關
    ├── Migrations/              # 資料庫遷移
    └── Seeders/                 # 資料填充
```

## 開發您的外掛

### 1. 配置外掛資訊

編輯 `mine.json` 檔案，完善外掛資訊：

```json
{
  "name": "mycompany/hello-world",
  "description": "我的第一個MineAdmin外掛",
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
                // 配置檔案釋出設定
            ],
        ];
    }
}
```

### 3. 新增業務邏輯

建立控制器 `src/Controller/HelloController.php`：

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

在 `web/` 目錄下新增前端元件：

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

const message = ref('歡迎使用 Hello World 外掛！')

const fetchGreeting = async () => {
  // 呼叫後端 API
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

## 安裝和測試外掛

### 1. 安裝外掛

```bash
# 安裝外掛到系統
php bin/hyperf.php mine-extension:install mycompany/hello-world --yes
```

### 2. 測試功能

啟動開發伺服器並測試 API：

```bash
# 啟動服務
php bin/hyperf.php start

# 測試 API (新終端)
curl http://localhost:9501/hello-world/greeting
```

### 3. 檢查安裝狀態

```bash
# 檢視本地已安裝外掛
php bin/hyperf.php mine-extension:local-list
```

## 外掛管理命令

### 常用命令總覽

```bash
# 檢視遠端外掛列表
php bin/hyperf.php mine-extension:list

# 下載遠端外掛
php bin/hyperf.php mine-extension:download --name plugin-name

# 安裝本地外掛
php bin/hyperf.php mine-extension:install plugin/path --yes

# 解除安裝外掛
php bin/hyperf.php mine-extension:uninstall plugin/path --yes

# 檢視本地外掛
php bin/hyperf.php mine-extension:local-list
```

## 開發除錯技巧

### 1. 日誌除錯

在外掛中使用 Hyperf 日誌系統：

```php
use Hyperf\Logger\LoggerFactory;

$logger = $container->get(LoggerFactory::class)->get('plugin');
$logger->info('Hello World Plugin Debug', ['data' => $someData]);
```

### 2. 配置熱過載

開發期間修改配置後需要重啟服務：

```bash
# 重啟 Hyperf 服務
php bin/hyperf.php start
```

### 3. 前端熱更新

如果使用 MineAdmin 前端開發環境：

```bash
# 在前端專案目錄
npm run dev
```

## 下一步

現在您已經建立了第一個外掛！接下來可以：

1. [深入瞭解外掛結構](./structure.md)
2. [學習完整開發流程](./develop.md)
3. [瞭解生命週期管理](./lifecycle.md)
4. [檢視更多示例](./examples.md)

## 常見問題

### Q: 外掛安裝失敗怎麼辦？
A: 檢查 `mine.json` 配置是否正確，確保 PSR-4 自動載入路徑正確。

### Q: 如何除錯外掛？
A: 使用 Hyperf 的日誌系統和除錯工具，檢視 `runtime/logs/` 目錄下的日誌檔案。

### Q: 前端元件不顯示？
A: 確保前端檔案放在 `web/` 目錄下，安裝外掛時會自動複製到前端專案。