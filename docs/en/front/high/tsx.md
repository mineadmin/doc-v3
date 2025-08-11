# JSX and TSX Development  

In the frontend of `3.0`, routing views not only support `vue` files but also **`jsx` and `tsx`** as view files, offering developers more options.  
Of course, you can also write `tsx` or `jsx` inside `vue` files while retaining the traditional approach.  

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
You'll notice there isn't much difference from the usual approach, but when writing tags like `<div>` directly inside the `script` tag, it becomes exceptionally convenient.  
:::  

The above is just a simple example. Here are some resources for further learning:  
- [Official Vue 3.0 plugin babel-plugin-jsx syntax guide](https://github.com/vuejs/babel-plugin-jsx#syntax)  
- [Embracing Vue 3 Series: JSX Syntax](https://juejin.cn/post/6846687592138670094)