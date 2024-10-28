# JSX 和 TSX 开发

在 `3.0` 的前端中，路由视图不仅支持 `vue`，也支持 **`jsx、tsx`** 作为视图文件，给开发者提供不同的选择，
当然在 `vue` 文件内也可以写 `tsx` 或 `jsx`，同时还可以保持传统写法。

我们强烈建议把 `vue` 的 `script` 的 `lang` 属性设置为 `tsx`

```vue
<script setup lang="tsx">
// 无需显性引入 vue
const example = ref('hello world!')  
  
// 定义一个带 html 标签的组件
const customComponent = () => {
  return <div class="w-full text-red-5">{example.value}</div> 
}
</script>

<template>
  <div>
    <!-- 输出 hello world  -->
    <div>{{ example }} </div>
    
    <!-- 输出组件 -->
    <component :is="customComponent()" />
  </div>
</template>
```

:::info
会发现，与普通写法没有什么大的差别，但在 `script` 标签里直接写 `<div>` 之类的标签时候，就会发现特别方便。
:::

以上仅仅是简单示例，下面分享几个学习的地方：
- [vue3.0 的官方插件 babel-plugin-jsx 语法教学](https://github.com/vuejs/babel-plugin-jsx#syntax)
- [拥抱 Vue3 系列之 JSX 语法](https://juejin.cn/post/6846687592138670094)