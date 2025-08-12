# 樹形表格

展示層級結構數據，支持展開收起、懶加載、自定義圖標等功能。

## 樹形表格演示

<DemoPreview dir="demos/ma-table/tree-table" />

## 功能特性

### 層級結構
- **多級嵌套**: 支持任意層級的樹形數據展示
- **展開控制**: 可控制節點的展開和收起狀態
- **默認展開**: 支持設置默認展開的節點
- **懶加載**: 支持節點的懶加載機制

### 視覺標識
- **層級縮進**: 自動根據層級添加縮進
- **展開圖標**: 提供默認的展開收起圖標
- **自定義圖標**: 支持為每個節點自定義圖標
- **狀態標識**: 可以為不同狀態的節點添加視覺標識

## 配置示例

### 基礎樹形配置
```javascript
const options = {
  rowKey: 'id',                    // 行數據的 Key
  defaultExpandAll: false,         // 是否默認展開所有行
  treeProps: {
    children: 'children',          // 指定子節點字段名
    hasChildren: 'hasChildren'     // 指定是否存在子節點字段名
  }
}
```

### 默認展開指定節點
```javascript
const options = {
  rowKey: 'id',
  expandRowKeys: [1, 2, 3],       // 默認展開的行的 key 數組
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### 懶加載配置
```javascript
const options = {
  rowKey: 'id',
  lazy: true,                     // 開啓懶加載
  load: async (row, treeNode, resolve) => {
    // 異步加載子節點數據
    try {
      const children = await loadChildrenData(row.id)
      resolve(children)
    } catch (error) {
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### 樹形數據結構
```javascript
const treeData = [
  {
    id: 1,
    name: '總公司',
    manager: '張總',
    children: [
      {
        id: 11,
        name: '技術部',
        manager: '李技術',
        children: [
          {
            id: 111,
            name: '前端組',
            manager: '王前端',
            children: []
          },
          {
            id: 112,
            name: '後端組',
            manager: '趙後端',
            children: []
          }
        ]
      }
    ]
  }
]
```

### 自定義節點渲染
```javascript
const columns = [
  {
    label: '部門名稱',
    prop: 'name',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">{row.icon}</span>
        <span style={`font-weight: ${row.children?.length ? 'bold' : 'normal'}`}>
          {row.name}
        </span>
        {row.isNew && <el-tag size="small" type="success">新</el-tag>}
      </div>
    )
  }
]
```

## 樹形表格參數

### 基礎參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `rowKey` | 行數據的 Key，用來優化 Table 的渲染 | `string \| Function(row): string` | - |
| `defaultExpandAll` | 是否默認展開所有行 | `boolean` | `false` |
| `expandRowKeys` | 可以通過該屬性設置目前的展開行 | `array` | - |
| `treeProps` | 渲染嵌套數據的配置選項 | `object` | - |

### 懶加載參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `lazy` | 是否懶加載子節點數據 | `boolean` | `false` |
| `load` | 加載子節點數據的函數 | `Function(row, treeNode, resolve)` | - |
| `indent` | 相鄰級節點間的水平縮進，單位為像素 | `number` | `16` |

### treeProps 配置

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `children` | 指定子樹為節點對象的某個屬性值 | `string` | `'children'` |
| `hasChildren` | 指定節點對象是否為葉子節點的標誌 | `string` | `'hasChildren'` |

## 樹形表格事件

| 事件名 | 説明 | 參數 |
|-------|------|------|
| `expand` | 當用户對某一行展開或者關閉的時候會觸發該事件 | `(row, expanded)` |

## 樹形表格方法

| 方法名 | 説明 | 參數 |
|-------|------|------|
| `toggleRowExpansion` | 用於可展開表格或樹表格，切換某一行的展開狀態 | `(row, expanded)` |

## 使用示例

### 部門組織架構
```vue
<template>
  <ma-table
    ref="tableRef"
    :columns="columns"
    :data="departmentData"
    :options="treeOptions"
  />
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

const columns = [
  {
    label: '部門名稱',
    prop: 'name',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>{row.icon}</span>
        <span>{row.name}</span>
      </div>
    )
  },
  { label: '負責人', prop: 'manager' },
  { label: '員工數', prop: 'employeeCount' }
]

const treeOptions = {
  rowKey: 'id',
  defaultExpandAll: false,
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  },
  on: {
    onExpand: (row, expanded) => {
      console.log(`${row.name} ${expanded ? '展開' : '收起'}`)
    }
  }
}

// 展開所有節點
const expandAll = () => {
  // 獲取所有節點ID
  const getAllIds = (nodes) => {
    const ids = []
    nodes.forEach(node => {
      ids.push(node.id)
      if (node.children?.length) {
        ids.push(...getAllIds(node.children))
      }
    })
    return ids
  }
  
  treeOptions.expandRowKeys = getAllIds(departmentData)
}

// 收起所有節點
const collapseAll = () => {
  treeOptions.expandRowKeys = []
}
</script>
```

### 懶加載示例
```vue
<script setup>
const lazyTreeOptions = {
  rowKey: 'id',
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      // 模擬異步加載
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const children = await fetchChildrenData(row.id)
      resolve(children)
    } catch (error) {
      console.error('加載子節點失敗:', error)
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}

const fetchChildrenData = async (parentId) => {
  // 模擬API調用
  const response = await api.getChildren(parentId)
  return response.data
}
</script>
```

## 最佳實踐

1. **數據結構**: 確保樹形數據具有正確的父子關係和唯一的 ID
2. **性能優化**: 對於大量數據，建議使用懶加載機制
3. **用户體驗**: 提供明確的加載狀態和展開收起反饋
4. **層級控制**: 合理控制樹形結構的層級深度，避免過深的嵌套
5. **操作交互**: 為樹形節點提供合適的操作按鈕和右鍵菜單

## 注意事項

- `rowKey` 是必需的，用於唯一標識每一行數據
- 懶加載模式下，`hasChildren` 字段用於判斷節點是否有子節點
- 展開狀態通過 `expandRowKeys` 控制，需要保證數組中的值與 `rowKey` 對應
- 樹形數據的修改需要保持數據結構的完整性