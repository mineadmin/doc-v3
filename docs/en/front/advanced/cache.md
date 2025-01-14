# Page Caching

Front-end page caching is based on Vue's `keep-alive` mechanism. Once enabled, it is used to cache page components to avoid repeated rendering, and also to cache page data to prevent redundant requests.

## Caching

The system has already encapsulated how caching works. To cache a specific page, simply follow these steps:

- Set the `meta.cache` property in the route to `true`. For static routes, this needs to be set manually. For dynamic routes, you can modify this property in the **Menu Management** page.
- Define `defineOptions({ name: 'route's name property' })` in the page.
- The page must maintain a `single root node`. If there are multiple root nodes and caching is enabled, it may result in a blank screen. Example of a single root node:
```vue
<script setup lang="ts">
  
</script>

<template>
  <!-- Only one root node -->
  <div>
    <div>Page Content</div>
  </div>
</template>
```

## Not Caching

Not caching is simple: do not set the `meta.cache` property to `true` or simply do not define this property. The other two steps do not need to be handled.

If this property is set but you do not want to cache, you can avoid defining `defineOptions({ name: 'xxx' })` in the page.