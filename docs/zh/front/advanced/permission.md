# 权限


## 概括
:::tip 权限概括
路由页面可否访问是基于后端返回的菜单确定的，而静态路由前端来控制是否可以访问。而前端目前主要控制了
`内容` 是否可显示`(v-show)`以及渲染`(v-if)`，内容包括了：
- 页面的元素
- 页面的组件
- 按钮...等等
:::

## 细粒度介绍及使用

目前权限分为三种细粒度：
- 基于权限码（菜单的 `name` 字段）
- 基于角色码（角色的 `code` 字段）
- 基于用户名（用户的 `username` 字段）

::: info
三种细粒度各有 `助手函数` 和 `指令` 来控制内容的渲染，其中基于权限码的还有 **组件** 使用的方式来控制是否渲染内容。
:::

### 业务逻辑使用
```vue
<script setup lang="ts">
// 基于权限码检查的助手函数
import hasAuth from '@/utils/permission/hasAuth'
// 基于角色码检查的助手函数
import hasRole from '@/utils/permission/hasRole'
// 基于用户名检查的助手函数
import hasUser from '@/utils/permission/hasUser'
  
// 权限判断
if (hasAuth('permission') || hasAuth(['log', 'log:index'])) {
  // 权限通过
}

// 角色判断
if (hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])) {
  // 角色通过
}

// 用户名判断
if (hasUser('admin') || hasRole(['zhangSan', 'liSi'])) {
  // 用户通过
}
</script>
```

### API使用方式
```vue
<script setup lang="ts">
// 基于权限码检查的助手函数
import hasAuth from '@/utils/permission/hasAuth'
// 基于角色码检查的助手函数
import hasRole from '@/utils/permission/hasRole'
// 基于用户名检查的助手函数
import hasUser from '@/utils/permission/hasUser'
</script>

<template>
  <div>
    <div v-if="hasAuth('permission') || hasAuth(['log', 'log:index'])">
      权限验证通过，可以查看
    </div>
    
    <div v-if="hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])">
      角色验证通过，可以查看
    </div>

    <div v-if="hasUser('admin') || hasRole(['zhangSan', 'liSi'])">
      用户验证通过，可以查看
    </div>
  </div>
</template>
```

### 指令使用方式

其实同样支持传入字符串，为了简单演示，就省略字符串传入模式了.

```vue
<template>
  <div>
    <div v-auth="['log', 'log:index']">
      权限验证通过，可以查看
    </div>
    
    <div v-role="['ceo', 'cfo']">
      角色验证通过，可以查看
    </div>

    <div v-user="['zhangSan', 'liSi']">
      用户验证通过，可以查看
    </div>
  </div>
</template>
```
::: tip 提示
`hasAuth`、`hasRole`、`hasUser` 函数还有第二个参数，用于是否连带**路由里的权限**是否检查。
:::

### 权限组件使用

相比其他方式，组件对大范围的内容控制更友好和方便，因为用组件包裹着需要显示的内容，再传入需要检查的权限即可。
而且组件还有针对没有权限的提供了插槽，可以自定义提示无权限的可看到的内容。

:::info 组件位置
**`src/components/ma-auth/index.vue`**

组件已全局引入，不需要再手动引入。
:::

```vue
<template>
  <!-- 拥有用户和菜单管理权限的可看到内容 -->
  <ma-auth :value="['permission:user', 'permission:menu']">
    权限通过，可以看到内容
    
    <!-- 没有权限提示内容插槽 -->
    <template #notAuth>
      对不起，你无权浏览此内容
    </template>
  </ma-auth>
</template>
```

## 静态路由访问控制

静态路由访问控制只包括带组件页面的路由，不包含按钮之类的，按钮之类的应该通过上面的方式来控制。

::: tip 使用说明
使用静态路由访问控制十分简单，只需要在路由 `meta` 属性配置上 `auth`、`role` 或 `user` 属性。前端在路由跳转时会进行检查是否可以访问。
检查不通过，则显示 `403页面`，检查通过则正常访问。如果不需要访问控制，不配置这些属性或将值设置为 `[]` 即可。


注意：三个属性的类型都为 `string[]`
:::

