# JSX and TSX Development

In the frontend of `3.0`, route views not only support `vue`, but also **`jsx` and `tsx`** as view files, providing developers with different options.  
Of course, you can also write `tsx` or `jsx` inside `vue` files while maintaining traditional syntax.

We strongly recommend setting the `lang` attribute of `vue`'s `script` to `tsx`.

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
    <!-- Outputs hello world  -->
    <div>{{ example }} </div>
    
    <!-- Outputs the component -->
    <component :is="customComponent()" />
  </div>
</template>
```

:::info
You will notice there is not much difference from the regular syntax, but it becomes especially convenient when directly writing `<div>` tags within the `script` tag.
:::

The above is just a simple example. Below are some resources for further study:
- [Official vue3.0 plugin babel-plugin-jsx syntax guide](https://github.com/vuejs/babel-plugin-jsx#syntax)
- [Embracing Vue3 Series: JSX Syntax](https://juejin.cn/post/6846687592138670094)