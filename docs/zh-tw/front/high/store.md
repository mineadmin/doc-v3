# 狀態管理 (Store)

MineAdmin 使用 [Pinia](https://pinia.vuejs.org/) 作為狀態管理庫，提供了一套完整的狀態管理解決方案。系統內建了多個常用的 Store 模組，覆蓋使用者管理、標籤頁、外掛系統、字典資料等核心功能。

::: tip 自動匯入說明
前端 `src/store/modules` 目錄下的所有 Store 已配置自動引入，可直接使用無需顯式匯入。

**自動匯入配置位置**：`vite/auto-import.ts` 中的 `dirs: ['./src/store/modules/**']` 配置
:::

## useUserStore()

使用者狀態管理 Store，負責使用者認證、許可權管理、使用者資訊維護等核心功能。

**原始碼位置**：
- **本地路徑**：`web/src/store/modules/useUserStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useUserStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useUserStore.ts)

### 主要狀態屬性

| 屬性名 | 型別 | 描述 |
|--------|------|------|
| `token` | `string` | 使用者訪問令牌 (Access Token) |
| `refreshToken` | `string` | 重新整理令牌 (Refresh Token) |
| `expireAt` | `number` | 令牌過期時間戳 |
| `userInfo` | `object \| null` | 使用者基礎資訊 |
| `menuList` | `array` | 使用者選單許可權列表 |
| `roleList` | `array` | 使用者角色列表 |

### 核心方法

#### login(params: LoginParams)
使用者登入方法，執行使用者認證流程

```typescript
// 登入示例
const userStore = useUserStore()

const loginData = {
  username: 'admin',
  password: '123456',
  captcha: 'abcd'
}

try {
  await userStore.login(loginData)
  // 登入成功，系統會自動跳轉
} catch (error) {
  console.error('登入失敗:', error)
}
```

#### logout()
使用者退出登入，清理認證資訊和快取

```typescript
// 退出登入
await userStore.logout()
// 會自動清理：使用者資訊、令牌、頁面快取、標籤頁等
```

#### requestUserInfo()
獲取使用者詳細資訊，包括許可權和角色資料

```typescript
// 獲取使用者資訊（通常在路由守衛中自動呼叫）
await userStore.requestUserInfo()

// 獲取結果
const { userInfo, menuList, roleList } = userStore
```

### 計算屬性

#### isLogin
檢查使用者是否已登入

```typescript
const userStore = useUserStore()

if (userStore.isLogin) {
  console.log('使用者已登入')
} else {
  console.log('使用者未登入')
}
```

### 使用示例

#### 在元件中使用
```vue
<template>
  <div class="user-panel">
    <div v-if="userStore.isLogin">
      <p>歡迎，{{ userStore.userInfo?.username }}</p>
      <el-button @click="handleLogout">退出登入</el-button>
    </div>
    <div v-else>
      <el-button @click="toLogin">去登入</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出登入失敗')
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>
```

#### 在許可權驗證中使用
```typescript
// 檢查使用者許可權
const hasPermission = (permission: string) => {
  const userStore = useUserStore()
  if (!userStore.isLogin) return false
  
  return userStore.menuList.some(menu => 
    menu.permission === permission
  )
}

// 檢查使用者角色
const hasRole = (role: string) => {
  const userStore = useUserStore()
  return userStore.roleList.some(r => r.code === role)
}
```

## useTabStore()

標籤頁狀態管理 Store，負責管理多標籤頁導航、標籤頁快取、頁面狀態保持等功能。

**原始碼位置**：
- **本地路徑**：`web/src/store/modules/useTabStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useTabStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts)

### 主要狀態屬性

| 屬性名 | 型別 | 描述 |
|--------|------|------|
| `tabs` | `MineTabbar[]` | 當前開啟的標籤頁列表 |
| `activeTab` | `string` | 當前啟用的標籤頁名稱 |

### 核心方法

#### addTab(tab: MineTabbar)
新增新標籤頁

```typescript
const tabStore = useTabStore()

// 新增新標籤頁
tabStore.addTab({
  name: 'user-list',
  title: '使用者列表',
  path: '/admin/user',
  fullPath: '/admin/user?status=active',
  icon: 'i-heroicons:users'
})
```

#### closeTab(targetTab: MineTabbar)
關閉指定標籤頁

```typescript
// 關閉標籤頁
const targetTab = tabStore.tabs.find(tab => tab.name === 'user-list')
if (targetTab) {
  tabStore.closeTab(targetTab)
}
```

#### refreshTab()
重新整理當前標籤頁

```typescript
// 重新整理當前標籤頁（會重新載入頁面元件）
await tabStore.refreshTab()
```

#### closeOtherTab(currentTab: MineTabbar)
關閉除指定標籤頁外的其他標籤頁

```typescript
// 關閉其他標籤頁
const currentTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
if (currentTab) {
  await tabStore.closeOtherTab(currentTab)
}
```

#### clearTab()
清空所有標籤頁（保留固定標籤頁）

```typescript
// 清空所有標籤頁
await tabStore.clearTab()
```

### 使用示例

#### 在元件中管理標籤頁
```vue
<template>
  <div class="tab-controls">
    <el-button @click="refreshCurrentTab">重新整理當前頁</el-button>
    <el-button @click="closeOtherTabs">關閉其他</el-button>
    <el-button @click="closeAllTabs">關閉全部</el-button>
  </div>
</template>

<script setup lang="ts">
const tabStore = useTabStore()

// 重新整理當前標籤頁
const refreshCurrentTab = async () => {
  await tabStore.refreshTab()
  ElMessage.success('頁面已重新整理')
}

// 關閉其他標籤頁
const closeOtherTabs = async () => {
  const activeTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
  if (activeTab) {
    await tabStore.closeOtherTab(activeTab)
    ElMessage.success('已關閉其他標籤頁')
  }
}

// 關閉所有標籤頁
const closeAllTabs = async () => {
  await tabStore.clearTab()
  ElMessage.success('已關閉所有標籤頁')
}
</script>
```

#### 在路由跳轉中使用
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()

// 程式設計式導航並新增標籤頁
const navigateToPage = (routeName: string, routeParams?: any) => {
  router.push({ name: routeName, params: routeParams })
  
  // 標籤頁會透過路由守衛自動新增
  // 也可以手動新增特定配置的標籤頁
}
```

## usePluginStore()

外掛系統狀態管理 Store，負責外掛的動態載入、啟停控制、鉤子呼叫等功能。

**原始碼位置**：
- **本地路徑**：`web/src/store/modules/usePluginStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/usePluginStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/usePluginStore.ts)

### 主要狀態屬性

| 屬性名 | 型別 | 描述 |
|--------|------|------|
| `plugins` | `Map<string, Plugin.PluginConfig>` | 已載入的外掛配置對映 |
| `enabledPlugins` | `Set<string>` | 已啟用的外掛名稱集合 |

### 核心方法

#### enabled(pluginName: string)
啟用指定外掛

```typescript
const pluginStore = usePluginStore()

// 啟用外掛
pluginStore.enabled('mine-admin/app-store')
```

#### disabled(pluginName: string)
停用指定外掛

```typescript
// 停用外掛
pluginStore.disabled('mine-admin/demo')
```

#### callHooks(hookName: string, ...args: any[])
呼叫所有已啟用外掛的指定鉤子

```typescript
// 呼叫登入鉤子
await pluginStore.callHooks('login', loginFormData)

// 呼叫網路請求鉤子
await pluginStore.callHooks('networkRequest', requestConfig)
```

### 使用示例

#### 動態控制外掛狀態
```vue
<template>
  <div class="plugin-manager">
    <el-table :data="pluginList">
      <el-table-column prop="name" label="外掛名稱" />
      <el-table-column prop="version" label="版本" />
      <el-table-column prop="author" label="作者" />
      <el-table-column label="狀態">
        <template #default="{ row }">
          <el-switch 
            v-model="row.enabled"
            @change="togglePlugin(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
const pluginStore = usePluginStore()

const pluginList = computed(() => {
  return Array.from(pluginStore.plugins.values()).map(plugin => ({
    name: plugin.config.info.name,
    version: plugin.config.info.version,
    author: plugin.config.info.author,
    enabled: pluginStore.enabledPlugins.has(plugin.config.info.name)
  }))
})

const togglePlugin = async (plugin: any) => {
  if (plugin.enabled) {
    pluginStore.enabled(plugin.name)
    ElMessage.success(`外掛 ${plugin.name} 已啟用`)
  } else {
    pluginStore.disabled(plugin.name)
    ElMessage.success(`外掛 ${plugin.name} 已停用`)
  }
}
</script>
```

#### 在HTTP攔截器中使用外掛鉤子
```typescript
// src/utils/http.ts
const pluginStore = usePluginStore()

// 請求攔截器中呼叫外掛鉤子
http.interceptors.request.use(async (config) => {
  // 呼叫所有外掛的網路請求鉤子
  await pluginStore.callHooks('networkRequest', config)
  return config
})

// 響應攔截器中呼叫外掛鉤子
http.interceptors.response.use(async (response) => {
  // 呼叫所有外掛的網路響應鉤子
  await pluginStore.callHooks('networkResponse', response)
  return response
})
```

## useDictStore()

字典資料狀態管理 Store，負責系統字典資料的快取、查詢、更新等功能。

**原始碼位置**：
- **本地路徑**：`web/src/store/modules/useDictStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useDictStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useDictStore.ts)

### 主要狀態屬性

| 屬性名 | 型別 | 描述 |
|--------|------|------|
| `dictData` | `Record<string, DictItem[]>` | 字典資料快取，以字典編碼為鍵 |
| `lastUpdateTime` | `number` | 最後更新時間戳 |

### 字典資料型別

```typescript
interface DictItem {
  label: string    // 顯示標籤
  value: any       // 實際值
  color?: string   // 顏色標識
  status?: number  // 狀態（1: 啟用, 0: 停用）
  sort?: number    // 排序
  remark?: string  // 備註
}
```

### 核心方法

#### getDict(dictCode: string): Promise<DictItem[]>
獲取指定編碼的字典資料

```typescript
const dictStore = useDictStore()

// 獲取使用者狀態字典
const userStatusDict = await dictStore.getDict('user_status')
console.log(userStatusDict)
// [
//   { label: '正常', value: 1, color: 'success' },
//   { label: '停用', value: 0, color: 'danger' }
// ]
```

#### getDictLabel(dictCode: string, value: any): string
根據字典值獲取對應標籤

```typescript
// 獲取狀態值對應的標籤
const statusLabel = await dictStore.getDictLabel('user_status', 1)
console.log(statusLabel) // '正常'
```

#### refreshDict(dictCode?: string)
重新整理字典資料

```typescript
// 重新整理特定字典
await dictStore.refreshDict('user_status')

// 重新整理所有字典
await dictStore.refreshDict()
```

### 使用示例

#### 在表單中使用字典
```vue
<template>
  <el-form :model="form">
    <el-form-item label="使用者狀態">
      <el-select v-model="form.status">
        <el-option
          v-for="item in userStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
const dictStore = useDictStore()
const form = ref({
  status: 1
})

// 獲取使用者狀態字典選項
const userStatusOptions = ref<DictItem[]>([])

onMounted(async () => {
  userStatusOptions.value = await dictStore.getDict('user_status')
})
</script>
```

#### 在表格中顯示字典標籤
```vue
<template>
  <el-table :data="tableData">
    <el-table-column prop="username" label="使用者名稱" />
    <el-table-column label="狀態">
      <template #default="{ row }">
        <el-tag :type="getStatusTagType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
const dictStore = useDictStore()

const tableData = ref([
  { id: 1, username: 'admin', status: 1 },
  { id: 2, username: 'user', status: 0 }
])

// 獲取狀態標籤
const getStatusLabel = async (status: number) => {
  return await dictStore.getDictLabel('user_status', status)
}

// 獲取標籤顏色型別
const getStatusTagType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}
</script>
```

#### 建立字典選擇元件
```vue
<!-- DictSelect.vue -->
<template>
  <el-select v-model="modelValue" @update:modelValue="$emit('update:modelValue', $event)">
    <el-option
      v-for="item in dictOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.status === 0"
    />
  </el-select>
</template>

<script setup lang="ts">
interface Props {
  dictCode: string
  modelValue: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const dictStore = useDictStore()
const dictOptions = ref<DictItem[]>([])

watch(
  () => props.dictCode,
  async (newCode) => {
    if (newCode) {
      dictOptions.value = await dictStore.getDict(newCode)
    }
  },
  { immediate: true }
)
</script>
```

## 其他 Store 模組

除了上述核心 Store 外，系統還提供了其他輔助性的 Store 模組：

### useKeepAliveStore()
頁面快取管理，詳見 [前端快取系統](/zh-tw/front/advanced/cache.md#頁面快取-keep-alive)

```typescript
const keepAliveStore = useKeepAliveStore()

// 新增頁面到快取
keepAliveStore.add('UserManagement')

// 移除頁面快取
keepAliveStore.remove('UserManagement')

// 清空所有快取
keepAliveStore.clean()
```

### useSettingStore()
系統設定管理，包括主題、語言、佈局等配置

```typescript
const settingStore = useSettingStore()

// 獲取設定
const appSettings = settingStore.getSettings('app')

// 更新設定
settingStore.updateSettings('app', {
  theme: 'dark',
  lang: 'zh-CN'
})
```

## Store 最佳實踐

### 1. 狀態更新
```typescript
// ✅ 推薦：使用 Store 方法更新狀態
const userStore = useUserStore()
await userStore.login(loginData)

// ❌ 避免：直接修改 Store 狀態
userStore.token = 'new-token' // 可能會丟失響應性
```

### 2. 錯誤處理
```typescript
// 統一的錯誤處理
const handleStoreAction = async (action: () => Promise<any>, errorMessage = '操作失敗') => {
  try {
    return await action()
  } catch (error) {
    console.error(error)
    ElMessage.error(errorMessage)
    throw error
  }
}

// 使用示例
await handleStoreAction(
  () => userStore.login(loginData),
  '登入失敗，請檢查使用者名稱和密碼'
)
```

### 3. 組合使用多個Store
```typescript
// 在一個操作中使用多個 Store
const handleUserLogin = async (loginData: LoginParams) => {
  const userStore = useUserStore()
  const tabStore = useTabStore()
  const settingStore = useSettingStore()
  
  try {
    // 執行登入
    await userStore.login(loginData)
    
    // 初始化使用者設定
    const userSettings = await settingStore.loadUserSettings()
    
    // 恢復使用者的標籤頁狀態
    await tabStore.restoreUserTabs()
    
    ElMessage.success('登入成功')
  } catch (error) {
    ElMessage.error('登入失敗')
    throw error
  }
}
```

### 4. 效能最佳化
```typescript
// 使用 storeToRefs 保持響應性
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore) // ✅ 保持響應性
const { login, logout } = userStore // ✅ 方法不需要 storeToRefs

// ❌ 避免：直接解構響應式資料
const { userInfo, isLogin } = userStore // 會丟失響應性
```

## 相關文件

- [自動匯入配置](/zh-tw/front/advanced/auto-import.md) - Store 自動匯入機制
- [前端快取系統](/zh-tw/front/advanced/cache.md) - 頁面和資料快取
- [外掛系統](/zh-tw/front/high/plugins.md) - 外掛開發與管理
- [請求與攔截器](/zh-tw/front/advanced/request.md) - HTTP 請求中的 Store 使用