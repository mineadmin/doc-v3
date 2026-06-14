# Frontend Cache System

MineAdmin frontend provides a complete caching system, including multi-layer caching strategies such as page caching, data caching, and browser storage caching. By properly using caching mechanisms, application performance and user experience can be significantly improved.

## Cache Types Overview

- **Page Cache**: Based on Vue's `keep-alive` mechanism, caches page component state
- **Data Cache**: Caches API request results and user data
- **Storage Cache**: Persistent caching based on localStorage/sessionStorage
- **Route Cache**: Caches route state and tab information

## Page Cache (Keep-Alive)

Page caching is implemented based on Vue's `keep-alive` mechanism, used to cache page component state, avoiding re-rendering and data requests.

### Enabling Page Cache

To enable page caching, the following three conditions must be met:

1. **Set Route Meta Info**: Set the `meta.cache` property to `true` in the route
2. **Define Component Name**: Use `defineOptions` in the page component to define the component name
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

// Page data will be cached, preserving state when user switches tabs and returns
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

For dynamic routes generated through backend menu management, cache properties can be set in the menu management interface:

1. Go to **System Management** → **Menu Management**
2. Edit the corresponding menu item
3. Find the **Cache** toggle in the form
4. Enable it and save

Refer to the menu form implementation: [menu-form.vue#L175](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/views/permission/menu/menu-form.vue#L175)

### Cache Mechanism Principles

The system implements page cache through the following methods:

1. **Route Guard Detection**: Detects the route's `meta.cache` property in `router.afterEach`
2. **Component Name Collection**: Gets the page component's `name` property and adds it to the cache list
3. **Keep-Alive Wrapping**: Wraps the route view with `<KeepAlive>` in the layout component

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
      console.warn(`Component page has no component name set, will not be cached`)
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

#### Disabling Page Cache

There are multiple ways to disable page caching:

1. **Don't set cache property** (Recommended)
```typescript
// Don't set cache in route config or set it to false
meta: {
  title: 'Temporary Page',
  cache: false // Or don't set this property
}
```

2. **Don't define component name**
```vue
<script setup lang="ts">
// Don't use defineOptions to define component name
// Even if the route has cache: true set, it won't be cached
</script>
```

#### Clearing Page Cache

The system provides multiple ways to clear cache:

```typescript
// Get keep-alive store instance
const keepAliveStore = useKeepAliveStore()

// 1. Remove specific page cache
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

The tab system is closely integrated with page caching, providing complete cache lifecycle management:

```typescript
const tabStore = useTabStore()

// Refresh current tab (clears and reloads cache)
await tabStore.refreshTab()

// Automatically clear corresponding page cache when closing a tab
tabStore.closeTab(targetTab)

// Close other tabs (preserve cache for pinned and current tabs)
await tabStore.closeOtherTab(currentTab)
```

## Data Cache (Web Storage)

Besides page caching, MineAdmin also provides a powerful data caching system for caching API data, user preferences, and other information.

### useCache Hook

The system provides the `useCache` Hook for unified browser storage management:

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

// Store data with expiration time (in seconds)
cache.set('tempData', { value: 'temp' }, { exp: 3600 }) // Expires in 1 hour

// Get data
const userInfo = cache.get('userInfo')
const tempData = cache.get('tempData', null) // Provide default value

// Delete data
cache.remove('tempData')

// Delete all expired data
cache.removeAllExpires()

// Update data expiration time
cache.touch('userInfo', 7200) // Extend by 2 hours
```

### Advanced Features

#### Auto Prefix
All cache keys automatically have the application prefix added to avoid conflicts with other applications:

```typescript
// The actual stored key will be: VITE_APP_STORAGE_PREFIX + 'userInfo'
cache.set('userInfo', data)
```

#### Capacity Management
When storage capacity is insufficient, the system automatically cleans expired data:

```typescript
cache.set('largeData', data, {
  exp: 3600,
  force: true // When capacity is insufficient, force clean expired data before storing
})
```

### Application in HTTP Requests

The system uses cache storage for user authentication information in HTTP interceptors:

```typescript
// src/utils/http.ts
const cache = useCache()
const userStore = useUserStore()

// Store authentication tokens
cache.set('token', data.access_token)
cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
cache.set('refresh_token', data.refresh_token)

// Read cache when automatically refreshing tokens
if (!cache.get('refresh_token')) {
  await logout()
}
```

## Cache Best Practices

### 1. Use Page Cache Appropriately

- **Pages suitable for caching**: List pages, form pages, detail view pages
- **Pages not suitable for caching**: Login pages, error pages, temporary modal pages
- **Notes**: Ensure component names are unique to avoid caching conflicts

### 2. Data Cache Strategy

```typescript
// Cache dictionary data (long-term validity)
cache.set('dictData', dictList, { exp: 24 * 3600 }) // 24 hours

// Cache user preferences (persistent)
cache.set('userSettings', settings) // No expiration time

// Cache temporary state (short-term validity)
cache.set('searchForm', formData, { exp: 1800 }) // 30 minutes
```

### 3. Cache Cleanup Strategy

```typescript
// Clean sensitive data on user logout
function logout() {
  cache.remove('token')
  cache.remove('refresh_token')
  cache.remove('userInfo')
  
  // Clean page cache
  keepAliveStore.clean()
  tabStore.clearTab()
}

// Periodically clean expired data
setInterval(() => {
  cache.removeAllExpires()
}, 60 * 60 * 1000) // Clean once per hour
```

### 4. Performance Optimization Tips

- Avoid caching excessively large data objects
- Set reasonable expiration times to avoid memory leaks
- Consider using sessionStorage for frequently updated data
- Monitor cache usage and clean up unnecessary cache data in a timely manner

## Common Issues

### Issue 1: Page Cache Not Taking Effect

**Possible Causes**:
- Component doesn't have `name` property defined
- Route `meta.cache` not set to `true`
- Page template has multiple root nodes

**Solution**:
```vue
<!-- Incorrect example: Multiple root nodes -->
<template>
  <div>Content 1</div>
  <div>Content 2</div>
</template>

<!-- Correct example: Single root node -->
<template>
  <div>
    <div>Content 1</div>
    <div>Content 2</div>
  </div>
</template>
```

### Issue 2: Cached Data Expired

```typescript
// Check if data exists and hasn't expired
const cachedData = cache.get('userData')
if (!cachedData) {
  // Re-fetch data
  const newData = await fetchUserData()
  cache.set('userData', newData, { exp: 3600 })
}
```

### Issue 3: Cache Occupying Too Much Space

```typescript
// Periodically clean and monitor cache usage
function monitorCacheUsage() {
  try {
    const used = JSON.stringify(localStorage).length
    const quota = 5 * 1024 * 1024 // 5MB limit
    
    if (used > quota * 0.8) {
      console.warn('Cache usage is high, recommend cleaning')
      cache.removeAllExpires()
    }
  } catch (error) {
    console.error('Cache monitoring failed', error)
  }
}
```

## Source Code Reference

- [useCache Hook](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts) - Data cache utility
- [useKeepAliveStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useKeepAliveStore.ts) - Page cache state management
- [useTabStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts) - Tab cache management
- [Router Configuration](https://github.com/mineadmin/mineadmin/blob/master/web/src/router/index.ts) - Route cache logic
- [Layout Component](https://github.com/mineadmin/mineadmin/blob/master/web/src/layouts/index.tsx) - Keep-Alive implementation