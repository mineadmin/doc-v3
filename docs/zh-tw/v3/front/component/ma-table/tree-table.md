# 樹形表格

展示層級結構資料，支援展開收起、懶載入、自定義圖示等功能。

## 樹形表格演示

<DemoPreview dir="demos/ma-table/tree-table" />

## 功能特性

### 層級結構
- **多級巢狀**: 支援任意層級的樹形資料展示
- **展開控制**: 可控制節點的展開和收起狀態
- **預設展開**: 支援設定預設展開的節點
- **懶載入**: 支援節點的懶載入機制

### 視覺標識
- **層級縮排**: 自動根據層級新增縮排
- **展開圖示**: 提供預設的展開收起圖示
- **自定義圖示**: 支援為每個節點自定義圖示
- **狀態標識**: 可以為不同狀態的節點新增視覺標識

## 配置示例

### 基礎樹形配置
```javascript
const options = {
  rowKey: 'id',                    // 行資料的 Key
  defaultExpandAll: false,         // 是否預設展開所有行
  treeProps: {
    children: 'children',          // 指定子節點欄位名
    hasChildren: 'hasChildren'     // 指定是否存在子節點欄位名
  }
}
```

### 預設展開指定節點
```javascript
const options = {
  rowKey: 'id',
  expandRowKeys: [1, 2, 3],       // 預設展開的行的 key 陣列
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### 懶載入配置
```javascript
const options = {
  rowKey: 'id',
  lazy: true,                     // 開啟懶載入
  load: async (row, treeNode, resolve) => {
    // 非同步載入子節點資料
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

### 樹形資料結構
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

## 樹形表格引數

### 基礎引數

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `rowKey` | 行資料的 Key，用來最佳化 Table 的渲染 | `string \| Function(row): string` | - |
| `defaultExpandAll` | 是否預設展開所有行 | `boolean` | `false` |
| `expandRowKeys` | 可以透過該屬性設定目前的展開行 | `array` | - |
| `treeProps` | 渲染巢狀資料的配置選項 | `object` | - |

### 懶載入引數

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `lazy` | 是否懶載入子節點資料 | `boolean` | `false` |
| `load` | 載入子節點資料的函式 | `Function(row, treeNode, resolve)` | - |
| `indent` | 相鄰級節點間的水平縮排，單位為畫素 | `number` | `16` |

### treeProps 配置

| 引數 | 說明 | 型別 | 預設值 |
|-----|------|-----|--------|
| `children` | 指定子樹為節點物件的某個屬性值 | `string` | `'children'` |
| `hasChildren` | 指定節點物件是否為葉子節點的標誌 | `string` | `'hasChildren'` |

## 樹形表格事件

| 事件名 | 說明 | 引數 |
|-------|------|------|
| `expand` | 當用戶對某一行展開或者關閉的時候會觸發該事件 | `(row, expanded)` |

## 樹形表格方法

| 方法名 | 說明 | 引數 |
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

### 懶載入示例
```vue
<script setup>
const lazyTreeOptions = {
  rowKey: 'id',
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      // 模擬非同步載入
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const children = await fetchChildrenData(row.id)
      resolve(children)
    } catch (error) {
      console.error('載入子節點失敗:', error)
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}

const fetchChildrenData = async (parentId) => {
  // 模擬API呼叫
  const response = await api.getChildren(parentId)
  return response.data
}
</script>
```

## 最佳實踐

1. **資料結構**: 確保樹形資料具有正確的父子關係和唯一的 ID
2. **效能最佳化**: 對於大量資料，建議使用懶載入機制
3. **使用者體驗**: 提供明確的載入狀態和展開收起反饋
4. **層級控制**: 合理控制樹形結構的層級深度，避免過深的巢狀
5. **操作互動**: 為樹形節點提供合適的操作按鈕和右鍵選單

## 注意事項

- `rowKey` 是必需的，用於唯一標識每一行資料
- 懶載入模式下，`hasChildren` 欄位用於判斷節點是否有子節點
- 展開狀態透過 `expandRowKeys` 控制，需要保證陣列中的值與 `rowKey` 對應
- 樹形資料的修改需要保持資料結構的完整性