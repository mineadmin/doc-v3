# 動態列管理

展示如何動態控制列的顯示隱藏、添加刪除列，以及使用 Expose 方法進行列管理。

## 動態列演示

<DemoPreview dir="demos/ma-table/dynamic-columns" />

## 功能特性

### 列控制方式
- **顯示隱藏**: 通過響應式數據控制列的顯示狀態
- **動態添加**: 運行時向表格添加新的列
- **動態刪除**: 刪除不需要的列
- **列配置獲取**: 獲取當前列的配置信息

### Expose 方法
ma-table 提供了完整的列管理 API：
- `setColumns()`: 重新設置所有列
- `getColumns()`: 獲取當前列配置
- `appendColumn()`: 追加新列
- `removeColumn()`: 刪除指定列
- `getColumnByProp()`: 根據屬性名獲取列配置

## 使用示例

### 列顯示控制
```vue
<template>
  <div>
    <!-- 列控制開關 -->
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

// 列顯示狀態
const columnVisibility = ref({
  name: true,
  age: true,
  email: true,
  department: false
})

// 基礎列配置
const baseColumns = [
  { label: '姓名', prop: 'name' },
  { label: '年齡', prop: 'age' },
  { label: '郵箱', prop: 'email' },
  { label: '部門', prop: 'department' }
]

// 計算可見列
const visibleColumns = computed(() => {
  return baseColumns.filter(col => 
    columnVisibility.value[col.prop]
  )
})
</script>
```

### 使用 Expose 方法動態管理列
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

// 添加新列
const addColumn = () => {
  const newColumn = {
    label: '新列',
    prop: 'newField',
    cellRender: ({ row }) => <el-tag>動態列</el-tag>
  }
  tableRef.value?.appendColumn(newColumn)
}

// 刪除列
const removeColumn = (prop) => {
  tableRef.value?.removeColumn(prop)
}

// 獲取列配置
const getColumns = () => {
  const columns = tableRef.value?.getColumns()
  console.log('當前列配置:', columns)
}

// 重置列配置
const resetColumns = () => {
  const newColumns = [
    { label: '姓名', prop: 'name' },
    { label: '年齡', prop: 'age' }
  ]
  tableRef.value?.setColumns(newColumns)
}
</script>
```

### 動態列表單
```vue
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="添加列">
      <el-form :model="newColumn">
        <el-form-item label="列標題" required>
          <el-input v-model="newColumn.label" />
        </el-form-item>
        <el-form-item label="字段名" required>
          <el-input v-model="newColumn.prop" />
        </el-form-item>
        <el-form-item label="列寬度">
          <el-input v-model="newColumn.width" />
        </el-form-item>
        <el-form-item label="對齊方式">
          <el-select v-model="newColumn.align">
            <el-option label="居左" value="left" />
            <el-option label="居中" value="center" />
            <el-option label="居右" value="right" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
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
  // 驗證表單
  if (!newColumn.value.label || !newColumn.value.prop) {
    return
  }
  
  // 構建列配置
  const column = {
    label: newColumn.value.label,
    prop: newColumn.value.prop,
    align: newColumn.value.align,
    width: newColumn.value.width ? parseInt(newColumn.value.width) : undefined,
    cellRender: ({ row }) => row[newColumn.value.prop] || '--'
  }
  
  // 添加到表格
  tableRef.value?.appendColumn(column)
  
  // 重置表單
  newColumn.value = { label: '', prop: '', width: '', align: 'center' }
  dialogVisible.value = false
}
</script>
```

## API 參考

### Expose 方法

| 方法名 | 説明 | 參數 | 返回值 |
|-------|------|------|--------|
| `setColumns(columns)` | 重新設置表格列 | `MaTableColumns[]` | - |
| `getColumns()` | 獲取當前表格列配置 | - | `MaTableColumns[]` |
| `appendColumn(column)` | 追加新列到表格末尾 | `MaTableColumns` | - |
| `removeColumn(prop)` | 刪除指定屬性名的列 | `string` | - |
| `getColumnByProp(prop)` | 根據屬性名獲取列配置 | `string` | `MaTableColumns` |

### 動態列配置

```typescript
interface MaTableColumns {
  label: string           // 列標題
  prop: string           // 字段名
  width?: number         // 列寬度
  minWidth?: number      // 最小寬度
  align?: 'left' | 'center' | 'right'  // 對齊方式
  hide?: boolean         // 是否隱藏
  cellRender?: Function  // 自定義渲染
  // ... 其他 Element Plus 列屬性
}
```

## 使用場景

1. **個性化配置**: 用户可以根據需要顯示或隱藏特定列
2. **權限控制**: 根據用户權限動態顯示不同的列
3. **數據適配**: 根據不同的數據源動態調整列配置
4. **實時配置**: 運行時根據業務需求添加或刪除列
5. **列配置保存**: 保存用户的列配置偏好

## 最佳實踐

1. **狀態管理**: 使用響應式數據管理列的顯示狀態
2. **配置驗證**: 添加新列時驗證配置的完整性和唯一性
3. **用户體驗**: 提供直觀的列控制界面，如開關、多選框等
4. **數據同步**: 動態添加列時，確保數據中包含對應字段
5. **性能優化**: 避免頻繁的列操作，考慮批量更新

## 注意事項

- 動態刪除列時，對應的數據不會被刪除，只是不顯示
- 動態添加的列需要確保數據中有對應的字段，否則顯示為空
- 使用 `setColumns` 會完全替換現有列配置
- 列的 `prop` 屬性必須唯一，不能重複