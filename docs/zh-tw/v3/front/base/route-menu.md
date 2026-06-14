# 路由和選單

MineAdmin 基於 `vue-router` 提供了一套完整的路由系統，支援**靜態路由**和**動態路由**兩種模式，為企業級許可權管理提供強大支撐。

## 系統架構概覽

```plantuml
@startuml
!theme plain

start
:使用者登入;
if (許可權驗證) then (透過)
  :載入靜態路由;
  :請求動態選單API;
  note right: /admin/permission/menus
  :合併路由資料;
  :生成選單結構;
  :渲染介面;
  stop
else (失敗)
  :跳轉登入頁;
  stop
endif

@enduml
```

## 路由型別選擇指南

### 📊 選擇決策矩陣

| 場景 | 靜態路由 | 動態路由 | 推薦理由 |
|------|---------|----------|---------|
| 公共頁面(登入、404) | ✅ | ❌ | 無需許可權驗證，快速載入 |
| 基礎管理頁面 | ❌ | ✅ | 需要許可權控制 |
| 多租戶系統 | ❌ | ✅ | 不同租戶選單結構不同 |
| 開發除錯頁面 | ✅ | ❌ | 僅開發環境使用 |
| 高頻訪問頁面 | ✅ | ❌ | 減少網路請求，提升效能 |

## 路由、選單詳細說明

### 🔹 靜態路由

靜態路由在前端預先定義，應用啟動時立即可用，適用於無需許可權控制的頁面。

**特點:**
- 前端預定義，啟動時可用
- 無需網路請求，載入快速
- 適合公共頁面和基礎功能

**配置位置:** `src/router/static-routes` 目錄

**工作流程:**
```plantuml
@startuml
!theme plain

[*] --> 應用啟動
應用啟動 --> 載入靜態路由配置
載入靜態路由配置 --> 註冊到vue_router : 配置完成
註冊到vue_router --> 立即可訪問
立即可訪問 --> [*]

@enduml
```

::: tip 💡 未來規劃
系統考慮引入**檔案路由**模式（檔案即路由），但目前在 MineAdmin 場景中使用頻率不高。
未來可能會根據社群需求新增此功能。
:::

### 🔹 動態路由

動態路由基於使用者許可權動態生成，提供精細化的許可權控制。

**生成流程:**
1. 使用者登入驗證透過
2. 請求 `/admin/permission/menus` 介面
3. 伺服器返回使用者許可權選單資料
4. 前端轉換為路由配置
5. 動態註冊到 vue-router
6. 生成對應選單結構

```plantuml
@startuml
!theme plain

actor 使用者 as U
participant "前端應用" as F
participant "許可權API" as A
participant "路由系統" as R
participant "選單元件" as M

U -> F: 登入成功
F -> A: 請求選單許可權
activate A
A --> F: 返回許可權資料
deactivate A
F -> F: 資料格式轉換
F -> R: 動態註冊路由
activate R
deactivate R
F -> M: 生成選單結構
activate M
M --> U: 顯示個性化選單
deactivate M

@enduml
```

### 🔹 菜單系統

選單是路由的視覺化表現，將路由配置轉換為使用者介面元素。

**選單與路由關係:**
- 一個路由可能對應一個或多個選單項
- 選單支援多層級巢狀結構
- 支援圖示、徽章、國際化等豐富展示

## 路由配置詳解

### 基礎資料型別

系統在 `#/types/global.d.ts` 中定義了完整的路由型別：

::: details 📋 路由資料型別定義
```typescript
declare namespace MineRoute {
  interface routeRecord {
    name?: string                    // 路由名稱，必須唯一
    path?: string                   // 路由路徑
    redirect?: string               // 重定向地址
    expand?: boolean               // 是否展開子選單
    component?: () => Promise<any>  // 非同步元件
    components?: () => Promise<any> // 命名檢視元件
    meta?: RouteMeta              // 路由元資料
    children?: routeRecord[]       // 子路由配置
  }
  
  interface RouteMeta {
    // 基礎資訊
    title?: string | (() => string)     // 頁面標題
    i18n?: string | (() => string)      // 國際化鍵名
    icon?: string                       // 圖示（支援iconify）
    badge?: () => string | number       // 徽章內容
    
    // 顯示控制
    hidden?: boolean                    // 是否隱藏選單
    subForceShow?: boolean             // 強制顯示子選單
    affix?: boolean                    // 是否固定標籤頁
    
    // 功能配置
    cache?: boolean                    // 是否快取頁面
    copyright?: boolean                // 是否顯示版權資訊
    breadcrumbEnable?: boolean         // 是否顯示麵包屑
    
    // 路由型別
    type?: 'M' | 'B' | 'I' | 'L' | string  // M:選單 B:按鈕 I:iframe L:外鏈
    link?: string                          // 外鏈/iframe地址
    
    // 許可權控制
    auth?: string[]                    // 許可權碼陣列
    role?: string[]                   // 角色陣列  
    user?: string[]                   // 使用者ID陣列
    
    // 系統內部
    activeName?: string               // 啟用選單名稱
    breadcrumb?: routeRecord[]        // 麵包屑路徑（自動生成）
  }
}
```
:::

### 完整配置示例

```typescript
// 標準選單頁面配置
const menuRoute: MineRoute.routeRecord = {
  name: 'system',
  path: '/system',
  redirect: '/system/user',
  meta: {
    title: '系統管理',
    i18n: 'menu.system',
    icon: 'icon-park-outline:setting-two',
    type: 'M'
  },
  children: [
    {
      name: 'system-user',
      path: '/system/user',
      component: () => import('~/modules/system/views/user/index.vue'),
      meta: {
        title: '使用者管理',
        i18n: 'menu.system.user',
        icon: 'icon-park-outline:user',
        cache: true,
        auth: ['system:user:list']
      }
    }
  ]
}
```

## META 配置詳解

### 🏷️ 基礎顯示配置

#### title - 頁面標題
```typescript
meta: {
  title: '使用者管理',           // 直接指定標題
  // 或
  title: () => `使用者管理(${count})` // 動態標題
}
```
**應用場景:** 選單顯示、標籤頁標題、瀏覽器標題

#### icon - 圖示配置  
```typescript
meta: {
  icon: 'icon-park-outline:user',      // Iconify圖示
  icon: 'mdi:user',                   // Material Design圖示
  icon: '/custom-icon.svg'            // 自定義SVG圖示
}
```
**支援圖示庫:** Iconify、Material Design Icons、自定義SVG

#### badge - 徽章配置
```typescript
meta: {
  badge: () => store.unreadCount,     // 動態徽章
  badge: () => 'NEW'                  // 固定徽章
}
```

### 🎯 路由型別配置

#### type - 路由型別
```typescript
type RouteType = 'M' | 'B' | 'I' | 'L'

// M: 選單型別（預設）
meta: { type: 'M' }  // 顯示在選單中，可有子路由

// B: 按鈕型別  
meta: { type: 'B' }  // 不顯示選單，無子路由，許可權控制

// I: iframe型別
meta: { 
  type: 'I', 
  link: 'https://admin.example.com'
}

// L: 外鏈型別
meta: { 
  type: 'L', 
  link: 'https://docs.example.com'
}
```

### 🔐 許可權控制配置

#### 多層級許可權控制
```typescript
meta: {
  // 許可權碼控制（推薦）
  auth: ['system:user:list', 'system:user:create'],
  
  // 角色控制
  role: ['admin', 'manager'],
  
  // 使用者控制
  user: ['1001', '1002']
}
```

**許可權驗證優先順序:** `user > role > auth`

### 🚀 效能配置

#### cache - 頁面快取
```typescript
// 元件中配置
defineOptions({ 
  name: 'SystemUser'  // 必須與路由name一致
})

// 路由中啟用
meta: {
  cache: true
}
```

#### 懶載入配置
```typescript
// 基礎懶載入
component: () => import('~/views/user/index.vue')

// 分組懶載入（webpack魔法註釋）
component: () => import(
  /* webpackChunkName: "system" */ 
  '~/modules/system/views/user/index.vue'
)
```

## 實際應用案例

### 📝 案例1: 標準CRUD模組

```typescript
// 使用者管理完整配置
export const userManagementRoutes: MineRoute.routeRecord = {
  name: 'user-management',
  path: '/users',
  redirect: '/users/list',
  meta: {
    title: '使用者管理',
    i18n: 'menu.users',
    icon: 'icon-park-outline:user',
    type: 'M'
  },
  children: [
    // 列表頁面
    {
      name: 'user-list',
      path: '/users/list',
      component: () => import('~/modules/user/views/list.vue'),
      meta: {
        title: '使用者列表',
        cache: true,
        auth: ['user:list']
      }
    },
    // 詳情頁面（隱藏選單）
    {
      name: 'user-detail',
      path: '/users/:id',
      component: () => import('~/modules/user/views/detail.vue'),
      meta: {
        title: '使用者詳情',
        hidden: true,
        cache: true,
        activeName: 'user-list',  // 啟用父選單
        auth: ['user:view']
      }
    },
    // 許可權控制按鈕
    {
      name: 'user-delete',
      path: '/users/delete',
      meta: {
        type: 'B',  // 按鈕型別，不顯示選單
        auth: ['user:delete']
      }
    }
  ]
}
```

### 🌐 案例2: 外部整合

```typescript
// iframe和外鏈配置
export const externalRoutes: MineRoute.routeRecord = {
  name: 'external',
  path: '/external',
  meta: {
    title: '外部系統',
    icon: 'icon-park-outline:link'
  },
  children: [
    // iframe嵌入
    {
      name: 'external-monitor',
      path: '/external/monitor',
      meta: {
        title: '監控中心',
        type: 'I',
        link: 'https://monitor.company.com',
        auth: ['system:monitor']
      }
    },
    // 外鏈跳轉  
    {
      name: 'external-docs',
      path: '/external/docs',
      meta: {
        title: '介面文件',
        type: 'L', 
        link: 'https://api-docs.company.com'
      }
    }
  ]
}
```

### 🏢 案例3: 複雜工作流

```typescript
// 多層級工作流配置
export const workflowRoutes: MineRoute.routeRecord = {
  name: 'workflow',
  path: '/workflow',
  meta: {
    title: '工作流程',
    icon: 'icon-park-outline:flow-chart',
    badge: () => store.pendingTasks
  },
  children: [
    {
      name: 'workflow-pending',
      path: '/workflow/pending',
      component: () => import('~/workflow/pending.vue'),
      meta: {
        title: '待辦事項',
        affix: true,  // 固定標籤頁
        cache: true
      }
    },
    {
      name: 'workflow-approval',
      path: '/workflow/approval',
      redirect: '/workflow/approval/my',
      meta: {
        title: '審批管理',
        role: ['manager', 'admin']
      },
      children: [
        {
          name: 'my-approval',
          path: '/workflow/approval/my',
          component: () => import('~/workflow/my-approval.vue'),
          meta: {
            title: '我的審批',
            cache: true
          }
        }
      ]
    }
  ]
}
```

## 最佳實踐

### 📝 命名規範

**✅ 推薦做法:**
```typescript
// 路由名稱使用kebab-case
name: 'system-user-list'

// 路徑使用小寫+連字元
path: '/system/user-management'

// 國際化鍵名分層級
i18n: 'menu.system.user.list'
```

**❌ 避免的做法:**
```typescript
// 避免駝峰命名
name: 'SystemUserList'

// 避免特殊字元
path: '/system/user_management'

// 避免過深層級
i18n: 'menu.system.management.user.list.page'
```

### 🏗️ 路由結構設計

**層級控制原則:**
- 選單層級不超過3層
- 每個層級子項數量不超過8個
- 相關功能模組歸類組織

**許可權粒度設計:**
```typescript
// 功能級許可權（推薦）
auth: ['user:list', 'user:create', 'user:edit']

// 避免過細粒度
auth: ['user:list:name', 'user:list:email']  // ❌

// 避免過粗粒度  
auth: ['user:all']  // ❌
```

### ⚡ 效能最佳化策略

#### 路由懶載入最佳化
```typescript
// 按模組分組載入
const UserRoutes = () => import(
  /* webpackChunkName: "user-module" */
  '~/modules/user/routes'
)

// 預載入關鍵路由
const Dashboard = () => import(
  /* webpackChunkName: "dashboard" */
  /* webpackPreload: true */
  '~/views/dashboard.vue'
)
```

#### 選單渲染最佳化
```typescript
// 大量選單項時使用虛擬滾動
meta: {
  virtualScroll: true  // 啟用虛擬滾動
}

// 延遲載入非關鍵選單
meta: {
  lazyLoad: true
}
```

## 問題排查指南

### 🐛 常見問題及解決方案

#### 1. 路由無法訪問

**症狀:** 輸入URL後顯示404或空白頁

**排查步驟:**
```typescript
// 1. 檢查路由是否正確註冊
console.log('已註冊路由:', router.getRoutes())

// 2. 驗證路由配置
const route = {
  name: 'user-list',  // ✅ 確保name唯一
  path: '/users',     // ✅ 確保路徑正確
  component: () => import('~/views/users.vue')  // ✅ 元件路徑存在
}

// 3. 檢查許可權配置
const hasPermission = await checkAuth(['user:list'])
```

#### 2. 選單不顯示

**可能原因及解決:**
```typescript
// 原因1: hidden設定為true
meta: { hidden: false }  // 確保未隱藏

// 原因2: 許可權驗證失敗
meta: { auth: ['correct:permission'] }  // 檢查許可權碼

// 原因3: 路由型別錯誤
meta: { type: 'M' }  // 確保是選單型別
```

#### 3. 頁面快取失效

**解決方案:**
```vue
<!-- 元件中必須定義name -->
<script setup>
defineOptions({ 
  name: 'UserList'  // 必須與路由name匹配
})
</script>
```

```typescript
// 路由配置
meta: {
  cache: true,
  // 確保元件name與路由name一致
  name: 'UserList'  
}
```

### 🔍 除錯工具

#### 路由除錯助手
```typescript
// 路由除錯函式
export const debugRoute = () => {
  const router = useRouter()
  const currentRoute = useRoute()
  
  console.group('路由除錯資訊')
  console.log('當前路由:', currentRoute.name)
  console.log('路由引數:', currentRoute.params)
  console.log('查詢引數:', currentRoute.query)
  console.log('路由元資料:', currentRoute.meta)
  console.log('所有路由:', router.getRoutes())
  console.groupEnd()
}

// 許可權除錯
export const debugPermission = async (route: RouteRecord) => {
  const { auth, role, user } = route.meta
  
  console.group('許可權除錯')
  console.log('所需許可權:', auth)
  console.log('所需角色:', role)
  console.log('所需使用者:', user)
  
  if (auth) {
    console.log('許可權驗證結果:', await checkAuth(auth))
  }
  console.groupEnd()
}
```

#### 選單驗證工具
```typescript
// 選單結構驗證
export const validateMenuStructure = (routes: MineRoute.routeRecord[]) => {
  const issues = []
  
  const checkRoute = (route: MineRoute.routeRecord, depth = 0) => {
    // 檢查層級深度
    if (depth > 3) {
      issues.push(`路由 ${route.name} 層級過深 (${depth})`)
    }
    
    // 檢查必要欄位
    if (!route.name) {
      issues.push(`路由缺少name欄位: ${route.path}`)
    }
    
    // 遞迴檢查子路由
    route.children?.forEach(child => 
      checkRoute(child, depth + 1)
    )
  }
  
  routes.forEach(route => checkRoute(route))
  return issues
}
```