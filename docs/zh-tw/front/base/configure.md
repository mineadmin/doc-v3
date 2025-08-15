# 前端配置指南

MineAdmin 前端基於 Vite 構建，提供了靈活的環境變數配置系統，支援開發、測試、生產等多種環境的個性化配置。

## 環境變數配置

### 配置檔案概述

專案預設提供了以下環境配置檔案：

- `.env.development` - 開發環境配置
- `.env.production` - 生產環境配置

您可以根據需要建立額外的環境配置檔案，如：
- `.env.test` - 測試環境
- `.env.staging` - 預釋出環境
- `.env.local` - 本地開發專用（會被 git 忽略）

::: tip 提示
環境變數配置遵循 Vite 的約定，詳細資訊請參考 [Vite - 環境變數和模式](https://cn.vitejs.dev/guide/env-and-mode.html)
:::

### 開發環境配置 (.env.development)

開發環境配置主要用於本地開發除錯，包含了除錯工具和代理設定。

::: code-group

```env [.env.development]
# ================================
# 基礎應用配置
# ================================
# 頁面標題 - 顯示在瀏覽器標籤頁和頁面標題中
VITE_APP_TITLE = MineAdmin

# 開發伺服器埠
VITE_APP_PORT = 2888

# 應用根路徑 - 部署到子目錄時需要修改
VITE_APP_ROOT_BASE = /

# ================================
# API 介面配置
# ================================
# 後端 API 地址 - 開發環境通常指向本地後端服務
VITE_APP_API_BASEURL = http://127.0.0.1:9501

# ================================
# 路由配置
# ================================
# 路由模式：hash | history
# hash: 帶 # 號的路由模式，相容性好
# history: HTML5 History API，需要伺服器支援
VITE_APP_ROUTE_MODE = hash

# ================================
# 儲存配置
# ================================
# 本地儲存字首 - 避免多個專案間的儲存衝突
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# 代理配置
# ================================
# 是否開啟開發代理 - 解決開發環境跨域問題
VITE_OPEN_PROXY = true

# 代理字首 - 用於標識需要代理的請求
VITE_PROXY_PREFIX = /dev

# ================================
# 除錯工具
# ================================
# 是否開啟 vConsole - 移動端除錯工具
VITE_OPEN_vCONSOLE = false

# 是否開啟 Vue DevTools - Vue 開發者工具
VITE_OPEN_DEVTOOLS = false
```

:::

### 生產環境配置 (.env.production)

生產環境配置注重效能和安全性，移除了除錯功能並優化了構建選項。

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
# API 介面配置
# ================================
# 生產環境 API 地址 - 通常使用相對路徑或完整域名
VITE_APP_API_BASEURL = /

# ================================
# 路由配置
# ================================
# 生產環境路由模式
VITE_APP_ROUTE_MODE = hash

# ================================
# 儲存配置
# ================================
# 儲存字首
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# 代理配置（生產環境一般不需要）
# ================================
VITE_OPEN_PROXY = false
VITE_PROXY_PREFIX = /prod

# ================================
# 構建配置
# ================================
# 是否在打包時啟用 Mock - 生產環境建議關閉
VITE_BUILD_MOCK = false

# 是否生成 source map - 影響構建大小和除錯能力
VITE_BUILD_SOURCEMAP = false

# 構建壓縮方式 - 支援 gzip, brotli
VITE_BUILD_COMPRESS = gzip,brotli

# 構建後是否生成壓縮包 - 支援 zip, tar
VITE_BUILD_ARCHIVE =
```

:::

## 配置項詳細說明

### 基礎配置項

| 配置項 | 型別 | 預設值 | 說明 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | string | MineAdmin | 應用標題，顯示在瀏覽器標籤頁 |
| `VITE_APP_PORT` | number | 2888 | 開發伺服器埠（僅開發環境） |
| `VITE_APP_ROOT_BASE` | string | / | 應用部署的基礎路徑 |

### API 介面配置

| 配置項 | 型別 | 說明 | 示例 |
|--------|------|------|------|
| `VITE_APP_API_BASEURL` | string | 後端 API 基礎地址 | `http://api.example.com` |

::: warning 注意
生產環境的 API 地址配置需要特別注意：
- 如果前後端部署在同一域名下，使用相對路徑 `/`
- 如果跨域部署，需要配置完整的 API 地址
- 確保 API 伺服器已正確配置 CORS
:::

### 路由配置

| 配置項 | 可選值 | 說明 |
|--------|--------|------|
| `VITE_APP_ROUTE_MODE` | `hash` \| `history` | 路由模式選擇 |

**路由模式對比：**

| 模式 | 優點 | 缺點 | 適用場景 |
|------|------|------|----------|
| `hash` | 相容性好，無需伺服器配置 | URL 帶 # 號，SEO 不友好 | 傳統部署環境 |
| `history` | URL 簡潔，SEO 友好 | 需要伺服器支援，配置複雜 | 現代部署環境 |

### 儲存配置

| 配置項 | 說明 | 建議值 |
|--------|------|--------|
| `VITE_APP_STORAGE_PREFIX` | 本地儲存字首 | 專案唯一標識 |

### 代理配置

| 配置項 | 型別 | 說明 |
|--------|------|------|
| `VITE_OPEN_PROXY` | boolean | 是否啟用開發代理 |
| `VITE_PROXY_PREFIX` | string | 代理請求字首標識 |

### 構建配置

| 配置項 | 型別 | 說明 |
|--------|------|------|
| `VITE_BUILD_MOCK` | boolean | 是否在構建時包含 Mock 功能 |
| `VITE_BUILD_SOURCEMAP` | boolean | 是否生成 source map |
| `VITE_BUILD_COMPRESS` | string | 壓縮演算法，多個用逗號分隔 |
| `VITE_BUILD_ARCHIVE` | string | 構建後生成的壓縮包格式 |

## 部署場景配置

### 場景 1：子目錄部署

如果需要將應用部署到伺服器的子目錄（如 `https://example.com/admin/`）：

```env
# 設定基礎路徑
VITE_APP_ROOT_BASE = /admin/

# API 地址相應調整
VITE_APP_API_BASEURL = /admin/api/
```

### 場景 2：CDN 部署

使用 CDN 加速靜態資源：

```env
# 基礎路徑設定為 CDN 地址
VITE_APP_ROOT_BASE = https://cdn.example.com/admin/

# API 地址保持原域名
VITE_APP_API_BASEURL = https://api.example.com/
```

### 場景 3：Docker 部署

Docker 容器化部署配置：

```env
# 使用環境變數佔位符
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

# 使用 history 路由模式（需要 Nginx 配置支援）
VITE_APP_ROUTE_MODE = history
```

## 最佳實踐

### 1. 環境變數命名規範

- 所有環境變數必須以 `VITE_` 開頭才能被客戶端訪問
- 使用全大寫字母和下劃線命名
- 按功能模組分組命名

### 2. 安全考慮

::: danger 安全提醒
- 不要在環境變數中儲存敏感資訊（如金鑰、密碼）
- 生產環境配置檔案不應包含開發除錯資訊
- 定期檢查和清理不再使用的配置項
:::

### 3. 效能最佳化

```env
# 生產環境建議配置
VITE_BUILD_SOURCEMAP = false          # 減少包體積
VITE_BUILD_COMPRESS = gzip,brotli      # 啟用壓縮
VITE_OPEN_vCONSOLE = false            # 關閉除錯工具
VITE_OPEN_DEVTOOLS = false            # 關閉開發工具
```

### 4. 多環境管理

建立 `.env.staging` 用於預釋出環境：

```env
# 預釋出環境配置
VITE_APP_TITLE = MineAdmin (Staging)
VITE_APP_API_BASEURL = https://staging-api.example.com/
VITE_BUILD_SOURCEMAP = true           # 保留 source map 用於除錯
```

## 常見問題

### Q: 修改環境變數後不生效？

**A:** 請確保：
1. 重啟開發伺服器
2. 環境變數名稱以 `VITE_` 開頭
3. 語法格式正確（無多餘空格）

### Q: 生產環境 API 請求失敗？

**A:** 檢查以下配置：
1. `VITE_APP_API_BASEURL` 是否正確
2. 後端服務是否配置了正確的 CORS
3. 網路防火牆是否允許對應埠訪問

### Q: 如何在程式碼中獲取環境變數？

**A:** 使用 `import.meta.env` 訪問：

```typescript
// 獲取 API 基礎地址
const apiBaseUrl = import.meta.env.VITE_APP_API_BASEURL

// 獲取應用標題
const appTitle = import.meta.env.VITE_APP_TITLE

// 檢查是否為開發環境
const isDev = import.meta.env.DEV
```

### Q: history 路由模式下頁面重新整理 404？

**A:** 需要配置伺服器重寫規則，以 Nginx 為例：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

::: tip 提示
更多部署相關問題，請參考 [部署指南](../../guide/start/deployment.md) 章節。
:::
