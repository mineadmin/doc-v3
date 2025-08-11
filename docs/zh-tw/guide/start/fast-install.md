# MineAdmin 快速安裝指南

## 概述

MineAdmin 是一個基於 Hyperf 框架的企業級後臺管理系統，採用前後端分離架構。本指南將指導您完成 MineAdmin 的快速安裝和配置，幫助您在最短時間內搭建一個功能完整的管理系統。

### 系統架構

- **後端**：基於 Hyperf 的 PHP 框架
- **前端**：基於 Vue.js 的現代化單頁應用
- **資料庫**：支援 MySQL、PostgreSQL 等
- **快取**：支援 Redis
- **容器化**：支援 Docker 和 Docker Compose

## 系統需求

### 軟體環境

#### 本地開發環境
- **PHP**：≥ 8.1
- **Composer**：≥ 2.0
- **Node.js**：≥ 16.0（推薦使用 LTS 版本）
- **pnpm**：≥ 7.0
- **MySQL**：≥ 5.7 或 **PostgreSQL**：≥ 10
- **Redis**：≥ 5.0
- **Git**：用於版本控制

#### Docker 環境（推薦）
- **Docker**：≥ 20.0
- **Docker Compose**：≥ 2.0

::: tip 環境選擇建議
- **新手使用者**：推薦使用 Docker Compose，環境配置更加簡單
- **開發者**：可根據需要選擇本地環境或 Docker 環境
- **生產環境**：推薦使用 Docker 進行部署
:::

## 安裝方式選擇

根據您的使用場景選擇合適的安裝方式：

| 使用場景 | 推薦方式 | 優勢 | 適用使用者 |
|---------|---------|------|---------|
| 快速體驗/學習 | Docker Compose | 一鍵部署，環境隔離 | 初學者 |
| 開發除錯 | 本地環境 | 靈活性高，便於除錯 | 開發者 |
| 生產部署 | Docker Build | 可定製，易擴充套件 | 運維人員 |

## 快速開始

### 第一步：下載原始碼

#### 使用 Git 克隆（推薦）

確保已安裝 [Git](https://git-scm.com/) 工具，然後執行以下命令：

```bash
# 克隆主分支（標準版本）
git clone https://github.com/mineadmin/MineAdmin.git

# 或克隆到指定目錄
git clone https://github.com/mineadmin/MineAdmin.git your-project-name
```

#### 分支選擇指南

MineAdmin 提供兩個主要分支，請根據您的需求選擇：

| 分支名稱 | 特性描述 | 適用場景 |
|---------|---------|---------|
| `master` | 標準版本，包含核心功能 | 大多數應用場景 |
| `master-department` | 增強版本，包含部門管理、崗位管理、資料許可權等高階功能 | 需要複雜許可權管理的企業應用 |

```bash
# 切換到增強版本分支
git checkout master-department
```

::: warning 重要提醒
請在專案開始前確定所需分支，避免後期遷移帶來的不必要麻煩。兩個分支的資料庫結構和功能存在差異。
:::

#### 下載完成後的基礎配置

```bash
# 進入專案目錄
cd MineAdmin  # 或 your-project-name

# 複製環境配置檔案
cp .env.example .env
```

### 第二步：環境配置

開啟 `.env` 檔案，配置以下關鍵引數：

```ini
# 應用配置
APP_NAME=MineAdmin
APP_ENV=local
APP_DEBUG=true

# 資料庫配置
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mineadmin
DB_USERNAME=root
DB_PASSWORD=your_password
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci

# Redis 配置
REDIS_HOST=127.0.0.1
REDIS_AUTH=
REDIS_PORT=6379
REDIS_DB=0

# JWT 配置（需要手動生成）
JWT_SECRET=your_jwt_secret_key
```

::: tip 配置建議
- 生產環境請務必設定 `APP_DEBUG=false`
- 建議使用強密碼並定期更換資料庫密碼
- JWT_SECRET 建議使用隨機生成的複雜字串
:::

## 安裝方式詳解

### 方式一：Docker Compose 安裝（推薦新手）

這是最簡單的安裝方式，適合快速體驗和開發環境。

#### 優勢
- 環境隔離，不汙染宿主機
- 一鍵啟動所有服務
- 版本統一，避免環境差異

#### 安裝步驟

1. **啟動服務**

```bash
# 後臺啟動所有服務
docker-compose up -d

# 檢視服務狀態
docker-compose ps
```

2. **等待服務就緒**

初次啟動需要下載映象，請耐心等待。您可以透過以下命令檢視日誌：

```bash
# 檢視所有服務日誌
docker-compose logs -f

# 檢視特定服務日誌
docker-compose logs -f mineadmin
```

3. **進入容器執行初始化**

```bash
# 進入應用容器
docker-compose exec mineadmin bash

# 安裝後端依賴
composer install --no-dev --optimize-autoloader

# 資料庫遷移
php bin/hyperf.php migrate

# 資料填充
php bin/hyperf.php db:seed
```

### 方式二：Docker 自構建

適合需要自定義映象的高階使用者。

```bash
# 構建映象
docker build -t mineadmin:latest .

# 啟動容器
docker run -d \
  --name mineadmin \
  -p 9501:9501 \
  -v $(pwd):/opt/www \
  -e DB_HOST=your_db_host \
  -e DB_DATABASE=mineadmin \
  -e DB_USERNAME=your_username \
  -e DB_PASSWORD=your_password \
  -e REDIS_HOST=your_redis_host \
  mineadmin:latest
```

### 方式三：本地環境安裝

適合需要深度開發和除錯的開發者。

#### 前置條件檢查

在開始安裝前，請確認環境是否滿足要求：

```bash
# 檢查 PHP 版本
php --version

# 檢查 Composer 版本
composer --version

# 檢查擴充套件
php -m | grep -E "(swoole|redis|pdo_mysql)"

# 檢查 Node.js 版本
node --version

# 檢查 pnpm 版本
pnpm --version
```

#### 後端安裝

1. **安裝 PHP 依賴**

```bash
# 安裝依賴包（開發環境）
composer install -vvv

# 生產環境安裝（可選）
composer install --no-dev --optimize-autoloader
```

2. **資料庫初始化**

```bash
# 建立資料庫（可選，也可以手動建立）
mysql -u root -p -e "CREATE DATABASE mineadmin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 執行資料庫遷移
php bin/hyperf.php migrate

# 填充初始資料
php bin/hyperf.php db:seed
```

3. **啟動後端服務**

```bash
# 啟動 Hyperf 服務
php bin/hyperf.php start
```

#### 前端安裝

1. **環境準備**

推薦使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本：

```bash
# 安裝並使用推薦的 Node.js 版本
nvm install 18
nvm use 18

# 全域性安裝 pnpm（如果還沒安裝）
npm install -g pnpm
```

2. **安裝前端依賴**

```bash
# 進入前端目錄
cd web

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev
```

## 驗證安裝

### 檢查服務狀態

1. **後端服務驗證**

```bash
# 檢查 Hyperf 服務是否正常啟動
curl http://localhost:9501/health

# 或使用瀏覽器訪問
# http://localhost:9501
```

2. **前端服務驗證**

```bash
# 前端預設執行在 3000 埠
curl http://localhost:3000

# 或使用瀏覽器訪問
# http://localhost:3000
```

3. **資料庫連線驗證**

```bash
# 檢查資料庫連線
php bin/hyperf.php db:show
```

### 登入系統

安裝完成後，使用以下預設賬戶登入：

- **管理員賬戶**：admin
- **預設密碼**：123456

::: warning 安全提醒
首次登入後請立即修改預設密碼，確保系統安全。
:::

## 常見問題解決

### 安裝過程中的常見錯誤

#### 1. Composer 依賴安裝失敗

**錯誤現象**：
```
Your requirements could not be resolved to an installable set of packages.
```

**解決方案**：
```bash
# 清除 Composer 快取
composer clear-cache

# 更新 Composer 到最新版本
composer self-update

# 重新安裝
composer install --ignore-platform-reqs
```

#### 2. 資料庫連線失敗

**錯誤現象**：
```
SQLSTATE[HY000] [2002] Connection refused
```

**解決方案**：
1. 檢查資料庫服務是否啟動
2. 驗證 `.env` 檔案中的資料庫配置
3. 確認資料庫使用者許可權

```bash
# 測試資料庫連線
mysql -h 127.0.0.1 -P 3306 -u root -p
```

#### 3. Redis 連線失敗

**錯誤現象**：
```
Connection refused [tcp://127.0.0.1:6379]
```

**解決方案**：
```bash
# 檢查 Redis 服務狀態
redis-cli ping

# 啟動 Redis 服務（根據系統不同）
# Ubuntu/Debian
sudo systemctl start redis-server

# CentOS/RHEL
sudo systemctl start redis

# macOS
brew services start redis
```

#### 4. 前端依賴安裝緩慢

**解決方案**：
```bash
# 使用淘寶映象源
pnpm config set registry https://registry.npmmirror.com

# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### 5. 端口占用問題

**檢查端口占用**：
```bash
# 檢查 9501 埠（後端）
lsof -i :9501
netstat -tulpn | grep :9501

# 檢查 3000 埠（前端）
lsof -i :3000
netstat -tulpn | grep :3000
```

**解決方案**：
- 停止佔用埠的程序
- 或修改配置檔案使用其他埠

### 效能最佳化建議

#### 開發環境最佳化

```bash
# 開啟 OPcache（PHP 配置）
echo "opcache.enable=1" >> /etc/php/8.1/cli/conf.d/99-opcache.ini

# 增加 PHP 記憶體限制
echo "memory_limit=512M" >> /etc/php/8.1/cli/conf.d/99-memory.ini
```

#### 生產環境最佳化

```bash
# 使用生產環境配置
composer install --no-dev --optimize-autoloader

# 清除配置快取
php bin/hyperf.php config:clear

# 構建前端生產版本
cd web && pnpm build
```