# ページネーションテーブル

完全なページネーション機能を表示します。ページネーション設定、イベント処理、動的更新などを含みます。

## ページネーションデモ

<DemoPreview dir="demos/ma-table/pagination" />

## 機能特徴

### ページネーションコンポーネント
- **ページナビゲーション**: ページ切り替えとジャンプをサポート
- **ページサイズ**: 1ページに表示する項目数を選択可能
- **総数表示**: データの総項目数を表示
- **クイックジャンプ**: ページ番号入力によるクイックジャンプをサポート

### ページネーション設定
- **レイアウト設定**: ページネーションコンポーネントの表示要素をカスタマイズ
- **スタイル設定**: 背景色、サイズなどのスタイル設定をサポート
- **イベント処理**: ページ番号とページサイズ変更イベントを監視
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
      console.log('現在ページ変更:', currentPage)
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
    prevText: '前へ',     // 前ページボタンテキスト
    nextText: '次へ'      // 次ページボタンテキスト
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

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `currentPage` | 現在のページ番号 | `number` | `1` |
| `pageSize` | 1ページに表示する項目数 | `number` | `10` |
| `total` | 総項目数 | `number` | `0` |
| `pageSizes` | ページサイズ選択オプション | `number[]` | `[10, 20, 50, 100]` |

### スタイルパラメータ

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `size` | ページネーションコンポーネントサイズ | `'large' \| 'default' \| 'small'` | `'default'` |
| `background` | ページ番号ボタンに背景色を追加するか | `boolean` | `false` |
| `layout` | コンポーネントレイアウト、子コンポーネント名をカンマ区切り | `string` | `'prev, pager, next, jumper, ->, total'` |
| `pagerCount` | ページ番号ボタンの数 | `number` | `7` |

### 制御パラメータ

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `disabled` | ページネーションを無効化するか | `boolean` | `false` |
| `hideOnSinglePage` | 1ページのみの場合に非表示にするか | `boolean` | `false` |
| `prevText` | アイコン表示の代わりに表示する前ページテキスト | `string` | - |
| `nextText` | アイコン表示の代わりに表示する次ページテキスト | `string` | - |

## ページネーションイベント

| イベント名 | 説明 | パラメータ |
|-------|------|------|
| `onChange` | ページ番号またはページサイズ変更時に発火 | `(currentPage, pageSize)` |
| `onSizeChange` | ページサイズ変更時に発火 | `(pageSize)` |
| `onCurrentChange` | 現在ページ変更時に発火 | `(currentPage)` |
| `onPrevClick` | 前ページボタンクリックで現在ページ変更後に発火 | `(currentPage)` |
| `onNextClick` | 次ページボタンクリックで現在ページ変更後に発火 | `(currentPage)` |

## レイアウトオプション

`layout` プロパティで以下のコンポーネントを設定可能:

- `prev`: 前ページボタン
- `pager`: ページ番号リスト
- `next`: 次ページボタン
- `jumper`: ジャンプ入力ボックス
- `total`: 総項目数
- `sizes`: ページサイズセレクター
- `->`: セパレーター、後続のコンポーネントを右寄せ表示

レイアウト例:
- `'total, sizes, prev, pager, next, jumper'`
- `'prev, pager, next, jumper, ->, total, sizes'`

## ベストプラクティス

1. **データページネーション**: サーバーサイドでのデータページネーションを推奨、大量データの一括読み込みを回避
2. **状態同期**: ページネーション状態と実際のデータを同期させる
3. **ユーザーエクスペリエンス**: 適切なページサイズオプションを提供（10、20、50など）
4. **ローディング状態**: データ読み込み中にローディング状態を表示
5. **エラー処理**: ページネーションデータ読み込み失敗時の処理

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