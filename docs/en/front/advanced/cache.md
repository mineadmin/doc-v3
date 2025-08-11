# Page Caching  
Frontend page caching is based on Vue's `keep-alive` mechanism. Once enabled, it caches page components to avoid repeated rendering and also stores page data to prevent redundant requests.

## Caching  
The system has already encapsulated the caching logic. To cache a specific page, simply follow these steps:  

- Set the `meta.cache` property in the route to `true`. For static routes, this needs to be configured manually, while for dynamic routes, this attribute can be modified in the **Menu Management** page.  
- Define `defineOptions({ name: 'Route's name property' })` in the page.  
- The page must have a **single root node**. If multiple root nodes exist while caching is enabled, it may result in a blank screen. Example of a single root node:  
```vue
<script setup lang="ts">
  
</script>

<template>
  <!-- Only one root node -->
  <div>
    <div>Page content</div>
  </div>
</template>
```

## Disabling Caching  
Disabling caching is straightforward—either do not set the `meta.cache` property to `true` or omit this property entirely. The other two conditions need not be addressed.  

If the property is set but caching is undesired, simply avoid defining `defineOptions({ name: 'xxx' })` in the page.