# 前端配置指南

MineAdmin 前端基於 Vite 構建，提供了靈活的環境變量配置系統，支持開發、測試、生產等多種環境的個性化配置。

## 環境變量配置

### 配置文件概述

項目默認提供了以下環境配置文件：

- `.env.development` - 開發環境配置
- `.env.production` - 生產環境配置

您可以根據需要創建額外的環境配置文件，如：
- `.env.test` - 測試環境
- `.env.staging` - 預發佈環境
- `.env.local` - 本地開發專用（會被 git 忽略）

::: tip 提示
環境變量配置遵循 Vite 的約定，詳細信息請參考 [Vite - 環境變量和模式](https://cn.vitejs.dev/guide/env-and-mode.html)
:::

### 開發環境配置 (.env.development)

開發環境配置主要用於本地開發調試，包含了調試工具和代理設置。

::: code-group

```env [.env.development]
# ================================
# 基礎應用配置
# ================================
# 頁面標題 - 顯示在瀏覽器標籤頁和頁面標題中
VITE_APP_TITLE = MineAdmin

# 開發服務器端口
VITE_APP_PORT = 2888

# 應用根路徑 - 部署到子目錄時需要修改
VITE_APP_ROOT_BASE = /

# ================================
# API 接口配置
# ================================
# 後端 API 地址 - 開發環境通常指向本地後端服務
VITE_APP_API_BASEURL = http://127.0.0.1:9501

# ================================
# 路由配置
# ================================
# 路由模式：hash | history
# hash: 帶 # 號的路由模式，兼容性好
# history: HTML5 History API，需要服務器支持
VITE_APP_ROUTE_MODE = hash

# ================================
# 存儲配置
# ================================
# 本地存儲前綴 - 避免多個項目間的存儲衝突
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# 代理配置
# ================================
# 是否開啓開發代理 - 解決開發環境跨域問題
VITE_OPEN_PROXY = true

# 代理前綴 - 用於標識需要代理的請求
VITE_PROXY_PREFIX = /dev

# ================================
# 調試工具
# ================================
# 是否開啓 vConsole - 移動端調試工具
VITE_OPEN_vCONSOLE = false

# 是否開啓 Vue DevTools - Vue 開發者工具
VITE_OPEN_DEVTOOLS = false
```

:::

### 生產環境配置 (.env.production)

生產環境配置注重性能和安全性，移除了調試功能並優化了構建選項。

::: code-group

```env [.env.production]
# ================================
# 基礎應用配置
# ================================
# 頁面標題
VITE_APP_TITLE = MineAdmin

# 應用根路徑 - 根據實際部署路徑調整
VITE_APP_ROOT_BASE = /

# ================================
# API 接口配置
# ================================
# 生產環境 API 地址 - 通常使用相對路徑或完整域名
VITE_APP_API_BASEURL = /

# ================================
# 路由配置
# ================================
# 生產環境路由模式
VITE_APP_ROUTE_MODE = hash

# ================================
# 存儲配置
# ================================
# 存儲前綴
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# 代理配置（生產環境一般不需要）
# ================================
VITE_OPEN_PROXY = false
VITE_PROXY_PREFIX = /prod

# ================================
# 構建配置
# ================================
# 是否在打包時啓用 Mock - 生產環境建議關閉
VITE_BUILD_MOCK = false

# 是否生成 source map - 影響構建大小和調試能力
VITE_BUILD_SOURCEMAP = false

# 構建壓縮方式 - 支持 gzip, brotli
VITE_BUILD_COMPRESS = gzip,brotli

# 構建後是否生成壓縮包 - 支持 zip, tar
VITE_BUILD_ARCHIVE =
```

:::

## 配置項詳細説明

### 基礎配置項

| 配置項 | 類型 | 默認值 | 説明 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | string | MineAdmin | 應用標題，顯示在瀏覽器標籤頁 |
| `VITE_APP_PORT` | number | 2888 | 開發服務器端口（僅開發環境） |
| `VITE_APP_ROOT_BASE` | string | / | 應用部署的基礎路徑 |

### API 接口配置

| 配置項 | 類型 | 説明 | 示例 |
|--------|------|------|------|
| `VITE_APP_API_BASEURL` | string | 後端 API 基礎地址 | `http://api.example.com` |

::: warning 注意
生產環境的 API 地址配置需要特別注意：
- 如果前後端部署在同一域名下，使用相對路徑 `/`
- 如果跨域部署，需要配置完整的 API 地址
- 確保 API 服務器已正確配置 CORS
:::

### 路由配置

| 配置項 | 可選值 | 説明 |
|--------|--------|------|
| `VITE_APP_ROUTE_MODE` | `hash` \| `history` | 路由模式選擇 |

**路由模式對比：**

| 模式 | 優點 | 缺點 | 適用場景 |
|------|------|------|----------|
| `hash` | 兼容性好，無需服務器配置 | URL 帶 # 號，SEO 不友好 | 傳統部署環境 |
| `history` | URL 簡潔，SEO 友好 | 需要服務器支持，配置複雜 | 現代部署環境 |

### 存儲配置

| 配置項 | 説明 | 建議值 |
|--------|------|--------|
| `VITE_APP_STORAGE_PREFIX` | 本地存儲前綴 | 項目唯一標識 |

### 代理配置

| 配置項 | 類型 | 説明 |
|--------|------|------|
| `VITE_OPEN_PROXY` | boolean | 是否啓用開發代理 |
| `VITE_PROXY_PREFIX` | string | 代理請求前綴標識 |

### 構建配置

| 配置項 | 類型 | 説明 |
|--------|------|------|
| `VITE_BUILD_MOCK` | boolean | 是否在構建時包含 Mock 功能 |
| `VITE_BUILD_SOURCEMAP` | boolean | 是否生成 source map |
| `VITE_BUILD_COMPRESS` | string | 壓縮算法，多個用逗號分隔 |
| `VITE_BUILD_ARCHIVE` | string | 構建後生成的壓縮包格式 |

## 部署場景配置

### 場景 1：子目錄部署

如果需要將應用部署到服務器的子目錄（如 `https://example.com/admin/`）：

```env
# 設置基礎路徑
VITE_APP_ROOT_BASE = /admin/

# API 地址相應調整
VITE_APP_API_BASEURL = /admin/api/
```

### 場景 2：CDN 部署

使用 CDN 加速靜態資源：

```env
# 基礎路徑設置為 CDN 地址
VITE_APP_ROOT_BASE = https://cdn.example.com/admin/

# API 地址保持原域名
VITE_APP_API_BASEURL = https://api.example.com/
```

### 場景 3：Docker 部署

Docker 容器化部署配置：

```env
# 使用環境變量佔位符
VITE_APP_API_BASEURL = ${API_BASE_URL}
VITE_APP_TITLE = ${APP_TITLE:-MineAdmin}
```

### 場景 4：前後端分離部署

前後端完全分離的部署架構：

```env
# 前端獨立域名
VITE_APP_ROOT_BASE = /

# 後端 API 完整地址
VITE_APP_API_BASEURL = https://api.example.com/v1/

# 使用 history 路由模式（需要 Nginx 配置支持）
VITE_APP_ROUTE_MODE = history
```

## 最佳實踐

### 1. 環境變量命名規範

- 所有環境變量必須以 `VITE_` 開頭才能被客户端訪問
- 使用全大寫字母和下劃線命名
- 按功能模塊分組命名

### 2. 安全考慮

::: danger 安全提醒
- 不要在環境變量中存儲敏感信息（如密鑰、密碼）
- 生產環境配置文件不應包含開發調試信息
- 定期檢查和清理不再使用的配置項
:::

### 3. 性能優化

```env
# 生產環境建議配置
VITE_BUILD_SOURCEMAP = false          # 減少包體積
VITE_BUILD_COMPRESS = gzip,brotli      # 啓用壓縮
VITE_OPEN_vCONSOLE = false            # 關閉調試工具
VITE_OPEN_DEVTOOLS = false            # 關閉開發工具
```

### 4. 多環境管理

創建 `.env.staging` 用於預發佈環境：

```env
# 預發佈環境配置
VITE_APP_TITLE = MineAdmin (Staging)
VITE_APP_API_BASEURL = https://staging-api.example.com/
VITE_BUILD_SOURCEMAP = true           # 保留 source map 用於調試
```

## 常見問題

### Q: 修改環境變量後不生效？

**A:** 請確保：
1. 重啓開發服務器
2. 環境變量名稱以 `VITE_` 開頭
3. 語法格式正確（無多餘空格）

### Q: 生產環境 API 請求失敗？

**A:** 檢查以下配置：
1. `VITE_APP_API_BASEURL` 是否正確
2. 後端服務是否配置了正確的 CORS
3. 網絡防火牆是否允許對應端口訪問

### Q: 如何在代碼中獲取環境變量？

**A:** 使用 `import.meta.env` 訪問：

```typescript
// 獲取 API 基礎地址
const apiBaseUrl = import.meta.env.VITE_APP_API_BASEURL

// 獲取應用標題
const appTitle = import.meta.env.VITE_APP_TITLE

// 檢查是否為開發環境
const isDev = import.meta.env.DEV
```

### Q: history 路由模式下頁面刷新 404？

**A:** 需要配置服務器重寫規則，以 Nginx 為例：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

::: tip 提示
更多部署相關問題，請參考 [部署指南](../../guide/start/deployment.md) 章節。
:::
