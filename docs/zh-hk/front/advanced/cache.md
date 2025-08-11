# 前端緩存系統

MineAdmin 前端提供了完整的緩存系統，包括頁面緩存、數據緩存和瀏覽器存儲緩存等多層緩存策略。通過合理使用緩存機制，可以顯著提升應用性能和用户體驗。

## 緩存類型概述

- **頁面緩存**: 基於 Vue 的 `keep-alive` 機制，緩存頁面組件狀態
- **數據緩存**: 緩存 API 請求結果和用户數據
- **存儲緩存**: 基於 localStorage/sessionStorage 的持久化緩存
- **路由緩存**: 緩存路由狀態和標籤頁信息

## 頁面緩存 (Keep-Alive)

頁面緩存基於 Vue 的 `keep-alive` 機制實現，用於緩存頁面組件狀態，避免重複渲染和數據請求。

### 啓用頁面緩存

要啓用頁面緩存，需要滿足以下三個條件：

1. **設置路由元信息**: 在路由的 `meta.cache` 屬性設置為 `true`
2. **定義組件名稱**: 在頁面組件中使用 `defineOptions` 定義組件名稱
3. **保持單一根節點**: 頁面模板必須有且只有一個根節點

### 實現示例

```vue
<script setup lang="ts">
// 定義組件名稱，必須與路由的 name 屬性一致
defineOptions({ 
  name: 'UserManagement' // 對應路由 name: 'UserManagement'
})

// 頁面邏輯
const userList = ref([])
const searchForm = ref({})

// 頁面數據會被緩存，用户切換標籤頁後再回來時保持之前的狀態
</script>

<template>
  <!-- 必須保持單一根節點 -->
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

#### 靜態路由
```typescript
// src/router/static-routes/userRoute.ts
export default {
  name: 'UserManagement',
  path: '/user/management',
  component: () => import('@/views/user/management/index.vue'),
  meta: {
    title: '用户管理',
    cache: true, // 開啓緩存
    icon: 'i-heroicons:users',
    type: 'M'
  }
}
```

#### 動態路由（菜單管理）

對於通過後台菜單管理生成的動態路由，可以在菜單管理界面設置緩存屬性：

1. 進入 **系統管理** → **菜單管理**
2. 編輯對應菜單項
3. 在表單中找到 **是否緩存** 開關
4. 開啓後保存即可

參考菜單表單實現：[menu-form.vue#L175](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/views/permission/menu/menu-form.vue#L175)

### 緩存機制原理

系統通過以下方式實現頁面緩存：

1. **路由守衞檢測**: 在 `router.afterEach` 中檢測路由的 `meta.cache` 屬性
2. **組件名稱收集**: 獲取頁面組件的 `name` 屬性並添加到緩存列表
3. **Keep-Alive 包裹**: 在佈局組件中使用 `<KeepAlive>` 包裹路由視圖

核心實現代碼：

```typescript
// src/router/index.ts
router.afterEach(async (to) => {
  const keepAliveStore = useKeepAliveStore()
  
  // 檢查是否需要緩存且非iframe頁面
  if (to.meta.cache && to.meta.type !== 'I') {
    const componentName = to.matched.at(-1)?.components?.default!.name
    if (componentName) {
      keepAliveStore.add(componentName) // 添加到緩存列表
    } else {
      console.warn(`組件頁面未設置組件名，將不會被緩存`)
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

### 緩存管理

#### 禁用頁面緩存

有多種方式可以禁用頁面緩存：

1. **不設置緩存屬性**（推薦）
```typescript
// 路由配置中不設置 cache 或設置為 false
meta: {
  title: '臨時頁面',
  cache: false // 或者不設置此屬性
}
```

2. **不定義組件名稱**
```vue
<script setup lang="ts">
// 不使用 defineOptions 定義組件名稱
// 即使路由設置了 cache: true，也不會被緩存
</script>
```

#### 清除頁面緩存

系統提供了多種清除緩存的方法：

```typescript
// 獲取 keep-alive 存儲實例
const keepAliveStore = useKeepAliveStore()

// 1. 移除指定頁面緩存
keepAliveStore.remove('UserManagement')

// 2. 移除多個頁面緩存
keepAliveStore.remove(['UserManagement', 'RoleManagement'])

// 3. 清除所有頁面緩存
keepAliveStore.clean()

// 4. 臨時隱藏緩存（用於頁面刷新）
keepAliveStore.hidden()
// 恢復顯示緩存
keepAliveStore.display()
```

#### 標籤頁緩存管理

標籤頁系統與頁面緩存緊密結合，提供了完整的緩存生命週期管理：

```typescript
const tabStore = useTabStore()

// 刷新當前標籤頁（會清除並重新加載緩存）
await tabStore.refreshTab()

// 關閉標籤頁時自動清除對應的頁面緩存
tabStore.closeTab(targetTab)

// 關閉其他標籤頁（保留固定標籤頁和當前標籤頁的緩存）
await tabStore.closeOtherTab(currentTab)
```

## 數據緩存 (Web Storage)

除了頁面緩存，MineAdmin 還提供了功能強大的數據緩存系統，用於緩存 API 數據、用户偏好設置等信息。

### useCache Hook

系統提供了 `useCache` Hook 來統一管理瀏覽器存儲：

```typescript
import useCache from '@/hooks/useCache'

// 使用 localStorage（默認）
const localStorage = useCache('localStorage')

// 使用 sessionStorage
const sessionStorage = useCache('sessionStorage')
```

### 基本用法

```typescript
const cache = useCache()

// 存儲數據
cache.set('userInfo', {
  id: 1,
  name: 'admin',
  roles: ['admin']
})

// 存儲帶過期時間的數據（單位：秒）
cache.set('tempData', { value: 'temp' }, { exp: 3600 }) // 1小時後過期

// 獲取數據
const userInfo = cache.get('userInfo')
const tempData = cache.get('tempData', null) // 提供默認值

// 刪除數據
cache.remove('tempData')

// 刪除所有過期數據
cache.removeAllExpires()

// 更新數據的過期時間
cache.touch('userInfo', 7200) // 延長2小時
```

### 高級特性

#### 自動前綴
所有緩存鍵都會自動添加應用前綴，避免與其他應用衝突：

```typescript
// 實際存儲的鍵名會是：VITE_APP_STORAGE_PREFIX + 'userInfo'
cache.set('userInfo', data)
```

#### 容量管理
當存儲容量不足時，系統會自動清理過期數據：

```typescript
cache.set('largeData', data, {
  exp: 3600,
  force: true // 當容量不足時，強制清理過期數據後再存儲
})
```

### 在 HTTP 請求中的應用

系統在 HTTP 攔截器中使用緩存存儲用户認證信息：

```typescript
// src/utils/http.ts
const cache = useCache()
const userStore = useUserStore()

// 存儲認證令牌
cache.set('token', data.access_token)
cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
cache.set('refresh_token', data.refresh_token)

// 自動刷新令牌時讀取緩存
if (!cache.get('refresh_token')) {
  await logout()
}
```

## 緩存最佳實踐

### 1. 合理使用頁面緩存

- **適合緩存的頁面**：列表頁、表單頁、查看詳情頁
- **不適合緩存的頁面**：登錄頁、錯誤頁、臨時彈窗頁面
- **注意事項**：確保組件名稱唯一，避免緩存衝突

### 2. 數據緩存策略

```typescript
// 緩存字典數據（長期有效）
cache.set('dictData', dictList, { exp: 24 * 3600 }) // 24小時

// 緩存用户偏好設置（持久化）
cache.set('userSettings', settings) // 無過期時間

// 緩存臨時狀態（短期有效）
cache.set('searchForm', formData, { exp: 1800 }) // 30分鐘
```

### 3. 緩存清理策略

```typescript
// 用户登出時清理敏感數據
function logout() {
  cache.remove('token')
  cache.remove('refresh_token')
  cache.remove('userInfo')
  
  // 清理頁面緩存
  keepAliveStore.clean()
  tabStore.clearTab()
}

// 定期清理過期數據
setInterval(() => {
  cache.removeAllExpires()
}, 60 * 60 * 1000) // 每小時清理一次
```

### 4. 性能優化建議

- 避免緩存過大的數據對象
- 合理設置過期時間，避免內存泄漏
- 對於頻繁更新的數據，考慮使用 sessionStorage
- 監控緩存使用情況，及時清理無用緩存

## 常見問題

### 問題1：頁面緩存未生效

**可能原因**：
- 組件未定義 `name` 屬性
- 路由 `meta.cache` 未設置為 `true`
- 頁面模板存在多個根節點

**解決方案**：
```vue
<!-- 錯誤示例：多個根節點 -->
<template>
  <div>內容1</div>
  <div>內容2</div>
</template>

<!-- 正確示例：單一根節點 -->
<template>
  <div>
    <div>內容1</div>
    <div>內容2</div>
  </div>
</template>
```

### 問題2：緩存數據過期

```typescript
// 檢查數據是否存在且未過期
const cachedData = cache.get('userData')
if (!cachedData) {
  // 重新獲取數據
  const newData = await fetchUserData()
  cache.set('userData', newData, { exp: 3600 })
}
```

### 問題3：緩存佔用過多空間

```typescript
// 定期清理和監控緩存使用
function monitorCacheUsage() {
  try {
    const used = JSON.stringify(localStorage).length
    const quota = 5 * 1024 * 1024 // 5MB 限制
    
    if (used > quota * 0.8) {
      console.warn('緩存使用率過高，建議清理')
      cache.removeAllExpires()
    }
  } catch (error) {
    console.error('緩存監控失敗', error)
  }
}
```

## 源碼參考

- [useCache Hook](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts) - 數據緩存工具
- [useKeepAliveStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useKeepAliveStore.ts) - 頁面緩存狀態管理
- [useTabStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts) - 標籤頁緩存管理
- [Router 配置](https://github.com/mineadmin/mineadmin/blob/master/web/src/router/index.ts) - 路由緩存邏輯
- [Layout 佈局](https://github.com/mineadmin/mineadmin/blob/master/web/src/layouts/index.tsx) - Keep-Alive 實現
