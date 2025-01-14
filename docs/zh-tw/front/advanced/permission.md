# 許可權


## 概括
:::tip 許可權概括
路由頁面可否訪問是基於後端返回的選單確定的，而靜態路由前端來控制是否可以訪問。而前端目前主要控制了
`內容` 是否可顯示`(v-show)`以及渲染`(v-if)`，內容包括了：
- 頁面的元素
- 頁面的元件
- 按鈕...等等
:::

## 細粒度介紹及使用

目前許可權分為三種細粒度：
- 基於許可權碼（選單的 `name` 欄位）
- 基於角色碼（角色的 `code` 欄位）
- 基於使用者名稱（使用者的 `username` 欄位）

::: info
三種細粒度各有 `助手函式` 和 `指令` 來控制內容的渲染，其中基於許可權碼的還有 **元件** 使用的方式來控制是否渲染內容。
:::

### 業務邏輯使用
```vue
<script setup lang="ts">
// 基於許可權碼檢查的助手函式
import hasAuth from '@/utils/permission/hasAuth'
// 基於角色碼檢查的助手函式
import hasRole from '@/utils/permission/hasRole'
// 基於使用者名稱檢查的助手函式
import hasUser from '@/utils/permission/hasUser'
  
// 許可權判斷
if (hasAuth('permission') || hasAuth(['log', 'log:index'])) {
  // 許可權透過
}

// 角色判斷
if (hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])) {
  // 角色透過
}

// 使用者名稱判斷
if (hasUser('admin') || hasRole(['zhangSan', 'liSi'])) {
  // 使用者透過
}
</script>
```

### API使用方式
```vue
<script setup lang="ts">
// 基於許可權碼檢查的助手函式
import hasAuth from '@/utils/permission/hasAuth'
// 基於角色碼檢查的助手函式
import hasRole from '@/utils/permission/hasRole'
// 基於使用者名稱檢查的助手函式
import hasUser from '@/utils/permission/hasUser'
</script>

<template>
  <div>
    <div v-if="hasAuth('permission') || hasAuth(['log', 'log:index'])">
      許可權驗證透過，可以檢視
    </div>
    
    <div v-if="hasRole('SuperAdmin') || hasRole(['ceo', 'cfo'])">
      角色驗證透過，可以檢視
    </div>

    <div v-if="hasUser('admin') || hasRole(['zhangSan', 'liSi'])">
      使用者驗證透過，可以檢視
    </div>
  </div>
</template>
```

### 指令使用方式

其實同樣支援傳入字串，為了簡單演示，就省略字串傳入模式了.

```vue
<template>
  <div>
    <div v-auth="['log', 'log:index']">
      許可權驗證透過，可以檢視
    </div>
    
    <div v-role="['ceo', 'cfo']">
      角色驗證透過，可以檢視
    </div>

    <div v-user="['zhangSan', 'liSi']">
      使用者驗證透過，可以檢視
    </div>
  </div>
</template>
```
::: tip 提示
`hasAuth`、`hasRole`、`hasUser` 函式還有第二個引數，用於是否連帶**路由裡的許可權**是否檢查。
:::

### 許可權元件使用

相比其他方式，元件對大範圍的內容控制更友好和方便，因為用元件包裹著需要顯示的內容，再傳入需要檢查的許可權即可。
而且元件還有針對沒有許可權的提供了插槽，可以自定義提示無許可權的可看到的內容。

:::info 元件位置
**`src/components/ma-auth/index.vue`**

元件已全域性引入，不需要再手動引入。
:::

```vue
<template>
  <!-- 擁有使用者和選單管理許可權的可看到內容 -->
  <ma-auth :value="['permission:user', 'permission:menu']">
    許可權透過，可以看到內容
    
    <!-- 沒有許可權提示內容插槽 -->
    <template #notAuth>
      對不起，你無權瀏覽此內容
    </template>
  </ma-auth>
</template>
```

## 靜態路由訪問控制

靜態路由訪問控制只包括帶元件頁面的路由，不包含按鈕之類的，按鈕之類的應該透過上面的方式來控制。

::: tip 使用說明
使用靜態路由訪問控制十分簡單，只需要在路由 `meta` 屬性配置上 `auth`、`role` 或 `user` 屬性。前端在路由跳轉時會進行檢查是否可以訪問。
檢查不透過，則顯示 `403頁面`，檢查透過則正常訪問。如果不需要訪問控制，不配置這些屬性或將值設定為 `[]` 即可。


注意：三個屬性的型別都為 `string[]`
:::

