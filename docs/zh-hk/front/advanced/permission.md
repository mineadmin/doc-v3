# 權限


## 概括
:::tip 權限概括
路由頁面可否訪問是基於後端返回的菜單確定的，而靜態路由前端來控制是否可以訪問。而前端目前主要控制了
`內容` 是否可顯示`(v-show)`以及渲染`(v-if)`，內容包括了：
- 頁面的元素
- 頁面的組件
- 按鈕...等等
:::

## 細粒度介紹及使用

目前權限分為三種細粒度：
- 基於權限碼（菜單的 `name` 字段）
- 基於角色碼（角色的 `code` 字段）
- 基於用户名（用户的 `username` 字段）

::: info
三種細粒度各有 `助手函數` 和 `指令` 來控制內容的渲染，其中基於權限碼的還有 **組件** 使用的方式來控制是否渲染內容。
:::

### 業務邏輯使用
```vue
<script setup lang="ts">
// 基於權限碼檢查的助手函數
import hasAuth from '@/utils/permission/hasAuth'
// 基於角色碼檢查的助手函數
import hasRole from '@/utils/permission/hasRole'
// 基於用户名檢查的助手函數
import hasUser from '@/utils/permission/hasUser'
  
// 權限判斷
if (hasAuth('permission') || hasAuth(['log', 'log:index'])) {
  // 權限通過
}

// 角色判斷
if (hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])) {
  // 角色通過
}

// 用户名判斷
if (hasUser('admin') || hasRole(['zhangSan', 'liSi'])) {
  // 用户通過
}
</script>
```

### API使用方式
```vue
<script setup lang="ts">
// 基於權限碼檢查的助手函數
import hasAuth from '@/utils/permission/hasAuth'
// 基於角色碼檢查的助手函數
import hasRole from '@/utils/permission/hasRole'
// 基於用户名檢查的助手函數
import hasUser from '@/utils/permission/hasUser'
</script>

<template>
  <div>
    <div v-if="hasAuth('permission') || hasAuth(['log', 'log:index'])">
      權限驗證通過，可以查看
    </div>
    
    <div v-if="hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])">
      角色驗證通過，可以查看
    </div>

    <div v-if="hasUser('admin') || hasRole(['zhangSan', 'liSi'])">
      用户驗證通過，可以查看
    </div>
  </div>
</template>
```

### 指令使用方式

其實同樣支持傳入字符串，為了簡單演示，就省略字符串傳入模式了.

```vue
<template>
  <div>
    <div v-auth="['log', 'log:index']">
      權限驗證通過，可以查看
    </div>
    
    <div v-role="['ceo', 'cfo']">
      角色驗證通過，可以查看
    </div>

    <div v-user="['zhangSan', 'liSi']">
      用户驗證通過，可以查看
    </div>
  </div>
</template>
```
::: tip 提示
`hasAuth`、`hasRole`、`hasUser` 函數還有第二個參數，用於是否連帶**路由裏的權限**是否檢查。
:::

### 權限組件使用

相比其他方式，組件對大範圍的內容控制更友好和方便，因為用組件包裹着需要顯示的內容，再傳入需要檢查的權限即可。
而且組件還有針對沒有權限的提供了插槽，可以自定義提示無權限的可看到的內容。

:::info 組件位置
**`src/components/ma-auth/index.vue`**

組件已全局引入，不需要再手動引入。
:::

```vue
<template>
  <!-- 擁有用户和菜單管理權限的可看到內容 -->
  <ma-auth :value="['permission:user', 'permission:menu']">
    權限通過，可以看到內容
    
    <!-- 沒有權限提示內容插槽 -->
    <template #notAuth>
      對不起，你無權瀏覽此內容
    </template>
  </ma-auth>
</template>
```

## 靜態路由訪問控制

靜態路由訪問控制只包括帶組件頁面的路由，不包含按鈕之類的，按鈕之類的應該通過上面的方式來控制。

::: tip 使用説明
使用靜態路由訪問控制十分簡單，只需要在路由 `meta` 屬性配置上 `auth`、`role` 或 `user` 屬性。前端在路由跳轉時會進行檢查是否可以訪問。
檢查不通過，則顯示 `403頁面`，檢查通過則正常訪問。如果不需要訪問控制，不配置這些屬性或將值設置為 `[]` 即可。


注意：三個屬性的類型都為 `string[]`
:::

