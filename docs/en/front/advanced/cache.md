# Page Caching  
Frontend page caching is based on Vue's `keep-alive` mechanism. Once enabled, it caches page components to avoid repeated rendering and also stores page data to prevent redundant requests.

## Caching  
The system has already encapsulated the caching logic. To cache a specific page, follow these steps:

- Set the `meta.cache` property in the route to `true`. Static routes require manual configuration, while dynamic routes can be adjusted via the **Menu Management** page by modifying this attribute.
- Define `defineOptions({ name: 'route-name' })` in the page component.  
- The page must maintain a **single root node**. Multiple root nodes with caching enabled may result in a blank screen. Example of a single root node:  
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

## Disabling Caching  
Disabling caching is straightforward—either avoid setting the `meta.cache` property to `true` or omit this property entirely. The other two steps are unnecessary.  

If the property is set but caching is undesired, simply refrain from defining `defineOptions({ name: 'xxx' })` in the page component.