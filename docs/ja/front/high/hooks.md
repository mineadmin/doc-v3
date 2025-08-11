# Hooks

MineAdmin は、一連の強力なカスタム Hooks を提供しています。これらの Hooks は、よく使われる機能とロジックをカプセル化しており、開発者が Vue 3 コンポーネントでコードを簡単に再利用できるようにします。このドキュメントでは、各 Hook の使い方、パラメータ、戻り値、および実際の適用シナリオについて詳しく説明します。

## useCache()

ブラウザのキャッシュ操作に使用する Hook で、localStorage と sessionStorage をサポートし、有効期限の設定機能を提供します。

**ソースコードパス:** `/web/src/hooks/useCache.ts`  
**GitHub リンク:** [ソースコードを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts)

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
   * true の場合：最大容量を超えてデータの挿入操作ができなくなったとき、キャッシュ内のタイムアウト済みコンテンツをクリアしてから再度データ挿入操作を試みます。
   * デフォルトは true。
   */
  force?: boolean
}
```

### パラメータ

| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| type | CacheType | 'localStorage' | キャッシュタイプ。'localStorage' または 'sessionStorage' を選択可能 |

### 戻り値

| プロパティ | 型 | 説明 |
|------|------|------|
| cache | WebStorageCache | 基盤となる WebStorageCache インスタンス |
| prefix | string | キャッシュキー名のプレフィックス |
| set | Function | キャッシュを設定 |
| get | Function | キャッシュを取得 |
| remove | Function | キャッシュを削除 |
| removeAllExpires | Function | すべての期限切れキャッシュを削除 |
| touch | Function | キャッシュの有効期限を更新 |

### 使用例

```typescript
import useCache from '@/hooks/useCache'

// localStorageを使用（デフォルト）
const { set, get, remove, removeAllExpires, touch } = useCache()

// sessionStorageを使用
const sessionCache = useCache('sessionStorage')

// キャッシュを設定（期限なし）
set('userInfo', { name: 'MineAdmin', role: 'admin' })

// キャッシュを設定（30秒後に期限切れ）
set('tempData', '一時的な値', { exp: 30 })

// キャッシュを取得
const userInfo = get('userInfo', null)

// 特定のキャッシュを削除
remove('tempData')

// すべての期限切れキャッシュを削除
removeAllExpires()

// キャッシュの有効期限を更新（60秒延長）
touch('userInfo', 60)
```

### 実際の適用シナリオ

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

ダイアログを作成するための Hook で、ダイアログのライフサイクル管理を完全にサポートし、カスタムタイトル、プロパティ、およびイベントコールバックを提供します。

**ソースコードパス:** `/web/src/hooks/useDialog.ts`  
**GitHub リンク:** [ソースコードを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useDialog.ts)

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
| dialogProps | Record<string, any> \| null | null | ダイアログの初期プロパティ設定 |

### 戻り値

| プロパティ | 型 | 説明 |
|------|------|------|
| on | Object | イベントコールバック設定 |
| Dialog | Component | ダイアログコンポーネント |
| open | Function | ダイアログを開く |
| close | Function | ダイアログを閉じる |
| setTitle | Function | ダイアログのタイトルを設定 |
| setAttr | Function | ダイアログのプロパティを設定 |

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
      console.log('ユーザーがOKをクリックしました')
      close()
    }

    on.cancel = () => {
      console.log('ユーザーがキャンセルをクリックしました')
      return true // trueを返すと閉じることが許可されます
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
          <div>ここにダイアログの内容が表示されます</div>
        </Dialog>
      </div>
    )
  }
})
```

### 実際の適用シナリオ

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
  // ここでフォーム送信をトリガーできます
  return false // デフォルトの閉じる動作を阻止
}
</script>
```

## useEcharts()

ECharts ライブラリを統合するための Hook で、テーマ切り替えとチャート初期化機能を提供します。

**ソースコードパス:** `/web/src/hooks/useEcharts.ts`  
**GitHub リンク:** [ソースコードを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useEcharts.ts)

### エクスポート関数

| 関数 | 型 | 説明 |
|------|------|------|
| useEcharts | Function | @mineadmin/echarts の useEcharts 関数 |
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
        title: { text: '販売データ' },
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

### 実際の適用シナリオ

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
  // 販売チャートを初期化
  const salesChart = await useEcharts(salesChartRef.value)
  salesChart.setOption({
    title: { text: '販売トレンド' },
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

フォーム操作のための Hook で、フォームインスタンスの取得と操作機能を提供します。

**ソースコードパス:** `/web/src/hooks/useForm.ts`  
**GitHub リンク:** [ソースコードを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useForm.ts)

### パラメータ

| パラメータ | 型 | 説明 |
|------|------|------|
| refName | string | フォーム参照名 |

### 戻り値

`MaFormExpose` タイプのフォームインスタンスに解決される Promise を返します。

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
        
        console.log('フォームデータ:', formData)
      } catch (error) {
        console.error('フォーム検証に失敗しました:', error)
      }
    }

    return {
      formRef,
      getFormInstance
    }
  }
})
```

### 実際の適用シナリオ

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
    title: 'メールアドレス',
    dataIndex: 'email',
    formType: 'input',
    rules: [{ required: true, type: 'email', message: '正しいメールアドレスを入力してください' }]
  }
]

const handleSubmit = async () => {
  try {
    const formInstance = await useForm('userForm')
    
    // フォーム送信ロジック
    console.log('フォームを送信')
  } catch (error) {
    console.error('送信に失敗しました:', error)
  }
}
</script>
```

## useTable()

テーブル操作のための Hook で、テーブルインスタンスの取得と操作機能を提供します。

**ソースコードパス:** `/web/src/hooks/useTable.ts`  
**GitHub リンク:** [ソースコードを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTable.ts)

### パラメータ

| パラメータ | 型 | 説明 |
|------|------|------|
| refName | string | テーブル参照名 |

### 戻り値

`MaTableExpose` タイプのテーブルインスタンスに解決される Promise を返します。

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
        console.log('選択された行:', selectedRows)
        
        // 選択をクリア
        tableInstance.clearSelection()
      } catch (error) {
        console.error('テーブルインスタンスの取得に失敗しました:', error)
      }
    }

    return { getTableInstance }
  }
})
```

### 実際の適用シナリオ

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
  { title: 'メールアドレス', dataIndex: 'email' },
  { title: 'ステータス', dataIndex: 'status' }
]

// テーブルを更新
const refreshTable = async () => {
  const tableInstance = await useTable('userTable')
  await tableInstance.refresh()
  ElMessage.success('更新しました')
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
    
    await ElMessageBox.confirm('選択したユーザーを削除しますか？')
    
    const ids = selectedRows.map(row => row.id)
    await deleteUsers(ids)
    
    // テーブルを更新して選択をクリア
    await tableInstance.refresh()
    tableInstance.clearSelection()
    
    ElMessage.success('削除しました')
  } catch (error) {
    ElMessage.error('削除に失敗しました')
  }
}
</script>
```

## useLocalTrans()

ローカライゼーション翻訳のための Hook で、vue-i18n に基づく翻訳機能を提供します。

**ソースコードパス:** `/web/src/hooks/useLocalTrans.ts`  
**GitHub リンク:** [ソースコードを表示](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useLocalTrans.ts)

### パラメータ

| パラメータ | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| key | any \| null | null | 翻訳キー名。null の場合は翻訳関数を返します |

### 戻り値

- `key` が null の場合、翻訳関数 `ComposerTranslation` を返します
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
        <