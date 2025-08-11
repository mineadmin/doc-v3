# Frontend Caching System

MineAdmin's frontend provides a comprehensive caching system, including multi-layer caching strategies such as page caching, data caching, and browser storage caching. Proper use of caching mechanisms can significantly improve application performance and user experience.

## Cache Type Overview

- **Page Caching**: Based on Vue's `keep-alive` mechanism to cache page component states
- **Data Caching**: Caches API request results and user data
- **Storage Caching**: Persistent caching based on localStorage/sessionStorage
- **Route Caching**: Caches route states and tab information

## Page Caching (Keep-Alive)

Page caching is implemented based on Vue's `keep-alive` mechanism to cache page component states, avoiding repeated rendering and data requests.

### Enabling Page Caching

To enable page caching, the following three conditions must be met:

1. **Set Route Meta Information**: Set the `meta.cache` property to `true` in the route
2. **Define Component Name**: Use `defineOptions` to define the component name in the page component
3. **Maintain Single Root Node**: The page template must have exactly one root node

### Implementation Example

```vue
<script setup lang="ts">
// Define component name, must match the route's name property
defineOptions({ 
  name: 'UserManagement' // Corresponds to route name: 'UserManagement'
})

// Page logic
const userList = ref([])
const searchForm = ref({})

// Page data will be cached, maintaining its state when users switch tabs and return
</script>

<template>
  <!-- Must maintain a single root node -->
  <div class="user-management-page">
    <ma-table 
      ref="tableRef"
      :columns="columns"
      :data="userList"
      :search="searchForm"
    />
  </div>
</template>
```

### Route Configuration

#### Static Routes
```typescript
// src/router/static-routes/userRoute.ts
export default {
  name: 'UserManagement',
  path: '/user/management',
  component: () => import('@/views/user/management/index.vue'),
  meta: {
    title: 'User Management',
    cache: true, // Enable caching
    icon: 'i-heroicons:users',
    type: 'M'
  }
}
```

#### Dynamic Routes (Menu Management)

For dynamic routes generated through backend menu management, caching properties can be set in the menu management interface:

1. Navigate to **System Management** → **Menu Management**
2. Edit the corresponding menu item
3. Find the **Enable Caching** toggle in the form
4. Enable and save

Reference menu form implementation: [menu-form.vue#L175](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/views/permission/menu/menu-form.vue#L175)

### Caching Mechanism Principle

The system implements page caching through the following methods:

1. **Route Guard Detection**: Checks the `meta.cache` property in `router.afterEach`
2. **Component Name Collection**: Collects the page component's `name` property and adds it to the cache list
3. **Keep-Alive Wrapping**: Uses `<KeepAlive>` to wrap the route view in the layout component

Core implementation code:

```typescript
// src/router/index.ts
router.afterEach(async (to) => {
  const keepAliveStore = useKeepAliveStore()
  
  // Check if caching is needed and not an iframe page
  if (to.meta.cache && to.meta.type !== 'I') {
    const componentName = to.matched.at(-1)?.components?.default!.name
    if (componentName) {
      keepAliveStore.add(componentName) // Add to cache list
    } else {
      console.warn(`Component page has no component name set and will not be cached`)
    }
  }
})
```

```tsx
// src/layouts/index.tsx
<RouterView>
  {({ Component }) => (
    <Transition name={appSetting.pageAnimate} mode="out-in">
      <KeepAlive include={keepAliveStore.list}>
        {(keepAliveStore.getShowState() && route.meta.type !== 'I') && 
          <Component key={route.fullPath} />
        }
      </KeepAlive>
    </Transition>
  )}
</RouterView>
```

### Cache Management

#### Disabling Page Caching

There are multiple ways to disable page caching:

1. **Do Not Set Cache Property** (Recommended)
```typescript
// Do not set cache or set it to false in route configuration
meta: {
  title: 'Temporary Page',
  cache: false // Or omit this property
}
```

2. **Do Not Define Component Name**
```vue
<script setup lang="ts">
// Do not use defineOptions to define component name
// Even if route sets cache: true, it will not be cached
</script>
```

#### Clearing Page Cache

The system provides multiple methods to clear cache:

```typescript
// Get keep-alive store instance
const keepAliveStore = useKeepAliveStore()

// 1. Remove specified page cache
keepAliveStore.remove('UserManagement')

// 2. Remove multiple page caches
keepAliveStore.remove(['UserManagement', 'RoleManagement'])

// 3. Clear all page caches
keepAliveStore.clean()

// 4. Temporarily hide cache (for page refresh)
keepAliveStore.hidden()
// Restore cache display
keepAliveStore.display()
```

#### Tab Cache Management

The tab system is tightly integrated with page caching, providing complete cache lifecycle management:

```typescript
const tabStore = useTabStore()

// Refresh current tab (clears and reloads cache)
await tabStore.refreshTab()

// Automatically clears corresponding page cache when closing tab
tabStore.closeTab(targetTab)

// Close other tabs (preserves fixed tabs and current tab caches)
await tabStore.closeOtherTab(currentTab)
```

## Data Caching (Web Storage)

In addition to page caching, MineAdmin also provides a powerful data caching system for caching API data, user preferences, and other information.

### useCache Hook

The system provides the `useCache` Hook to uniformly manage browser storage:

```typescript
import useCache from '@/hooks/useCache'

// Use localStorage (default)
const localStorage = useCache('localStorage')

// Use sessionStorage
const sessionStorage = useCache('sessionStorage')
```

### Basic Usage

```typescript
const cache = useCache()

// Store data
cache.set('userInfo', {
  id: 1,
  name: 'admin',
  roles: ['admin']
})

// Store data with expiration (in seconds)
cache.set('tempData', { value: 'temp' }, { exp: 3600 }) // Expires in 1 hour

// Get data
const userInfo = cache.get('userInfo')
const tempData = cache.get('tempData', null) // Provide default value

// Remove data
cache.remove('tempData')

// Remove all expired data
cache.removeAllExpires()

// Update data expiration time
cache.touch('userInfo', 7200) // Extend by 2 hours
```

### Advanced Features

#### Automatic Prefix
All cache keys automatically include an application prefix to avoid conflicts with other applications:

```typescript
// Actual stored key will be: VITE_APP_STORAGE_PREFIX + 'userInfo'
cache.set('userInfo', data)
```

#### Capacity Management
When storage capacity is insufficient, the system automatically cleans expired data:

```typescript
cache.set('largeData', data, {
  exp: 3600,
  force: true // When capacity is insufficient, forcibly clean expired data before storing
})
```

### Application in HTTP Requests

The system uses caching in HTTP interceptors to store user authentication information:

```typescript
// src/utils/http.ts
const cache = useCache()
const userStore = useUserStore()

// Store authentication token
cache.set('token', data.access_token)
cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
cache.set('refresh_token', data.refresh_token)

// Read cache when automatically refreshing token
if (!cache.get('refresh_token')) {
  await logout()
}
```

## Caching Best Practices

### 1. Proper Use of Page Caching

- **Suitable for Caching**: List pages, form pages, detail view pages
- **Not Suitable for Caching**: Login pages, error pages, temporary popup pages
- **Notes**: Ensure component names are unique to avoid cache conflicts

### 2. Data Caching Strategies

```typescript
// Cache dictionary data (long-term validity)
cache.set('dictData', dictList, { exp: 24 * 3600 }) // 24 hours

// Cache user preferences (persistent)
cache.set('userSettings', settings) // No expiration time

// Cache temporary state (short-term validity)
cache.set('searchForm', formData, { exp: 1800 }) // 30 minutes
```

### 3. Cache Cleaning Strategies

```typescript
// Clean sensitive data when user logs out
function logout() {
  cache.remove('token')
  cache.remove('refresh_token')
  cache.remove('userInfo')
  
  // Clean page caches
  keepAliveStore.clean()
  tabStore.clearTab()
}

// Periodically clean expired data
setInterval(() => {
  cache.removeAllExpires()
}, 60 * 60 * 1000) // Clean every hour
```

### 4. Performance Optimization Suggestions

- Avoid caching excessively large data objects
- Set reasonable expiration times to avoid memory leaks
- Consider using sessionStorage for frequently updated data
- Monitor cache usage and clean unnecessary caches promptly

## Frequently Asked Questions

### Issue 1: Page Caching Not Working

**Possible Causes**:
- Component does not define `name` property
- Route `meta.cache` is not set to `true`
- Page template has multiple root nodes

**Solution**:
```vue
<!-- Incorrect Example: Multiple root nodes -->
<template>
  <div>Content 1</div>
  <div>Content 2</div>
</template>

<!-- Correct Example: Single root node -->
<template>
  <div>
    <div>Content 1</div>
    <div>Content 2</div>
  </div>
</template>
```

### Issue 2: Cached Data Expired

```typescript
// Check if data exists and is not expired
const cachedData = cache.get('userData')
if (!cachedData) {
  // Re-fetch data
  const newData = await fetchUserData()
  cache.set('userData', newData, { exp: 3600 })
}
```

### Issue 3: Excessive Cache Usage

```typescript
// Periodically clean and monitor cache usage
function monitorCacheUsage() {
  try {
    const used = JSON.stringify(localStorage).length
    const quota = 5 * 1024 * 1024 // 5MB limit
    
    if (used > quota * 0.8) {
      console.warn('Cache usage too high, recommend cleaning')
      cache.removeAllExpires()
    }
  } catch (error) {
    console.error('Cache monitoring failed', error)
  }
}
```

## Source Code References

- [useCache Hook](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts) - Data caching utility
- [useKeepAliveStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useKeepAliveStore.ts) - Page cache state management
- [useTabStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts) - Tab cache management
- [Router Configuration](https://github.com/mineadmin/mineadmin/blob/master/web/src/router/index.ts) - Route caching logic
- [Layout Implementation](https://github.com/mineadmin/mineadmin/blob/master/web/src/layouts/index.tsx) - Keep-Alive implementation