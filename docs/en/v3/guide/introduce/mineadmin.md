# About MineAdmin

MineAdmin is an enterprise-level backend management system based on the Hyperf framework, built for modern application development. If you are conducting research or technical selection for a backend framework, this article will help you fully understand MineAdmin's core advantages, technical features, and complete feature system.

## Project Overview

MineAdmin is a modern, high-performance backend management system solution employing a front-end and back-end separation architecture. It is dedicated to providing developers with an out-of-the-box enterprise application development platform. The system features comprehensive permission management, modular design, and rich business components, significantly improving development efficiency.

## Long-term and Stable

<script setup>
import { computed } from 'vue'

// MineAdmin 开始开发的日期 (2021年10月14日)
const startDate = new Date('2021-10-14')
const currentDate = new Date()

// 计算天数差
const daysPassed = computed(() => {
  const timeDiff = currentDate.getTime() - startDate.getTime()
  return Math.floor(timeDiff / (1000 * 3600 * 24))
})
</script>

Since its first release on [October 14, 2021](https://github.com/mineadmin/MineAdmin/commit/670f6439ba2a6fe8181bbf138c247bfb1d26601c), `MineAdmin has gone through {{ daysPassed }} days of development`. We consistently adhere to a long-term and stable development roadmap, strictly control code quality, and ensure that each version undergoes thorough testing and verification.

**Stability Commitments:**
- Continuous version iteration and maintenance
- Strict code review mechanism
- Comprehensive unit test coverage
- Backward compatibility guarantee
- Active community support

::: tip Why Choose MineAdmin
We are committed to providing individual developers and enterprise teams with a modern, clean, and efficient backend management system. With the following core advantages, it helps you achieve more with less effort in project development:

**Technological Advancement**
- Adopts the latest technology stack: Hyperf 3.x, PHP 8.x, Vue 3.x, Vite 5.x, etc., ensuring your project's technology stack remains cutting-edge
- High-performance architecture based on Swoole coroutines, supporting high-concurrency business scenarios
- Full-stack TypeScript support, providing better type safety and development experience

**Code Quality Assurance**
- Strictly follows PSR standards and best practices
- Modular architecture design ensures code consistency and maintainability
- Comprehensive error handling and logging mechanisms

**Flexible Adaptability**
- Supports lightweight applications for individual developers and rapid setup for startups
- Meets the complex business requirements and customization needs of enterprise applications
- Enables a complete development cycle of rapid development, deployment, and iteration
:::

## Technical Architecture

### Backend Technology Stack
- **Framework Core**: Hyperf 3.x - High-performance PHP framework based on Swoole
- **Language Version**: PHP 8.1+ - Supports the latest language features
- **Database**: MySQL 8.0+ / PostgreSQL - Supports mainstream relational databases
- **Cache System**: Redis - High-performance caching and session storage
- **Permission Control**: Casbin-based RBAC permission management
- **API Documentation**: Swagger/OpenAPI auto-generation

### Frontend Technology Stack
- **Core Framework**: Vue 3.x - Composition API and reactive system
- **Build Tool**: Vite 5.x - Extremely fast frontend build tool
- **UI Component Library**: Element Plus - Enterprise-level component library
- **State Management**: Pinia - Lightweight state management solution
- **Routing System**: Vue Router 4.x - Official routing solution
- **Type Support**: TypeScript - Complete type system support

## Core Feature Highlights

### User & Permission Management
- **User Management**: Complete user lifecycle management including registration, authentication, profile maintenance
- **Role Management**: Flexible role definition and permission assignment, supporting menu and data permissions
- **Menu Management**: Dynamic menu configuration, supporting frontend routing and button-level permission control
- **Department Management**: Tree-structured department organization, supporting hierarchical data permission control

### System Monitoring & Logging
- **Operation Logs**: Detailed recording of user operations, supporting audit trails
- **Login Logs**: User login records and security monitoring
- **System Monitoring**: Server performance monitoring and application status monitoring
- **Exception Monitoring**: System exception capture and alerting mechanism

### Development Tools & Extensions
- **Code Generator**: Auto-generates CRUD code (frontend/backend) based on database table structures
- **API Documentation**: Auto-generated and maintained API interface documentation
- **Data Dictionary**: Unified data dictionary management and maintenance
- **System Configuration**: Visualized system parameter configuration management

### Application Ecosystem
- **Plugin Marketplace**: Rich plugin ecosystem supporting rapid integration of functional modules
- **Template System**: Multiple business templates to accelerate project initialization
- **User Center**: Independent user service module supporting personal information management and extension features

## Development History & Version Evolution

### Technology Evolution Path

**Backend Architecture Upgrade**
- **v0.x-v1.x**: Initial versions based on Hyperf 2.x, establishing the core architecture
- **v2.x-v3.x**: Upgraded alongside Hyperf 3.x, introducing more modern features
- **Current Version**: Completely refactored version based on the latest technology stack

**Frontend Technology Changes**
- **Early Versions**: Rapid prototype based on the SCUI open-source project
- **Mid-stage Development**: Self-developed frontend framework based on Arco Design
- **Modern Version**: Modern architecture adopting Vue 3 + Vite + TypeScript

### Architecture Optimization Journey

We have continuously optimized the system architecture and streamlined features throughout its development:

1. **Code Refactoring**: Comprehensive refactoring of frontend and backend code to improve code quality and maintainability
2. **Feature Streamlining**: Removed redundant features, focusing on core business scenarios
3. **Performance Optimization**: Performance tuning based on actual usage scenarios
4. **User Experience Enhancement**: Continuous improvement of interface design and interaction experience

### Development Vision

Our goal is to create a platform that allows developers to:
- **Get Started Quickly**: Reduce the learning curve with comprehensive documentation and examples
- **Focus on Business**: Minimize infrastructure development, concentrate on implementing business logic
- **Create Value**: Provide stable and reliable technical support for enterprises and brands

## Applicable Scenarios

MineAdmin is suitable for the following typical scenarios:

- **Enterprise Internal Management Systems**: OA, CRM, ERP, and other enterprise management applications
- **Content Management Platforms**: Website backends, content publishing systems
- **Data Analysis Platforms**: Reporting systems, data visualization platforms
- **E-commerce Management Systems**: Product management, order processing, user management
- **Multi-tenant SaaS Applications**: Cloud service applications supporting multi-tenant architecture

With MineAdmin, you can quickly build feature-rich, high-performance modern management systems, focusing on business innovation rather than infrastructure development.