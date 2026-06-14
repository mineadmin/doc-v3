# ページネーションテーブル

完全なページネーション機能を表示します。ページネーション設定、イベント処理、動的更新などを含みます。

## ページネーションデモ

<DemoPreview dir="demos/ma-table/pagination" />

## 機能特性

### ページネーションコンポーネント
- **ページ番号ナビゲーション**: ページ切り替えとジャンプをサポート
- **ページサイズ**: 1ページあたりの表示件数を選択可能
- **総件数表示**: データの総件数を表示
- **クイックジャンプ**: ページ番号入力によるクイックジャンプをサポート

### ページネーション設定
- **レイアウト設定**: ページネーションコンポーネントの表示要素をカスタマイズ
- **スタイル設定**: 背景色、サイズなどのスタイル設定をサポート
- **イベント処理**: ページ番号とページサイズの変更イベントを監視
- **動的更新**: 実行時にページネーション設定を変更

## 設定例

### 基本ページネーション設定
```javascript
const options = {
  showPagination: true,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100],
    background: true
  }
}
```

### ページネーションイベント処理
```javascript
const options = {
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    onChange: (currentPage, pageSize) => {
      console.log('ページネーション変更:', currentPage, pageSize)
      // データを再読み込み
      loadData(currentPage, pageSize)
    },
    onSizeChange: (pageSize) => {
      console.log('ページサイズ変更:', pageSize)
    },
    onCurrentChange: (currentPage) => {
      console.log('現在のページ変更:', currentPage)
    }
  }
}
```

### カスタムページネーションレイアウト
```javascript
const options = {
  pagination: {
    layout: 'prev, pager, next, jumper, ->, total, sizes',
    pageSizes: [5, 10, 20, 50],
    // 1ページのみの場合にページネーションを非表示
    hideOnSinglePage: true
  }
}
```

### ページネーションスタイル設定
```javascript
const options = {
  pagination: {
    size: 'small',        // ページネーションサイズ
    background: true,     // ページ番号背景
    disabled: false,      // 無効化するかどうか
    prevText: '前のページ',    // 前のページボタンのテキスト
    nextText: '次のページ'     // 次のページボタンのテキスト
  }
}
```

### Exposeメソッドを使用したページネーション更新
```vue
<template>
  <ma-table 
    ref="tableRef"
    :columns="columns" 
    :data="data" 
    :options="options" 
  />
</template>

<script setup>
const tableRef = ref()

// ページネーション設定を更新
const updatePagination = () => {
  const newPagination = {
    currentPage: 1,
    pageSize: 20,
    total: 200
  }
  tableRef.value?.setPagination(newPagination)
}

// 現在の設定を取得
const getCurrentOptions = () => {
  const options = tableRef.value?.getOptions()
  console.log('現在のページネーション設定:', options.pagination)
}
</script>
```

## ページネーションパラメータ

### 基本パラメータ

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `currentPage` | 現在のページ数 | `number` | `1` |
| `pageSize` | 1ページあたりの表示件数 | `number` | `10` |
| `total` | 総件数 | `number` | `0` |
| `pageSizes` | 1ページあたりの表示件数選択肢 | `number[]` | `[10, 20, 50, 100]` |

### スタイルパラメータ

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `size` | ページネーションコンポーネントのサイズ | `'large' \| 'default' \| 'small'` | `'default'` |
| `background` | ページ番号ボタンに背景色を追加するか | `boolean` | `false` |
| `layout` | コンポーネントレイアウト、子コンポーネント名をカンマ区切り | `string` | `'prev, pager, next, jumper, ->, total'` |
| `pagerCount` | ページ番号ボタンの数 | `number` | `7` |

### 制御パラメータ

| パラメータ | 説明 | 型 | デフォルト値 |
|-----------|------|-----|------------|
| `disabled` | ページネーションを無効化するか | `boolean` | `false` |
| `hideOnSinglePage` | 1ページのみの場合に非表示にするか | `boolean` | `false` |
| `prevText` | アイコン代わりに表示する前のページテキスト | `string` | - |
| `nextText` | アイコン代わりに表示する次のページテキスト | `string` | - |

## ページネーションイベント

| イベント名 | 説明 | パラメータ |
|-----------|------|-----------|
| `onChange` | ページ番号またはページサイズが変更されたときに発火 | `(currentPage, pageSize)` |
| `onSizeChange` | 1ページあたりの件数が変更されたときに発火 | `(pageSize)` |
| `onCurrentChange` | 現在のページが変更されたときに発火 | `(currentPage)` |
| `onPrevClick` | ユーザーが前のページボタンをクリックして現在のページを変更した後に発火 | `(currentPage)` |
| `onNextClick` | ユーザーが次のページボタンをクリックして現在のページを変更した後に発火 | `(currentPage)` |

## レイアウトオプション

`layout` プロパティでは以下のコンポーネントを設定できます：

- `prev`: 前のページボタン
- `pager`: ページ番号リスト
- `next`: 次のページボタン
- `jumper`: ジャンプ入力ボックス
- `total`: 総件数
- `sizes`: 1ページあたりの表示件数セレクター
- `->`: 区切り文字、後続のコンポーネントを右寄せにする

レイアウト例：
- `'total, sizes, prev, pager, next, jumper'`
- `'prev, pager, next, jumper, ->, total, sizes'`

## ベストプラクティス

1. **データページネーション**: 大量のデータを一度に読み込まないよう、サーバーサイドでのデータページネーションを推奨
2. **状態同期**: ページネーション状態と実際のデータが同期していることを確認
3. **ユーザーエクスペリエンス**: 適切なページサイズオプションを提供（通常は10、20、50などを含む）
4. **ローディング状態**: データ読み込み中はローディング状態を表示
5. **エラーハンドリング**: ページネーションデータの読み込み失敗を処理

## サーバーサイドページネーション例

```vue
<template>
  <ma-table 
    :columns="columns" 
    :data="currentPageData" 
    :options="tableOptions" 
  />
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentPageData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const tableOptions = {
  loading: false,
  pagination: {
    ...pagination,
    onChange: async (currentPage, pageSize) => {
      pagination.currentPage = currentPage
      pagination.pageSize = pageSize
      await loadData()
    }
  }
}

const loadData = async () => {
  try {
    tableOptions.loading = true
    const response = await api.getTableData({
      page: pagination.currentPage,
      size: pagination.pageSize
    })
    
    currentPageData.value = response.data
    pagination.total = response.total
  } catch (error) {
    console.error('データ読み込み失敗:', error)
  } finally {
    tableOptions.loading = false
  }
}

// 初期読み込み
loadData()
</script>
```