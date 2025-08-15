# 部署

本文将讲述如何在各种环境中部署 MineAdmin 的前后端应用程序，包括开发、测试、生产环境的最佳实践。

## 部署架构概览

MineAdmin 采用前后端分离架构，基于以下技术栈：
- **后端**: PHP 8.1+ + Hyperf 框架 + Swoole 扩展
- **前端**: Vue 3 + TypeScript + Vite
- **数据库**: MySQL 5.7+ / PostgreSQL (可选)
- **缓存**: Redis 6.0+
- **容器化**: Docker + Docker Compose

```plantuml
@startuml MineAdmin 部署架构图
!theme plain

skinparam rectangle {
    BackgroundColor LightBlue
    BorderColor Black
}

skinparam component {
    BackgroundColor LightGreen
    BorderColor Black
}

rectangle "负载均衡" as LB {
    component "Nginx/HAProxy" as nginx
}

rectangle "Web 层" as Web {
    component "前端静态资源\n(Vue 3 + Vite)" as frontend
}

rectangle "API 层" as API {
    component "MineAdmin 后端\n(PHP 8.1 + Hyperf)" as backend1
    component "MineAdmin 后端\n(PHP 8.1 + Hyperf)" as backend2
}

rectangle "数据层" as Data {
    component "MySQL 5.7+" as mysql
    component "Redis 6.0+" as redis
}

LB --> Web
LB --> API
API --> Data

@enduml
```

## 环境准备

### PHP 扩展要求

基于 [`mineadmin/Dockerfile`](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile) 的配置：

**必需扩展:**
- cURL >= 7.68
- Fileinfo 
- OpenSSL >= 1.1
- PDO
- Redis >= 5.3
- JSON
- Tokenizer
- SimpleXML
- XMLWriter

**可选扩展:**
- PDO_MYSQL (MySQL 支持)
- PDO_PGSQL (PostgreSQL 支持)  
- Swoole >= 5.1 (高性能模式)
- Swow >= 1.5 
- XlsWriter (Excel 文件支持)

**PHP 配置优化:**
```ini
# /etc/php/8.1/php.ini 或相应版本路径
upload_max_filesize = 128M
post_max_size = 128M
memory_limit = 1G
max_execution_time = 300
max_input_vars = 3000
date.timezone = Asia/Shanghai
```

## 后端部署

### 1. 环境配置

#### 创建环境配置文件

复制并配置环境文件，参考 [`mineadmin/.env.example`](https://github.com/mineadmin/MineAdmin/blob/master/.env.example)：

```shell
cp .env.example .env
```

**开发环境配置 (.env)**:
```bash
APP_NAME=MineAdmin
APP_ENV=dev
APP_DEBUG=true
APP_URL=http://127.0.0.1:9501

# 数据库配置
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mineadmin
DB_USERNAME=root
DB_PASSWORD=your_password
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
DB_PREFIX=

# Redis 配置
REDIS_HOST=127.0.0.1
REDIS_AUTH=
REDIS_PORT=6379
REDIS_DB=0

# JWT 密钥 (请生成新的密钥)
JWT_SECRET=your_jwt_secret_key_here
```

**生产环境配置**:
```bash
APP_NAME=MineAdmin
APP_ENV=prod
APP_DEBUG=false
APP_URL=https://your-domain.com

# 数据库配置 (使用内网 IP)
DB_DRIVER=mysql
DB_HOST=10.0.0.10
DB_PORT=3306
DB_DATABASE=mineadmin
DB_USERNAME=mineadmin
DB_PASSWORD=strong_password_here
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
DB_PREFIX=

# Redis 配置 (使用内网 IP，启用密码)
REDIS_HOST=10.0.0.11
REDIS_AUTH=redis_password_here
REDIS_PORT=6379
REDIS_DB=0

# JWT 密钥 (64 字符强密钥)
JWT_SECRET=generated_64_character_jwt_secret_key_here
```

#### 生成 JWT 密钥

```shell
# 生成安全的 JWT 密钥
php -r "echo base64_encode(random_bytes(64)) . PHP_EOL;"
```

### 2. 数据库初始化

#### 数据库迁移

执行数据库迁移，基于 [`mineadmin/databases/migrations/`](https://github.com/mineadmin/MineAdmin/tree/master/databases/migrations) 目录中的迁移文件：

```shell
# 运行数据库迁移
php bin/hyperf.php migrate

# 查看迁移状态
php bin/hyperf.php migrate:status
```

**主要数据表包括**:
- `user` - 用户表
- `menu` - 菜单表  
- `role` - 角色表
- `rules` - 权限规则表
- `attachment` - 附件表
- `user_login_log` - 用户登录日志
- `user_operation_log` - 用户操作日志

#### 数据填充（可选）

```shell
# 执行数据填充
php bin/hyperf.php db:seed
```

### 3. 直接服务器部署

#### 使用 Supervisord 进程管理

创建 Supervisor 配置文件 `/etc/supervisor/conf.d/mineadmin.conf`:

```ini
[program:mineadmin]
command=php /var/www/mineadmin/bin/hyperf.php start
directory=/var/www/mineadmin
autostart=true
autorestart=true
startretries=3
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/mineadmin.log
stdout_logfile_maxbytes=50MB
stdout_logfile_backups=10
```

启动服务:
```shell
# 重新加载配置
sudo supervisorctl reread
sudo supervisorctl update

# 启动 MineAdmin
sudo supervisorctl start mineadmin

# 查看状态
sudo supervisorctl status mineadmin
```

#### 使用 Systemd 服务管理

创建系统服务文件 `/etc/systemd/system/mineadmin.service`:

```ini
[Unit]
Description=MineAdmin Hyperf Service
After=network.target mysql.service redis.service

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=/var/www/mineadmin
ExecStart=/usr/bin/php /var/www/mineadmin/bin/hyperf.php start -d
ExecStop=/bin/kill -TERM $MAINPID
ExecReload=/bin/kill -USR1 $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=mineadmin

[Install]
WantedBy=multi-user.target
```

管理服务:
```shell
# 启用并启动服务
sudo systemctl enable mineadmin
sudo systemctl start mineadmin

# 查看服务状态
sudo systemctl status mineadmin

# 查看日志
sudo journalctl -u mineadmin -f
```

### 4. 容器化部署 (推荐)

#### 单容器部署

基于项目根目录的 [`Dockerfile`](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile):

```shell
# 构建镜像
docker build -t mineadmin:latest .

# 运行容器 (开发环境)
docker run -d \
  --name mineadmin \
  -p 9501:9501 \
  -p 9503:9503 \
  -v $(pwd)/.env:/opt/www/.env \
  -v $(pwd)/storage:/opt/www/storage \
  mineadmin:latest

# 查看容器状态
docker ps -a
docker logs mineadmin
```

#### Docker Compose 部署（完整环境）

使用项目提供的 [`docker-compose.yml`](https://github.com/mineadmin/MineAdmin/blob/master/docker-compose.yml) 配置：

**开发环境 docker-compose.yml**:
```yaml
name: mineadmin-dev

volumes:
  mine_redis_data:
  mine_mysql_data:
  mine_uploads:

networks:
  mineadmin:
    driver: bridge

services:
  redis:
    image: redis:7.2-alpine
    container_name: mineadmin-redis
    ports:
      - "6379:6379"
    volumes:
      - mine_redis_data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-}
    environment:
      - TZ=Asia/Shanghai
    networks:
      - mineadmin
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M

  mysql:
    image: mysql:8.0
    container_name: mineadmin-mysql
    volumes:
      - mine_mysql_data:/var/lib/mysql
      - ./docker/mysql/conf.d:/etc/mysql/conf.d
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-root}
      MYSQL_DATABASE: ${DB_DATABASE:-mineadmin}
      MYSQL_USER: ${DB_USERNAME:-mineadmin}
      MYSQL_PASSWORD: ${DB_PASSWORD:-root}
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
      TZ: Asia/Shanghai
    networks:
      - mineadmin
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 1G

  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - timezone=Asia/Shanghai
    container_name: mineadmin-app
    volumes:
      - ./:/opt/www
      - mine_uploads:/opt/www/storage/uploads
    ports:
      - "9501:9501"
      - "9503:9503"
    environment:
      - TZ=Asia/Shanghai
      - APP_ENV=dev
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - mineadmin
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9501/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**生产环境部署**:
```shell
# 创建生产环境配置
cp .env.example .env.prod

# 启动服务
docker-compose --env-file .env.prod up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app
```

#### Kubernetes 部署

**ConfigMap 配置**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mineadmin-config
  namespace: mineadmin
data:
  .env: |
    APP_NAME=MineAdmin
    APP_ENV=prod
    APP_DEBUG=false
    APP_URL=https://admin.yourdomain.com
    
    DB_DRIVER=mysql
    DB_HOST=mysql-service
    DB_PORT=3306
    DB_DATABASE=mineadmin
    DB_USERNAME=mineadmin
    DB_PASSWORD=your_secure_password
    DB_CHARSET=utf8mb4
    DB_COLLATION=utf8mb4_unicode_ci
    DB_PREFIX=
    
    REDIS_HOST=redis-service
    REDIS_AUTH=your_redis_password
    REDIS_PORT=6379
    REDIS_DB=0
    
    JWT_SECRET=your_64_character_jwt_secret
```

**Deployment 配置**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mineadmin-deployment
  namespace: mineadmin
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mineadmin
  template:
    metadata:
      labels:
        app: mineadmin
    spec:
      containers:
      - name: mineadmin
        image: mineadmin:latest
        ports:
        - containerPort: 9501
        - containerPort: 9503
        env:
        - name: APP_ENV
          value: "prod"
        - name: TZ
          value: "Asia/Shanghai"
        volumeMounts:
        - name: config-volume
          mountPath: /opt/www/.env
          subPath: .env
        - name: storage-volume
          mountPath: /opt/www/storage
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 9501
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 9501
          initialDelaySeconds: 10
          periodSeconds: 5
      volumes:
      - name: config-volume
        configMap:
          name: mineadmin-config
      - name: storage-volume
        persistentVolumeClaim:
          claimName: mineadmin-storage-pvc
```

**Service 配置**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mineadmin-service
  namespace: mineadmin
spec:
  selector:
    app: mineadmin
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9501
  type: ClusterIP
```

**Ingress 配置**:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mineadmin-ingress
  namespace: mineadmin
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "128m"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - admin.yourdomain.com
    secretName: mineadmin-tls
  rules:
  - host: admin.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mineadmin-service
            port:
              number: 80
```

### 5. 反向代理与负载均衡

<el-alert type="warning">无论何时都不建议将应用程序直接暴露在公网环境，最好是通过反向代理进行流量转发</el-alert>

基于 [`mineadmin/config/autoload/server.php`](https://github.com/mineadmin/MineAdmin/blob/master/config/autoload/server.php) 的服务器配置，应用默认监听 9501 端口。

#### Nginx 反向代理

**生产环境 Nginx 配置** (`/etc/nginx/sites-available/mineadmin`):

```nginx
# 上游服务器配置 (负载均衡)
upstream mineadmin_backend {
    # 权重轮询
    server 127.0.0.1:9501 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:9502 weight=1 max_fails=3 fail_timeout=30s backup;
    
    # 会话保持
    ip_hash;
    
    # 健康检查 (需要 nginx_upstream_check_module)
    # check interval=3000 rise=2 fall=5 timeout=1000 type=http;
}

# HTTPS 重定向
server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# 主要配置
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;
    
    # SSL 配置
    ssl_certificate /etc/ssl/certs/mineadmin.crt;
    ssl_certificate_key /etc/ssl/private/mineadmin.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 5m;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 日志配置
    access_log /var/log/nginx/mineadmin.access.log;
    error_log /var/log/nginx/mineadmin.error.log warn;
    
    # 客户端配置
    client_max_body_size 128M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API 代理
    location / {
        proxy_pass http://mineadmin_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 30s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲区配置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        
        # 错误处理
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_next_upstream_tries 3;
        proxy_next_upstream_timeout 30s;
    }
    
    # 健康检查端点
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

**启用站点**:
```shell
# 创建软链接
sudo ln -s /etc/nginx/sites-available/mineadmin /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

#### HAProxy 负载均衡

**HAProxy 配置** (`/etc/haproxy/haproxy.cfg`):

```haproxy
global
    daemon
    maxconn 4096
    log stdout local0

defaults
    mode http
    log global
    option httplog
    option dontlognull
    option redispatch
    retries 3
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

# 前端配置
frontend mineadmin_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/mineadmin.pem
    redirect scheme https if !{ ssl_fc }
    
    # 安全头
    http-response set-header X-Frame-Options SAMEORIGIN
    http-response set-header X-XSS-Protection "1; mode=block"
    http-response set-header X-Content-Type-Options nosniff
    
    default_backend mineadmin_backend

# 后端配置
backend mineadmin_backend
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    
    server app1 127.0.0.1:9501 check inter 2000ms rise 2 fall 3
    server app2 127.0.0.1:9502 check inter 2000ms rise 2 fall 3 backup

# 统计页面
stats enable
stats uri /haproxy/stats
stats refresh 30s
stats hide-version
stats auth admin:your_password_here
```

### 6. 性能优化

#### Swoole 性能调优

基于 [`mineadmin/config/autoload/server.php`](https://github.com/mineadmin/MineAdmin/blob/master/config/autoload/server.php) 配置调整：

```php
<?php
// config/autoload/server.php

return [
    'mode' => SWOOLE_PROCESS,
    'servers' => [
        [
            'name' => 'http',
            'type' => Server::SERVER_HTTP,
            'host' => '0.0.0.0',
            'port' => 9501,
            'sock_type' => SWOOLE_SOCK_TCP,
            'callbacks' => [
                Event::ON_REQUEST => [Hyperf\HttpServer\Server::class, 'onRequest'],
            ],
        ],
    ],
    'settings' => [
        // 性能优化配置
        Constant::OPTION_WORKER_NUM => swoole_cpu_num() * 2, // 工作进程数
        Constant::OPTION_MAX_COROUTINE => 100000, // 最大协程数
        Constant::OPTION_OPEN_TCP_NODELAY => true, // TCP_NODELAY
        Constant::OPTION_MAX_REQUEST => 50000, // 工作进程最大请求数
        Constant::OPTION_SOCKET_BUFFER_SIZE => 2 * 1024 * 1024, // Socket 缓冲区大小
        Constant::OPTION_PACKAGE_MAX_LENGTH => 10 * 1024 * 1024, // 最大包长度
        // HTTP2 支持
        Constant::OPTION_OPEN_HTTP2_PROTOCOL => true,
        
        // 进程管理
        Constant::OPTION_PID_FILE => BASE_PATH . '/runtime/hyperf.pid',
        Constant::OPTION_LOG_FILE => BASE_PATH . '/runtime/logs/swoole.log',
        Constant::OPTION_LOG_LEVEL => SWOOLE_LOG_INFO,
        
        // 内存优化
        Constant::OPTION_BACKLOG => 128,
        Constant::OPTION_HEARTBEAT_CHECK_INTERVAL => 30,
        Constant::OPTION_HEARTBEAT_IDLE_TIME => 60,
    ],
];
```

#### 数据库连接池优化

基于 [`mineadmin/config/autoload/databases.php`](https://github.com/mineadmin/MineAdmin/blob/master/config/autoload/databases.php) 配置：

```php
<?php
// config/autoload/databases.php

return [
    'default' => [
        'driver' => env('DB_DRIVER', 'mysql'),
        'host' => env('DB_HOST', 'localhost'),
        'port' => env('DB_PORT', 3306),
        'database' => env('DB_DATABASE', 'mineadmin'),
        'username' => env('DB_USERNAME', 'root'),
        'password' => env('DB_PASSWORD'),
        'charset' => env('DB_CHARSET', 'utf8mb4'),
        'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
        'prefix' => env('DB_PREFIX', ''),
        
        // 连接池配置 (生产环境优化)
        'pool' => [
            'min_connections' => 10,        // 最小连接数
            'max_connections' => 100,       // 最大连接数
            'connect_timeout' => 10.0,      // 连接超时时间
            'wait_timeout' => 3.0,          // 等待超时时间
            'heartbeat' => -1,              // 心跳间隔
            'max_idle_time' => 60,          // 最大空闲时间
        ],
        
        // 查询缓存配置
        'cache' => [
            'handler' => RedisHandler::class,
            'cache_key' => 'MineAdmin:%s:m:%s:%s:%s',
            'prefix' => 'model-cache',
            'ttl' => 86400 * 7,             // 缓存时间
            'empty_model_ttl' => 60,        // 空模型缓存时间
            'load_script' => true,
            'use_default_value' => false,
        ],
    ],
];
```

#### Redis 缓存优化

```redis
# /etc/redis/redis.conf 生产环境配置

# 基础配置
bind 127.0.0.1
port 6379
timeout 0
keepalive 300
requirepass your_redis_password

# 内存优化
maxmemory 2gb
maxmemory-policy allkeys-lru
maxmemory-samples 10

# 持久化配置
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis

# AOF 配置
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# 客户端连接
maxclients 10000
tcp-keepalive 60
tcp-backlog 511

# 日志配置
loglevel notice
logfile /var/log/redis/redis-server.log
```

### 7. 安全配置

#### 生产环境安全配置

基于 [`mineadmin/config/config.php`](https://github.com/mineadmin/MineAdmin/blob/master/config/config.php) 的调试配置：

```php
<?php
// config/config.php - 生产环境安全配置

return [
    'app_name' => env('APP_NAME', 'MineAdmin'),
    
    // 生产环境必须关闭调试模式
    'scan_cacheable' => true,   // 启用扫描缓存
    'debug' => false,           // 关闭调试模式
    
    // 日志级别配置 (生产环境)
    StdoutLoggerInterface::class => [
        'log_level' => [
            LogLevel::ALERT,
            LogLevel::CRITICAL,
            LogLevel::EMERGENCY,
            LogLevel::ERROR,
            LogLevel::WARNING,
            // LogLevel::INFO,    // 生产环境可以关闭 INFO 日志
            // LogLevel::DEBUG,   // 生产环境必须关闭 DEBUG 日志
        ],
    ],
];
```

#### 防火墙配置

**UFW 防火墙规则**:
```shell
# 重置防火墙规则
sudo ufw --force reset

# 默认拒绝所有连接
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 允许 SSH (修改为非默认端口)
sudo ufw allow 22022/tcp

# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 允许内网数据库连接
sudo ufw allow from 10.0.0.0/8 to any port 3306
sudo ufw allow from 10.0.0.0/8 to any port 6379

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status verbose
```

**iptables 防火墙规则**:
```shell
#!/bin/bash
# /etc/iptables/rules.sh

# 清空现有规则
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# 设置默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH (非默认端口)
iptables -A INPUT -p tcp --dport 22022 -j ACCEPT

# 允许 HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 防 DDoS 攻击
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT

# 保存规则
iptables-save > /etc/iptables/rules.v4
```

### 8. 监控与日志

#### 系统监控配置

**Prometheus + Grafana 监控配置**:

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=your_password

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"

volumes:
  prometheus_data:
  grafana_data:
```


#### 日志管理

**结构化日志配置**:
```php
<?php
// config/autoload/logger.php

use Monolog\Formatter\JsonFormatter;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;

return [
    'default' => [
        'handlers' => [
            [
                'class' => RotatingFileHandler::class,
                'constructor' => [
                    'filename' => BASE_PATH . '/runtime/logs/mineadmin.log',
                    'maxFiles' => 14,
                    'level' => Logger::DEBUG,
                ],
                'formatter' => [
                    'class' => JsonFormatter::class,
                    'constructor' => [],
                ],
            ],
            [
                'class' => StreamHandler::class,
                'constructor' => [
                    'stream' => 'php://stdout',
                    'level' => env('APP_DEBUG') ? Logger::DEBUG : Logger::INFO,
                ],
                'formatter' => [
                    'class' => JsonFormatter::class,
                    'constructor' => [],
                ],
            ],
        ],
    ],
];
```

**ELK Stack 日志收集**:
```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.0
    container_name: logstash
    volumes:
      - ./logging/logstash/config:/usr/share/logstash/config
      - ./logging/logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5044:5044"
      - "5000:5000/tcp"
      - "5000:5000/udp"
      - "9600:9600"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_URL: http://elasticsearch:9200
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

### 9. 调试模式与环境切换

在 [`mineadmin/config/config.php`](https://github.com/mineadmin/MineAdmin/blob/master/config/config.php) 配置文件中，调试选项决定了错误信息的展示级别，默认遵循环境变量 `APP_DEBUG` 的值。

**环境配置说明**:

| 环境 | APP_ENV | APP_DEBUG | 说明 |
|------|---------|-----------|------|
| 开发 | dev | true | 显示详细错误信息，启用热重载 |
| 测试 | test | false | 模拟生产环境，记录详细日志 |
| 生产 | prod | false | 隐藏错误信息，优化性能 |

::: danger 安全警告
在生产环境中，`APP_DEBUG` 必须设置为 `false`。如果设置为 `true`，将可能暴露敏感信息（数据库配置、API 密钥等）给最终用户，存在严重安全风险。
:::

**环境切换命令**:
```shell
# 切换到生产环境
export APP_ENV=prod
export APP_DEBUG=false

# 重启服务
supervisorctl restart mineadmin
```

## 前端部署

MineAdmin 前端基于 Vue 3 + TypeScript + Vite 构建，支持现代化的 SPA 单页应用部署。

### 1. 构建准备

#### 环境要求

基于 [`mineadmin/web/package.json`](https://github.com/mineadmin/MineAdmin/blob/master/web/package.json) 配置：

- **Node.js**: >= 18.16.0
- **包管理器**: pnpm (推荐) >= 8.0.0
- **构建工具**: Vite >= 4.0.0

#### 依赖安装

```shell
# 进入前端目录
cd web

# 安装依赖 (推荐使用 pnpm)
pnpm install

# 或使用 npm
npm install
```

### 2. 构建配置

#### 环境变量配置

创建不同环境的配置文件：

**开发环境** (`.env.development`):
```bash
# API 基础地址
VITE_API_BASE_URL=http://127.0.0.1:9501
VITE_API_PREFIX=/api

# 应用配置
VITE_APP_NAME=MineAdmin
VITE_APP_VERSION=3.0.0

# 开发配置
VITE_DEV_MOCK=false
VITE_DEV_PROXY=true
```

**生产环境** (`.env.production`):
```bash
# API 基础地址
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_PREFIX=/api

# 应用配置
VITE_APP_NAME=MineAdmin
VITE_APP_VERSION=3.0.0

# 生产配置
VITE_BUILD_COMPRESS=gzip
VITE_BUILD_ANALYZE=false
VITE_BUILD_DROP_CONSOLE=true
```

#### Vite 构建配置优化

```typescript
// vite.config.ts 生产环境优化配置
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    base: '/', // 根路径部署
    
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction, // 生产环境禁用 sourcemap
      minify: 'terser',
      
      // 代码分割
      rollupOptions: {
        output: {
          // 手动分包
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            'lodash': ['lodash-es'],
            'utils': ['axios', 'dayjs']
          },
          
          // 静态资源命名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      },
      
      // 压缩配置
      terserOptions: {
        compress: {
          drop_console: isProduction, // 生产环境移除 console
          drop_debugger: isProduction
        }
      },
      
      // 大文件警告阈值
      chunkSizeWarningLimit: 1500
    },
    
    // 开发服务器配置
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:9501',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
```

### 3. 直接服务器部署

#### 构建静态资源

```shell
# 开发环境构建
pnpm build --mode development

# 生产环境构建
pnpm build --mode production

# 构建并分析包大小
pnpm build --mode production && pnpm analyze
```

#### Nginx 静态文件配置

**完整的 Nginx 前端配置** (`/etc/nginx/sites-available/mineadmin-frontend`):

```nginx
server {
    listen 80;
    server_name www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.yourdomain.com;
    
    # SSL 配置
    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 5m;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 文档根目录
    root /var/www/mineadmin/web/dist;
    index index.html;
    
    # 日志配置
    access_log /var/log/nginx/mineadmin-frontend.access.log;
    error_log /var/log/nginx/mineadmin-frontend.error.log warn;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Brotli 压缩 (如果已安装)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # 静态资源缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        
        # 预压缩文件支持
        location ~* \.(js|css)$ {
            gzip_static on;
        }
    }
    
    # 字体文件缓存
    location ~* \.(woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }
    
    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }
    
    # API 代理到后端服务
    location ^~ /api/ {
        proxy_pass http://127.0.0.1:9501;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS 支持
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # 单页应用路由支持
    location / {
        try_files $uri $uri/ /index.html;
        
        # 预加载关键资源
        add_header Link "</assets/index.css>; rel=preload; as=style" always;
        add_header Link "</assets/index.js>; rel=preload; as=script" always;
    }
    
    # 健康检查
    location = /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 安全配置
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~* \.(env|log|ini)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 4. 容器化部署（推荐）

#### 多阶段构建 Dockerfile

基于项目提供的 [`mineadmin/web/Dockerfile`](https://github.com/mineadmin/MineAdmin/blob/master/web/Dockerfile) 优化：

```dockerfile
# 第一阶段：构建应用
FROM node:20-alpine3.20 AS builder

# 安装构建依赖
RUN apk add --no-cache git python3 make g++

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm 和依赖
RUN npm install -g pnpm@latest && \
    pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建参数
ARG NODE_ENV=production
ARG API_BASE_URL=https://api.yourdomain.com

# 设置环境变量
ENV NODE_ENV=$NODE_ENV
ENV VITE_API_BASE_URL=$API_BASE_URL

# 构建应用
RUN pnpm build --mode $NODE_ENV

# 第二阶段：生产运行环境
FROM nginx:1.25-alpine AS production

# 安装必要工具
RUN apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

# 创建 nginx 用户和目录
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-app -g nginx-app nginx-app

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY --from=builder /app/docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/docker/default.conf /etc/nginx/conf.d/default.conf

# 设置权限
RUN chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# 暴露端口
EXPOSE 80

# 使用非 root 用户运行
USER nginx-app

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose 前端部署

```yaml
# docker-compose.frontend.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./web
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
        - API_BASE_URL=https://api.yourdomain.com
    container_name: mineadmin-frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro
      - ./docker/nginx/conf.d:/etc/nginx/conf.d:ro
      - frontend_logs:/var/log/nginx
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`www.yourdomain.com`)"
      - "traefik.http.routers.frontend.tls=true"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
        reservations:
          memory: 128M
          cpus: '0.25'

volumes:
  frontend_logs:
```

**部署命令**:
```shell
# 构建并启动
docker-compose -f docker-compose.frontend.yml up -d --build

# 查看日志
docker-compose -f docker-compose.frontend.yml logs -f

# 更新部署
docker-compose -f docker-compose.frontend.yml down
docker-compose -f docker-compose.frontend.yml up -d --build
```

### 5. CDN 与静态资源优化

#### CDN 配置

```typescript
// vite.config.ts CDN 配置
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router', 'element-plus'],
      output: {
        globals: {
          'vue': 'Vue',
          'vue-router': 'VueRouter',
          'element-plus': 'ElementPlus'
        }
      }
    }
  },
  
  plugins: [
    // CDN 插件配置
    cdn({
      modules: [
        {
          name: 'vue',
          global: 'Vue',
          spare: 'https://unpkg.com/vue@3/dist/vue.global.prod.js'
        },
        {
          name: 'vue-router',
          global: 'VueRouter',
          spare: 'https://unpkg.com/vue-router@4/dist/vue-router.global.prod.js'
        },
        {
          name: 'element-plus',
          global: 'ElementPlus',
          spare: 'https://unpkg.com/element-plus/dist/index.full.min.js',
          css: 'https://unpkg.com/element-plus/dist/index.css'
        }
      ]
    })
  ]
})
```

#### 阿里云 OSS 静态资源上传

```shell
#!/bin/bash
# 自动化部署脚本

# 构建项目
pnpm build --mode production

# 上传到 OSS
ossutil cp -r dist/ oss://your-bucket/mineadmin/ --update

# 刷新 CDN 缓存
aliyun cdn RefreshObjectCaches --ObjectPath "https://cdn.yourdomain.com/*"

echo "部署完成！"
```

### 6. 性能优化

#### Webpack Bundle 分析

```shell
# 安装分析工具
pnpm add -D rollup-plugin-visualizer

# 生成分析报告
pnpm build --mode production
```

#### 预加载优化

```html
<!-- public/index.html 关键资源预加载 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MineAdmin</title>
  
  <!-- DNS 预解析 -->
  <link rel="dns-prefetch" href="//api.yourdomain.com">
  <link rel="dns-prefetch" href="//cdn.yourdomain.com">
  
  <!-- 关键资源预加载 -->
  <link rel="preload" href="/assets/index.css" as="style">
  <link rel="preload" href="/assets/index.js" as="script">
  
  <!-- 字体预加载 -->
  <link rel="preload" href="/assets/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

### 7. 故障排除

#### 常见部署问题

**1. 路由 404 问题**
```nginx
# Nginx 配置确保包含
location / {
    try_files $uri $uri/ /index.html;
}
```

**2. API 跨域问题**
```typescript
// vite.config.ts 开发环境代理
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

**3. 静态资源加载失败**
```nginx
# 检查 Nginx 文件权限
location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public";
    
    # 确保文件存在
    try_files $uri =404;
}
```

**4. 内存不足构建失败**
```shell
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

#### 日志调试

```shell
# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 查看 Docker 容器日志
docker logs mineadmin-frontend -f

# 浏览器网络调试
# F12 -> Network -> 查看失败的请求
```

**配置文件**:
- [x] `.env` 文件已正确配置
- [x] 数据库连接参数已测试
- [x] Redis 连接参数已测试
- [x] JWT 密钥已生成并配置

**安全设置**:
- [x] `APP_DEBUG` 已设置为 `false`（生产环境）
- [x] 数据库密码符合强密码策略
- [x] Redis 已设置认证密码
- [x] 防火墙规则已配置

**性能基准测试**:
```bash
# 使用 Apache Bench 进行压力测试
ab -n 1000 -c 10 http://localhost:9501/api/system/info

# 使用 wrk 进行更详细的性能测试
wrk -t4 -c100 -d30s --timeout 10s http://localhost:9501/api/system/info
```

## 常见问题排查

### 后端常见问题

** 内存不足导致进程崩溃**
```bash
# 症状：日志中出现 "Cannot allocate memory" 
# 解决方案：调整 PHP 内存限制
echo "memory_limit = 1G" >> /etc/php/8.1/php.ini

# 或调整 Swoole 工作进程数
# config/autoload/server.php
Constant::OPTION_WORKER_NUM => min(swoole_cpu_num(), 4)
```

**数据库连接超时**
```bash
# 症状：大量 "Connection timed out" 错误
# 解决方案：调整数据库连接池配置
# config/autoload/databases.php
'pool' => [
    'min_connections' => 1,
    'max_connections' => 20,
    'connect_timeout' => 10.0,
    'wait_timeout' => 3.0,
    'max_idle_time' => 60,
]
```

**Redis 连接失败**
```bash
# 症状：Redis 相关操作报错
# 检查 Redis 服务状态
systemctl status redis-server

# 检查 Redis 配置
redis-cli ping

# 检查防火墙
sudo ufw status | grep 6379
```

** 文件上传权限问题**
```bash
# 症状：文件上传失败，403 错误
# 解决方案：设置正确的目录权限
chown -R www-data:www-data storage/
chmod -R 755 storage/
chmod -R 777 storage/uploads/
```

### 前端常见问题

** 打包构建失败**
```bash
# 症状：pnpm build 失败，内存不足
# 解决方案：增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm build

# 或使用增量构建
pnpm build --mode development
```

**2. 路由 404 问题**
```nginx
# 症状：刷新页面出现 404
# 解决方案：确保 Nginx 配置包含 SPA 路由支持
location / {
    try_files $uri $uri/ /index.html;
}
```

**3. API 跨域问题**
```bash
# 症状：浏览器控制台出现 CORS 错误
# 解决方案：检查 Nginx 代理配置
location ^~ /api/ {
    proxy_pass http://127.0.0.1:9501;
    
    # 添加 CORS 头
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
}
```

**4. 静态资源加载失败**
```nginx
# 症状：CSS/JS 文件 404
# 检查 Nginx 配置中的资源路径
location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
    root /var/www/mineadmin/web/dist;
    expires 1y;
    try_files $uri =404;
}
```

### 容器部署问题

**1. Docker 构建失败**
```bash
# 症状：Docker build 过程中网络超时
# 解决方案：使用国内镜像源
docker build --build-arg NPM_REGISTRY=https://registry.npmmirror.com .

# 或使用多阶段构建缓存
docker build --target builder -t mineadmin:builder .
docker build --cache-from mineadmin:builder -t mineadmin:latest .
```

**2. 容器启动失败**
```bash
# 症状：容器启动后立即退出
# 查看容器日志
docker logs mineadmin-app

# 进入容器调试
docker exec -it mineadmin-app /bin/sh

# 检查容器健康状态
docker inspect --format='{{.State.Health.Status}}' mineadmin-app
```

**3. 容器间网络通信问题**
```bash
# 症状：应用无法连接到数据库容器
# 检查 Docker 网络
docker network ls
docker network inspect mineadmin_default

# 使用服务名进行连接
# .env 文件中使用容器服务名
DB_HOST=mysql
REDIS_HOST=redis
```

### 性能优化问题

**1. 响应时间过慢**
```bash
# 检查系统负载
top
iostat -x 1

# 检查 Swoole 进程状态
ps aux | grep hyperf

# 分析慢查询
# 在 MySQL 配置中启用慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 0.5
```

**2. 内存使用率过高**
```bash
# 检查内存使用
free -h
ps aux --sort=-%mem | head

# 调整 Swoole 配置
# config/autoload/server.php
Constant::OPTION_MAX_REQUEST => 10000  # 减少最大请求数
Constant::OPTION_WORKER_NUM => 2       # 减少工作进程数
```

##  🔗 相关资源

- **源码仓库**: [github.com/mineadmin/mineadmin](https://github.com/mineadmin/mineadmin)
- **Hyperf 官方文档**: [hyperf.wiki](https://hyperf.wiki)
- **技术支持**: [GitHub Issues](https://github.com/mineadmin/mineadmin/issues)
