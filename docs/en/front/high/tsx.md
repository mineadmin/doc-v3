# JSX and TSX Development

In the `3.0` frontend, routing views not only support `vue` but also **`jsx` and `tsx`** as view files, offering developers different choices. Of course, you can also write `tsx` or `jsx` within `vue` files while maintaining traditional writing styles.

We strongly recommend setting the `lang` attribute of the `script` tag in `vue` to `tsx`.

```vue
<script setup lang="tsx">
// No need to explicitly import vue
const example = ref('hello world!')  
 
// Define a component with HTML tags
const customComponent = () => {
  return <div class="w-full text-red-5">{example.value}</div> 
}
</script>

<template>
  <div>
    <!-- Output hello world  -->
    <div>{{ example }} </div>
    
    <!-- Output the component -->
    <component :is="customComponent()" />
  </div>
</template>
```

:::info
You'll notice that there isn't much difference from the usual writing style, but when you directly write tags like `<div>` within the `script` tag, it becomes particularly convenient.
:::

The above is just a simple example. Below are a few resources for further learning:
- [Official Vue 3.0 plugin babel-plugin-jsx syntax tutorial](https://github.com/vuejs/babel-plugin-jsx#syntax)
- [Embracing Vue3 Series: JSX Syntax](https://juejin.cn/post/6846687592138670094)