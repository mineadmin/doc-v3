# JSX 和 TSX 開發

在 `3.0` 的前端中，路由檢視不僅支援 `vue`，也支援 **`jsx、tsx`** 作為檢視檔案，給開發者提供不同的選擇，
當然在 `vue` 檔案內也可以寫 `tsx` 或 `jsx`，同時還可以保持傳統寫法。

我們強烈建議把 `vue` 的 `script` 的 `lang` 屬性設定為 `tsx`

```vue
<script setup lang="tsx">
// 無需顯性引入 vue
const example = ref('hello world!')  
  
// 定義一個帶 html 標籤的元件
const customComponent = () => {
  return <div class="w-full text-red-5">{example.value}</div> 
}
</script>

<template>
  <div>
    <!-- 輸出 hello world  -->
    <div>{{ example }} </div>
    
    <!-- 輸出元件 -->
    <component :is="customComponent()" />
  </div>
</template>
```

:::info
會發現，與普通寫法沒有什麼大的差別，但在 `script` 標籤裡直接寫 `<div>` 之類的標籤時候，就會發現特別方便。
:::

以上僅僅是簡單示例，下面分享幾個學習的地方：
- [vue3.0 的官方外掛 babel-plugin-jsx 語法教學](https://github.com/vuejs/babel-plugin-jsx#syntax)
- [擁抱 Vue3 系列之 JSX 語法](https://juejin.cn/post/6846687592138670094)