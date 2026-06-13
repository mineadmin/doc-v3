# 前端快取系統

MineAdmin 前端提供了完整的快取系統，包括頁面快取、資料快取和瀏覽器儲存快取等多層快取策略。透過合理使用快取機制，可以顯著提升應用效能和使用者體驗。

## 快取型別概述

- **頁面快取**: 基於 Vue 的 `keep-alive` 機制，快取頁面元件狀態
- **資料快取**: 快取 API 請求結果和使用者資料
- **儲存快取**: 基於 localStorage/sessionStorage 的持久化快取
- **路由快取**: 快取路由狀態和標籤頁資訊

## 頁面快取 (Keep-Alive)

頁面快取基於 Vue 的 `keep-alive` 機制實現，用於快取頁面元件狀態，避免重複渲染和資料請求。

### 啟用頁面快取

要啟用頁面快取，需要滿足以下三個條件：

1. **設定路由元資訊**: 在路由的 `meta.cache` 屬性設定為 `true`
2. **定義元件名稱**: 在頁面元件中使用 `defineOptions` 定義元件名稱
3. **保持單一根節點**: 頁面模板必須有且只有一個根節點

### 實現示例

```vue
<script setup lang="ts">
// 定義元件名稱，必須與路由的 name 屬性一致
defineOptions({ 
  name: 'UserManagement' // 對應路由 name: 'UserManagement'
})

// 頁面邏輯
const userList = ref([])
const searchForm = ref({})

// 頁面資料會被快取，使用者切換標籤頁後再回來時保持之前的狀態
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
    title: '使用者管理',
    cache: true, // 開啟快取
    icon: 'i-heroicons:users',
    type: 'M'
  }
}
```

#### 動態路由（選單管理）

對於通過後臺菜單管理生成的動態路由，可以在選單管理介面設定快取屬性：

1. 進入 **系統管理** → **選單管理**
2. 編輯對應選單項
3. 在表單中找到 **是否快取** 開關
4. 開啟後儲存即可

參考選單表單實現：[menu-form.vue#L175](https://github.com/mineadmin/mineadmin/blob/master/web/src/modules/base/views/permission/menu/menu-form.vue#L175)

### 快取機制原理

系統透過以下方式實現頁面快取：

1. **路由守衛檢測**: 在 `router.afterEach` 中檢測路由的 `meta.cache` 屬性
2. **元件名稱收集**: 獲取頁面元件的 `name` 屬性並新增到快取列表
3. **Keep-Alive 包裹**: 在佈局元件中使用 `<KeepAlive>` 包裹路由檢視

核心實現程式碼：

```typescript
// src/router/index.ts
router.afterEach(async (to) => {
  const keepAliveStore = useKeepAliveStore()
  
  // 檢查是否需要快取且非iframe頁面
  if (to.meta.cache && to.meta.type !== 'I') {
    const componentName = to.matched.at(-1)?.components?.default!.name
    if (componentName) {
      keepAliveStore.add(componentName) // 新增到快取列表
    } else {
      console.warn(`元件頁面未設定元件名，將不會被快取`)
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

### 快取管理

#### 停用頁面快取

有多種方式可以停用頁面快取：

1. **不設定快取屬性**（推薦）
```typescript
// 路由配置中不設定 cache 或設定為 false
meta: {
  title: '臨時頁面',
  cache: false // 或者不設定此屬性
}
```

2. **不定義元件名稱**
```vue
<script setup lang="ts">
// 不使用 defineOptions 定義元件名稱
// 即使路由設定了 cache: true，也不會被快取
</script>
```

#### 清除頁面快取

系統提供了多種清除快取的方法：

```typescript
// 獲取 keep-alive 儲存例項
const keepAliveStore = useKeepAliveStore()

// 1. 移除指定頁面快取
keepAliveStore.remove('UserManagement')

// 2. 移除多個頁面快取
keepAliveStore.remove(['UserManagement', 'RoleManagement'])

// 3. 清除所有頁面快取
keepAliveStore.clean()

// 4. 臨時隱藏快取（用於頁面重新整理）
keepAliveStore.hidden()
// 恢復顯示快取
keepAliveStore.display()
```

#### 標籤頁快取管理

標籤頁系統與頁面快取緊密結合，提供了完整的快取生命週期管理：

```typescript
const tabStore = useTabStore()

// 重新整理當前標籤頁（會清除並重新載入快取）
await tabStore.refreshTab()

// 關閉標籤頁時自動清除對應的頁面快取
tabStore.closeTab(targetTab)

// 關閉其他標籤頁（保留固定標籤頁和當前標籤頁的快取）
await tabStore.closeOtherTab(currentTab)
```

## 資料快取 (Web Storage)

除了頁面快取，MineAdmin 還提供了功能強大的資料快取系統，用於快取 API 資料、使用者偏好設定等資訊。

### useCache Hook

系統提供了 `useCache` Hook 來統一管理瀏覽器儲存：

```typescript
import useCache from '@/hooks/useCache'

// 使用 localStorage（預設）
const localStorage = useCache('localStorage')

// 使用 sessionStorage
const sessionStorage = useCache('sessionStorage')
```

### 基本用法

```typescript
const cache = useCache()

// 儲存資料
cache.set('userInfo', {
  id: 1,
  name: 'admin',
  roles: ['admin']
})

// 儲存帶過期時間的資料（單位：秒）
cache.set('tempData', { value: 'temp' }, { exp: 3600 }) // 1小時後過期

// 獲取資料
const userInfo = cache.get('userInfo')
const tempData = cache.get('tempData', null) // 提供預設值

// 刪除資料
cache.remove('tempData')

// 刪除所有過期資料
cache.removeAllExpires()

// 更新資料的過期時間
cache.touch('userInfo', 7200) // 延長2小時
```

### 高階特性

#### 自動字首
所有快取鍵都會自動新增應用字首，避免與其他應用衝突：

```typescript
// 實際儲存的鍵名會是：VITE_APP_STORAGE_PREFIX + 'userInfo'
cache.set('userInfo', data)
```

#### 容量管理
當儲存容量不足時，系統會自動清理過期資料：

```typescript
cache.set('largeData', data, {
  exp: 3600,
  force: true // 當容量不足時，強制清理過期資料後再儲存
})
```

### 在 HTTP 請求中的應用

系統在 HTTP 攔截器中使用快取儲存使用者認證資訊：

```typescript
// src/utils/http.ts
const cache = useCache()
const userStore = useUserStore()

// 儲存認證令牌
cache.set('token', data.access_token)
cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
cache.set('refresh_token', data.refresh_token)

// 自動重新整理令牌時讀取快取
if (!cache.get('refresh_token')) {
  await logout()
}
```

## 快取最佳實踐

### 1. 合理使用頁面快取

- **適合快取的頁面**：列表頁、表單頁、檢視詳情頁
- **不適合快取的頁面**：登入頁、錯誤頁、臨時彈窗頁面
- **注意事項**：確保元件名稱唯一，避免快取衝突

### 2. 資料快取策略

```typescript
// 快取字典資料（長期有效）
cache.set('dictData', dictList, { exp: 24 * 3600 }) // 24小時

// 快取使用者偏好設定（持久化）
cache.set('userSettings', settings) // 無過期時間

// 快取臨時狀態（短期有效）
cache.set('searchForm', formData, { exp: 1800 }) // 30分鐘
```

### 3. 快取清理策略

```typescript
// 使用者登出時清理敏感資料
function logout() {
  cache.remove('token')
  cache.remove('refresh_token')
  cache.remove('userInfo')
  
  // 清理頁面快取
  keepAliveStore.clean()
  tabStore.clearTab()
}

// 定期清理過期資料
setInterval(() => {
  cache.removeAllExpires()
}, 60 * 60 * 1000) // 每小時清理一次
```

### 4. 效能最佳化建議

- 避免快取過大的資料物件
- 合理設定過期時間，避免記憶體洩漏
- 對於頻繁更新的資料，考慮使用 sessionStorage
- 監控快取使用情況，及時清理無用快取

## 常見問題

### 問題1：頁面快取未生效

**可能原因**：
- 元件未定義 `name` 屬性
- 路由 `meta.cache` 未設定為 `true`
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

### 問題2：快取資料過期

```typescript
// 檢查資料是否存在且未過期
const cachedData = cache.get('userData')
if (!cachedData) {
  // 重新獲取資料
  const newData = await fetchUserData()
  cache.set('userData', newData, { exp: 3600 })
}
```

### 問題3：快取佔用過多空間

```typescript
// 定期清理和監控快取使用
function monitorCacheUsage() {
  try {
    const used = JSON.stringify(localStorage).length
    const quota = 5 * 1024 * 1024 // 5MB 限制
    
    if (used > quota * 0.8) {
      console.warn('快取使用率過高，建議清理')
      cache.removeAllExpires()
    }
  } catch (error) {
    console.error('快取監控失敗', error)
  }
}
```

## 原始碼參考

- [useCache Hook](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts) - 資料快取工具
- [useKeepAliveStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useKeepAliveStore.ts) - 頁面快取狀態管理
- [useTabStore](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts) - 標籤頁快取管理
- [Router 配置](https://github.com/mineadmin/mineadmin/blob/master/web/src/router/index.ts) - 路由快取邏輯
- [Layout 佈局](https://github.com/mineadmin/mineadmin/blob/master/web/src/layouts/index.tsx) - Keep-Alive 實現
