# Backend Documentation

Welcome to the MineAdmin 3.x backend development documentation. This guide will help you gain an in-depth understanding of MineAdmin's backend architecture, development standards, and best practices.

## Architecture Overview

The MineAdmin backend is built using a modern PHP technology stack, developed on the Hyperf 3.x framework, and runs in a high-performance coroutine environment.

### Core Features

- **High-performance coroutines**: Leveraging Swoole/Swow extensions for exceptional concurrency performance
- **Modern architecture**: Clear layered structure
- **Secure and reliable**: Built-in dual-token authentication mechanism with comprehensive permission control
- **Easy to extend**: Supports plugin development with modular architecture design

## Technology Stack

| Component | Version | Description |
|---------|------|------|
| PHP | 8.x+ | Modern PHP language features |
| Hyperf | 3.x | High-performance coroutine framework |
| Swoole/Swow | Latest stable | Coroutine runtime environment |
| MySQL | 5.7+ / 8.0+ | Primary database |
| Redis | 6.0+ | Cache and session storage |
| JWT | - | Authentication based on lcobucci/jwt |

## Quick Start

### Requirements

- PHP >= 8.1
- Swoole >= 5.1 or Swow >= 1.0
- MySQL 
- Redis 

### Starting the Service

```bash
# Start HTTP service
php bin/hyperf.php start
```

### Development Mode

```bash
# Hot-reload mode (recommended for development)
php bin/hyperf.php server:watch
```

## Project Structure

MineAdmin's directory structure follows Laravel design principles. If you have Laravel experience, you'll feel right at home.

### Root Directory Structure

```
├── App/              # Core application code
├── Config/           # Configuration files
├── Database/         # Database-related files
├── Storage/          # Storage (logs, uploads, etc.)
├── Tests/            # Test code
├── Web/              # Frontend application
└── Plugin/           # Plugins directory
```

### App Directory Details

```
App/
├── Exceptions/       # Exception handling
├── Http/             # HTTP components (controllers, middleware, request validation)
├── Model/            # Data models (Eloquent ORM)
├── Service/          # Business logic layer
├── Repository/       # Data access layer
└── Schema/           # API documentation schema definitions
```

**Architecture Layers**:

- **Controller**: Handles HTTP requests, parameter validation, and response formatting
- **Service**: Business logic orchestration, coordinating Repository and Model
- **Repository**: Data access abstraction, unifying data sources (MySQL, Redis, ES, etc.)
- **Model**: Data model definitions using coroutine-compatible Eloquent ORM

## Core Features

### Authentication & Authorization

- **Dual-token mechanism**: Access Token + Refresh Token for seamless refresh
- **RBAC**: Role-based access control with data permissions
- **Multi-client support**: Web, mobile, and API clients

### Data Permissions

- **Flexible configuration**: Rule-based data permission control
- **Multi-dimensional support**: Department, user, and role-based permissions
- **Transparent integration**: Seamless integration with business logic

### Logging & Monitoring

- **Operation logs**: Detailed user activity tracking
- **Login logs**: User login records and security analysis
- **System logs**: Application runtime logs and error tracing

## Development Guide

### Fundamentals

- [Directory Structure](./base/structure.md) - Detailed project organization
- [Lifecycle](./base/lifecycle.md) - Application startup and request flow
- [Routing System](./base/router.md) - Route definitions and middleware
- [Exception Handling](./base/error-handler.md) - Unified exception handling

### Advanced Features

- [Security Mechanism](./security/passport.md) - Authentication and authorization
- [Data Permissions](./data-permission/overview.md) - Data permission system
- [Event Handling](./base/event-handler.md) - Event-driven development

### Deployment & Operations

- [Log Management](./base/logger.md) - Log configuration and management
- [File Uploads](./base/upload.md) - File processing and storage

## Plugin Development

MineAdmin supports extensibility through plugins:

- [Plugin Development Guide](../plugin/index.md) - Complete plugin tutorial
- [Marketplace](../plugin/develop/publish.md) - Plugin publishing and distribution

## API Documentation

- [API Reference](../api/) - Complete REST API documentation
- Swagger UI: `/swagger` (development environment)

## FAQ

- [Frequently Asked Questions](../faq/) - Common issues and solutions

## Community & Support

- **GitHub**: [https://github.com/mineadmin/mineadmin](https://github.com/mineadmin/mineadmin)
- **Documentation Issues**: [Submit Issue](https://github.com/mineadmin/doc-v3/issues)
- **Technical Discussions**: Join official community groups

## References

This documentation was created with inspiration from these excellent projects:

1. [Laravel Documentation](https://laravel.com/docs/11.x/)
2. [Hyperf Documentation](https://hyperf.wiki/3.1)

---

**Next Step**: We recommend starting with [Directory Structure](./base/structure.md) to understand the project architecture.