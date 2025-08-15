# 狀態管理 (Store)

MineAdmin 使用 [Pinia](https://pinia.vuejs.org/) 作為狀態管理庫，提供了一套完整的狀態管理解決方案。系統內置了多個常用的 Store 模塊，覆蓋用户管理、標籤頁、插件系統、字典數據等核心功能。

::: tip 自動導入説明
前端 `src/store/modules` 目錄下的所有 Store 已配置自動引入，可直接使用無需顯式導入。

**自動導入配置位置**：`vite/auto-import.ts` 中的 `dirs: ['./src/store/modules/**']` 配置
:::

## useUserStore()

用户狀態管理 Store，負責用户認證、權限管理、用户信息維護等核心功能。

**源碼位置**：
- **本地路徑**：`web/src/store/modules/useUserStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useUserStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useUserStore.ts)

### 主要狀態屬性

| 屬性名 | 類型 | 描述 |
|--------|------|------|
| `token` | `string` | 用户訪問令牌 (Access Token) |
| `refreshToken` | `string` | 刷新令牌 (Refresh Token) |
| `expireAt` | `number` | 令牌過期時間戳 |
| `userInfo` | `object \| null` | 用户基礎信息 |
| `menuList` | `array` | 用户菜單權限列表 |
| `roleList` | `array` | 用户角色列表 |

### 核心方法

#### login(params: LoginParams)
用户登錄方法，執行用户認證流程

```typescript
// 登錄示例
const userStore = useUserStore()

const loginData = {
  username: 'admin',
  password: '123456',
  captcha: 'abcd'
}

try {
  await userStore.login(loginData)
  // 登錄成功，系統會自動跳轉
} catch (error) {
  console.error('登錄失敗:', error)
}
```

#### logout()
用户退出登錄，清理認證信息和緩存

```typescript
// 退出登錄
await userStore.logout()
// 會自動清理：用户信息、令牌、頁面緩存、標籤頁等
```

#### requestUserInfo()
獲取用户詳細信息，包括權限和角色數據

```typescript
// 獲取用户信息（通常在路由守衞中自動調用）
await userStore.requestUserInfo()

// 獲取結果
const { userInfo, menuList, roleList } = userStore
```

### 計算屬性

#### isLogin
檢查用户是否已登錄

```typescript
const userStore = useUserStore()

if (userStore.isLogin) {
  console.log('用户已登錄')
} else {
  console.log('用户未登錄')
}
```

### 使用示例

#### 在組件中使用
```vue
<template>
  <div class="user-panel">
    <div v-if="userStore.isLogin">
      <p>歡迎，{{ userStore.userInfo?.username }}</p>
      <el-button @click="handleLogout">退出登錄</el-button>
    </div>
    <div v-else>
      <el-button @click="toLogin">去登錄</el-button>
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
    ElMessage.error('退出登錄失敗')
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>
```

#### 在權限驗證中使用
```typescript
// 檢查用户權限
const hasPermission = (permission: string) => {
  const userStore = useUserStore()
  if (!userStore.isLogin) return false
  
  return userStore.menuList.some(menu => 
    menu.permission === permission
  )
}

// 檢查用户角色
const hasRole = (role: string) => {
  const userStore = useUserStore()
  return userStore.roleList.some(r => r.code === role)
}
```

## useTabStore()

標籤頁狀態管理 Store，負責管理多標籤頁導航、標籤頁緩存、頁面狀態保持等功能。

**源碼位置**：
- **本地路徑**：`web/src/store/modules/useTabStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useTabStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts)

### 主要狀態屬性

| 屬性名 | 類型 | 描述 |
|--------|------|------|
| `tabs` | `MineTabbar[]` | 當前打開的標籤頁列表 |
| `activeTab` | `string` | 當前激活的標籤頁名稱 |

### 核心方法

#### addTab(tab: MineTabbar)
添加新標籤頁

```typescript
const tabStore = useTabStore()

// 添加新標籤頁
tabStore.addTab({
  name: 'user-list',
  title: '用户列表',
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
刷新當前標籤頁

```typescript
// 刷新當前標籤頁（會重新加載頁面組件）
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

#### 在組件中管理標籤頁
```vue
<template>
  <div class="tab-controls">
    <el-button @click="refreshCurrentTab">刷新當前頁</el-button>
    <el-button @click="closeOtherTabs">關閉其他</el-button>
    <el-button @click="closeAllTabs">關閉全部</el-button>
  </div>
</template>

<script setup lang="ts">
const tabStore = useTabStore()

// 刷新當前標籤頁
const refreshCurrentTab = async () => {
  await tabStore.refreshTab()
  ElMessage.success('頁面已刷新')
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

// 編程式導航並添加標籤頁
const navigateToPage = (routeName: string, routeParams?: any) => {
  router.push({ name: routeName, params: routeParams })
  
  // 標籤頁會通過路由守衞自動添加
  // 也可以手動添加特定配置的標籤頁
}
```

## usePluginStore()

插件系統狀態管理 Store，負責插件的動態加載、啓停控制、鈎子調用等功能。

**源碼位置**：
- **本地路徑**：`web/src/store/modules/usePluginStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/usePluginStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/usePluginStore.ts)

### 主要狀態屬性

| 屬性名 | 類型 | 描述 |
|--------|------|------|
| `plugins` | `Map<string, Plugin.PluginConfig>` | 已加載的插件配置映射 |
| `enabledPlugins` | `Set<string>` | 已啓用的插件名稱集合 |

### 核心方法

#### enabled(pluginName: string)
啓用指定插件

```typescript
const pluginStore = usePluginStore()

// 啓用插件
pluginStore.enabled('mine-admin/app-store')
```

#### disabled(pluginName: string)
禁用指定插件

```typescript
// 禁用插件
pluginStore.disabled('mine-admin/demo')
```

#### callHooks(hookName: string, ...args: any[])
調用所有已啓用插件的指定鈎子

```typescript
// 調用登錄鈎子
await pluginStore.callHooks('login', loginFormData)

// 調用網絡請求鈎子
await pluginStore.callHooks('networkRequest', requestConfig)
```

### 使用示例

#### 動態控制插件狀態
```vue
<template>
  <div class="plugin-manager">
    <el-table :data="pluginList">
      <el-table-column prop="name" label="插件名稱" />
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
    ElMessage.success(`插件 ${plugin.name} 已啓用`)
  } else {
    pluginStore.disabled(plugin.name)
    ElMessage.success(`插件 ${plugin.name} 已禁用`)
  }
}
</script>
```

#### 在HTTP攔截器中使用插件鈎子
```typescript
// src/utils/http.ts
const pluginStore = usePluginStore()

// 請求攔截器中調用插件鈎子
http.interceptors.request.use(async (config) => {
  // 調用所有插件的網絡請求鈎子
  await pluginStore.callHooks('networkRequest', config)
  return config
})

// 響應攔截器中調用插件鈎子
http.interceptors.response.use(async (response) => {
  // 調用所有插件的網絡響應鈎子
  await pluginStore.callHooks('networkResponse', response)
  return response
})
```

## useDictStore()

字典數據狀態管理 Store，負責系統字典數據的緩存、查詢、更新等功能。

**源碼位置**：
- **本地路徑**：`web/src/store/modules/useDictStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useDictStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useDictStore.ts)

### 主要狀態屬性

| 屬性名 | 類型 | 描述 |
|--------|------|------|
| `dictData` | `Record<string, DictItem[]>` | 字典數據緩存，以字典編碼為鍵 |
| `lastUpdateTime` | `number` | 最後更新時間戳 |

### 字典數據類型

```typescript
interface DictItem {
  label: string    // 顯示標籤
  value: any       // 實際值
  color?: string   // 顏色標識
  status?: number  // 狀態（1: 啓用, 0: 禁用）
  sort?: number    // 排序
  remark?: string  // 備註
}
```

### 核心方法

#### getDict(dictCode: string): Promise<DictItem[]>
獲取指定編碼的字典數據

```typescript
const dictStore = useDictStore()

// 獲取用户狀態字典
const userStatusDict = await dictStore.getDict('user_status')
console.log(userStatusDict)
// [
//   { label: '正常', value: 1, color: 'success' },
//   { label: '禁用', value: 0, color: 'danger' }
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
刷新字典數據

```typescript
// 刷新特定字典
await dictStore.refreshDict('user_status')

// 刷新所有字典
await dictStore.refreshDict()
```

### 使用示例

#### 在表單中使用字典
```vue
<template>
  <el-form :model="form">
    <el-form-item label="用户狀態">
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

// 獲取用户狀態字典選項
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
    <el-table-column prop="username" label="用户名" />
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

// 獲取標籤顏色類型
const getStatusTagType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}
</script>
```

#### 創建字典選擇組件
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

## 其他 Store 模塊

除了上述核心 Store 外，系統還提供了其他輔助性的 Store 模塊：

### useKeepAliveStore()
頁面緩存管理，詳見 [前端緩存系統](/front/advanced/cache.md#頁面緩存-keep-alive)

```typescript
const keepAliveStore = useKeepAliveStore()

// 添加頁面到緩存
keepAliveStore.add('UserManagement')

// 移除頁面緩存
keepAliveStore.remove('UserManagement')

// 清空所有緩存
keepAliveStore.clean()
```

### useSettingStore()
系統設置管理，包括主題、語言、佈局等配置

```typescript
const settingStore = useSettingStore()

// 獲取設置
const appSettings = settingStore.getSettings('app')

// 更新設置
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
  '登錄失敗，請檢查用户名和密碼'
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
    // 執行登錄
    await userStore.login(loginData)
    
    // 初始化用户設置
    const userSettings = await settingStore.loadUserSettings()
    
    // 恢復用户的標籤頁狀態
    await tabStore.restoreUserTabs()
    
    ElMessage.success('登錄成功')
  } catch (error) {
    ElMessage.error('登錄失敗')
    throw error
  }
}
```

### 4. 性能優化
```typescript
// 使用 storeToRefs 保持響應性
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore) // ✅ 保持響應性
const { login, logout } = userStore // ✅ 方法不需要 storeToRefs

// ❌ 避免：直接解構響應式數據
const { userInfo, isLogin } = userStore // 會丟失響應性
```

## 相關文檔

- [自動導入配置](/front/advanced/auto-import.md) - Store 自動導入機制
- [前端緩存系統](/front/advanced/cache.md) - 頁面和數據緩存
- [插件系統](/front/high/plugins.md) - 插件開發與管理
- [請求與攔截器](/front/advanced/request.md) - HTTP 請求中的 Store 使用