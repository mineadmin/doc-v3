# Permissions  

## Overview  
:::tip Permission Summary  
Access to route pages is determined by the backend-returned menu, while static routes are controlled by the frontend for accessibility. Currently, the frontend primarily controls whether `content` is displayed (`v-show`) or rendered (`v-if`). This content includes:  
- Page elements  
- Page components  
- Buttons, etc.  
:::

## Granularity Introduction and Usage  

Currently, permissions are divided into three granularities:  
- **Permission-based** (menu's `name` field)  
- **Role-based** (role's `code` field)  
- **User-based** (user's `username` field)  

::: info  
Each granularity has corresponding **helper functions** and **directives** to control content rendering. Additionally, permission-based granularity also supports **component-based** usage for content rendering control.  
:::

### Business Logic Usage  
```vue  
<script setup lang="ts">  
// Permission-based helper function  
import hasAuth from '@/utils/permission/hasAuth'  
// Role-based helper function  
import hasRole from '@/utils/permission/hasRole'  
// User-based helper function  
import hasUser from '@/utils/permission/hasUser'  
  
// Permission check  
if (hasAuth('permission') || hasAuth(['log', 'log:index'])) {  
  // Permission granted  
}  

// Role check  
if (hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])) {  
  // Role granted  
}  

// User check  
if (hasUser('admin') || hasRole(['zhangSan', 'liSi'])) {  
  // User granted  
}  
</script>  
```  

### API Usage  
```vue  
<script setup lang="ts">  
// Permission-based helper function  
import hasAuth from '@/utils/permission/hasAuth'  
// Role-based helper function  
import hasRole from '@/utils/permission/hasRole'  
// User-based helper function  
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

String input is also supported, but for simplicity, only array input is demonstrated here.  

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
The `hasAuth`, `hasRole`, and `hasUser` functions also accept a second parameter to determine whether **route permissions** should be checked as well.  
:::

### Permission Component Usage  

Compared to other methods, the component approach is more user-friendly and convenient for controlling large sections of content. By wrapping the content to be displayed with the component and passing the required permissions, you can easily manage visibility. Additionally, the component provides a slot for customizing the "no permission" message.  

:::info Component Location  
**`src/components/ma-auth/index.vue`**  

The component is globally registered and does not require manual import.  
:::  

```vue  
<template>  
  <!-- Users with user and menu management permissions can see the content -->  
  <ma-auth :value="['permission:user', 'permission:menu']">  
    Permission granted, content visible  
    
    <!-- Slot for no-permission message -->  
    <template #notAuth>  
      Sorry, you do not have permission to view this content.  
    </template>  
  </ma-auth>  
</template>  
```  

## Static Route Access Control  

Static route access control only applies to routes with component pages, not buttons or similar elements. Buttons should be controlled using the methods described above.  

::: tip Usage Instructions  
Using static route access control is straightforward. Simply configure the `auth`, `role`, or `user` properties in the route's `meta` attribute. The frontend will check accessibility during route navigation.  

If access is denied, a `403 page` is displayed. If granted, normal access is permitted. To disable access control, omit these properties or set their values to `[]`.  

Note: All three properties are of type `string[]`.  
:::