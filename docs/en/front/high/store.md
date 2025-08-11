# State Management (Store)

MineAdmin uses [Pinia](https://pinia.vuejs.org/) as its state management library, providing a comprehensive solution for state management. The system comes with several built-in Store modules covering core functionalities such as user management, tabs, plugin systems, dictionary data, and more.

::: tip Auto-import Note
All Stores in the frontend `src/store/modules` directory are configured for automatic import and can be used directly without explicit imports.

**Auto-import configuration location**: `dirs: ['./src/store/modules/**']` in `vite/auto-import.ts`
:::

## useUserStore()

User state management Store, responsible for core functionalities such as user authentication, permission management, and user information maintenance.

**Source locations**:
- **Local path**: `web/src/store/modules/useUserStore.ts`  
- **GitHub URL**: [mineadmin/web/src/store/modules/useUserStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useUserStore.ts)

### Key State Properties

| Property | Type | Description |
|--------|------|------|
| `token` | `string` | User access token (Access Token) |
| `refreshToken` | `string` | Refresh token (Refresh Token) |
| `expireAt` | `number` | Token expiration timestamp |
| `userInfo` | `object \| null` | Basic user information |
| `menuList` | `array` | User menu permission list |
| `roleList` | `array` | User role list |

### Core Methods

#### login(params: LoginParams)
User login method, executes the authentication process

```typescript
// Login example
const userStore = useUserStore()

const loginData = {
  username: 'admin',
  password: '123456',
  captcha: 'abcd'
}

try {
  await userStore.login(loginData)
  // Login successful, system will automatically redirect
} catch (error) {
  console.error('Login failed:', error)
}
```

#### logout()
User logout, clears authentication information and cache

```typescript
// Logout
await userStore.logout()
// Automatically clears: user info, tokens, page cache, tabs, etc.
```

#### requestUserInfo()
Fetches detailed user information, including permissions and role data

```typescript
// Get user info (typically called automatically in route guards)
await userStore.requestUserInfo()

// Get results
const { userInfo, menuList, roleList } = userStore
```

### Computed Properties

#### isLogin
Checks if the user is logged in

```typescript
const userStore = useUserStore()

if (userStore.isLogin) {
  console.log('User is logged in')
} else {
  console.log('User is not logged in')
}
```

### Usage Examples

#### Using in Components
```vue
<template>
  <div class="user-panel">
    <div v-if="userStore.isLogin">
      <p>Welcome, {{ userStore.userInfo?.username }}</p>
      <el-button @click="handleLogout">Logout</el-button>
    </div>
    <div v-else>
      <el-button @click="toLogin">Go to Login</el-button>
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
    ElMessage.error('Logout failed')
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>
```

#### Using in Permission Checks
```typescript
// Check user permissions
const hasPermission = (permission: string) => {
  const userStore = useUserStore()
  if (!userStore.isLogin) return false
  
  return userStore.menuList.some(menu => 
    menu.permission === permission
  )
}

// Check user roles
const hasRole = (role: string) => {
  const userStore = useUserStore()
  return userStore.roleList.some(r => r.code === role)
}
```

## useTabStore()

Tab state management Store, responsible for managing multi-tab navigation, tab caching, and page state persistence.

**Source locations**:
- **Local path**: `web/src/store/modules/useTabStore.ts`  
- **GitHub URL**: [mineadmin/web/src/store/modules/useTabStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts)

### Key State Properties

| Property | Type | Description |
|--------|------|------|
| `tabs` | `MineTabbar[]` | List of currently open tabs |
| `activeTab` | `string` | Name of the currently active tab |

### Core Methods

#### addTab(tab: MineTabbar)
Adds a new tab

```typescript
const tabStore = useTabStore()

// Add a new tab
tabStore.addTab({
  name: 'user-list',
  title: 'User List',
  path: '/admin/user',
  fullPath: '/admin/user?status=active',
  icon: 'i-heroicons:users'
})
```

#### closeTab(targetTab: MineTabbar)
Closes the specified tab

```typescript
// Close a tab
const targetTab = tabStore.tabs.find(tab => tab.name === 'user-list')
if (targetTab) {
  tabStore.closeTab(targetTab)
}
```

#### refreshTab()
Refreshes the current tab

```typescript
// Refresh current tab (reloads page components)
await tabStore.refreshTab()
```

#### closeOtherTab(currentTab: MineTabbar)
Closes all tabs except the specified one

```typescript
// Close other tabs
const currentTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
if (currentTab) {
  await tabStore.closeOtherTab(currentTab)
}
```

#### clearTab()
Clears all tabs (retains fixed tabs)

```typescript
// Clear all tabs
await tabStore.clearTab()
```

### Usage Examples

#### Managing Tabs in Components
```vue
<template>
  <div class="tab-controls">
    <el-button @click="refreshCurrentTab">Refresh Current</el-button>
    <el-button @click="closeOtherTabs">Close Others</el-button>
    <el-button @click="closeAllTabs">Close All</el-button>
  </div>
</template>

<script setup lang="ts">
const tabStore = useTabStore()

// Refresh current tab
const refreshCurrentTab = async () => {
  await tabStore.refreshTab()
  ElMessage.success('Page refreshed')
}

// Close other tabs
const closeOtherTabs = async () => {
  const activeTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
  if (activeTab) {
    await tabStore.closeOtherTab(activeTab)
    ElMessage.success('Other tabs closed')
  }
}

// Close all tabs
const closeAllTabs = async () => {
  await tabStore.clearTab()
  ElMessage.success('All tabs closed')
}
</script>
```

#### Using in Programmatic Navigation
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()

// Programmatic navigation with tab addition
const navigateToPage = (routeName: string, routeParams?: any) => {
  router.push({ name: routeName, params: routeParams })
  
  // Tabs are automatically added via route guards
  // Can also manually add specially configured tabs
}
```

## usePluginStore()

Plugin system state management Store, responsible for dynamic plugin loading, enable/disable control, and hook invocation.

**Source locations**:
- **Local path**: `web/src/store/modules/usePluginStore.ts`  
- **GitHub URL**: [mineadmin/web/src/store/modules/usePluginStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/usePluginStore.ts)

### Key State Properties

| Property | Type | Description |
|--------|------|------|
| `plugins` | `Map<string, Plugin.PluginConfig>` | Map of loaded plugin configurations |
| `enabledPlugins` | `Set<string>` | Set of enabled plugin names |

### Core Methods

#### enabled(pluginName: string)
Enables the specified plugin

```typescript
const pluginStore = usePluginStore()

// Enable plugin
pluginStore.enabled('mine-admin/app-store')
```

#### disabled(pluginName: string)
Disables the specified plugin

```typescript
// Disable plugin
pluginStore.disabled('mine-admin/demo')
```

#### callHooks(hookName: string, ...args: any[])
Invokes the specified hook for all enabled plugins

```typescript
// Call login hook
await pluginStore.callHooks('login', loginFormData)

// Call network request hook
await pluginStore.callHooks('networkRequest', requestConfig)
```

### Usage Examples

#### Dynamically Controlling Plugin State
```vue
<template>
  <div class="plugin-manager">
    <el-table :data="pluginList">
      <el-table-column prop="name" label="Plugin Name" />
      <el-table-column prop="version" label="Version" />
      <el-table-column prop="author" label="Author" />
      <el-table-column label="Status">
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
    ElMessage.success(`Plugin ${plugin.name} enabled`)
  } else {
    pluginStore.disabled(plugin.name)
    ElMessage.success(`Plugin ${plugin.name} disabled`)
  }
}
</script>
```

#### Using Plugin Hooks in HTTP Interceptors
```typescript
// src/utils/http.ts
const pluginStore = usePluginStore()

// Call plugin hooks in request interceptor
http.interceptors.request.use(async (config) => {
  // Call network request hooks for all plugins
  await pluginStore.callHooks('networkRequest', config)
  return config
})

// Call plugin hooks in response interceptor
http.interceptors.response.use(async (response) => {
  // Call network response hooks for all plugins
  await pluginStore.callHooks('networkResponse', response)
  return response
})
```

## useDictStore()

Dictionary data state management Store, responsible for caching, querying, and updating system dictionary data.

**Source locations**:
- **Local path**: `web/src/store/modules/useDictStore.ts`  
- **GitHub URL**: [mineadmin/web/src/store/modules/useDictStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useDictStore.ts)

### Key State Properties

| Property | Type | Description |
|--------|------|------|
| `dictData` | `Record<string, DictItem[]>` | Dictionary data cache, keyed by dictionary code |
| `lastUpdateTime` | `number` | Last update timestamp |

### Dictionary Data Type

```typescript
interface DictItem {
  label: string    // Display label
  value: any       // Actual value
  color?: string   // Color indicator
  status?: number  // Status (1: enabled, 0: disabled)
  sort?: number    // Sort order
  remark?: string  // Remarks
}
```

### Core Methods

#### getDict(dictCode: string): Promise<DictItem[]>
Gets dictionary data for the specified code

```typescript
const dictStore = useDictStore()

// Get user status dictionary
const userStatusDict = await dictStore.getDict('user_status')
console.log(userStatusDict)
// [
//   { label: 'Active', value: 1, color: 'success' },
//   { label: 'Disabled', value: 0, color: 'danger' }
// ]
```

#### getDictLabel(dictCode: string, value: any): string
Gets the corresponding label for a dictionary value

```typescript
// Get label for status value
const statusLabel = await dictStore.getDictLabel('user_status', 1)
console.log(statusLabel) // 'Active'
```

#### refreshDict(dictCode?: string)
Refreshes dictionary data

```typescript
// Refresh specific dictionary
await dictStore.refreshDict('user_status')

// Refresh all dictionaries
await dictStore.refreshDict()
```

### Usage Examples

#### Using Dictionaries in Forms
```vue
<template>
  <el-form :model="form">
    <el-form-item label="User Status">
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

// Get user status dictionary options
const userStatusOptions = ref<DictItem[]>([])

onMounted(async () => {
  userStatusOptions.value = await dictStore.getDict('user_status')
})
</script>
```

#### Displaying Dictionary Labels in Tables
```vue
<template>
  <el-table :data="tableData">
    <el-table-column prop="username" label="Username" />
    <el-table-column label="Status">
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

// Get status label
const getStatusLabel = async (status: number) => {
  return await dictStore.getDictLabel('user_status', status)
}

// Get tag color type
const getStatusTagType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}
</script>
```

#### Creating a Dictionary Select Component
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

## Other Store Modules

In addition to the core Stores mentioned above, the system provides other auxiliary Store modules:

### useKeepAliveStore()
Page caching management, see [Frontend Cache System](/en/front/advanced/cache.md#page-caching-keep-alive)

```typescript
const keepAliveStore = useKeepAliveStore()

// Add page to cache
keepAliveStore.add('UserManagement')

// Remove page from cache
keepAliveStore.remove('UserManagement')

// Clear all cache
keepAliveStore.clean()
```

### useSettingStore()
System settings management, including theme, language, layout configurations

```typescript
const settingStore = useSettingStore()

// Get settings
const appSettings = settingStore.getSettings('app')

// Update settings
settingStore.updateSettings('app', {
  theme: 'dark',
  lang: 'zh-CN'
})
```

## Store Best Practices

### 1. State Updates
```typescript
// ✅ Recommended: Use Store methods to update state
const userStore = useUserStore()
await userStore.login(loginData)

// ❌ Avoid: Directly modifying Store state
userStore.token = 'new-token' // May lose reactivity
```

### 2. Error Handling
```typescript
// Unified error handling
const handleStoreAction = async (action: () => Promise<any>, errorMessage = 'Operation failed') => {
  try {
    return await action()
  } catch (error) {
    console.error(error)
    ElMessage.error(errorMessage)
    throw error
  }
}

// Usage example
await handleStoreAction(
  () => userStore.login(loginData),
  'Login failed, please check username and password'
)
```

### 3. Combining Multiple Stores
```typescript
// Using multiple Stores in one operation
const handleUserLogin = async (loginData: LoginParams) => {
  const userStore = useUserStore()
  const tabStore = useTabStore()
  const settingStore = useSettingStore()
  
  try {
    // Perform login
    await userStore.login(loginData)
    
    // Initialize user settings
    const userSettings = await settingStore.loadUserSettings()
    
    // Restore user's tab state
    await tabStore.restoreUserTabs()
    
    ElMessage.success('Login successful')
  } catch (error) {
    ElMessage.error('Login failed')
    throw error
  }
}
```

### 4. Performance Optimization
```typescript
// Use storeToRefs to maintain reactivity
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore) // ✅ Maintains reactivity
const { login, logout } = userStore // ✅ Methods don't need storeToRefs

// ❌ Avoid: Direct destructuring of reactive data
const { userInfo, isLogin } = userStore // Will lose reactivity
```

## Related Documentation

