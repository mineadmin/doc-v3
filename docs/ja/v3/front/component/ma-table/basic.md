# 基本テーブル

最も基本的なテーブル機能を表示します。ストライプ、枠線、現在行のハイライトなどの機能を含みます。

## 基本的な使い方

<DemoPreview dir="demos/ma-table/basic" />

## 機能説明

### 基本設定
- **ストライプ表示**: `stripe: true` で交互の行に色を付けます
- **枠線表示**: `border: true` でテーブルの枠線を表示します
- **現在行のハイライト**: `highlightCurrentRow: true` でクリックした行をハイライト表示します
- **ヘッダー表示**: `showHeader: true` でヘッダーの表示・非表示を制御します

### 列設定
- **固定幅**: `width` で列の固定幅を設定します
- **最小幅**: `minWidth` で列の最小幅を設定します
- **列の配置**: `align` で列の内容の配置を制御します

## コード例

```vue
<template>
  <ma-table
    :columns="columns"
    :data="data"
    :options="options"
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  { label: '氏名', prop: 'name', width: 120 },
  { label: '年齢', prop: 'age', width: 80 },
  { label: 'メール', prop: 'email' },
  { label: '部署', prop: 'department' },
  { label: '役職', prop: 'position' }
])

const options = ref({
  stripe: true,
  border: true,
  size: 'default',
  showHeader: true,
  highlightCurrentRow: true
})

const data = [
  { name: '張三', age: 28, email: 'zhangsan@example.com', department: '技術部', position: 'フロントエンドエンジニア' },
  // ... その他のデータ
]
</script>
```

## 設定パラメーター

| パラメーター | 説明 | 型 | デフォルト値 |
|------------|------|-----|-----------|
| `stripe` | ゼブラストライプテーブルにするか | `boolean` | `false` |
| `border` | 縦の枠線を表示するか | `boolean` | `false` |
| `size` | テーブルのサイズ | `'large' \| 'default' \| 'small'` | `'default'` |
| `highlightCurrentRow` | 現在行をハイライトするか | `boolean` | `false` |
| `showHeader` | ヘッダーを表示するか | `boolean` | `true` |