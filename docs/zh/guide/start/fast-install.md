# MineAdmin 快速安装指南

## 概述

MineAdmin 是一个基于 Hyperf 框架的企业级后台管理系统，采用前后端分离架构。本指南将指导您完成 MineAdmin 的快速安装和配置，帮助您在最短时间内搭建一个功能完整的管理系统。

### 系统架构

- **后端**：基于 Hyperf 的 PHP 框架
- **前端**：基于 Vue.js 的现代化单页应用
- **数据库**：支持 MySQL、PostgreSQL 等
- **缓存**：支持 Redis
- **容器化**：支持 Docker 和 Docker Compose

## 系统需求

### 软件环境

#### 本地开发环境
- **PHP**：≥ 8.1
- **Composer**：≥ 2.0
- **Node.js**：≥ 16.0（推荐使用 LTS 版本）
- **pnpm**：≥ 7.0
- **MySQL**：≥ 5.7 或 **PostgreSQL**：≥ 10
- **Redis**：≥ 5.0
- **Git**：用于版本控制

#### Docker 环境（推荐）
- **Docker**：≥ 20.0
- **Docker Compose**：≥ 2.0

::: tip 环境选择建议
- **新手用户**：推荐使用 Docker Compose，环境配置更加简单
- **开发者**：可根据需要选择本地环境或 Docker 环境
- **生产环境**：推荐使用 Docker 进行部署
:::

## 安装方式选择

根据您的使用场景选择合适的安装方式：

| 使用场景 | 推荐方式 | 优势 | 适用用户 |
|---------|---------|------|---------|
| 快速体验/学习 | Docker Compose | 一键部署，环境隔离 | 初学者 |
| 开发调试 | 本地环境 | 灵活性高，便于调试 | 开发者 |
| 生产部署 | Docker Build | 可定制，易扩展 | 运维人员 |

## 快速开始

### 第一步：下载源码

#### 使用 Git 克隆（推荐）

确保已安装 [Git](https://git-scm.com/) 工具，然后执行以下命令：

```bash
# 克隆主分支（标准版本）
git clone https://github.com/mineadmin/MineAdmin.git

# 或克隆到指定目录
git clone https://github.com/mineadmin/MineAdmin.git your-project-name
```

#### 分支选择指南

MineAdmin 提供两个主要分支，请根据您的需求选择：

| 分支名称 | 特性描述 | 适用场景 |
|---------|---------|---------|
| `master` | 标准版本，包含核心功能 | 大多数应用场景 |
| `master-department` | 增强版本，包含部门管理、岗位管理、数据权限等高级功能 | 需要复杂权限管理的企业应用 |

```bash
# 切换到增强版本分支
git checkout master-department
```

::: warning 重要提醒
请在项目开始前确定所需分支，避免后期迁移带来的不必要麻烦。两个分支的数据库结构和功能存在差异。
:::

#### 下载完成后的基础配置

```bash
# 进入项目目录
cd MineAdmin  # 或 your-project-name

# 复制环境配置文件
cp .env.example .env
```

### 第二步：环境配置

打开 `.env` 文件，配置以下关键参数：

```ini
# 应用配置
APP_NAME=MineAdmin
APP_ENV=local
APP_DEBUG=true

# 数据库配置
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

# JWT 配置（需要手动生成）
JWT_SECRET=your_jwt_secret_key
```

::: tip 配置建议
- 生产环境请务必设置 `APP_DEBUG=false`
- 建议使用强密码并定期更换数据库密码
- JWT_SECRET 建议使用随机生成的复杂字符串
:::

## 安装方式详解

### 方式一：Docker Compose 安装（推荐新手）

这是最简单的安装方式，适合快速体验和开发环境。

#### 优势
- 环境隔离，不污染宿主机
- 一键启动所有服务
- 版本统一，避免环境差异

#### 安装步骤

1. **启动服务**

```bash
# 后台启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

2. **等待服务就绪**

初次启动需要下载镜像，请耐心等待。您可以通过以下命令查看日志：

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f mineadmin
```

3. **进入容器执行初始化**

```bash
# 进入应用容器
docker-compose exec mineadmin bash

# 安装依赖（按场景二选一）

# 开发环境:
composer install -vvv

# 生产环境安装:
composer install --no-dev --optimize-autoloader

# 数据库迁移
php bin/hyperf.php migrate

# 数据填充
php bin/hyperf.php db:seed
```

### 方式二：Docker 自构建

适合需要自定义镜像的高级用户。

```bash
# 构建镜像
docker build -t mineadmin:latest .

# 启动容器
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

### 方式三：本地环境安装

适合需要深度开发和调试的开发者。

#### 前置条件检查

在开始安装前，请确认环境是否满足要求：

```bash
# 检查 PHP 版本
php --version

# 检查 Composer 版本
composer --version

# 检查扩展
php -m | grep -E "(swoole|redis|pdo_mysql)"

# 检查 Node.js 版本
node --version

# 检查 pnpm 版本
pnpm --version
```

#### 后端安装

1. **安装 PHP 依赖**

```bash
# 安装依赖（按场景二选一）

# 开发环境:
composer install -vvv

# 生产环境安装:
composer install --no-dev --optimize-autoloader
```

2. **数据库初始化**

```bash
# 创建数据库（可选，也可以手动创建）
mysql -u root -p -e "CREATE DATABASE mineadmin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 执行数据库迁移
php bin/hyperf.php migrate

# 填充初始数据
php bin/hyperf.php db:seed
```

3. **启动后端服务**

```bash
# 启动 Hyperf 服务
php bin/hyperf.php start
```

#### 前端安装

1. **环境准备**

推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本：

```bash
# 安装并使用推荐的 Node.js 版本
nvm install 18
nvm use 18

# 全局安装 pnpm（如果还没安装）
npm install -g pnpm
```

2. **安装前端依赖**

```bash
# 进入前端目录
cd web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 验证安装

### 检查服务状态

1. **后端服务验证**

```bash
# 检查 Hyperf 服务是否正常启动
curl http://localhost:9501/health

# 或使用浏览器访问
# http://localhost:9501
```

2. **前端服务验证**

```bash
# 前端默认运行在 3000 端口
curl http://localhost:3000

# 或使用浏览器访问
# http://localhost:3000
```

3. **数据库连接验证**

```bash
# 检查数据库连接
php bin/hyperf.php db:show
```

### 登录系统

安装完成后，使用以下默认账户登录：

- **管理员账户**：admin
- **默认密码**：123456

::: warning 安全提醒
首次登录后请立即修改默认密码，确保系统安全。
:::

## 常见问题解决

### 安装过程中的常见错误

#### 1. Composer 依赖安装失败

**错误现象**：
```
Your requirements could not be resolved to an installable set of packages.
```

**解决方案**：
```bash
# 清除 Composer 缓存
composer clear-cache

# 更新 Composer 到最新版本
composer self-update

# 重新安装
composer install --ignore-platform-reqs
```

#### 2. 数据库连接失败

**错误现象**：
```
SQLSTATE[HY000] [2002] Connection refused
```

**解决方案**：
1. 检查数据库服务是否启动
2. 验证 `.env` 文件中的数据库配置
3. 确认数据库用户权限

```bash
# 测试数据库连接
mysql -h 127.0.0.1 -P 3306 -u root -p
```

#### 3. Redis 连接失败

**错误现象**：
```
Connection refused [tcp://127.0.0.1:6379]
```

**解决方案**：
```bash
# 检查 Redis 服务状态
redis-cli ping

# 启动 Redis 服务（根据系统不同）
# Ubuntu/Debian
sudo systemctl start redis-server

# CentOS/RHEL
sudo systemctl start redis

# macOS
brew services start redis
```

#### 4. 前端依赖安装缓慢

**解决方案**：
```bash
# 使用淘宝镜像源
pnpm config set registry https://registry.npmmirror.com

# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### 5. 端口占用问题

**检查端口占用**：
```bash
# 检查 9501 端口（后端）
lsof -i :9501
netstat -tulpn | grep :9501

# 检查 3000 端口（前端）
lsof -i :3000
netstat -tulpn | grep :3000
```

**解决方案**：
- 停止占用端口的进程
- 或修改配置文件使用其他端口

### 性能优化建议

#### 开发环境优化

```bash
# 开启 OPcache（PHP 配置）
echo "opcache.enable=1" >> /etc/php/8.1/cli/conf.d/99-opcache.ini

# 增加 PHP 内存限制
echo "memory_limit=512M" >> /etc/php/8.1/cli/conf.d/99-memory.ini
```

#### 生产环境优化

```bash
# 使用生产环境配置
composer install --no-dev --optimize-autoloader

# 清除配置缓存
php bin/hyperf.php config:clear

# 构建前端生产版本
cd web && pnpm build
```
