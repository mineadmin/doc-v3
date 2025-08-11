# 前端配置指南

MineAdmin 前端基于 Vite 构建，提供了灵活的环境变量配置系统，支持开发、测试、生产等多种环境的个性化配置。

## 环境变量配置

### 配置文件概述

项目默认提供了以下环境配置文件：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

您可以根据需要创建额外的环境配置文件，如：
- `.env.test` - 测试环境
- `.env.staging` - 预发布环境
- `.env.local` - 本地开发专用（会被 git 忽略）

::: tip 提示
环境变量配置遵循 Vite 的约定，详细信息请参考 [Vite - 环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html)
:::

### 开发环境配置 (.env.development)

开发环境配置主要用于本地开发调试，包含了调试工具和代理设置。

::: code-group

```env [.env.development]
# ================================
# 基础应用配置
# ================================
# 页面标题 - 显示在浏览器标签页和页面标题中
VITE_APP_TITLE = MineAdmin

# 开发服务器端口
VITE_APP_PORT = 2888

# 应用根路径 - 部署到子目录时需要修改
VITE_APP_ROOT_BASE = /

# ================================
# API 接口配置
# ================================
# 后端 API 地址 - 开发环境通常指向本地后端服务
VITE_APP_API_BASEURL = http://127.0.0.1:9501

# ================================
# 路由配置
# ================================
# 路由模式：hash | history
# hash: 带 # 号的路由模式，兼容性好
# history: HTML5 History API，需要服务器支持
VITE_APP_ROUTE_MODE = hash

# ================================
# 存储配置
# ================================
# 本地存储前缀 - 避免多个项目间的存储冲突
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# 代理配置
# ================================
# 是否开启开发代理 - 解决开发环境跨域问题
VITE_OPEN_PROXY = true

# 代理前缀 - 用于标识需要代理的请求
VITE_PROXY_PREFIX = /dev

# ================================
# 调试工具
# ================================
# 是否开启 vConsole - 移动端调试工具
VITE_OPEN_vCONSOLE = false

# 是否开启 Vue DevTools - Vue 开发者工具
VITE_OPEN_DEVTOOLS = false
```

:::

### 生产环境配置 (.env.production)

生产环境配置注重性能和安全性，移除了调试功能并优化了构建选项。

::: code-group

```env [.env.production]
# ================================
# 基础应用配置
# ================================
# 页面标题
VITE_APP_TITLE = MineAdmin

# 应用根路径 - 根据实际部署路径调整
VITE_APP_ROOT_BASE = /

# ================================
# API 接口配置
# ================================
# 生产环境 API 地址 - 通常使用相对路径或完整域名
VITE_APP_API_BASEURL = /

# ================================
# 路由配置
# ================================
# 生产环境路由模式
VITE_APP_ROUTE_MODE = hash

# ================================
# 存储配置
# ================================
# 存储前缀
VITE_APP_STORAGE_PREFIX = mine_

# ================================
# 代理配置（生产环境一般不需要）
# ================================
VITE_OPEN_PROXY = false
VITE_PROXY_PREFIX = /prod

# ================================
# 构建配置
# ================================
# 是否在打包时启用 Mock - 生产环境建议关闭
VITE_BUILD_MOCK = false

# 是否生成 source map - 影响构建大小和调试能力
VITE_BUILD_SOURCEMAP = false

# 构建压缩方式 - 支持 gzip, brotli
VITE_BUILD_COMPRESS = gzip,brotli

# 构建后是否生成压缩包 - 支持 zip, tar
VITE_BUILD_ARCHIVE =
```

:::

## 配置项详细说明

### 基础配置项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | string | MineAdmin | 应用标题，显示在浏览器标签页 |
| `VITE_APP_PORT` | number | 2888 | 开发服务器端口（仅开发环境） |
| `VITE_APP_ROOT_BASE` | string | / | 应用部署的基础路径 |

### API 接口配置

| 配置项 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `VITE_APP_API_BASEURL` | string | 后端 API 基础地址 | `http://api.example.com` |

::: warning 注意
生产环境的 API 地址配置需要特别注意：
- 如果前后端部署在同一域名下，使用相对路径 `/`
- 如果跨域部署，需要配置完整的 API 地址
- 确保 API 服务器已正确配置 CORS
:::

### 路由配置

| 配置项 | 可选值 | 说明 |
|--------|--------|------|
| `VITE_APP_ROUTE_MODE` | `hash` \| `history` | 路由模式选择 |

**路由模式对比：**

| 模式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| `hash` | 兼容性好，无需服务器配置 | URL 带 # 号，SEO 不友好 | 传统部署环境 |
| `history` | URL 简洁，SEO 友好 | 需要服务器支持，配置复杂 | 现代部署环境 |

### 存储配置

| 配置项 | 说明 | 建议值 |
|--------|------|--------|
| `VITE_APP_STORAGE_PREFIX` | 本地存储前缀 | 项目唯一标识 |

### 代理配置

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `VITE_OPEN_PROXY` | boolean | 是否启用开发代理 |
| `VITE_PROXY_PREFIX` | string | 代理请求前缀标识 |

### 构建配置

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `VITE_BUILD_MOCK` | boolean | 是否在构建时包含 Mock 功能 |
| `VITE_BUILD_SOURCEMAP` | boolean | 是否生成 source map |
| `VITE_BUILD_COMPRESS` | string | 压缩算法，多个用逗号分隔 |
| `VITE_BUILD_ARCHIVE` | string | 构建后生成的压缩包格式 |

## 部署场景配置

### 场景 1：子目录部署

如果需要将应用部署到服务器的子目录（如 `https://example.com/admin/`）：

```env
# 设置基础路径
VITE_APP_ROOT_BASE = /admin/

# API 地址相应调整
VITE_APP_API_BASEURL = /admin/api/
```

### 场景 2：CDN 部署

使用 CDN 加速静态资源：

```env
# 基础路径设置为 CDN 地址
VITE_APP_ROOT_BASE = https://cdn.example.com/admin/

# API 地址保持原域名
VITE_APP_API_BASEURL = https://api.example.com/
```

### 场景 3：Docker 部署

Docker 容器化部署配置：

```env
# 使用环境变量占位符
VITE_APP_API_BASEURL = ${API_BASE_URL}
VITE_APP_TITLE = ${APP_TITLE:-MineAdmin}
```

### 场景 4：前后端分离部署

前后端完全分离的部署架构：

```env
# 前端独立域名
VITE_APP_ROOT_BASE = /

# 后端 API 完整地址
VITE_APP_API_BASEURL = https://api.example.com/v1/

# 使用 history 路由模式（需要 Nginx 配置支持）
VITE_APP_ROUTE_MODE = history
```

## 最佳实践

### 1. 环境变量命名规范

- 所有环境变量必须以 `VITE_` 开头才能被客户端访问
- 使用全大写字母和下划线命名
- 按功能模块分组命名

### 2. 安全考虑

::: danger 安全提醒
- 不要在环境变量中存储敏感信息（如密钥、密码）
- 生产环境配置文件不应包含开发调试信息
- 定期检查和清理不再使用的配置项
:::

### 3. 性能优化

```env
# 生产环境建议配置
VITE_BUILD_SOURCEMAP = false          # 减少包体积
VITE_BUILD_COMPRESS = gzip,brotli      # 启用压缩
VITE_OPEN_vCONSOLE = false            # 关闭调试工具
VITE_OPEN_DEVTOOLS = false            # 关闭开发工具
```

### 4. 多环境管理

创建 `.env.staging` 用于预发布环境：

```env
# 预发布环境配置
VITE_APP_TITLE = MineAdmin (Staging)
VITE_APP_API_BASEURL = https://staging-api.example.com/
VITE_BUILD_SOURCEMAP = true           # 保留 source map 用于调试
```

## 常见问题

### Q: 修改环境变量后不生效？

**A:** 请确保：
1. 重启开发服务器
2. 环境变量名称以 `VITE_` 开头
3. 语法格式正确（无多余空格）

### Q: 生产环境 API 请求失败？

**A:** 检查以下配置：
1. `VITE_APP_API_BASEURL` 是否正确
2. 后端服务是否配置了正确的 CORS
3. 网络防火墙是否允许对应端口访问

### Q: 如何在代码中获取环境变量？

**A:** 使用 `import.meta.env` 访问：

```typescript
// 获取 API 基础地址
const apiBaseUrl = import.meta.env.VITE_APP_API_BASEURL

// 获取应用标题
const appTitle = import.meta.env.VITE_APP_TITLE

// 检查是否为开发环境
const isDev = import.meta.env.DEV
```

### Q: history 路由模式下页面刷新 404？

**A:** 需要配置服务器重写规则，以 Nginx 为例：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

::: tip 提示
更多部署相关问题，请参考 [部署指南](/zh/guide/deploy) 章节。
:::
