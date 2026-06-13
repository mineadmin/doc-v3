# 動的列管理

列の表示・非表示、追加・削除を動的に制御する方法と、Expose メソッドを使用した列管理について説明します。

## 動的列デモ

<DemoPreview dir="demos/ma-table/dynamic-columns" />

## 機能特性

### 列制御方式
- **表示・非表示**: リアクティブデータで列の表示状態を制御
- **動的追加**: 実行時にテーブルに新しい列を追加
- **動的削除**: 不要な列を削除
- **列構成の取得**: 現在の列構成情報を取得

### Expose メソッド
ma-table は完全な列管理 API を提供します：
- `setColumns()`: すべての列を再設定
- `getColumns()`: 現在の列構成を取得
- `appendColumn()`: 新しい列を追加
- `removeColumn()`: 指定した列を削除
- `getColumnByProp()`: プロパティ名で列構成を取得

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

// 基本列構成
const baseColumns = [
  { label: '名前', prop: 'name' },
  { label: '年齢', prop: 'age' },
  { label: 'メール', prop: 'email' },
  { label: '部署', prop: 'department' }
]

// 表示列の計算
const visibleColumns = computed(() => {
  return baseColumns.filter(col => 
    columnVisibility.value[col.prop]
  )
})
</script>
```

### Expose メソッドを使用した動的列管理
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

// 新しい列を追加
const addColumn = () => {
  const newColumn = {
    label: '新しい列',
    prop: 'newField',
    cellRender: ({ row }) => <el-tag>動的列</el-tag>
  }
  tableRef.value?.appendColumn(newColumn)
}

// 列を削除
const removeColumn = (prop) => {
  tableRef.value?.removeColumn(prop)
}

// 列構成を取得
const getColumns = () => {
  const columns = tableRef.value?.getColumns()
  console.log('現在の列構成:', columns)
}

// 列構成をリセット
const resetColumns = () => {
  const newColumns = [
    { label: '名前', prop: 'name' },
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
    <el-dialog v-model="dialogVisible" title="列の追加">
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
  
  // 列構成を構築
  const column = {
    label: newColumn.value.label,
    prop: newColumn.value.prop,
    align: newColumn.value.align,
    width: newColumn.value.width ? parseInt(newColumn.value.width) : undefined,
    cellRender: ({ row }) => row[newColumn.value.prop] || '--'
  }
  
  // テーブルに追加
  tableRef.value?.appendColumn(column)
  
  // フォームをリセット
  newColumn.value = { label: '', prop: '', width: '', align: 'center' }
  dialogVisible.value = false
}
</script>
```

## API リファレンス

### Expose メソッド

| メソッド名 | 説明 | パラメータ | 戻り値 |
|-----------|------|-----------|--------|
| `setColumns(columns)` | テーブル列を再設定 | `MaTableColumns[]` | - |
| `getColumns()` | 現在のテーブル列構成を取得 | - | `MaTableColumns[]` |
| `appendColumn(column)` | 新しい列をテーブル末尾に追加 | `MaTableColumns` | - |
| `removeColumn(prop)` | 指定したプロパティ名の列を削除 | `string` | - |
| `getColumnByProp(prop)` | プロパティ名で列構成を取得 | `string` | `MaTableColumns` |

### 動的列構成

```typescript
interface MaTableColumns {
  label: string           // 列タイトル
  prop: string           // フィールド名
  width?: number         // 列幅
  minWidth?: number      // 最小幅
  align?: 'left' | 'center' | 'right'  // 配置
  hide?: boolean         // 非表示フラグ
  cellRender?: Function  // カスタムレンダリング
  // ... その他の Element Plus 列属性
}
```

## 使用シナリオ

1. **個人設定**: ユーザーが必要に応じて特定の列を表示・非表示
2. **権限制御**: ユーザー権限に基づいて異なる列を動的表示
3. **データ適応**: 異なるデータソースに応じて列構成を動的調整
4. **リアルタイム構成**: 実行時にビジネス要件に応じて列を追加・削除
5. **列構成保存**: ユーザーの列構成設定を保存

## ベストプラクティス

1. **状態管理**: リアクティブデータで列の表示状態を管理
2. **構成検証**: 新しい列追加時に構成の完全性と一意性を検証
3. **ユーザー体験**: スイッチやチェックボックスなど直感的な列制御インターフェースを提供
4. **データ同期**: 動的列追加時に対応するフィールドがデータに含まれていることを確認
5. **パフォーマンス最適化**: 頻繁な列操作を避け、バッチ更新を検討

## 注意事項

- 動的に列を削除しても、対応するデータは削除されず、表示されなくなるだけです
- 動的に追加した列に対応するフィールドがデータに存在しない場合、空で表示されます
- `setColumns` を使用すると、既存の列構成が完全に置き換えられます
- 列の `prop` 属性は一意である必要があり、重複は許可されません