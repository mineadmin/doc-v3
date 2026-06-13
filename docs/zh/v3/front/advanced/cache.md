# 前端缓存系统

MineAdmin 前端提供了完整的缓存系统，包括页面缓存、数据缓存和浏览器存储缓存等多层缓存策略。通过合理使用缓存机制，可以显著提升应用性能和用户体验。

## 缓存类型概述

- **页面缓存**: 基于 Vue 的 `keep-alive` 机制，缓存页面组件状态
- **数据缓存**: 缓存 API 请求结果和用户数据
- **存储缓存**: 基于 localStorage/sessionStorage 的持久化缓存
- **路由缓存**: 缓存路由状态和标签页信息

## 页面缓存 (Keep-Alive)

页面缓存基于 Vue 的 `keep-alive` 机制实现，用于缓存页面组件状态，避免重复渲染和数据请求。

### 启用页面缓存

要启用页面缓存，需要满足以下三个条件：

1. **设置路由元信息**: 在路由的 `meta.cache` 属性设置为 `true`
2. **定义组件名称**: 在页面组件中使用 `defineOptions` 定义组件名称
3. **保持单一根节点**: 页面模板必须有且只有一个根节点

### 实现示例

```vue
<script setup lang="ts">
// 定义组件名称，必须与路由的 name 属性一致
defineOptions({ 
  name: 'UserManagement' // 对应路由 name: 'UserManagement'
})

// 页面逻辑
const userList = ref([])
const searchForm = ref({})

// 页面数据会被缓存，用户切换标签页后再回来时保持之前的状态
</script>

<template>
  <!-- 必须保持单一根节点 -->
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

### 路由配置

#### 静态路由
```typescript
// src/router/static-routes/userRoute.ts
export default {
  name: 'UserManagement',
  path: '/user/management',
  component: () => import('@/views/user/management/index.vue'),
  meta: {
    title: '用户管理',
    cache: true, // 开启缓存
    icon: 'i-heroicons:users',
    type: 'M'
  }
}
```

#### 动态路由（菜单管理）

对于通过后台菜单管理生成的动态路由，可以在菜单管理界面设置缓存属性：

1. 进入 **系统管理** → **菜单管理**
2. 编辑对应菜单项
3. 在表单中找到 **是否缓存** 开关
4. 开启后保存即可

参考菜单表单实现：[menu-form.vue#L175](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/views/permission/menu/menu-form.vue#L175)

### 缓存机制原理

系统通过以下方式实现页面缓存：

1. **路由守卫检测**: 在 `router.afterEach` 中检测路由的 `meta.cache` 属性
2. **组件名称收集**: 获取页面组件的 `name` 属性并添加到缓存列表
3. **Keep-Alive 包裹**: 在布局组件中使用 `<KeepAlive>` 包裹路由视图

核心实现代码：

```typescript
// src/router/index.ts
router.afterEach(async (to) => {
  const keepAliveStore = useKeepAliveStore()
  
  // 检查是否需要缓存且非iframe页面
  if (to.meta.cache && to.meta.type !== 'I') {
    const componentName = to.matched.at(-1)?.components?.default!.name
    if (componentName) {
      keepAliveStore.add(componentName) // 添加到缓存列表
    } else {
      console.warn(`组件页面未设置组件名，将不会被缓存`)
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

### 缓存管理

#### 禁用页面缓存

有多种方式可以禁用页面缓存：

1. **不设置缓存属性**（推荐）
```typescript
// 路由配置中不设置 cache 或设置为 false
meta: {
  title: '临时页面',
  cache: false // 或者不设置此属性
}
```

2. **不定义组件名称**
```vue
<script setup lang="ts">
// 不使用 defineOptions 定义组件名称
// 即使路由设置了 cache: true，也不会被缓存
</script>
```

#### 清除页面缓存

系统提供了多种清除缓存的方法：

```typescript
// 获取 keep-alive 存储实例
const keepAliveStore = useKeepAliveStore()

// 1. 移除指定页面缓存
keepAliveStore.remove('UserManagement')

// 2. 移除多个页面缓存
keepAliveStore.remove(['UserManagement', 'RoleManagement'])

// 3. 清除所有页面缓存
keepAliveStore.clean()

// 4. 临时隐藏缓存（用于页面刷新）
keepAliveStore.hidden()
// 恢复显示缓存
keepAliveStore.display()
```

#### 标签页缓存管理

标签页系统与页面缓存紧密结合，提供了完整的缓存生命周期管理：

```typescript
const tabStore = useTabStore()

// 刷新当前标签页（会清除并重新加载缓存）
await tabStore.refreshTab()

// 关闭标签页时自动清除对应的页面缓存
tabStore.closeTab(targetTab)

// 关闭其他标签页（保留固定标签页和当前标签页的缓存）
await tabStore.closeOtherTab(currentTab)
```

## 数据缓存 (Web Storage)

除了页面缓存，MineAdmin 还提供了功能强大的数据缓存系统，用于缓存 API 数据、用户偏好设置等信息。

### useCache Hook

系统提供了 `useCache` Hook 来统一管理浏览器存储：

```typescript
import useCache from '@/hooks/useCache'

// 使用 localStorage（默认）
const localStorage = useCache('localStorage')

// 使用 sessionStorage
const sessionStorage = useCache('sessionStorage')
```

### 基本用法

```typescript
const cache = useCache()

// 存储数据
cache.set('userInfo', {
  id: 1,
  name: 'admin',
  roles: ['admin']
})

// 存储带过期时间的数据（单位：秒）
cache.set('tempData', { value: 'temp' }, { exp: 3600 }) // 1小时后过期

// 获取数据
const userInfo = cache.get('userInfo')
const tempData = cache.get('tempData', null) // 提供默认值

// 删除数据
cache.remove('tempData')

// 删除所有过期数据
cache.removeAllExpires()

// 更新数据的过期时间
cache.touch('userInfo', 7200) // 延长2小时
```

### 高级特性

#### 自动前缀
所有缓存键都会自动添加应用前缀，避免与其他应用冲突：

```typescript
// 实际存储的键名会是：VITE_APP_STORAGE_PREFIX + 'userInfo'
cache.set('userInfo', data)
```

#### 容量管理
当存储容量不足时，系统会自动清理过期数据：

```typescript
cache.set('largeData', data, {
  exp: 3600,
  force: true // 当容量不足时，强制清理过期数据后再存储
})
```

### 在 HTTP 请求中的应用

系统在 HTTP 拦截器中使用缓存存储用户认证信息：

```typescript
// src/utils/http.ts
const cache = useCache()
const userStore = useUserStore()

// 存储认证令牌
cache.set('token', data.access_token)
cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
cache.set('refresh_token', data.refresh_token)

// 自动刷新令牌时读取缓存
if (!cache.get('refresh_token')) {
  await logout()
}
```

## 缓存最佳实践

### 1. 合理使用页面缓存

- **适合缓存的页面**：列表页、表单页、查看详情页
- **不适合缓存的页面**：登录页、错误页、临时弹窗页面
- **注意事项**：确保组件名称唯一，避免缓存冲突

### 2. 数据缓存策略

```typescript
// 缓存字典数据（长期有效）
cache.set('dictData', dictList, { exp: 24 * 3600 }) // 24小时

// 缓存用户偏好设置（持久化）
cache.set('userSettings', settings) // 无过期时间

// 缓存临时状态（短期有效）
cache.set('searchForm', formData, { exp: 1800 }) // 30分钟
```

### 3. 缓存清理策略

```typescript
// 用户登出时清理敏感数据
function logout() {
  cache.remove('token')
  cache.remove('refresh_token')
  cache.remove('userInfo')
  
  // 清理页面缓存
  keepAliveStore.clean()
  tabStore.clearTab()
}

// 定期清理过期数据
setInterval(() => {
  cache.removeAllExpires()
}, 60 * 60 * 1000) // 每小时清理一次
```

### 4. 性能优化建议

- 避免缓存过大的数据对象
- 合理设置过期时间，避免内存泄漏
- 对于频繁更新的数据，考虑使用 sessionStorage
- 监控缓存使用情况，及时清理无用缓存

## 常见问题

### 问题1：页面缓存未生效

**可能原因**：
- 组件未定义 `name` 属性
- 路由 `meta.cache` 未设置为 `true`
- 页面模板存在多个根节点

**解决方案**：
```vue
<!-- 错误示例：多个根节点 -->
<template>
  <div>内容1</div>
  <div>内容2</div>
</template>

<!-- 正确示例：单一根节点 -->
<template>
  <div>
    <div>内容1</div>
    <div>内容2</div>
  </div>
</template>
```

### 问题2：缓存数据过期

```typescript
// 检查数据是否存在且未过期
const cachedData = cache.get('userData')
if (!cachedData) {
  // 重新获取数据
  const newData = await fetchUserData()
  cache.set('userData', newData, { exp: 3600 })
}
```

### 问题3：缓存占用过多空间

```typescript
// 定期清理和监控缓存使用
function monitorCacheUsage() {
  try {
    const used = JSON.stringify(localStorage).length
    const quota = 5 * 1024 * 1024 // 5MB 限制
    
    if (used > quota * 0.8) {
      console.warn('缓存使用率过高，建议清理')
      cache.removeAllExpires()
    }
  } catch (error) {
    console.error('缓存监控失败', error)
  }
}
```

## 源码参考

- [useCache Hook](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts) - 数据缓存工具
- [useKeepAliveStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useKeepAliveStore.ts) - 页面缓存状态管理
- [useTabStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts) - 标签页缓存管理
- [Router 配置](https://github.com/mineadmin/mineadmin/blob/master/web/src/router/index.ts) - 路由缓存逻辑
- [Layout 布局](https://github.com/mineadmin/mineadmin/blob/master/web/src/layouts/index.tsx) - Keep-Alive 实现
