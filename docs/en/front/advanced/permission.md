# MineAdmin Permission Control System

## Overview

MineAdmin provides a comprehensive front-end permission control system that implements fine-grained permission management. Permission control operates at two levels:

:::tip Permission Architecture Overview
- **Route-level permissions**: Controls page access based on menu data returned by the backend
- **Content-level permissions**: Controls the display and hiding of page content through helper functions, directives, and components

The permission system is deeply integrated with the backend Hyperf framework to ensure consistency between frontend and backend permission control.
:::

### Permission Types

MineAdmin supports three types of fine-grained permission control:

| Permission Type | Judgment Basis | Application Scenario | Implementation Method |
|---------|---------|---------|---------|
| **Permission Code** | Menu's `name` field | Functional module permission control | Functions, directives, components |
| **Role Permission** | Role's `code` field | Responsibility-based permission control | Functions, directives |
| **User Permission** | User's `username` field | Specific user permission control | Functions, directives |

::: info Implementation Principle
The permission system is based on permission data obtained after user login, verifying access to specific functions by comparing the current user's permission codes, role codes, and user identifiers. Permission data is stored in frontend state management for efficient permission verification.
:::

## Permission Helper Functions

### Function Import and Basic Usage

MineAdmin provides three core permission judgment functions located in the `web/src/utils/permission/` directory:

```javascript
// Permission code check function
import hasAuth from '@/utils/permission/hasAuth'
// Role check function  
import hasRole from '@/utils/permission/hasRole'
// User check function
import hasUser from '@/utils/permission/hasUser'
```

::: tip Function Location
**Source Path**:
- GitHub: `https://github.com/mineadmin/mineadmin/tree/master/web/src/utils/permission/`
- Local Development: `/web/src/utils/permission/`

These functions are globally registered and can be called directly in components.
:::

### Usage in Business Logic

```vue
<script setup>
// Permission code verification - supports single permission or permission array
if (hasAuth('user:list') || hasAuth(['user:list', 'user:create'])) {
  // User management permission verification passed
  console.log('Has user management permission')
}

// Role verification - supports single role or role array
if (hasRole('SuperAdmin') || hasRole(['admin', 'manager'])) {
  // Administrator role verification passed
  console.log('Has administrator permission')
}

// User verification - supports single username or username array
if (hasUser('admin') || hasUser(['admin', 'root'])) {
  // Specific user verification passed
  console.log('Specific user verification passed')
}

// Composite permission judgment example
const canManageUsers = hasAuth(['user:list', 'user:create']) && hasRole('admin')
if (canManageUsers) {
  // Meets both permission code and role requirements
}
</script>
```

### Usage in Templates

```vue
<script setup>
// Import permission judgment functions
import hasAuth from '@/utils/permission/hasAuth'
import hasRole from '@/utils/permission/hasRole'
import hasUser from '@/utils/permission/hasUser'
</script>

<template>
  <div>
    <!-- Permission code verification -->
    <div v-if="hasAuth('user:list') || hasAuth(['user:list', 'user:create'])">
      <el-button type="primary">User Management</el-button>
    </div>
    
    <!-- Role verification -->
    <div v-if="hasRole('SuperAdmin') || hasRole(['admin', 'manager'])">
      <el-button type="danger">System Settings</el-button>
    </div>

    <!-- User verification -->
    <div v-if="hasUser('admin') || hasUser(['root', 'administrator'])">
      <el-button type="warning">Advanced Features</el-button>
    </div>

    <!-- Composite condition verification -->
    <div v-if="hasAuth('role:manage') && hasRole('admin')">
      <el-button>Role Management</el-button>
    </div>
  </div>
</template>
```

### Function Parameter Description

All permission functions support the following two parameter formats:

```javascript
// String format - single permission check
hasAuth('user:list')
hasRole('admin')  
hasUser('admin')

// Array format - multiple permission checks (OR logic)
hasAuth(['user:list', 'user:create', 'user:edit'])
hasRole(['admin', 'manager', 'supervisor'])
hasUser(['admin', 'root', 'system'])
```

::: warning Notes
- Array parameters use **OR logic**, meaning any single condition being met will return `true`
- For **AND logic**, use multiple function calls combined: `hasAuth('a') && hasAuth('b')`
- Permission codes should follow the `module:operation` naming convention, such as `user:list`, `role:create`
:::

### Route Permission Parameter

Permission functions support an optional second parameter `checkRoute` to determine whether to check route permissions simultaneously:

```javascript
// Second parameter defaults to false, only checking functional permissions
hasAuth('user:list', false)  

// When set to true, checks route permissions simultaneously
hasAuth('user:list', true)
```

## Permission Directives

MineAdmin provides three permission directives to simplify permission control in templates. The directives are located in the `web/src/directives/permission/` directory:

::: tip Directive Source Location
**GitHub Path**:
- `https://github.com/mineadmin/mineadmin/tree/master/web/src/directives/permission/auth/`
- `https://github.com/mineadmin/mineadmin/tree/master/web/src/directives/permission/role/`
- `https://github.com/mineadmin/mineadmin/tree/master/web/src/directives/permission/user/`

**Local Path**: `/web/src/directives/permission/`
:::

### Directive Usage

```vue
<template>
  <div>
    <!-- Permission code directive - supports strings and arrays -->
    <div v-auth="'user:list'">
      Single permission code control
    </div>
    <div v-auth="['user:list', 'user:create']">
      Multiple permission code control (any one satisfied)
    </div>
    
    <!-- Role directive -->
    <div v-role="'admin'">
      Single role control
    </div>
    <div v-role="['admin', 'manager']">
      Multiple role control (any one satisfied)
    </div>

    <!-- User directive -->
    <div v-user="'admin'">
      Single user control
    </div>
    <div v-user="['admin', 'root']">
      Multiple user control (any one satisfied)
    </div>

    <!-- Practical business scenario examples -->
    <el-button v-auth="'user:create'" type="primary">
      Add User
    </el-button>
    
    <el-button v-role="'SuperAdmin'" type="danger">
      Delete Data
    </el-button>
    
    <div v-auth="['log:operation', 'log:login']" class="log-panel">
      Log View Panel
    </div>
  </div>
</template>
```

### Directive vs Function Comparison

| Method | Advantages | Applicable Scenarios | Example |
|------|------|----------|------|
| **Directive** | Concise and intuitive, automatically controls element display/hiding | Simple permission control, static permission checks | `v-auth="'user:list'"` |
| **Function** | High flexibility, supports complex logic judgment | Permission judgment in business logic, dynamic permission checks | `v-if="hasAuth('a') && hasRole('b')"` |

::: warning Directive Usage Notes
- Directives use **OR logic**, displaying the element if any condition in the array is met
- Directives directly control DOM element display/hiding, elements are not rendered without permission
- Complex permission logic combinations should use functions rather than directives
:::

## MaAuth Permission Component

### Component Introduction

The `MaAuth` component is MineAdmin's permission control component, suitable for large-scale content permission control. Compared to functions and directives, the component approach is better suited for complex permission display logic.

::: info Component Source Location
**GitHub Path**: `https://github.com/mineadmin/mineadmin/tree/master/web/src/components/ma-auth/index.vue`

**Local Path**: `/web/src/components/ma-auth/index.vue`

This component is globally registered and can be used directly in any Vue component without manual import.
:::

### Basic Usage

```vue
<template>
  <!-- Single permission control -->
  <ma-auth :value="'user:list'">
    <div class="user-management">
      <h3>User Management Panel</h3>
      <p>You have user list view permission</p>
    </div>
  </ma-auth>

  <!-- Multiple permission control (displays if any permission is satisfied) -->
  <ma-auth :value="['user:list', 'user:create', 'user:edit']">
    <div class="user-operations">
      <el-button type="primary">Add User</el-button>
      <el-button type="success">Edit User</el-button>
      <el-button type="danger">Delete User</el-button>
    </div>
  </ma-auth>
</template>
```

### No Permission Prompt

The component provides a `#notAuth` slot for customizing content displayed when permissions are lacking:

```vue
<template>
  <ma-auth :value="['admin:system', 'admin:config']">
    <!-- Content displayed with permission -->
    <div class="admin-panel">
      <h2>System Management</h2>
      <el-form>
        <el-form-item label="System Configuration">
          <el-input placeholder="Configuration Item" />
        </el-form-item>
      </el-form>
    </div>
    
    <!-- Content displayed without permission -->
    <template #notAuth>
      <el-alert
        title="Insufficient Permissions"
        description="You do not have system management permissions, please contact the administrator to apply for relevant permissions"
        type="warning"
        :closable="false"
        show-icon
      />
    </template>
  </ma-auth>
</template>
```

### Advanced Usage

#### Nested Permission Control

```vue
<template>
  <ma-auth :value="'module:access'">
    <!-- Module-level permission -->
    <div class="module-container">
      <h2>Business Module</h2>
      
      <!-- Feature-level permission -->
      <ma-auth :value="'feature:read'">
        <div class="read-section">
          <p>Read-only content area</p>
        </div>
        <template #notAuth>
          <p class="text-gray">You do not have read permission</p>
        </template>
      </ma-auth>

      <!-- Operation-level permission -->
      <ma-auth :value="['feature:create', 'feature:edit']">
        <div class="action-buttons">
          <el-button>Create</el-button>
          <el-button>Edit</el-button>
        </div>
        <template #notAuth>
          <p class="text-muted">You do not have operation permission</p>
        </template>
      </ma-auth>
    </div>
    
    <template #notAuth>
      <el-empty description="You do not have permission to access this module" />
    </template>
  </ma-auth>
</template>
```

#### Integration with Other Components

```vue
<template>
  <!-- Table operation permission control -->
  <el-table :data="tableData">
    <el-table-column label="Name" prop="name" />
    <el-table-column label="Operations">
      <template #default="{ row }">
        <ma-auth :value="'user:edit'">
          <el-button size="small" @click="editUser(row)">Edit</el-button>
          <template #notAuth>
            <el-button size="small" disabled>No Permission</el-button>
          </template>
        </ma-auth>
        
        <ma-auth :value="'user:delete'">
          <el-button size="small" type="danger" @click="deleteUser(row)">
            Delete
          </el-button>
        </ma-auth>
      </template>
    </el-table-column>
  </el-table>
</template>
```

### Component Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `value` | `string \| string[]` | `[]` | Permission codes to verify, supports string or array |

### Component Slots

| Slot Name | Description | Parameters |
|--------|------|------|
| `default` | Content displayed with permission | - |
| `notAuth` | Content displayed without permission | - |

### Component vs Other Methods Comparison

| Method | Applicable Scenarios | Advantages | Disadvantages |
|------|----------|------|------|
| **MaAuth Component** | Large content permission control, requires no permission prompt | Supports slot customization, clear code structure | Slightly redundant |
| **Permission Directive** | Simple element permission control | Concise and intuitive | Does not support no permission prompt |
| **Permission Function** | Complex business logic permission judgment | Highest flexibility | Requires manual display logic handling |

## Route Permission Control

### Static Route Permission Configuration

MineAdmin supports permission control at the route level by configuring permission parameters in the route's `meta` property.

::: tip Route Permission Mechanism
**Control Scope**: Only effective for routes with component pages, excluding buttons and other in-page elements

**Check Timing**: Automatically checks permissions during route navigation

**Permission Verification Failure**: Displays 403 page

**Source Location**: `/web/src/router/` - Route configuration and permission guard logic
:::

### Route Permission Configuration Syntax

Configure permission parameters through the `meta` object in route configuration files:

```javascript
// Example route configuration
const routes = [
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/index.vue'),
    meta: {
      // Permission code control - requires user management permission
      auth: ['user:list', 'user:manage'],
      
      // Role control - requires admin or super admin role
      role: ['admin', 'SuperAdmin'],
      
      // User control - specific users can access
      user: ['admin', 'root']
    }
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/views/system/index.vue'),
    meta: {
      // Only requires permission code
      auth: ['system:config']
    }
  },
  {
    path: '/public',
    name: 'Public',
    component: () => import('@/views/public/index.vue'),
    meta: {
      // No permission restrictions when not configured or set to empty array
      auth: []
    }
  }
]
```

### Permission Parameter Description

| Parameter | Type | Description | Logical Relationship |
|------|------|------|----------|
| `auth` | `string[]` | Permission code array, based on menu permission control | OR (any single permission satisfied) |
| `role` | `string[]` | Role code array, based on user role control | OR (any single role satisfied) |
| `user` | `string[]` | Username array, based on specific user control | OR (any single user satisfied) |

::: warning Permission Configuration Notes
- All permission parameter types must be `string[]` (string array)
- Multiple permission types can be configured for the same route, with **AND logic** between them
- Not configuring permission parameters or setting to empty array `[]` means no permission restrictions
- Permission verification failure automatically redirects to 403 page
:::

### Practical Application Scenarios

#### User Management Module

```javascript
// User management related routes
const userRoutes = [
  {
    path: '/user',
    name: 'UserManagement',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: 'User Management',
      auth: ['user:list'] // Requires user list permission
    },
    children: [
      {
        path: 'create',
        name: 'UserCreate',
        component: () => import('@/views/user/create.vue'),
        meta: {
          title: 'Add User',
          auth: ['user:create'] // Requires user creation permission
        }
      },
      {
        path: 'edit/:id',
        name: 'UserEdit',
        component: () => import('@/views/user/edit.vue'),
        meta: {
          title: 'Edit User',
          auth: ['user:edit'] // Requires user edit permission
        }
      }
    ]
  }
]
```

#### System Management Module

```javascript
// System management - requires multiple permission verification
const systemRoutes = [
  {
    path: '/system',
    name: 'SystemManagement',
    component: () => import('@/views/system/index.vue'),
    meta: {
      title: 'System Management',
      auth: ['system:config'], // Requires system configuration permission
      role: ['SuperAdmin']     // And requires super admin role
    }
  },
  {
    path: '/logs',
    name: 'SystemLogs',
    component: () => import('@/views/logs/index.vue'),
    meta: {
      title: 'System Logs',
      auth: ['log:operation', 'log:login'], // Requires operation log or login log permission
      role: ['admin', 'auditor']            // And requires admin or auditor role
    }
  }
]
```

#### Special Permission Control

```javascript
// Development debugging page - only accessible to specific users
const devRoutes = [
  {
    path: '/dev-tools',
    name: 'DevTools',
    component: () => import('@/views/dev/index.vue'),
    meta: {
      title: 'Development Tools',
      user: ['admin', 'developer'], // Only admin and developer users can access
      auth: ['dev:tools']          // And requires development tools permission
    }
  }
]
```

### Permission Verification Process

```mermaid
graph TD
    A[User accesses route] --> B{Does route have permissions configured?}
    B -->|No| C[Directly allow access]
    B -->|Yes| D{Check permission codes (auth)}
    D -->|Not satisfied| E[Redirect to 403 page]
    D -->|Satisfied| F{Check roles (role)}
    F -->|Not satisfied| E
    F -->|Satisfied| G{Check users (user)}
    G -->|Not satisfied| E
    G -->|Satisfied| H[Allow access]
    C --> I[Render page component]
    H --> I
    E --> J[Display 403 no permission page]
```

### Permission Guard Implementation

MineAdmin's route permission guard logic is located in the route configuration, with core implementation logic:

```javascript
// Route guard example (simplified version)
router.beforeEach((to, from, next) => {
 