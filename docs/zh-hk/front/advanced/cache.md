# 頁面緩存
前端頁面緩存基於 `vue` 的 `keep-alive` 機制，開始後，用於緩存頁面組件，避免重複渲染，同時，也用於緩存頁面數據，避免重複請求。

## 緩存
系統內部已經封裝好如何緩存，只需要按照以下方式即可將指定頁面緩存：

- 路由裏的 `meta.cache` 屬性設置為 `true`，靜態路由需要手動設置，動態路由可在**菜單管理**頁面修改此屬性即可。
- 在頁面裏定義 `defineOptions({ name: '路由的name屬性' })`
- 頁面要保持`單一根節點`，如果多個根節點，又開啓緩存的情況下，會造成白屏狀態。單一根節點寫法：
```vue
<script setup lang="ts">
  
</script>

<template>
  <!-- 只有一個根節點 -->
  <div>
    <div>頁面內容</div>
  </div>
</template>
```

## 不緩存
不緩存很簡單，不要設置 `meta.cache` 屬性為 `true` 或者不定義此屬性就可以了，其他兩項不需要處理。

如果設置了此屬性，但又不想緩存，頁面裏不要定義 `defineOptions({ name: 'xxx'})` 也可以。
