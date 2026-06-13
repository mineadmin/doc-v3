# 状態管理（Store）

MineAdmin は [Pinia](https://pinia.vuejs.org/) を状態管理ライブラリとして使用し、完全な状態管理ソリューションを提供しています。システムには複数の一般的な Store モジュールが組み込まれており、ユーザー管理、タブ、プラグインシステム、辞書データなどのコア機能をカバーしています。

::: tip 自動インポートについて
フロントエンドの `src/store/modules` ディレクトリ内のすべての Store は自動インポートが設定されているため、明示的にインポートすることなく直接使用できます。

**自動インポート設定場所**：`vite/auto-import.ts` の `dirs: ['./src/store/modules/**']` 設定
:::

## useUserStore()

ユーザー状態管理 Store。ユーザー認証、権限管理、ユーザー情報管理などのコア機能を担当します。

**ソースコードの場所**：
- **ローカルパス**：`web/src/store/modules/useUserStore.ts`  
- **GitHubアドレス**：[mineadmin/web/src/store/modules/useUserStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useUserStore.ts)

### 主要な状態プロパティ

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
ユーザーログインメソッド。ユーザー認証フローを実行します。

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
  // ログイン成功、システムが自動的にリダイレクト
} catch (error) {
  console.error('ログイン失敗:', error)
}
```

#### logout()
ユーザーログアウト。認証情報とキャッシュをクリアします。

```typescript
// ログアウト
await userStore.logout()
// 自動的に：ユーザー情報、トークン、ページキャッシュ、タブなどをクリア
```

#### requestUserInfo()
ユーザーの詳細情報を取得します。権限とロールデータを含みます。

```typescript
// ユーザー情報の取得（通常はルートガードで自動的に呼び出されます）
await userStore.requestUserInfo()

// 結果の取得
const { userInfo, menuList, roleList } = userStore
```

### 算出プロパティ

#### isLogin
ユーザーがログインしているかどうかを確認します。

```typescript
const userStore = useUserStore()

if (userStore.isLogin) {
  console.log('ユーザーはログインしています')
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
      <el-button @click="toLogin">ログインへ</el-button>
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
// ユーザー権限の確認
const hasPermission = (permission: string) => {
  const userStore = useUserStore()
  if (!userStore.isLogin) return false
  
  return userStore.menuList.some(menu => 
    menu.permission === permission
  )
}

// ユーザーロールの確認
const hasRole = (role: string) => {
  const userStore = useUserStore()
  return userStore.roleList.some(r => r.code === role)
}
```

## useTabStore()

タブ状態管理 Store。マルチタブナビゲーション、タブキャッシュ、ページ状態保持などの機能を担当します。

**ソースコードの場所**：
- **ローカルパス**：`web/src/store/modules/useTabStore.ts`  
- **GitHubアドレス**：[mineadmin/web/src/store/modules/useTabStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useTabStore.ts)

### 主要な状態プロパティ

| プロパティ名 | 型 | 説明 |
|--------|------|------|
| `tabs` | `MineTabbar[]` | 現在開いているタブのリスト |
| `activeTab` | `string` | 現在アクティブなタブの名前 |

### コアメソッド

#### addTab(tab: MineTabbar)
新しいタブを追加します。

```typescript
const tabStore = useTabStore()

// 新しいタブの追加
tabStore.addTab({
  name: 'user-list',
  title: 'ユーザーリスト',
  path: '/admin/user',
  fullPath: '/admin/user?status=active',
  icon: 'i-heroicons:users'
})
```

#### closeTab(targetTab: MineTabbar)
指定したタブを閉じます。

```typescript
// タブを閉じる
const targetTab = tabStore.tabs.find(tab => tab.name === 'user-list')
if (targetTab) {
  tabStore.closeTab(targetTab)
}
```

#### refreshTab()
現在のタブをリフレッシュします。

```typescript
// 現在のタブをリフレッシュ（ページコンポーネントを再読み込み）
await tabStore.refreshTab()
```

#### closeOtherTab(currentTab: MineTabbar)
指定したタブ以外のタブを閉じます。

```typescript
// 他のタブを閉じる
const currentTab = tabStore.tabs.find(tab => tab.name === tabStore.activeTab)
if (currentTab) {
  await tabStore.closeOtherTab(currentTab)
}
```

#### clearTab()
すべてのタブをクリアします（固定タブは保持）。

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
    <el-button @click="closeOtherTabs">他を閉じる</el-button>
    <el-button @click="closeAllTabs">すべて閉じる</el-button>
  </div>
</template>

<script setup lang="ts">
const tabStore = useTabStore()

// 現在のタブをリフレッシュ
const refreshCurrentTab = async () => {
  await tabStore.refreshTab()
  ElMessage.success('ページをリフレッシュしました')
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

#### ルート遷移での使用
```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()

// プログラムによるナビゲーションとタブの追加
const navigateToPage = (routeName: string, routeParams?: any) => {
  router.push({ name: routeName, params: routeParams })
  
  // タブはルートガードを通じて自動的に追加されます
  // 特定の設定のタブを手動で追加することも可能
}
```

## usePluginStore()

プラグインシステム状態管理 Store。プラグインの動的ロード、有効/無効の制御、フックの呼び出しなどの機能を担当します。

**ソースコードの場所**：
- **ローカルパス**：`web/src/store/modules/usePluginStore.ts`  
- **GitHubアドレス**：[mineadmin/web/src/store/modules/usePluginStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/usePluginStore.ts)

### 主要な状態プロパティ

| プロパティ名 | 型 | 説明 |
|--------|------|------|
| `plugins` | `Map<string, Plugin.PluginConfig>` | ロード済みプラグイン設定のマッピング |
| `enabledPlugins` | `Set<string>` | 有効化済みプラグイン名のセット |

### コアメソッド

#### enabled(pluginName: string)
指定したプラグインを有効化します。

```typescript
const pluginStore = usePluginStore()

// プラグインの有効化
pluginStore.enabled('mine-admin/app-store')
```

#### disabled(pluginName: string)
指定したプラグインを無効化します。

```typescript
// プラグインの無効化
pluginStore.disabled('mine-admin/demo')
```

#### callHooks(hookName: string, ...args: any[])
有効化されているすべてのプラグインの指定フックを呼び出します。

```typescript
// ログインフックの呼び出し
await pluginStore.callHooks('login', loginFormData)

// ネットワークリクエストフックの呼び出し
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

#### HTTPインターセプターでのプラグインフックの使用
```typescript
// src/utils/http.ts
const pluginStore = usePluginStore()

// リクエストインターセプターでのプラグインフック呼び出し
http.interceptors.request.use(async (config) => {
  // 全プラグインのネットワークリクエストフックを呼び出し
  await pluginStore.callHooks('networkRequest', config)
  return config
})

// レスポンスインターセプターでのプラグインフック呼び出し
http.interceptors.response.use(async (response) => {
  // 全プラグインのネットワークレスポンスフックを呼び出し
  await pluginStore.callHooks('networkResponse', response)
  return response
})
```

## useDictStore()

辞書データ状態管理 Store。システム辞書データのキャッシュ、検索、更新などの機能を担当します。

**ソースコードの場所**：
- **ローカルパス**：`web/src/store/modules/useDictStore.ts`  
- **GitHubアドレス**：[mineadmin/web/src/store/modules/useDictStore.ts](https://github.com/mineadmin/mineadmin/blob/master/web/src/store/modules/useDictStore.ts)

### 主要な状態プロパティ

| プロパティ名 | 型 | 説明 |
|--------|------|------|
| `dictData` | `Record<string, DictItem[]>` | 辞書データキャッシュ。辞書コードをキーとする |
| `lastUpdateTime` | `number` | 最終更新タイムスタンプ |

### 辞書データ型

```typescript
interface DictItem {
  label: string    // 表示ラベル
  value: any       // 実際の値
  color?: string   // 色識別子
  status?: number  // 状態（1: 有効, 0: 無効）
  sort?: number    // ソート順
  remark?: string  // 備考
}
```

### コアメソッド

#### getDict(dictCode: string): Promise<DictItem[]>
指定されたコードの辞書データを取得します。

```typescript
const dictStore = useDictStore()

// ユーザー状態辞書の取得
const userStatusDict = await dictStore.getDict('user_status')
console.log(userStatusDict)
// [
//   { label: '正常', value: 1, color: 'success' },
//   { label: '無効', value: 0, color: 'danger' }
// ]
```

#### getDictLabel(dictCode: string, value: any): string
辞書の値に対応するラベルを取得します。

```typescript
// 状態値に対応するラベルの取得
const statusLabel = await dictStore.getDictLabel('user_status', 1)
console.log(statusLabel) // '正常'
```

#### refreshDict(dictCode?: string)
辞書データをリフレッシュします。

```typescript
// 特定の辞書のリフレッシュ
await dictStore.refreshDict('user_status')

// 全辞書のリフレッシュ
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

// ユーザー状態辞書オプションの取得
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

// 状態ラベルの取得
const getStatusLabel = async (status: number) => {
  return await dictStore.getDictLabel('user_status', status)
}

// タグの色タイプの取得
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

## その他の Store モジュール

上記のコア Store の他に、システムは以下の補助的な Store モジュールを提供しています：

### useKeepAliveStore()
ページキャッシュ管理。詳細は [フロントエンドキャッシュシステム](/v3/front/advanced/cache.md#ページキャッシュ-keep-alive) を参照してください。

```typescript
const keepAliveStore = useKeepAliveStore()

// ページをキャッシュに追加
keepAliveStore.add('UserManagement')

// ページキャッシュを削除
keepAliveStore.remove('UserManagement')

// すべてのキャッシュをクリア
keepAliveStore.clean()
```

### useSettingStore()
システム設定管理。テーマ、言語、レイアウトなどの設定を含みます。

```typescript
const settingStore = useSettingStore()

// 設定の取得
const appSettings = settingStore.getSettings('app')

// 設定の更新
settingStore.updateSettings('app', {
  theme: 'dark',
  lang: 'zh-CN'
})
```

## Store ベストプラクティス

### 1. 状態の更新
```typescript
// ✅ 推奨：Store メソッドを使用して状態を更新
const userStore = useUserStore()
await userStore.login(loginData)

// ❌ 回避：Store 状態を直接変更
userStore.token = 'new-token' // リアクティビティが失われる可能性あり
```

### 2. エラーハンドリング
```typescript
// 統一されたエラーハンドリング
const handleStoreAction = async (action: () => Promise<any>, errorMessage = '操作に失敗しました') => {
  try {
    return await action()
  } catch (error) {
    console.error(error)
    ElMessage.error(errorMessage)
    throw error
  }
}

// 使用例
await handleStoreAction(
  () => userStore.login(loginData),
  'ログインに失敗しました。ユーザー名とパスワードを確認してください'
)
```

### 3. 複数Storeの組み合わせ使用
```typescript
// 1つの操作で複数のStoreを使用
const handleUserLogin = async (loginData: LoginParams) => {
  const userStore = useUserStore()
  const tabStore = useTabStore()
  const settingStore = useSettingStore()
  
  try {
    // ログインの実行
    await userStore.login(loginData)
    
    // ユーザー設定の初期化
    const userSettings = await settingStore.loadUserSettings()
    
    // ユーザーのタブ状態を復元
    await tabStore.restoreUserTabs()
    
    ElMessage.success('ログイン成功')
  } catch (error) {
    ElMessage.error('ログイン失敗')
    throw error
  }
}
```

### 4. パフォーマンス最適化
```typescript
// storeToRefs を使用してリアクティビティを維持
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo, isLogin } = storeToRefs(userStore) // ✅ リアクティビティを維持
const { login, logout } = userStore // ✅ メソッドは storeToRefs 不要

// ❌ 回避：リアクティブデータを直接分割代入
const { userInfo, isLogin } = userStore // リアクティビティが失われる
```

## 関連ドキュメント

- [自動インポート設定](/v3/front/advanced/auto-import.md) - Store 自動インポートメカニズム
- [フロントエンドキャッシュシステム](/v3/front/advanced/cache.md) - ページとデータのキャッシュ
- [プラグインシステム](/v3/front/high/plugins.md) - プラグイン開発と管理
- [リクエストとインターセプター](/v3/front/advanced/request.md) - HTTP リクエストでの Store 使用