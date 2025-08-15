# JSX and TSX Development  

In the `3.0` frontend, route views not only support `vue` files but also **`jsx` and `tsx`** as view files, offering developers more flexibility.  
Of course, you can also write `tsx` or `jsx` inside `vue` files while maintaining traditional syntax.  

We strongly recommend setting the `lang` attribute of the `script` tag in `vue` files to `tsx`.  

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
    <!-- Outputs "hello world!" -->  
    <div>{{ example }}</div>  

    <!-- Renders the component -->  
    <component :is="customComponent()" />  
  </div>  
</template>  
```  

:::info  
You'll notice that there isn't much difference from the traditional approach, but writing `<div>` or similar tags directly inside the `script` tag becomes incredibly convenient.  
:::  

The above is just a simple example. Below are some resources for further learning:  
- [Official Vue 3.0 plugin `babel-plugin-jsx` syntax guide](https://github.com/vuejs/babel-plugin-jsx#syntax)  
- [Embracing Vue 3 Series: JSX Syntax](https://juejin.cn/post/6846687592138670094)