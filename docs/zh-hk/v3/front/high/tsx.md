# JSX 和 TSX 開發

在 `3.0` 的前端中，路由視圖不僅支持 `vue`，也支持 **`jsx、tsx`** 作為視圖文件，給開發者提供不同的選擇，
當然在 `vue` 文件內也可以寫 `tsx` 或 `jsx`，同時還可以保持傳統寫法。

我們強烈建議把 `vue` 的 `script` 的 `lang` 屬性設置為 `tsx`

```vue
<script setup lang="tsx">
// 無需顯性引入 vue
const example = ref('hello world!')  
  
// 定義一個帶 html 標籤的組件
const customComponent = () => {
  return <div class="w-full text-red-5">{example.value}</div> 
}
</script>

<template>
  <div>
    <!-- 輸出 hello world  -->
    <div>{{ example }} </div>
    
    <!-- 輸出組件 -->
    <component :is="customComponent()" />
  </div>
</template>
```

:::info
會發現，與普通寫法沒有什麼大的差別，但在 `script` 標籤裏直接寫 `<div>` 之類的標籤時候，就會發現特別方便。
:::

以上僅僅是簡單示例，下面分享幾個學習的地方：
- [vue3.0 的官方插件 babel-plugin-jsx 語法教學](https://github.com/vuejs/babel-plugin-jsx#syntax)
- [擁抱 Vue3 系列之 JSX 語法](https://juejin.cn/post/6846687592138670094)