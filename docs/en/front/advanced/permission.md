# Permissions

## Overview
:::tip Permission Overview
Whether a route page can be accessed is determined by the menu returned by the backend, while static routes are controlled by the frontend for access. The frontend currently mainly controls whether the `content` can be displayed `(v-show)` and rendered `(v-if)`. The content includes:
- Page elements
- Page components
- Buttons... etc.
:::

## Granularity Introduction and Usage

Currently, permissions are divided into three granularities:
- Based on permission codes (the `name` field of the menu)
- Based on role codes (the `code` field of the role)
- Based on usernames (the `username` field of the user)

::: info
Each of the three granularities has `helper functions` and `directives` to control the rendering of content. Additionally, the permission code-based granularity also supports **component** usage to control whether content is rendered.
:::

### Business Logic Usage
```vue
<script setup lang="ts">
// Helper function for permission code-based checks
import hasAuth from '@/utils/permission/hasAuth'
// Helper function for role code-based checks
import hasRole from '@/utils/permission/hasRole'
// Helper function for username-based checks
import hasUser from '@/utils/permission/hasUser'
  
// Permission check
if (hasAuth('permission') || hasAuth(['log', 'log:index'])) {
  // Permission granted
}

// Role check
if (hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])) {
  // Role granted
}

// Username check
if (hasUser('admin') || hasRole(['zhangSan', 'liSi'])) {
  // User granted
}
</script>
```

### API Usage
```vue
<script setup lang="ts">
// Helper function for permission code-based checks
import hasAuth from '@/utils/permission/hasAuth'
// Helper function for role code-based checks
import hasRole from '@/utils/permission/hasRole'
// Helper function for username-based checks
import hasUser from '@/utils/permission/hasUser'
</script>

<template>
  <div>
    <div v-if="hasAuth('permission') || hasAuth(['log', 'log:index'])">
      Permission granted, content visible
    </div>
    
    <div v-if="hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])">
      Role granted, content visible
    </div>

    <div v-if="hasUser('admin') || hasRole(['zhangSan', 'liSi'])">
      User granted, content visible
    </div>
  </div>
</template>
```

### Directive Usage

It also supports passing strings, but for simplicity, the string passing mode is omitted here.

```vue
<template>
  <div>
    <div v-auth="['log', 'log:index']">
      Permission granted, content visible
    </div>
    
    <div v-role="['ceo', 'cfo']">
      Role granted, content visible
    </div>

    <div v-user="['zhangSan', 'liSi']">
      User granted, content visible
    </div>
  </div>
</template>
```
::: tip Note
The `hasAuth`, `hasRole`, and `hasUser` functions have a second parameter to check whether the **permissions in the route** should also be checked.
:::

### Permission Component Usage

Compared to other methods, components are more friendly and convenient for controlling large areas of content. By wrapping the content that needs to be displayed with the component and passing the required permissions, it becomes easier to manage.
Additionally, the component provides a slot for cases where there is no permission, allowing custom content to be displayed when access is denied.

:::info Component Location
**`src/components/ma-auth/index.vue`**

The component is globally registered and does not need to be manually imported.
:::

```vue
<template>
  <!-- Content visible to users with user and menu management permissions -->
  <ma-auth :value="['permission:user', 'permission:menu']">
    Permission granted, content visible
    
    <!-- Slot for no permission content -->
    <template #notAuth>
      Sorry, you do not have permission to view this content
    </template>
  </ma-auth>
</template>
```

## Static Route Access Control

Static route access control only includes routes with component pages, not buttons or similar elements. Buttons and similar elements should be controlled using the methods described above.

::: tip Usage Instructions
Using static route access control is very simple. Just configure the `auth`, `role`, or `user` properties in the route's `meta` attribute. The frontend will check whether access is allowed during route navigation.
If the check fails, a `403 page` is displayed. If the check passes, normal access is granted. If no access control is needed, do not configure these properties or set their values to `[]`.

Note: The types of these three properties are all `string[]`
:::