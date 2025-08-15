# 基本テーブル

最も基本的なテーブル機能を表示します。ストライプ表示、枠線、現在行のハイライトなどの機能を含みます。

## 基本使い方

<DemoPreview dir="demos/ma-table/basic" />

## 機能説明

### 基本設定
- **ストライプ表示**: `stripe: true` で交互に色を変更
- **枠線表示**: `border: true` でテーブルの枠線を表示  
- **現在行ハイライト**: `highlightCurrentRow: true` 行をクリック時にハイライト表示
- **ヘッダー表示**: `showHeader: true` ヘッダーの表示/非表示を制御

### 列設定
- **固定幅**: `width` 列の固定幅を設定
- **最小幅**: `minWidth` 列の最小幅を設定
- **列揃え**: `align` 列内容の配置を制御

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
  { label: '名前', prop: 'name', width: 120 },
  { label: '年齢', prop: 'age', width: 80 },
  { label: 'メール', prop: 'email' },
  { label: '部門', prop: 'department' },
  { label: '職位', prop: 'position' }
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

## 設定パラメータ

| パラメータ | 説明 | タイプ | デフォルト値 |
|-----|------|-----|--------|
| `stripe` | ストライプ表示するか | `boolean` | `false` |
| `border` | 縦枠線を表示するか | `boolean` | `false` |
| `size` | テーブルのサイズ | `'large' \| 'default' \| 'small'` | `'default'` |
| `highlightCurrentRow` | 現在行をハイライトするか | `boolean` | `false` |
| `showHeader` | ヘッダーを表示するか | `boolean` | `true` |