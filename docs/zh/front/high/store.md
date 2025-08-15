# 状态管理 (Store)

MineAdmin 使用 [Pinia](https://pinia.vuejs.org/) 作为状态管理库，提供了一套完整的状态管理解决方案。系统内置了多个常用的 Store 模块，覆盖用户管理、标签页、插件系统、字典数据等核心功能。

::: tip 自动导入说明
前端 `src/store/modules` 目录下的所有 Store 已配置自动引入，可直接使用无需显式导入。

**自动导入配置位置**：`vite/auto-import.ts` 中的 `dirs: ['./src/store/modules/**']` 配置
:::

## useUserStore()

用户状态管理 Store，负责用户认证、权限管理、用户信息维护等核心功能。

**源码位置**：
- **本地路径**：`web/src/store/modules/useUserStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useUserStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useUserStore.ts)

### 主要状态属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `token` | `string` | 用户访问令牌 (Access Token) |
| `refreshToken` | `string` | 刷新令牌 (Refresh Token) |
| `expireAt` | `number` | 令牌过期时间戳 |
| `userInfo` | `object \| null` | 用户基础信息 |
| `menuList` | `array` | 用户菜单权限列表 |
| `roleList` | `array` | 用户角色列表 |

### 核心方法

#### login(params: LoginParams)
用户登录方法，执行用户认证流程

```typescript
// 登录示例
const userStore = useUserStore()

const loginData = {
  username: 'admin',
  password: '123456',
  captcha: 'abcd'
}

try {
  await userStore.login(loginData)
  // 登录成功，系统会自动跳转
} catch (error) {
  console.error('登录失败:', error)
}
```

#### logout()
用户退出登录，清理认证信息和缓存

```typescript
// 退出登录
await userStore.logout()
// 会自动清理：用户信息、令牌、页面缓存、标签页等
```

#### requestUserInfo()
获取用户详细信息，包括权限和角色数据

```typescript
// 获取用户信息（通常在路由守卫中自动调用）
await userStore.requestUserInfo()

// 获取结果
const { userInfo, menuList, roleList } = userStore
```

### 计算属性

#### isLogin
检查用户是否已登录

```typescript
const userStore = useUserStore()

if (userStore.isLogin) {
  console.log('用户已登录')
} else {
  console.log('用户未登录')
}
```

### 使用示例

#### 在组件中使用
```vue
<template>
  <div class="user-panel">
    <div v-if="userStore.isLogin">
      <p>欢迎，{{ userStore.userInfo?.username }}</p>
      <el-button @click="handleLogout">退出登录</el-button>
    </div>
    <div v-else>
      <el-button @click="toLogin">去登录</el-button>
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
    ElMessage.error('退出登录失败')
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>
```

#### 在权限验证中使用
```typescript
// 检查用户权限
const hasPermission = (permission: string) => {
  const userStore = useUserStore()
  if (!userStore.isLogin) return false
  
  return userStore.menuList.some(menu => 
    menu.permission === permission
  )
}

// 检查用户角色
const hasRole = (role: string) => {
  const userStore = useUserStore()
  return userStore.roleList.some(r => r.code === role)
}
```

## useTabStore()

标签页状态管理 Store，负责管理多标签页导航、标签页缓存、页面状态保持等功能。

**源码位置**：
- **本地路径**：`web/src/store/modules/useTabStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useTabStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts)

### 主要状态属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `tabs` | `MineTabbar[]` | 当前打开的标签页列表 |
| `activeTab` | `string` | 当前激活的标签页名称 |

### 核心方法

#### addTab(tab: MineTabbar)
添加新标签页

```typescript
const tabStore = useTabStore()

// 添加新标签页
tabStore.addTab({
  name: 'user-list',
  title: '用户列表',
  path: '/admin/user',
  fullPath: '/admin/user?status=active',
  icon: 'i-heroicons:users'
})
```

#### closeTab(targetTab: MineTabbar)
关闭指定标签页

```typescript
// 关闭标签页
const targetTab = tabStore.tabs.find(tab => tab.name === 'user-list')
if (targetTab) {
  tabStore.closeTab(targetTab)
}
```

#### refreshTab()
刷新当前标签页

```typescript
// 刷新当前标签页（会重新加载页面组件）
await tabStore.refreshTab()
```

#### closeOtherTab(currentTab: MineTabbar)
关闭除指定标签页外的其他标签页

```typescript
// 关闭其他标签页
const currentTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
if (currentTab) {
  await tabStore.closeOtherTab(currentTab)
}
```

#### clearTab()
清空所有标签页（保留固定标签页）

```typescript
// 清空所有标签页
await tabStore.clearTab()
```

### 使用示例

#### 在组件中管理标签页
```vue
<template>
  <div class="tab-controls">
    <el-button @click="refreshCurrentTab">刷新当前页</el-button>
    <el-button @click="closeOtherTabs">关闭其他</el-button>
    <el-button @click="closeAllTabs">关闭全部</el-button>
  </div>
</template>

<script setup lang="ts">
const tabStore = useTabStore()

// 刷新当前标签页
const refreshCurrentTab = async () => {
  await tabStore.refreshTab()
  ElMessage.success('页面已刷新')
}

// 关闭其他标签页
const closeOtherTabs = async () => {
  const activeTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
  if (activeTab) {
    await tabStore.closeOtherTab(activeTab)
    ElMessage.success('已关闭其他标签页')
  }
}

// 关闭所有标签页
const closeAllTabs = async () => {
  await tabStore.clearTab()
  ElMessage.success('已关闭所有标签页')
}
</script>
```

#### 在路由跳转中使用
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()

// 编程式导航并添加标签页
const navigateToPage = (routeName: string, routeParams?: any) => {
  router.push({ name: routeName, params: routeParams })
  
  // 标签页会通过路由守卫自动添加
  // 也可以手动添加特定配置的标签页
}
```

## usePluginStore()

插件系统状态管理 Store，负责插件的动态加载、启停控制、钩子调用等功能。

**源码位置**：
- **本地路径**：`web/src/store/modules/usePluginStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/usePluginStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/usePluginStore.ts)

### 主要状态属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `plugins` | `Map<string, Plugin.PluginConfig>` | 已加载的插件配置映射 |
| `enabledPlugins` | `Set<string>` | 已启用的插件名称集合 |

### 核心方法

#### enabled(pluginName: string)
启用指定插件

```typescript
const pluginStore = usePluginStore()

// 启用插件
pluginStore.enabled('mine-admin/app-store')
```

#### disabled(pluginName: string)
禁用指定插件

```typescript
// 禁用插件
pluginStore.disabled('mine-admin/demo')
```

#### callHooks(hookName: string, ...args: any[])
调用所有已启用插件的指定钩子

```typescript
// 调用登录钩子
await pluginStore.callHooks('login', loginFormData)

// 调用网络请求钩子
await pluginStore.callHooks('networkRequest', requestConfig)
```

### 使用示例

#### 动态控制插件状态
```vue
<template>
  <div class="plugin-manager">
    <el-table :data="pluginList">
      <el-table-column prop="name" label="插件名称" />
      <el-table-column prop="version" label="版本" />
      <el-table-column prop="author" label="作者" />
      <el-table-column label="状态">
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
    ElMessage.success(`插件 ${plugin.name} 已启用`)
  } else {
    pluginStore.disabled(plugin.name)
    ElMessage.success(`插件 ${plugin.name} 已禁用`)
  }
}
</script>
```

#### 在HTTP拦截器中使用插件钩子
```typescript
// src/utils/http.ts
const pluginStore = usePluginStore()

// 请求拦截器中调用插件钩子
http.interceptors.request.use(async (config) => {
  // 调用所有插件的网络请求钩子
  await pluginStore.callHooks('networkRequest', config)
  return config
})

// 响应拦截器中调用插件钩子
http.interceptors.response.use(async (response) => {
  // 调用所有插件的网络响应钩子
  await pluginStore.callHooks('networkResponse', response)
  return response
})
```

## useDictStore()

字典数据状态管理 Store，负责系统字典数据的缓存、查询、更新等功能。

**源码位置**：
- **本地路径**：`web/src/store/modules/useDictStore.ts`  
- **GitHub地址**：[mineadmin/web/src/store/modules/useDictStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useDictStore.ts)

### 主要状态属性

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `dictData` | `Record<string, DictItem[]>` | 字典数据缓存，以字典编码为键 |
| `lastUpdateTime` | `number` | 最后更新时间戳 |

### 字典数据类型

```typescript
interface DictItem {
  label: string    // 显示标签
  value: any       // 实际值
  color?: string   // 颜色标识
  status?: number  // 状态（1: 启用, 0: 禁用）
  sort?: number    // 排序
  remark?: string  // 备注
}
```

### 核心方法

#### getDict(dictCode: string): Promise<DictItem[]>
获取指定编码的字典数据

```typescript
const dictStore = useDictStore()

// 获取用户状态字典
const userStatusDict = await dictStore.getDict('user_status')
console.log(userStatusDict)
// [
//   { label: '正常', value: 1, color: 'success' },
//   { label: '禁用', value: 0, color: 'danger' }
// ]
```

#### getDictLabel(dictCode: string, value: any): string
根据字典值获取对应标签

```typescript
// 获取状态值对应的标签
const statusLabel = await dictStore.getDictLabel('user_status', 1)
console.log(statusLabel) // '正常'
```

#### refreshDict(dictCode?: string)
刷新字典数据

```typescript
// 刷新特定字典
await dictStore.refreshDict('user_status')

// 刷新所有字典
await dictStore.refreshDict()
```

### 使用示例

#### 在表单中使用字典
```vue
<template>
  <el-form :model="form">
    <el-form-item label="用户状态">
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

// 获取用户状态字典选项
const userStatusOptions = ref<DictItem[]>([])

onMounted(async () => {
  userStatusOptions.value = await dictStore.getDict('user_status')
})
</script>
```

#### 在表格中显示字典标签
```vue
<template>
  <el-table :data="tableData">
    <el-table-column prop="username" label="用户名" />
    <el-table-column label="状态">
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

// 获取状态标签
const getStatusLabel = async (status: number) => {
  return await dictStore.getDictLabel('user_status', status)
}

// 获取标签颜色类型
const getStatusTagType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}
</script>
```

#### 创建字典选择组件
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

## 其他 Store 模块

除了上述核心 Store 外，系统还提供了其他辅助性的 Store 模块：

### useKeepAliveStore()
页面缓存管理，详见 [前端缓存系统](/front/advanced/cache.md#页面缓存-keep-alive)

```typescript
const keepAliveStore = useKeepAliveStore()

// 添加页面到缓存
keepAliveStore.add('UserManagement')

// 移除页面缓存
keepAliveStore.remove('UserManagement')

// 清空所有缓存
keepAliveStore.clean()
```

### useSettingStore()
系统设置管理，包括主题、语言、布局等配置

```typescript
const settingStore = useSettingStore()

// 获取设置
const appSettings = settingStore.getSettings('app')

// 更新设置
settingStore.updateSettings('app', {
  theme: 'dark',
  lang: 'zh-CN'
})
```

## Store 最佳实践

### 1. 状态更新
```typescript
// ✅ 推荐：使用 Store 方法更新状态
const userStore = useUserStore()
await userStore.login(loginData)

// ❌ 避免：直接修改 Store 状态
userStore.token = 'new-token' // 可能会丢失响应性
```

### 2. 错误处理
```typescript
// 统一的错误处理
const handleStoreAction = async (action: () => Promise<any>, errorMessage = '操作失败') => {
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
  '登录失败，请检查用户名和密码'
)
```

### 3. 组合使用多个Store
```typescript
// 在一个操作中使用多个 Store
const handleUserLogin = async (loginData: LoginParams) => {
  const userStore = useUserStore()
  const tabStore = useTabStore()
  const settingStore = useSettingStore()
  
  try {
    // 执行登录
    await userStore.login(loginData)
    
    // 初始化用户设置
    const userSettings = await settingStore.loadUserSettings()
    
    // 恢复用户的标签页状态
    await tabStore.restoreUserTabs()
    
    ElMessage.success('登录成功')
  } catch (error) {
    ElMessage.error('登录失败')
    throw error
  }
}
```

### 4. 性能优化
```typescript
// 使用 storeToRefs 保持响应性
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore) // ✅ 保持响应性
const { login, logout } = userStore // ✅ 方法不需要 storeToRefs

// ❌ 避免：直接解构响应式数据
const { userInfo, isLogin } = userStore // 会丢失响应性
```

## 相关文档

- [自动导入配置](/front/advanced/auto-import.md) - Store 自动导入机制
- [前端缓存系统](/front/advanced/cache.md) - 页面和数据缓存
- [插件系统](/front/high/plugins.md) - 插件开发与管理
- [请求与拦截器](/front/advanced/request.md) - HTTP 请求中的 Store 使用