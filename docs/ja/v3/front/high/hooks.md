# Hooks

MineAdminは、一連の強力なカスタムHooksを提供しています。これらのHooksは一般的な機能とロジックをカプセル化しており、開発者がVue 3コンポーネント内でコードを容易に再利用できるようにします。このドキュメントでは、各Hookの使用方法、パラメータ、戻り値、および実際のアプリケーションシナリオについて詳しく説明します。

## useCache()

ブラウザキャッシュ操作用のHookで、localStorageとsessionStorageをサポートし、有効期限設定機能を提供します。

**ソースパス:** `/web/src/hooks/useCache.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts)

### 型定義

```typescript
export type CacheType = 'localStorage' | 'sessionStorage'

export interface CacheOptions {
  /**
   * タイムアウト時間（秒）。
   * デフォルトは無制限。
   */
  exp?: number

  /**
   * trueの場合：最大容量を超えてデータの挿入ができない場合、まずキャッシュ内の期限切れコンテンツをクリアしてからデータの挿入を試みます。
   * デフォルトはtrue。
   */
  force?: boolean
}
```

### パラメータ

| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| type | CacheType | 'localStorage' | キャッシュタイプ。localStorageまたはsessionStorageを選択可能 |

### 戻り値

| 属性 | 型 | 説明 |
|------|------|------|
| cache | WebStorageCache | 基盤となるWebStorageCacheインスタンス |
| prefix | string | キャッシュキーのプレフィックス |
| set | Function | キャッシュを設定 |
| get | Function | キャッシュを取得 |
| remove | Function | キャッシュを削除 |
| removeAllExpires | Function | 期限切れのキャッシュを全て削除 |
| touch | Function | キャッシュの有効期限を更新 |

### 使用例

```typescript
import useCache from '@/hooks/useCache'

// localStorageを使用（デフォルト）
const { set, get, remove, removeAllExpires, touch } = useCache()

// sessionStorageを使用
const sessionCache = useCache('sessionStorage')

// キャッシュを設定（期限切れなし）
set('userInfo', { name: 'MineAdmin', role: 'admin' })

// キャッシュを設定（30秒後に期限切れ）
set('tempData', 'temporary value', { exp: 30 })

// キャッシュを取得
const userInfo = get('userInfo', null)

// 特定のキャッシュを削除
remove('tempData')

// 期限切れのキャッシュを全て削除
removeAllExpires()

// キャッシュの有効期限を更新（60秒延長）
touch('userInfo', 60)
```

### 実際のアプリケーションシナリオ

```typescript
// ユーザーログインコンポーネントで使用
const { set, get } = useCache()

// ユーザーログイン情報を保存
const saveUserInfo = (userInfo: any) => {
  set('userInfo', userInfo, { exp: 24 * 60 * 60 }) // 24時間後に期限切れ
}

// ユーザー情報を取得
const getUserInfo = () => {
  return get('userInfo', null)
}
```

## useDialog()

ダイアログ作成用のHookで、完全なダイアログライフサイクル管理を提供し、カスタムタイトル、属性、イベントコールバックをサポートします。

**ソースパス:** `/web/src/hooks/useDialog.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useDialog.ts)

### 型定義

```typescript
export interface UseDialogExpose {
  on: {
    ok?: (...args: any[]) => void
    cancel?: (...args: any[]) => void
  }
  Dialog: Component
  open: (...args: any[]) => void
  close: () => void
  setTitle: (title: string) => void
  setAttr: (attr: Record<string, any>) => void
}
```

### パラメータ

| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| dialogProps | Record<string, any> \| null | null | ダイアログの初期属性設定 |

### 戻り値

| 属性 | 型 | 説明 |
|------|------|------|
| on | Object | イベントコールバック設定 |
| Dialog | Component | ダイアログコンポーネント |
| open | Function | ダイアログを開く |
| close | Function | ダイアログを閉じる |
| setTitle | Function | ダイアログのタイトルを設定 |
| setAttr | Function | ダイアログの属性を設定 |

### 使用例

```typescript
import useDialog from '@/hooks/useDialog'

export default defineComponent({
  setup() {
    // ダイアログインスタンスを作成
    const { Dialog, open, close, setTitle, on } = useDialog({
      width: '500px',
      draggable: true
    })

    // イベントコールバックを設定
    on.ok = () => {
      console.log('ユーザーが確定をクリックしました')
      close()
    }

    on.cancel = () => {
      console.log('ユーザーがキャンセルをクリックしました')
      return true // trueを返して閉じることを許可
    }

    // ダイアログを開く
    const openDialog = () => {
      setTitle('ユーザー情報を編集')
      open({ userId: 123 })
    }

    return {
      Dialog,
      openDialog
    }
  },

  render() {
    return (
      <div>
        <el-button onClick={this.openDialog}>ダイアログを開く</el-button>
        <Dialog title="デフォルトタイトル">
          <div>ここにダイアログの内容</div>
        </Dialog>
      </div>
    )
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div>
    <el-button @click="editUser">ユーザーを編集</el-button>
    <Dialog>
      <div>ユーザー編集フォームの内容</div>
    </Dialog>
  </div>
</template>

<script setup>
import useDialog from '@/hooks/useDialog'

const { Dialog, open, close, setTitle, on } = useDialog({
  width: '600px',
  destroyOnClose: true
})

const currentUserId = ref(null)

// ユーザーを編集
const editUser = () => {
  currentUserId.value = 123
  setTitle('ユーザー情報を編集')
  open()
}

// フォーム送信を処理
const handleSubmit = async (formData) => {
  try {
    console.log('ユーザーデータを送信:', formData)
    close()
    // ここでフォーム送信ロジックを処理
  } catch (error) {
    console.error('送信に失敗しました:', error)
  }
}

// イベントを設定
on.ok = () => {
  // ここでフォーム送信をトリガー可能
  return false // デフォルトの閉じる動作を防止
}
</script>
```

## useEcharts()

EChartsチャートライブラリを統合するためのHookで、テーマ切り替えとチャート初期化機能を提供します。

**ソースパス:** `/web/src/hooks/useEcharts.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useEcharts.ts)

### エクスポート関数

| 関数 | 型 | 説明 |
|------|------|------|
| useEcharts | Function | @mineadmin/echarts からの useEcharts 関数 |
| themeMode | Function | 現在のテーマモードを取得 |

### 使用例

```typescript
import { useEcharts, themeMode } from '@/hooks/useEcharts'

export default defineComponent({
  setup() {
    const chartRef = ref()
    
    onMounted(async () => {
      // チャートを初期化
      const chart = await useEcharts(chartRef.value)
      
      // チャートオプションを設定
      const option = {
        title: { text: '売上データ' },
        theme: themeMode(), // 現在のテーマを使用
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [820, 932, 901, 934, 1290],
          type: 'bar'
        }]
      }
      
      chart.setOption(option)
    })

    return { chartRef }
  },

  render() {
    return <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div class="dashboard">
    <div ref="salesChartRef" class="chart-container"></div>
    <div ref="trafficChartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { useEcharts, themeMode } from '@/hooks/useEcharts'
import { ref, onMounted } from 'vue'

const salesChartRef = ref()
const trafficChartRef = ref()

onMounted(async () => {
  // 売上チャートを初期化
  const salesChart = await useEcharts(salesChartRef.value)
  salesChart.setOption({
    title: { text: '売上トレンド' },
    theme: themeMode(),
    // ... その他の設定
  })

  // トラフィックチャートを初期化
  const trafficChart = await useEcharts(trafficChartRef.value)
  trafficChart.setOption({
    title: { text: 'アクセス統計' },
    theme: themeMode(),
    // ... その他の設定
  })
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
</style>
```

## useForm()

フォーム操作用のHookで、フォームインスタンスの取得と操作機能を提供します。

**ソースパス:** `/web/src/hooks/useForm.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useForm.ts)

### パラメータ

| パラメータ | 型 | 説明 |
|------|------|------|
| refName | string | フォーム参照名 |

### 戻り値

Promiseを返し、`MaFormExpose` 型のフォームインスタンスに解決されます。

### 使用例

```typescript
import useForm from '@/hooks/useForm'

export default defineComponent({
  setup() {
    const formRef = ref()
    
    // フォームインスタンスを取得
    const getFormInstance = async () => {
      try {
        const formInstance = await useForm('userForm')
        
        // フォームインスタンスを使用して操作
        await formInstance.validate()
        const formData = formInstance.getFieldsValue()
        
        console.log('フォームデータ：', formData)
      } catch (error) {
        console.error('フォーム検証に失敗しました：', error)
      }
    }

    return {
      formRef,
      getFormInstance
    }
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div>フォーム内容</div>
  <el-button @click="handleSubmit">送信</el-button>
</template>

<script setup>
import useForm from '@/hooks/useForm'
import { ref } from 'vue'

const userFormRef = ref()

const formColumns = [
  {
    title: 'ユーザー名',
    dataIndex: 'username',
    formType: 'input',
    rules: [{ required: true, message: 'ユーザー名を入力してください' }]
  },
  {
    title: 'メール',
    dataIndex: 'email',
    formType: 'input',
    rules: [{ required: true, type: 'email', message: '正しいメールアドレスを入力してください' }]
  }
]

const handleSubmit = async () => {
  try {
    const formInstance = await useForm('userForm')
    
    // フォーム送信ロジック
    console.log('フォーム送信')
  } catch (error) {
    console.error('送信に失敗しました:', error)
  }
}
</script>
```

## useTable()

テーブル操作用のHookで、テーブルインスタンスの取得と操作機能を提供します。

**ソースパス:** `/web/src/hooks/useTable.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTable.ts)

### パラメータ

| パラメータ | 型 | 説明 |
|------|------|------|
| refName | string | テーブル参照名 |

### 戻り値

Promiseを返し、`MaTableExpose` 型のテーブルインスタンスに解決されます。

### 使用例

```typescript
import useTable from '@/hooks/useTable'

export default defineComponent({
  setup() {
    // テーブルインスタンスを取得
    const getTableInstance = async () => {
      try {
        const tableInstance = await useTable('userTable')
        
        // テーブルデータを更新
        await tableInstance.refresh()
        
        // 選択された行を取得
        const selectedRows = tableInstance.getSelectedRows()
        console.log('選択された行：', selectedRows)
        
        // 選択をクリア
        tableInstance.clearSelection()
      } catch (error) {
        console.error('テーブルインスタンスの取得に失敗しました：', error)
      }
    }

    return { getTableInstance }
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div>
    <el-button @click="refreshTable">更新</el-button>
    <el-button @click="deleteSelected">選択を削除</el-button>
    <div>テーブル内容</div>
  </div>
</template>

<script setup>
import useTable from '@/hooks/useTable'

const userTableRef = ref()

const tableColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: 'ユーザー名', dataIndex: 'username' },
  { title: 'メール', dataIndex: 'email' },
  { title: 'ステータス', dataIndex: 'status' }
]

// テーブルを更新
const refreshTable = async () => {
  const tableInstance = await useTable('userTable')
  await tableInstance.refresh()
  ElMessage.success('更新に成功しました')
}

// 選択されたユーザーを削除
const deleteSelected = async () => {
  try {
    const tableInstance = await useTable('userTable')
    const selectedRows = tableInstance.getSelectedRows()
    
    if (selectedRows.length === 0) {
      ElMessage.warning('削除するユーザーを選択してください')
      return
    }
    
    await ElMessageBox.confirm('選択したユーザーを削除してもよろしいですか？')
    
    const ids = selectedRows.map(row => row.id)
    await deleteUsers(ids)
    
    // テーブルを更新し、選択をクリア
    await tableInstance.refresh()
    tableInstance.clearSelection()
    
    ElMessage.success('削除に成功しました')
  } catch (error) {
    ElMessage.error('削除に失敗しました')
  }
}
</script>
```

## useLocalTrans()

ローカライゼーション翻訳用のHookで、vue-i18nベースの翻訳機能を提供します。

**ソースパス:** `/web/src/hooks/useLocalTrans.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useLocalTrans.ts)

### パラメータ

| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| key | any \| null | null | 翻訳キー。nullの場合は翻訳関数を返します |

### 戻り値

- `key` がnullの場合、翻訳関数 `ComposerTranslation` を返します
- `key` に値がある場合、翻訳された文字列を返します

### 使用例

```typescript
import { useLocalTrans } from '@/hooks/useLocalTrans'

export default defineComponent({
  setup() {
    // 翻訳関数を取得
    const t = useLocalTrans()
    
    // 直接翻訳
    const title = useLocalTrans('user.title')
    const message = useLocalTrans('user.welcome', { name: 'MineAdmin' })
    
    return {
      t,
      title,
      message
    }
  },

  render() {
    return (
      <div>
        <h1>{this.title}</h1>
        <p>{this.message}</p>
        <p>{this.t("user.description")}</p>
      </div>
    )
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div class="user-panel">
    <h2>{{ pageTitle }}</h2>
    <el-button @click="showWelcome">{{ t('user.showWelcome') }}</el-button>
    <p>{{ welcomeMessage }}</p>
  </div>
</template>

<script setup>
import { useLocalTrans } from '@/hooks/useLocalTrans'

// 翻訳関数を取得
const t = useLocalTrans()

// 翻訳テキストを直接取得
const pageTitle = useLocalTrans('user.management')

const userName = ref('管理者')
const welcomeMessage = computed(() => 
  t('user.welcomeMessage', { name: userName.value })
)

const showWelcome = () => {
  ElMessage.success(t('user.welcomeBack'))
}
</script>
```

## useMessage()

メッセージ通知用のHookで、Element Plusのメッセージコンポーネントをカプセル化し、統一されたメッセージ通知インターフェースを提供します。

**ソースパス:** `/web/src/hooks/useMessage.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useMessage.ts)

### 戻り値

| メソッド | パラメータ | 説明 |
|------|------|------|
| info | (content: string) | 情報メッセージを表示 |
| error | (content: string) | エラーメッセージを表示 |
| success | (content: string) | 成功メッセージを表示 |
| warning | (content: string) | 警告メッセージを表示 |
| alert | (content: string) | アラートを表示 |
| alertError | (content: string) | エラーアラートを表示 |
| alertSuccess | (content: string) | 成功アラートを表示 |
| alertWarning | (content: string) | 警告アラートを表示 |
| notify | (content: string, args?: Record<string, any>) | 通知を表示 |
| notifyError | (content: string) | エラー通知を表示 |
| notifySuccess | (content: string) | 成功通知を表示 |
| notifyWarning | (content: string) | 警告通知を表示 |
| confirm | (content: string, tip?: string) | 確認ダイアログを表示 |
| delConfirm | (content?: string, tip?: string) | 削除確認ダイアログを表示 |
| exportConfirm | (content?: string, tip?: string) | エクスポート確認ダイアログを表示 |
| prompt | (content: string, defaultValue?: string, tip?: string, inputValidator?: MessageBoxInputValidator) | 入力ダイアログを表示 |

### 使用例

```typescript
import { useMessage } from '@/hooks/useMessage'

export default defineComponent({
  setup() {
    const message = useMessage()

    const handleSuccess = () => {
      message.success('操作が成功しました！')
    }

    const handleError = () => {
      message.error('操作に失敗しました。もう一度お試しください')
    }

    const handleConfirm = async () => {
      try {
        await message.confirm('この操作を実行してもよろしいですか？')
        console.log('ユーザーが操作を確認しました')
      } catch {
        console.log('ユーザーが操作をキャンセルしました')
      }
    }

    const handleDelete = async () => {
      try {
        await message.delConfirm()
        console.log('削除操作を実行します')
      } catch {
        console.log('削除をキャンセルしました')
      }
    }

    return {
      handleSuccess,
      handleError,
      handleConfirm,
      handleDelete
    }
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div>
    <el-button @click="saveData">データを保存</el-button>
    <el-button @click="deleteItem" type="danger">削除</el-button>
    <el-button @click="exportData">データをエクスポート</el-button>
  </div>
</template>

<script setup>
import { useMessage } from '@/hooks/useMessage'
import { saveUserData, deleteUserById, exportUserData } from '@/api/user'

const message = useMessage()

// データを保存
const saveData = async () => {
  try {
    await saveUserData({ name: 'test', email: 'test@example.com' })
    message.success('データが保存されました')
  } catch (error) {
    message.error('保存に失敗しました：' + error.message)
  }
}

// アイテムを削除
const deleteItem = async () => {
  try {
    await message.delConfirm('このユーザーを削除してもよろしいですか？')
    await deleteUserById(123)
    message.success('削除に成功しました')
  } catch (error) {
    if (error !== 'cancel') {
      message.error('削除に失敗しました')
    }
  }
}

// データをエクスポート
const exportData = async () => {
  try {
    await message.exportConfirm()
    const data = await exportUserData()
    message.notifySuccess('データのエクスポートが完了しました')
  } catch (error) {
    if (error !== 'cancel') {
      message.notifyError('エクスポートに失敗しました')
    }
  }
}

// カスタム通知を表示
const showCustomNotify = () => {
  message.notify('これはカスタム通知です', {
    type: 'info',
    duration: 5000,
    position: 'top-right'
  })
}
</script>
```

## useTabCollection()

タブコレクション用のHookで、ユーザーがよく使うタブをブックマークして管理できるようにします。

**ソースパス:** `/web/src/hooks/useTabCollection.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTabCollection.ts)

### 戻り値

| 属性 | 型 | 説明 |
|------|------|------|
| tabCollection | Ref<MineTabbar[]> | ブックマークされたタブのリスト |
| addToCollection | Function | タブをコレクションに追加 |
| removeCollection | Function | タブをコレクションから削除 |

### 使用例

```typescript
import useTabCollection from '@/hooks/useTabCollection'

export default defineComponent({
  setup() {
    const { tabCollection, addToCollection, removeCollection } = useTabCollection()

    // 現在のタブをコレクションに追加
    const addCurrentTab = () => {
      addToCollection() // パラメータなしで現在のタブを自動取得
    }

    // 指定したタブをコレクションに追加
    const addSpecificTab = () => {
      const tab = {
        name: 'userList',
        title: 'ユーザーリスト',
        path: '/user/list',
        fullPath: '/user/list?status=active',
        icon: 'user'
      }
      addToCollection(tab)
    }

    // コレクションから削除
    const removeTab = (tab) => {
      removeCollection(tab)
    }

    return {
      tabCollection,
      addCurrentTab,
      addSpecificTab,
      removeTab
    }
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div class="tab-collection">
    <div class="collection-header">
      <h3>マイコレクション</h3>
      <el-button @click="addCurrentTab" size="small">
        <el-icon><Star /></el-icon>
        現在のページをブックマーク
      </el-button>
    </div>
    
    <div class="collection-list">
      <div 
        v-for="tab in tabCollection" 
        :key="tab.fullPath"
        class="collection-item"
      >
        <el-icon v-if="tab.icon">
          <component :is="tab.icon" />
        </el-icon>
        <span class="tab-title" @click="goToTab(tab)">
          {{ tab.title }}
        </span>
        <el-button 
          @click="removeTab(tab)" 
          type="text" 
          size="small"
          class="remove-btn"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useTabCollection from '@/hooks/useTabCollection'
import { Star, Close } from '@element-plus/icons-vue'

const router = useRouter()
const { tabCollection, addToCollection, removeCollection } = useTabCollection()

// 現在のタブをコレクションに追加
const addCurrentTab = () => {
  addToCollection()
}

// 指定したタブに移動
const goToTab = (tab) => {
  router.push(tab.fullPath)
}

// コレクションから削除
const removeTab = (tab) => {
  removeCollection(tab)
}
</script>

<style scoped>
.collection-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-title {
  flex: 1;
  margin-left: 8px;
  cursor: pointer;
}

.tab-title:hover {
  color: var(--el-color-primary);
}

.remove-btn {
  margin-left: auto;
}
</style>
```

## useImageViewer()

画像プレビュー用のHookで、Element PlusのImageViewerコンポーネントをベースに、複数画像の閲覧をサポートします。

**ソースパス:** `/web/src/hooks/useImageViewer.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useImageViewer.ts)

### 型定義

```typescript
type Options = Partial<Omit<ImageViewerProps, 'urlList'>>
```

### パラメータ

| パラメータ | 型 | 説明 |
|------|------|------|
| images | string[] | 画像URLの配列 |
| options | Options | 画像ビューアの設定オプション |

### 使用例

```typescript
import { useImageViewer } from '@/hooks/useImageViewer'

export default defineComponent({
  setup() {
    const previewImages = () => {
      const images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ]

      useImageViewer(images, {
        initialIndex: 0, // 最初の画像を表示
        zIndex: 3000,    // z-indexを設定
        hideOnClickModal: true // オーバーレイクリックで閉じる
      })
    }

    return { previewImages }
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div class="image-gallery">
    <div 
      v-for="(image, index) in imageList" 
      :key="index"
      class="image-item"
      @click="previewImage(index)"
    >
      <img :src="image" alt="画像" />
      <div class="image-overlay">
        <el-icon><ZoomIn /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImageViewer } from '@/hooks/useImageViewer'
import { ZoomIn } from '@element-plus/icons-vue'

const imageList = ref([
  'https://example.com/gallery/img1.jpg',
  'https://example.com/gallery/img2.jpg',
  'https://example.com/gallery/img3.jpg',
  'https://example.com/gallery/img4.jpg'
])

// 画像をプレビュー
const previewImage = (index) => {
  useImageViewer(imageList.value, {
    initialIndex: index, // クリックした画像から表示
    zIndex: 2500,
    hideOnClickModal: true,
    // カスタムクローズコールバック
    onClose: () => {
      console.log('画像プレビューが閉じられました')
    }
  })
}

// 単一画像をプレビュー
const previewSingleImage = (imageUrl) => {
  useImageViewer([imageUrl], {
    zIndex: 2500,
    hideOnClickModal: true
  })
}
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-item:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-overlay .el-icon {
  color: white;
  font-size: 24px;
}
</style>
```

## useResourcePicker()

リソース選択用のHookで、ファイル、画像などのリソース選択機能を提供します。

**ソースパス:** `/web/src/hooks/useResourcePicker.ts`
**GitHubリンク:** [ソースを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useResourcePicker.ts)

### 型定義

```typescript
export type WithOnEventListeners<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: T[K];
}

type Options = Partial<ResourcePickerProps & WithOnEventListeners<ResourcePickerEmits>>
```

### パラメータ

| パラメータ | 型 | 説明 |
|------|------|------|
| options | Options | リソースピッカーの設定オプション |

### 使用例

```typescript
import { useResourcePicker } from '@/hooks/useResourcePicker'

export default defineComponent({
  setup() {
    const selectSingleFile = () => {
      useResourcePicker({
        multiple: false,
        defaultFileType: 'image',
        onConfirm: (resources) => {
          console.log('選択されたリソース：', resources)
          // 選択されたリソースを処理
          if (resources.length > 0) {
            const selectedFile = resources[0]
            console.log('ファイル名：', selectedFile.origin_name)
            console.log('ファイルURL：', selectedFile.url)
          }
        },
        onCancel: () => {
          console.log('ユーザーが選択をキャンセルしました')
        }
      })
    }

    const selectMultipleImages = () => {
      useResourcePicker({
        multiple: true,
        limit: 5, // 最大5ファイル選択
        defaultFileType: 'image',
        onConfirm: (resources) => {
          console.log('選択された画像：', resources)
          // 画像を一括処理
          resources.forEach(image => {
            console.log(`画像: ${image.origin_name}, URL: ${image.url}`)
          })
        }
      })
    }

    return {
      selectSingleFile,
      selectMultipleImages
    }
  }
})
```

### 実際のアプリケーションシナリオ

```vue
<template>
  <div class="resource-demo">
    <div class="upload-area">
      <el-button @click="selectAvatar">アバターを選択</el-button>
      <div v-if="avatarUrl" class="avatar-preview">
        <img :src="avatarUrl" alt="アバタープレビュー" />
      </div>
    </div>

    <div class="gallery-area">
      <el-button @click="selectGalleryImages">画像を選択</el-button>
      <div class="gallery-preview">
        <div 
          v-for="(image, index) in galleryImages" 
          :key="index"
          class="gallery-item"
        >
          <img :src="image.url" :alt="image.origin_name" />
          <p>{{ image.origin_name }}</p>
        </div>
      </div>
    </div>

    <div class="file-area">
      <el-button @click="selectDocuments">ドキュメントを選択</el-button>
      <ul class="file-list">
        <li v-for="(file, index) in documentFiles" :key="index">
          <span>{{ file.origin_name }}</span>
          <span>{{ file.size_info }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useResourcePicker } from '@/hooks/useResourcePicker'

const avatarUrl = ref('')
const galleryImages = ref([])
const documentFiles = ref([])

// アバターを選択
const selectAvatar = () => {
  useResourcePicker({
    multiple: false,
    defaultFileType: 'image',
    fileTypes: [
      { value: 'image', label: '画像', suffix: 'jpg,jpeg,png,gif' }
    ],
    onConfirm: (resources) => {
      if (resources.length > 0) {
        avatarUrl.value = resources[0].url
        ElMessage.success('アバターが選択されました')
      }
    }
  })
}

// 画像ギャラリーを選択
const selectGalleryImages = () => {
  useResourcePicker({
    multiple: true,
    limit: 10,
    defaultFileType: 'image',
    onConfirm: (resources) => {
      galleryImages.value = resources
      ElMessage.success(`${resources.length} 枚の画像を選択しました`)
    }
  })
}

// ドキュメントを選択
const