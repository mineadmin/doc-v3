# 動的列管理

列の表示/非表示、追加/削除を動的に制御する方法と、Exposeメソッドを使用した列管理を紹介します。

## 動的列デモ

<DemoPreview dir="demos/ma-table/dynamic-columns" />

## 機能特徴

### 列制御方法
- **表示/非表示**: リアクティブデータで列の表示状態を制御
- **動的追加**: 実行時に新しい列を追加
- **動的削除**: 不要な列を削除
- **列設定取得**: 現在の列設定情報を取得

### Exposeメソッド
ma-tableは完全な列管理APIを提供:
- `setColumns()`: 全ての列を再設定
- `getColumns()`: 現在の列設定を取得
- `appendColumn()`: 新しい列を追加
- `removeColumn()`: 指定列を削除
- `getColumnByProp()`: プロパティ名で列設定を取得

## 使用例

### 列表示制御
```vue
<template>
  <div>
    <!-- 列制御スイッチ -->
    <el-switch 
      v-for="(visible, key) in columnVisibility" 
      :key="key"
      v-model="columnVisibility[key]"
      :label="getColumnLabel(key)"
    />
    
    <ma-table 
      :columns="visibleColumns" 
      :data="data" 
      :options="options" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 列表示状態
const columnVisibility = ref({
  name: true,
  age: true,
  email: true,
  department: false
})

// 基本列設定
const baseColumns = [
  { label: '氏名', prop: 'name' },
  { label: '年齢', prop: 'age' },
  { label: 'メール', prop: 'email' },
  { label: '部門', prop: 'department' }
]

// 表示列を計算
const visibleColumns = computed(() => {
  return baseColumns.filter(col => 
    columnVisibility.value[col.prop]
  )
})
</script>
```

### Exposeメソッドで動的列管理
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
import { ref } from 'vue'

const tableRef = ref()

// 新規列追加
const addColumn = () => {
  const newColumn = {
    label: '新規列',
    prop: 'newField',
    cellRender: ({ row }) => <el-tag>動的列</el-tag>
  }
  tableRef.value?.appendColumn(newColumn)
}

// 列削除
const removeColumn = (prop) => {
  tableRef.value?.removeColumn(prop)
}

// 列設定取得
const getColumns = () => {
  const columns = tableRef.value?.getColumns()
  console.log('現在の列設定:', columns)
}

// 列設定リセット
const resetColumns = () => {
  const newColumns = [
    { label: '氏名', prop: 'name' },
    { label: '年齢', prop: 'age' }
  ]
  tableRef.value?.setColumns(newColumns)
}
</script>
```

### 動的列フォーム
```vue
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="列追加">
      <el-form :model="newColumn">
        <el-form-item label="列タイトル" required>
          <el-input v-model="newColumn.label" />
        </el-form-item>
        <el-form-item label="フィールド名" required>
          <el-input v-model="newColumn.prop" />
        </el-form-item>
        <el-form-item label="列幅">
          <el-input v-model="newColumn.width" />
        </el-form-item>
        <el-form-item label="配置">
          <el-select v-model="newColumn.align">
            <el-option label="左寄せ" value="left" />
            <el-option label="中央" value="center" />
            <el-option label="右寄せ" value="right" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">キャンセル</el-button>
        <el-button type="primary" @click="confirmAddColumn">確定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const dialogVisible = ref(false)
const newColumn = ref({
  label: '',
  prop: '',
  width: '',
  align: 'center'
})

const confirmAddColumn = () => {
  // フォーム検証
  if (!newColumn.value.label || !newColumn.value.prop) {
    return
  }
  
  // 列設定構築
  const column = {
    label: newColumn.value.label,
    prop: newColumn.value.prop,
    align: newColumn.value.align,
    width: newColumn.value.width ? parseInt(newColumn.value.width) : undefined,
    cellRender: ({ row }) => row[newColumn.value.prop] || '--'
  }
  
  // テーブルに追加
  tableRef.value?.appendColumn(column)
  
  // フォームリセット
  newColumn.value = { label: '', prop: '', width: '', align: 'center' }
  dialogVisible.value = false
}
</script>
```

## APIリファレンス

### Exposeメソッド

| メソッド名 | 説明 | パラメータ | 戻り値 |
|-------|------|------|--------|
| `setColumns(columns)` | テーブル列を再設定 | `MaTableColumns[]` | - |
| `getColumns()` | 現在の列設定を取得 | - | `MaTableColumns[]` |
| `appendColumn(column)` | 列を末尾に追加 | `MaTableColumns` | - |
| `removeColumn(prop)` | 指定列を削除 | `string` | - |
| `getColumnByProp(prop)` | プロパティ名で列設定取得 | `string` | `MaTableColumns` |

### 動的列設定

```typescript
interface MaTableColumns {
  label: string           // 列タイトル
  prop: string           // フィールド名
  width?: number         // 列幅
  minWidth?: number      // 最小幅
  align?: 'left' | 'center' | 'right'  // 配置
  hide?: boolean         // 非表示フラグ
  cellRender?: Function  // カスタムレンダリング
  // ... その他Element Plus列プロパティ
}
```

## 使用シナリオ

1. **カスタマイズ設定**: ユーザーが必要な列を表示/非表示
2. **権限制御**: ユーザー権限に基づき異なる列を表示
3. **データ適応**: データソースに応じて列設定を調整
4. **リアルタイム設定**: 実行時に業務要件に応じて列を追加/削除
5. **列設定保存**: ユーザーの列設定プリファレンスを保存

## ベストプラクティス

1. **状態管理**: リアクティブデータで列表示状態を管理
2. **設定検証**: 新規列追加時に設定の完全性と一意性を検証
3. **ユーザー体験**: スイッチやチェックボックスなど直感的な制御UIを提供
4. **データ同期**: 動的列追加時に対応フィールドがデータにあることを確認
5. **パフォーマンス最適化**: 頻繁な列操作を避け、一括更新を考慮

## 注意事項

- 動的列削除時、対応データは削除されず非表示になる
- 動的追加列には対応フィールドが必要、ない場合は空表示
- `setColumns`使用時は既存列設定が完全に置換される
- 列の`prop`プロパティは一意である必要あり、重複不可