# 动态列管理

展示如何动态控制列的显示隐藏、添加删除列，以及使用 Expose 方法进行列管理。

## 动态列演示

<DemoPreview dir="demos/ma-table/dynamic-columns" />

## 功能特性

### 列控制方式
- **显示隐藏**: 通过响应式数据控制列的显示状态
- **动态添加**: 运行时向表格添加新的列
- **动态删除**: 删除不需要的列
- **列配置获取**: 获取当前列的配置信息

### Expose 方法
ma-table 提供了完整的列管理 API：
- `setColumns()`: 重新设置所有列
- `getColumns()`: 获取当前列配置
- `appendColumn()`: 追加新列
- `removeColumn()`: 删除指定列
- `getColumnByProp()`: 根据属性名获取列配置

## 使用示例

### 列显示控制
```vue
<template>
  <div>
    <!-- 列控制开关 -->
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

// 列显示状态
const columnVisibility = ref({
  name: true,
  age: true,
  email: true,
  department: false
})

// 基础列配置
const baseColumns = [
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
  { label: '邮箱', prop: 'email' },
  { label: '部门', prop: 'department' }
]

// 计算可见列
const visibleColumns = computed(() => {
  return baseColumns.filter(col => 
    columnVisibility.value[col.prop]
  )
})
</script>
```

### 使用 Expose 方法动态管理列
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
    cellRender: ({ row }) => <el-tag>动态列</el-tag>
  }
  tableRef.value?.appendColumn(newColumn)
}

// 删除列
const removeColumn = (prop) => {
  tableRef.value?.removeColumn(prop)
}

// 获取列配置
const getColumns = () => {
  const columns = tableRef.value?.getColumns()
  console.log('当前列配置:', columns)
}

// 重置列配置
const resetColumns = () => {
  const newColumns = [
    { label: '姓名', prop: 'name' },
    { label: '年龄', prop: 'age' }
  ]
  tableRef.value?.setColumns(newColumns)
}
</script>
```

### 动态列表单
```vue
<template>
  <div>
    <el-dialog v-model="dialogVisible" title="添加列">
      <el-form :model="newColumn">
        <el-form-item label="列标题" required>
          <el-input v-model="newColumn.label" />
        </el-form-item>
        <el-form-item label="字段名" required>
          <el-input v-model="newColumn.prop" />
        </el-form-item>
        <el-form-item label="列宽度">
          <el-input v-model="newColumn.width" />
        </el-form-item>
        <el-form-item label="对齐方式">
          <el-select v-model="newColumn.align">
            <el-option label="居左" value="left" />
            <el-option label="居中" value="center" />
            <el-option label="居右" value="right" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddColumn">确定</el-button>
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
  // 验证表单
  if (!newColumn.value.label || !newColumn.value.prop) {
    return
  }
  
  // 构建列配置
  const column = {
    label: newColumn.value.label,
    prop: newColumn.value.prop,
    align: newColumn.value.align,
    width: newColumn.value.width ? parseInt(newColumn.value.width) : undefined,
    cellRender: ({ row }) => row[newColumn.value.prop] || '--'
  }
  
  // 添加到表格
  tableRef.value?.appendColumn(column)
  
  // 重置表单
  newColumn.value = { label: '', prop: '', width: '', align: 'center' }
  dialogVisible.value = false
}
</script>
```

## API 参考

### Expose 方法

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|--------|
| `setColumns(columns)` | 重新设置表格列 | `MaTableColumns[]` | - |
| `getColumns()` | 获取当前表格列配置 | - | `MaTableColumns[]` |
| `appendColumn(column)` | 追加新列到表格末尾 | `MaTableColumns` | - |
| `removeColumn(prop)` | 删除指定属性名的列 | `string` | - |
| `getColumnByProp(prop)` | 根据属性名获取列配置 | `string` | `MaTableColumns` |

### 动态列配置

```typescript
interface MaTableColumns {
  label: string           // 列标题
  prop: string           // 字段名
  width?: number         // 列宽度
  minWidth?: number      // 最小宽度
  align?: 'left' | 'center' | 'right'  // 对齐方式
  hide?: boolean         // 是否隐藏
  cellRender?: Function  // 自定义渲染
  // ... 其他 Element Plus 列属性
}
```

## 使用场景

1. **个性化配置**: 用户可以根据需要显示或隐藏特定列
2. **权限控制**: 根据用户权限动态显示不同的列
3. **数据适配**: 根据不同的数据源动态调整列配置
4. **实时配置**: 运行时根据业务需求添加或删除列
5. **列配置保存**: 保存用户的列配置偏好

## 最佳实践

1. **状态管理**: 使用响应式数据管理列的显示状态
2. **配置验证**: 添加新列时验证配置的完整性和唯一性
3. **用户体验**: 提供直观的列控制界面，如开关、多选框等
4. **数据同步**: 动态添加列时，确保数据中包含对应字段
5. **性能优化**: 避免频繁的列操作，考虑批量更新

## 注意事项

- 动态删除列时，对应的数据不会被删除，只是不显示
- 动态添加的列需要确保数据中有对应的字段，否则显示为空
- 使用 `setColumns` 会完全替换现有列配置
- 列的 `prop` 属性必须唯一，不能重复