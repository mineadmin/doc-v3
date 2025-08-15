# About MineAdmin

MineAdmin is an enterprise-level backend management system based on the Hyperf framework, specifically designed for modern application development. If you're conducting research or technical selection for backend frameworks, this article will help you fully understand MineAdmin's core advantages, technical features, and comprehensive functional system.

## Project Overview

MineAdmin is a modern, high-performance backend management system solution that adopts a frontend-backend separation architecture, dedicated to providing developers with an out-of-the-box enterprise application development platform. The system features complete permission management, modular design, and rich business components, significantly improving development efficiency.

## Long-term and Stable

<script setup>
import { computed } from 'vue'

// The date MineAdmin started development (October 14, 2021)
const startDate = new Date('2021-10-14')
const currentDate = new Date()

// Calculate the difference in days
const daysPassed = computed(() => {
  const timeDiff = currentDate.getTime() - startDate.getTime()
  return Math.floor(timeDiff / (1000 * 3600 * 24))
})
</script>

Since its initial release on [October 14, 2021](https://github.com/mineadmin/MineAdmin/commit/670f6439ba2a6fe8181bbf138c247bfb1d26601c), `MineAdmin has undergone {{ daysPassed }} days of development`. We adhere to a long-term and stable development path, strictly controlling code quality to ensure each version undergoes thorough testing and validation.

**Stability Commitment:**
- Continuous version iteration and maintenance
- Strict code review mechanisms
- Comprehensive unit test coverage
- Backward compatibility assurance
- Active community support

::: tip Why Choose MineAdmin
We are committed to providing individual developers and enterprise teams with a modern, concise, and efficient backend management system. With the following core advantages, we help you achieve more with less in project development:

**Technical Advancement**
- Utilizes the latest technology stack: Hyperf 3.x, PHP 8.x, Vue 3.x, Vite 5.x, etc., ensuring your project remains technologically advanced
- High-performance architecture based on Swoole coroutines, supporting high-concurrency business scenarios
- Full-stack TypeScript support for better type safety and development experience

**Code Quality Assurance**
- Strict adherence to PSR standards and best practices
- Modular architecture design ensuring code consistency and maintainability
- Comprehensive error handling and logging mechanisms

**Flexible Adaptability**
- Supports lightweight applications for individual developers and rapid setup for startup projects
- Meets complex business needs and customization requirements of enterprise-level applications
- Enables rapid development, deployment, and iteration cycles
:::

## Technical Architecture

### Backend Technology Stack
- **Core Framework**: Hyperf 3.x - High-performance PHP framework based on Swoole
- **Language Version**: PHP 8.1+ - Supports the latest language features
- **Database**: MySQL 8.0+ / PostgreSQL - Supports mainstream relational databases
- **Cache System**: Redis - High-performance caching and session storage
- **Permission Control**: RBAC permission management based on Casbin
- **API Documentation**: Swagger/OpenAPI auto-generation

### Frontend Technology Stack
- **Core Framework**: Vue 3.x - Composition API and reactive system
- **Build Tool**: Vite 5.x - Ultra-fast frontend build tool
- **UI Component Library**: Element Plus - Enterprise-level component library
- **State Management**: Pinia - Lightweight state management solution
- **Routing System**: Vue Router 4.x - Official routing solution
- **Type Support**: TypeScript - Comprehensive type system support

## Core Features

### User and Permission Management
- **User Management**: Complete user lifecycle management, including registration, authentication, profile maintenance, etc.
- **Role Management**: Flexible role definition and permission assignment, supporting menu and data permissions
- **Menu Management**: Dynamic menu configuration with frontend routing and button-level permission control
- **Department Management**: Tree-structured department hierarchy supporting data permission control

### System Monitoring and Logging
- **Operation Logs**: Detailed records of user actions for audit and traceability
- **Login Logs**: User login records and security monitoring
- **System Monitoring**: Server performance and application status monitoring
- **Exception Monitoring**: System exception capture and alert mechanisms

### Development Tools and Extensions
- **Code Generator**: Auto-generates CRUD code (frontend and backend) based on database table structures
- **API Documentation**: Auto-generated and maintained API interface documentation
- **Data Dictionary**: Unified data dictionary management and maintenance
- **System Configuration**: Visual system parameter configuration management

### Application Ecosystem
- **Plugin Marketplace**: Rich plugin ecosystem for rapid module integration
- **Template System**: Multiple business templates for accelerated project initialization
- **User Center**: Independent user service module supporting personal information management and extended features

## Development History and Version Evolution

### Technical Evolution Path

**Backend Architecture Upgrades**
- **v0.x-v1.x**: Initial versions based on Hyperf 2.x, establishing core architecture
- **v2.x-v3.x**: Upgraded with Hyperf 3.x, introducing more modern features
- **Current Version**: Comprehensive refactoring based on the latest technology stack

**Frontend Technology Transition**
- **Early Versions**: Rapid prototyping based on the SCUI open-source project
- **Mid-stage Development**: Self-developed frontend framework based on Arco Design
- **Modern Version**: Modern architecture using Vue 3 + Vite + TypeScript

### Architecture Optimization History

Throughout system development, we continuously optimize architecture and streamline features:

1. **Code Refactoring**: Comprehensive refactoring of frontend and backend code to improve quality and maintainability
2. **Feature Streamlining**: Removal of redundant features to focus on core business scenarios
3. **Performance Optimization**: Performance tuning based on real-world usage scenarios
4. **User Experience Enhancement**: Continuous improvement of interface design and interaction

### Development Vision

Our goal is to create a platform where developers can:
- **Get Started Quickly**: Lower learning curve with comprehensive documentation and examples
- **Focus on Business**: Reduce infrastructure development to concentrate on business logic
- **Create Value**: Provide stable and reliable technical support for enterprises and brands

## Applicable Scenarios

MineAdmin is suitable for the following typical scenarios:

- **Enterprise Internal Management Systems**: OA, CRM, ERP, and other enterprise management applications
- **Content Management Platforms**: Website backends, content publishing systems
- **Data Analysis Platforms**: Reporting systems, data visualization platforms
- **E-commerce Management Systems**: Product management, order processing, user management
- **Multi-tenant SaaS Applications**: Cloud service applications supporting multi-tenant architecture

With MineAdmin, you can quickly build feature-rich, high-performance modern management systems, focusing on business innovation rather than infrastructure development.