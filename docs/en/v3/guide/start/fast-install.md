# MineAdmin Quick Installation Guide

## Overview

MineAdmin is an enterprise-level backend management system based on the Hyperf framework, adopting a front-end and back-end separation architecture. This guide will walk you through the quick installation and configuration of MineAdmin, helping you set up a fully functional management system in the shortest possible time.

### System Architecture

- **Backend**: PHP framework based on Hyperf
- **Frontend**: Modern single-page application based on Vue.js
- **Database**: Supports MySQL, PostgreSQL, etc.
- **Cache**: Supports Redis
- **Containerization**: Supports Docker and Docker Compose

## System Requirements

### Software Environment

#### Local Development Environment
- **PHP**: ≥ 8.1
- **Composer**: ≥ 2.0
- **Node.js**: ≥ 16.0 (LTS version recommended)
- **pnpm**: ≥ 7.0
- **MySQL**: ≥ 5.7 or **PostgreSQL**: ≥ 10
- **Redis**: ≥ 5.0
- **Git**: For version control

#### Docker Environment (Recommended)
- **Docker**: ≥ 20.0
- **Docker Compose**: ≥ 2.0

::: tip Environment Selection Advice
- **New Users**: Docker Compose is recommended, environment configuration is simpler
- **Developers**: Can choose local environment or Docker environment as needed
- **Production Environment**: Docker deployment is recommended
:::

## Installation Method Selection

Choose the appropriate installation method according to your usage scenario:

| Usage Scenario | Recommended Method | Advantages | Target Users |
|---------|---------|------|---------|
| Quick Experience/Learning | Docker Compose | One-click deployment, environment isolation | Beginners |
| Development/Debugging | Local Environment | High flexibility, easy to debug | Developers |
| Production Deployment | Docker Build | Customizable, easy to scale | Operations Personnel |

## Quick Start

### Step 1: Download Source Code

#### Using Git Clone (Recommended)

Ensure [Git](https://git-scm.com/) is installed, then execute the following command:

```bash
# Clone the main branch (standard version)
git clone https://github.com/mineadmin/MineAdmin.git

# Or clone to a specific directory
git clone https://github.com/mineadmin/MineAdmin.git your-project-name
```

#### Branch Selection Guide

MineAdmin provides two main branches, please choose according to your needs:

| Branch Name | Feature Description | Applicable Scenario |
|---------|---------|---------|
| `master` | Standard version, includes core features | Most application scenarios |
| `master-department` | Enhanced version, includes advanced features like department management, position management, data permissions | Enterprise applications requiring complex permission management |

```bash
# Switch to the enhanced version branch
git checkout master-department
```

::: warning Important Reminder
Please determine the required branch before starting the project to avoid unnecessary trouble from later migration. The database structures and features of the two branches differ.
:::

#### Basic Configuration After Download

```bash
# Enter the project directory
cd MineAdmin  # or your-project-name

# Copy the environment configuration file
cp .env.example .env
```

### Step 2: Environment Configuration

Open the `.env` file and configure the following key parameters:

```ini
# Application Configuration
APP_NAME=MineAdmin
APP_ENV=local
APP_DEBUG=true

# Database Configuration
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mineadmin
DB_USERNAME=root
DB_PASSWORD=your_password
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_AUTH=
REDIS_PORT=6379
REDIS_DB=0

# JWT Configuration (needs to be generated manually)
JWT_SECRET=your_jwt_secret_key
```

::: tip Configuration Advice
- For production environment, be sure to set `APP_DEBUG=false`
- It is recommended to use strong passwords and change database passwords regularly
- JWT_SECRET should use a randomly generated complex string
:::

## Installation Method Details

### Method 1: Docker Compose Installation (Recommended for Beginners)

This is the simplest installation method, suitable for quick experience and development environments.

#### Advantages
- Environment isolation, does not pollute the host machine
- One-click startup for all services
- Unified version, avoids environment differences

#### Installation Steps

1. **Start Services**

```bash
# Start all services in the background
docker-compose up -d

# Check service status
docker-compose ps
```

2. **Wait for Services to be Ready**

The first startup requires downloading images, please be patient. You can view the logs with the following command:

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f mineadmin
```

3. **Enter the Container for Initialization**

```bash
# Enter the application container
docker-compose exec mineadmin bash

# Install dependencies (choose one based on the scenario)

# Development environment:
composer install -vvv

# Production environment installation:
composer install --no-dev --optimize-autoloader

# Database migration
php bin/hyperf.php migrate

# Data seeding
php bin/hyperf.php db:seed
```

### Method 2: Docker Self-Build

Suitable for advanced users who need custom images.

```bash
# Build the image
docker build -t mineadmin:latest .

# Start the container
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

### Method 3: Local Environment Installation

Suitable for developers who need deep development and debugging.

#### Prerequisite Check

Before starting the installation, confirm whether the environment meets the requirements:

```bash
# Check PHP version
php --version

# Check Composer version
composer --version

# Check extensions
php -m | grep -E "(swoole|redis|pdo_mysql)"

# Check Node.js version
node --version

# Check pnpm version
pnpm --version
```

#### Backend Installation

1. **Install PHP Dependencies**

```bash
# Install dependencies (choose one based on the scenario)

# Development environment:
composer install -vvv

# Production environment installation:
composer install --no-dev --optimize-autoloader
```

2. **Database Initialization**

```bash
# Create the database (optional, can also be created manually)
mysql -u root -p -e "CREATE DATABASE mineadmin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Execute database migration
php bin/hyperf.php migrate

# Seed initial data
php bin/hyperf.php db:seed
```

3. **Start the Backend Service**

```bash
# Start the Hyperf service
php bin/hyperf.php start
```

#### Frontend Installation

1. **Environment Preparation**

It is recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage the Node.js version:

```bash
# Install and use the recommended Node.js version
nvm install 18
nvm use 18

# Install pnpm globally (if not already installed)
npm install -g pnpm
```

2. **Install Frontend Dependencies**

```bash
# Enter the frontend directory
cd web

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## Verify Installation

### Check Service Status

1. **Backend Service Verification**

```bash
# Check if the Hyperf service is running normally
curl http://localhost:9501/health

# Or visit via browser
# http://localhost:9501
```

2. **Frontend Service Verification**

```bash
# Frontend runs on port 3000 by default
curl http://localhost:3000

# Or visit via browser
# http://localhost:3000
```

3. **Database Connection Verification**

```bash
# Check database connection
php bin/hyperf.php db:show
```

### Log into the System

After installation is complete, log in using the following default account:

- **Administrator Account**: admin
- **Default Password**: 123456

::: warning Security Reminder
Please change the default password immediately after the first login to ensure system security.
:::

## Common Problem Solving

### Common Errors During Installation

#### 1. Composer Dependency Installation Failure

**Error Phenomenon**:
```
Your requirements could not be resolved to an installable set of packages.
```

**Solution**:
```bash
# Clear Composer cache
composer clear-cache

# Update Composer to the latest version
composer self-update

# Reinstall
composer install --ignore-platform-reqs
```

#### 2. Database Connection Failure

**Error Phenomenon**:
```
SQLSTATE[HY000] [2002] Connection refused
```

**Solution**:
1. Check if the database service is running
2. Verify the database configuration in the `.env` file
3. Confirm database user permissions

```bash
# Test database connection
mysql -h 127.0.0.1 -P 3306 -u root -p
```

#### 3. Redis Connection Failure

**Error Phenomenon**:
```
Connection refused [tcp://127.0.0.1:6379]
```

**Solution**:
```bash
# Check Redis service status
redis-cli ping

# Start Redis service (depends on the system)
# Ubuntu/Debian
sudo systemctl start redis-server

# CentOS/RHEL
sudo systemctl start redis

# macOS
brew services start redis
```

#### 4. Slow Frontend Dependency Installation

**Solution**:
```bash
# Use Taobao mirror source
pnpm config set registry https://registry.npmmirror.com

# Or use cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### 5. Port Occupancy Issues

**Check Port Occupancy**:
```bash
# Check port 9501 (backend)
lsof -i :9501
netstat -tulpn | grep :9501

# Check port 3000 (frontend)
lsof -i :3000
netstat -tulpn | grep :3000
```

**Solution**:
- Stop the process occupying the port
- Or modify the configuration file to use another port

### Performance Optimization Suggestions

#### Development Environment Optimization

```bash
# Enable OPcache (PHP configuration)
echo "opcache.enable=1" >> /etc/php/8.1/cli/conf.d/99-opcache.ini

# Increase PHP memory limit
echo "memory_limit=512M" >> /etc/php/8.1/cli/conf.d/99-memory.ini
```

#### Production Environment Optimization

```bash
# Use production environment configuration
composer install --no-dev --optimize-autoloader

# Clear configuration cache
php bin/hyperf.php config:clear

# Build the frontend production version
cd web && pnpm build
```