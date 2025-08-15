# 状態管理 (Store)

MineAdmin は [Pinia](https://pinia.vuejs.org/) を状態管理ライブラリとして使用し、完全な状態管理ソリューションを提供しています。システムには、ユーザー管理、タブ、プラグインシステム、辞書データなどのコア機能をカバーする複数の一般的な Store モジュールが組み込まれています。

::: tip 自動インポートについて
フロントエンドの `src/store/modules` ディレクトリ内のすべての Store は自動インポートが設定されており、明示的にインポートせずに直接使用できます。

**自動インポート設定場所**: `vite/auto-import.ts` 内の `dirs: ['./src/store/modules/**']` 設定
:::

## useUserStore()

ユーザー状態管理 Store。ユーザー認証、権限管理、ユーザー情報の維持などのコア機能を担当します。

**ソースコードの場所**:
- **ローカルパス**: `web/src/store/modules/useUserStore.ts`  
- **GitHubアドレス**: [mineadmin/web/src/store/modules/useUserStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useUserStore.ts)

### 主な状態プロパティ

| プロパティ名 | 型 | 説明 |
|--------|------|------|
| `token` | `string` | ユーザーアクセストークン (Access Token) |
| `refreshToken` | `string` | リフレッシュトークン (Refresh Token) |
| `expireAt` | `number` | トークンの有効期限タイムスタンプ |
| `userInfo` | `object \| null` | ユーザー基本情報 |
| `menuList` | `array` | ユーザーメニュー権限リスト |
| `roleList` | `array` | ユーザーロールリスト |

### コアメソッド

#### login(params: LoginParams)
ユーザーログイン処理を実行します

```typescript
// ログイン例
const userStore = useUserStore()

const loginData = {
  username: 'admin',
  password: '123456',
  captcha: 'abcd'
}

try {
  await userStore.login(loginData)
  // ログイン成功、システムは自動的にリダイレクトします
} catch (error) {
  console.error('ログイン失敗:', error)
}
```

#### logout()
ユーザーログアウト処理を実行し、認証情報とキャッシュをクリアします

```typescript
// ログアウト
await userStore.logout()
// 自動的にクリア: ユーザー情報、トークン、ページキャッシュ、タブなど
```

#### requestUserInfo()
ユーザーの詳細情報（権限とロールデータを含む）を取得します

```typescript
// ユーザー情報を取得（通常はルートガードで自動的に呼び出されます）
await userStore.requestUserInfo()

// 結果を取得
const { userInfo, menuList, roleList } = userStore
```

### 算出プロパティ

#### isLogin
ユーザーがログインしているかどうかをチェックします

```typescript
const userStore = useUserStore()

if (userStore.isLogin) {
  console.log('ユーザーはログイン中です')
} else {
  console.log('ユーザーはログインしていません')
}
```

### 使用例

#### コンポーネントでの使用
```vue
<template>
  <div class="user-panel">
    <div v-if="userStore.isLogin">
      <p>ようこそ、{{ userStore.userInfo?.username }}</p>
      <el-button @click="handleLogout">ログアウト</el-button>
    </div>
    <div v-else>
      <el-button @click="toLogin">ログイン</el-button>
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
    ElMessage.error('ログアウトに失敗しました')
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>
```

#### 権限検証での使用
```typescript
// ユーザー権限をチェック
const hasPermission = (permission: string) => {
  const userStore = useUserStore()
  if (!userStore.isLogin) return false
  
  return userStore.menuList.some(menu => 
    menu.permission === permission
  )
}

// ユーザーロールをチェック
const hasRole = (role: string) => {
  const userStore = useUserStore()
  return userStore.roleList.some(r => r.code === role)
}
```

## useTabStore()

タブ状態管理 Store。マルチタブナビゲーション、タブキャッシュ、ページ状態の保持などの機能を管理します。

**ソースコードの場所**:
- **ローカルパス**: `web/src/store/modules/useTabStore.ts`  
- **GitHubアドレス**: [mineadmin/web/src/store/modules/useTabStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts)

### 主な状態プロパティ

| プロパティ名 | 型 | 説明 |
|--------|------|------|
| `tabs` | `MineTabbar[]` | 現在開いているタブのリスト |
| `activeTab` | `string` | 現在アクティブなタブ名 |

### コアメソッド

#### addTab(tab: MineTabbar)
新しいタブを追加します

```typescript
const tabStore = useTabStore()

// 新しいタブを追加
tabStore.addTab({
  name: 'user-list',
  title: 'ユーザーリスト',
  path: '/admin/user',
  fullPath: '/admin/user?status=active',
  icon: 'i-heroicons:users'
})
```

#### closeTab(targetTab: MineTabbar)
指定したタブを閉じます

```typescript
// タブを閉じる
const targetTab = tabStore.tabs.find(tab => tab.name === 'user-list')
if (targetTab) {
  tabStore.closeTab(targetTab)
}
```

#### refreshTab()
現在のタブをリフレッシュします

```typescript
// 現在のタブをリフレッシュ（ページコンポーネントが再ロードされます）
await tabStore.refreshTab()
```

#### closeOtherTab(currentTab: MineTabbar)
指定したタブ以外の他のタブを閉じます

```typescript
// 他のタブを閉じる
const currentTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
if (currentTab) {
  await tabStore.closeOtherTab(currentTab)
}
```

#### clearTab()
すべてのタブをクリアします（固定タブは保持されます）

```typescript
// すべてのタブをクリア
await tabStore.clearTab()
```

### 使用例

#### コンポーネントでのタブ管理
```vue
<template>
  <div class="tab-controls">
    <el-button @click="refreshCurrentTab">現在のページをリフレッシュ</el-button>
    <el-button @click="closeOtherTabs">他のタブを閉じる</el-button>
    <el-button @click="closeAllTabs">すべてのタブを閉じる</el-button>
  </div>
</template>

<script setup lang="ts">
const tabStore = useTabStore()

// 現在のタブをリフレッシュ
const refreshCurrentTab = async () => {
  await tabStore.refreshTab()
  ElMessage.success('ページがリフレッシュされました')
}

// 他のタブを閉じる
const closeOtherTabs = async () => {
  const activeTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
  if (activeTab) {
    await tabStore.closeOtherTab(activeTab)
    ElMessage.success('他のタブを閉じました')
  }
}

// すべてのタブを閉じる
const closeAllTabs = async () => {
  await tabStore.clearTab()
  ElMessage.success('すべてのタブを閉じました')
}
</script>
```

#### ルートナビゲーションでの使用
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()

// プログラムによるナビゲーションとタブ追加
const navigateToPage = (routeName: string, routeParams?: any) => {
  router.push({ name: routeName, params: routeParams })
  
  // タブはルートガードで自動的に追加されます
  // 特定の設定タブを手動で追加することも可能
}
```

## usePluginStore()

プラグインシステム状態管理 Store。プラグインの動的ロード、有効化/無効化制御、フック呼び出しなどの機能を管理します。

**ソースコードの場所**:
- **ローカルパス**: `web/src/store/modules/usePluginStore.ts`  
- **GitHubアドレス**: [mineadmin/web/src/store/modules/usePluginStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/usePluginStore.ts)

### 主な状態プロパティ

| プロパティ名 | 型 | 説明 |
|--------|------|------|
| `plugins` | `Map<string, Plugin.PluginConfig>` | ロード済みプラグイン設定マップ |
| `enabledPlugins` | `Set<string>` | 有効化されたプラグイン名のセット |

### コアメソッド

#### enabled(pluginName: string)
指定したプラグインを有効化します

```typescript
const pluginStore = usePluginStore()

// プラグインを有効化
pluginStore.enabled('mine-admin/app-store')
```

#### disabled(pluginName: string)
指定したプラグインを無効化します

```typescript
// プラグインを無効化
pluginStore.disabled('mine-admin/demo')
```

#### callHooks(hookName: string, ...args: any[])
すべての有効化されたプラグインの指定フックを呼び出します

```typescript
// ログインフックを呼び出し
await pluginStore.callHooks('login', loginFormData)

// ネットワークリクエストフックを呼び出し
await pluginStore.callHooks('networkRequest', requestConfig)
```

### 使用例

#### プラグイン状態の動的制御
```vue
<template>
  <div class="plugin-manager">
    <el-table :data="pluginList">
      <el-table-column prop="name" label="プラグイン名" />
      <el-table-column prop="version" label="バージョン" />
      <el-table-column prop="author" label="作者" />
      <el-table-column label="状態">
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
    ElMessage.success(`プラグイン ${plugin.name} を有効化しました`)
  } else {
    pluginStore.disabled(plugin.name)
    ElMessage.success(`プラグイン ${plugin.name} を無効化しました`)
  }
}
</script>
```

#### HTTPインターセプターでのプラグインフック使用
```typescript
// src/utils/http.ts
const pluginStore = usePluginStore()

// リクエストインターセプターでプラグインフックを呼び出し
http.interceptors.request.use(async (config) => {
  // すべてのプラグインのネットワークリクエストフックを呼び出し
  await pluginStore.callHooks('networkRequest', config)
  return config
})

// レスポンスインターセプターでプラグインフックを呼び出し
http.interceptors.response.use(async (response) => {
  // すべてのプラグインのネットワークレスポンスフックを呼び出し
  await pluginStore.callHooks('networkResponse', response)
  return response
})
```

## useDictStore()

辞書データ状態管理 Store。システム辞書データのキャッシュ、検索、更新などの機能を管理します。

**ソースコードの場所**:
- **ローカルパス**: `web/src/store/modules/useDictStore.ts`  
- **GitHubアドレス**: [mineadmin/web/src/store/modules/useDictStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useDictStore.ts)

### 主な状態プロパティ

| プロパティ名 | 型 | 説明 |
|--------|------|------|
| `dictData` | `Record<string, DictItem[]>` | 辞書データキャッシュ（辞書コードをキーとする） |
| `lastUpdateTime` | `number` | 最終更新タイムスタンプ |

### 辞書データ型

```typescript
interface DictItem {
  label: string    // 表示ラベル
  value: any       // 実際の値
  color?: string   // カラー識別子
  status?: number  // 状態（1: 有効, 0: 無効）
  sort?: number    // ソート順
  remark?: string  // 備考
}
```

### コアメソッド

#### getDict(dictCode: string): Promise<DictItem[]>
指定コードの辞書データを取得します

```typescript
const dictStore = useDictStore()

// ユーザー状態辞書を取得
const userStatusDict = await dictStore.getDict('user_status')
console.log(userStatusDict)
// [
//   { label: '正常', value: 1, color: 'success' },
//   { label: '無効', value: 0, color: 'danger' }
// ]
```

#### getDictLabel(dictCode: string, value: any): string
辞書値に対応するラベルを取得します

```typescript
// 状態値に対応するラベルを取得
const statusLabel = await dictStore.getDictLabel('user_status', 1)
console.log(statusLabel) // '正常'
```

#### refreshDict(dictCode?: string)
辞書データをリフレッシュします

```typescript
// 特定の辞書をリフレッシュ
await dictStore.refreshDict('user_status')

// すべての辞書をリフレッシュ
await dictStore.refreshDict()
```

### 使用例

#### フォームでの辞書使用
```vue
<template>
  <el-form :model="form">
    <el-form-item label="ユーザー状態">
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

// ユーザー状態辞書オプションを取得
const userStatusOptions = ref<DictItem[]>([])

onMounted(async () => {
  userStatusOptions.value = await dictStore.getDict('user_status')
})
</script>
```

#### テーブルでの辞書ラベル表示
```vue
<template>
  <el-table :data="tableData">
    <el-table-column prop="username" label="ユーザー名" />
    <el-table-column label="状態">
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

// 状態ラベルを取得
const getStatusLabel = async (status: number) => {
  return await dictStore.getDictLabel('user_status', status)
}

// タグタイプを取得
const getStatusTagType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}
</script>
```

#### 辞書選択コンポーネントの作成
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

const dict