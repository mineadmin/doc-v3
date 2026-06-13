# Backend Documentation

Welcome to the MineAdmin 3.x backend development documentation. This document will help you gain a deep understanding of MineAdmin's backend architecture, development conventions, and best practices.

## Architecture Overview

MineAdmin's backend is built on a modern PHP technology stack, developed using the Hyperf 3.x framework and running in a high-performance coroutine environment.

### Core Features

- **High-Performance Coroutines**: Leveraging the coroutine features of the Swoole/Swow extension for exceptional concurrency performance.
- **Modern Architecture**: Clear layered architecture.
- **Secure and Reliable**: Built-in dual token authentication mechanism and comprehensive permission control system.
- **Easy to Extend**: Supports plugin-based development with a modular architecture design.

## Technology Stack

| Technology Component | Version | Description |
|---------|------|------|
| PHP | 8.x+ | Modern PHP language feature support |
| Hyperf | 3.x | High-performance coroutine framework |
| Swoole/Swow | Latest Stable | Coroutine runtime environment |
| MySQL | 5.7+ / 8.0+ | Primary database |
| Redis | 6.0+ | Cache and session storage |
| JWT | - | Authentication scheme based on lcobucci/jwt |

## Quick Start

### Environment Requirements

- PHP >= 8.1
- Swoole >= 5.1 or Swow >= 1.0
- MySQL 
- Redis 

### Start the Service

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

MineAdmin's directory structure references Laravel's design philosophy. If you have experience with Laravel development, you will find it easy to get started.

### Root Directory Structure

```
├── App/              # Application core code directory
├── Config/           # Configuration file directory
├── Database/         # Database-related files
├── Storage/          # Storage directory (logs, uploads, etc.)
├── Tests/            # Test code directory
├── Web/              # Frontend application code
└── Plugin/           # Plugin directory
```

### App Directory Details

```
App/
├── Exceptions/       # Exception handling
├── Http/            # HTTP related (Controllers, Middleware, Request Validation)
├── Model/           # Data models (Eloquent ORM)
├── Service/         # Business logic layer
├── Repository/      # Data access layer
└── Schema/          # API documentation schema definition
```

**Architecture Layer Explanation**:

- **Controller**: Handles HTTP requests, parameter validation, and response formatting.
- **Service**: Orchestrates business logic, dispatches Repository and Model.
- **Repository**: Data access abstraction, unifies data sources (MySQL, Redis, ES, etc.).
- **Model**: Data model definition, based on the coroutine version of Eloquent ORM.

## Core Features

### Authentication & Authorization

- **Dual Token Mechanism**: Seamless refresh with Access Token + Refresh Token.
- **RBAC Permission Control**: Role-based access control with data permission support.
- **Multi-Client Support**: Supports Web, Mobile, API, and other clients.

### Data Permissions

- **Flexible Configuration**: Rule-based data permission control.
- **Multi-Dimensional Support**: Supports department, user, role, and other multi-dimensional permission control.
- **Transparent Integration**: Seamless integration with business logic.

### Logging & Monitoring

- **Operation Logs**: Detailed recording of user operations.
- **Login Logs**: User login records and security analysis.
- **System Logs**: Application runtime logs and error tracking.

## Development Guide

### Basic Development

- [Directory Structure Details](./base/structure.md) - In-depth understanding of project directory organization.
- [Lifecycle](./base/lifecycle.md) - Understanding application startup and request processing flow.
- [Routing System](./base/router.md) - Route definition and middleware usage.
- [Exception Handling](./base/error-handler.md) - Unified exception handling mechanism.

### Advanced Features

- [Security Mechanism](./security/passport.md) - Authentication and authorization details.
- [Data Permissions](./data-permission/overview.md) - Data permission system usage.
- [Event Handling](./base/event-handler.md) - Event-driven development.

### Deployment & Operations

- [Log Management](./base/logger.md) - Log configuration and management.
- [File Upload](./base/upload.md) - File processing and storage.

## Plugin Development

MineAdmin supports plugin-based extension. You can quickly extend system functionality through the plugin mechanism:

- [Plugin Development Guide](../plugin/index.md) - Complete plugin development tutorial.
- [Application Marketplace](../plugin/develop/publish.md) - Plugin publishing and distribution.

## API Documentation

- [API Interface Documentation](../api/) - Complete REST API documentation.
- Swagger Docs URL: `/swagger` (Development environment)

## Frequently Asked Questions

- [FAQ Common Questions](../faq/) - Common issues and solutions during development.

## Community & Support

- **GitHub**: [https://github.com/mineadmin/mineadmin](https://github.com/mineadmin/mineadmin)
- **Documentation Issues**: [Submit an Issue](https://github.com/mineadmin/doc-v3/issues)
- **Technical Discussion**: Join the official community groups.

## References

During the writing of this documentation, we referred to the documentation of the following excellent projects (in no particular order):

1. [Laravel Official Documentation](https://laravel.com/docs/11.x/)
2. [Hyperf Official Documentation](https://hyperf.wiki/3.1)

---

**Next step**: It is recommended to read [Directory Structure Details](./base/structure.md) first to gain an in-depth understanding of the project architecture.