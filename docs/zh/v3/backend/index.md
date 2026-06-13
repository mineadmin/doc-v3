# 后端文档

欢迎来到 MineAdmin 3.x 后端开发文档。本文档将帮助您深入理解 MineAdmin 的后端架构、开发规范和最佳实践。

## 架构概述

MineAdmin 后端采用现代化的 PHP 技术栈构建，基于 Hyperf 3.x 框架开发，运行在高性能的协程环境中。

### 核心特性

- **高性能协程**: 基于 Swoole/Swow 扩展的协程特性，提供卓越的并发性能
- **现代化架构**: 分层架构清晰
- **安全可靠**: 内置双 Token 认证机制，完善的权限控制系统
- **易于扩展**: 支持插件化开发，模块化架构设计

## 技术栈

| 技术组件 | 版本 | 说明 |
|---------|------|------|
| PHP | 8.x+ | 现代化 PHP 语言特性支持 |
| Hyperf | 3.x | 高性能协程框架 |
| Swoole/Swow | 最新稳定版 | 协程运行时环境 |
| MySQL | 5.7+ / 8.0+ | 主数据库 |
| Redis | 6.0+ | 缓存和会话存储 |
| JWT | - | 基于 lcobucci/jwt 的认证方案 |

## 快速开始

### 环境要求

- PHP >= 8.1
- Swoole >= 5.1 或 Swow >= 1.0
- MySQL 
- Redis 

### 启动服务

```bash
# 启动 HTTP 服务
php bin/hyperf.php start
```

### 开发模式

```bash
# 热重载模式（开发环境推荐）
php bin/hyperf.php server:watch
```

## 项目结构

MineAdmin 的目录结构参考了 Laravel 的设计理念，如果您有 Laravel 开发经验，将会很快上手。

### 根目录结构

```
├── App/              # 应用核心代码目录
├── Config/           # 配置文件目录
├── Database/         # 数据库相关文件
├── Storage/          # 存储目录（日志、上传文件等）
├── Tests/            # 测试代码目录
├── Web/              # 前端应用代码
└── Plugin/           # 插件目录
```

### App 目录详解

```
App/
├── Exceptions/       # 异常处理
├── Http/            # HTTP 相关（控制器、中间件、请求验证）
├── Model/           # 数据模型（Eloquent ORM）
├── Service/         # 业务逻辑层
├── Repository/      # 数据访问层
└── Schema/          # API 文档 Schema 定义
```

**架构分层说明**:

- **Controller**: 处理 HTTP 请求，参数验证和响应格式化
- **Service**: 业务逻辑编排，调度 Repository 和 Model
- **Repository**: 数据访问抽象，统一数据来源（MySQL、Redis、ES等）
- **Model**: 数据模型定义，基于协程版 Eloquent ORM

## 核心功能

### 认证授权

- **双 Token 机制**: Access Token + Refresh Token 无感刷新
- **RBAC 权限控制**: 基于角色的访问控制，支持数据权限
- **多端支持**: 支持 Web、移动端、API 等多种客户端

### 数据权限

- **灵活配置**: 基于规则的数据权限控制
- **多维度支持**: 支持部门、用户、角色等多维度权限控制
- **透明集成**: 与业务逻辑无感集成

### 日志监控

- **操作日志**: 详细记录用户操作行为
- **登录日志**: 用户登录记录和安全分析
- **系统日志**: 应用运行日志和错误追踪

## 开发指南

### 基础开发

- [目录结构详解](./base/structure.md) - 深入了解项目目录组织
- [生命周期](./base/lifecycle.md) - 理解应用启动和请求处理流程
- [路由系统](./base/router.md) - 路由定义和中间件使用
- [异常处理](./base/error-handler.md) - 统一异常处理机制

### 进阶功能

- [安全机制](./security/passport.md) - 认证和授权详解
- [数据权限](./data-permission/overview.md) - 数据权限系统使用
- [事件处理](./base/event-handler.md) - 事件驱动开发

### 部署运维

- [日志管理](./base/logger.md) - 日志配置和管理
- [文件上传](./base/upload.md) - 文件处理和存储

## 插件开发

MineAdmin 支持插件化扩展，您可以通过插件机制快速扩展系统功能：

- [插件开发指南](../plugin/index.md) - 插件开发完整教程
- [应用市场](../plugin/develop/publish.md) - 插件发布和分发

## API 文档

- [API 接口文档](../api/) - 完整的 REST API 文档
- Swagger 文档地址：`/swagger` （开发环境）

## 常见问题

- [FAQ 常见问题](../faq/) - 开发中的常见问题和解决方案

## 社区与支持

- **GitHub**: [https://github.com/mineadmin/mineadmin](https://github.com/mineadmin/mineadmin)
- **文档问题**: [提交 Issue](https://github.com/mineadmin/doc-v3/issues)
- **技术交流**: 加入官方社区群组

## 参考资料

本文档在编写过程中参考了以下优秀项目的文档（排名不分先后）：

1. [Laravel 官方文档](https://laravel.com/docs/11.x/)
2. [Hyperf 官方文档](https://hyperf.wiki/3.1)

---

**下一步**: 建议先阅读 [目录结构详解](./base/structure.md) 来深入理解项目架构。