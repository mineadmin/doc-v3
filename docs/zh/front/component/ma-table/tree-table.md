# 树形表格

展示层级结构数据，支持展开收起、懒加载、自定义图标等功能。

## 树形表格演示

<DemoPreview dir="demos/ma-table/tree-table" />

## 功能特性

### 层级结构
- **多级嵌套**: 支持任意层级的树形数据展示
- **展开控制**: 可控制节点的展开和收起状态
- **默认展开**: 支持设置默认展开的节点
- **懒加载**: 支持节点的懒加载机制

### 视觉标识
- **层级缩进**: 自动根据层级添加缩进
- **展开图标**: 提供默认的展开收起图标
- **自定义图标**: 支持为每个节点自定义图标
- **状态标识**: 可以为不同状态的节点添加视觉标识

## 配置示例

### 基础树形配置
```javascript
const options = {
  rowKey: 'id',                    // 行数据的 Key
  defaultExpandAll: false,         // 是否默认展开所有行
  treeProps: {
    children: 'children',          // 指定子节点字段名
    hasChildren: 'hasChildren'     // 指定是否存在子节点字段名
  }
}
```

### 默认展开指定节点
```javascript
const options = {
  rowKey: 'id',
  expandRowKeys: [1, 2, 3],       // 默认展开的行的 key 数组
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}
```

### 懒加载配置
```javascript
const options = {
  rowKey: 'id',
  lazy: true,                     // 开启懒加载
  load: async (row, treeNode, resolve) => {
    // 异步加载子节点数据
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

### 树形数据结构
```javascript
const treeData = [
  {
    id: 1,
    name: '总公司',
    manager: '张总',
    children: [
      {
        id: 11,
        name: '技术部',
        manager: '李技术',
        children: [
          {
            id: 111,
            name: '前端组',
            manager: '王前端',
            children: []
          },
          {
            id: 112,
            name: '后端组',
            manager: '赵后端',
            children: []
          }
        ]
      }
    ]
  }
]
```

### 自定义节点渲染
```javascript
const columns = [
  {
    label: '部门名称',
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

## 树形表格参数

### 基础参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `rowKey` | 行数据的 Key，用来优化 Table 的渲染 | `string \| Function(row): string` | - |
| `defaultExpandAll` | 是否默认展开所有行 | `boolean` | `false` |
| `expandRowKeys` | 可以通过该属性设置目前的展开行 | `array` | - |
| `treeProps` | 渲染嵌套数据的配置选项 | `object` | - |

### 懒加载参数

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `lazy` | 是否懒加载子节点数据 | `boolean` | `false` |
| `load` | 加载子节点数据的函数 | `Function(row, treeNode, resolve)` | - |
| `indent` | 相邻级节点间的水平缩进，单位为像素 | `number` | `16` |

### treeProps 配置

| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
| `children` | 指定子树为节点对象的某个属性值 | `string` | `'children'` |
| `hasChildren` | 指定节点对象是否为叶子节点的标志 | `string` | `'hasChildren'` |

## 树形表格事件

| 事件名 | 说明 | 参数 |
|-------|------|------|
| `expand` | 当用户对某一行展开或者关闭的时候会触发该事件 | `(row, expanded)` |

## 树形表格方法

| 方法名 | 说明 | 参数 |
|-------|------|------|
| `toggleRowExpansion` | 用于可展开表格或树表格，切换某一行的展开状态 | `(row, expanded)` |

## 使用示例

### 部门组织架构
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
    label: '部门名称',
    prop: 'name',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>{row.icon}</span>
        <span>{row.name}</span>
      </div>
    )
  },
  { label: '负责人', prop: 'manager' },
  { label: '员工数', prop: 'employeeCount' }
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
      console.log(`${row.name} ${expanded ? '展开' : '收起'}`)
    }
  }
}

// 展开所有节点
const expandAll = () => {
  // 获取所有节点ID
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

// 收起所有节点
const collapseAll = () => {
  treeOptions.expandRowKeys = []
}
</script>
```

### 懒加载示例
```vue
<script setup>
const lazyTreeOptions = {
  rowKey: 'id',
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      // 模拟异步加载
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const children = await fetchChildrenData(row.id)
      resolve(children)
    } catch (error) {
      console.error('加载子节点失败:', error)
      resolve([])
    }
  },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
}

const fetchChildrenData = async (parentId) => {
  // 模拟API调用
  const response = await api.getChildren(parentId)
  return response.data
}
</script>
```

## 最佳实践

1. **数据结构**: 确保树形数据具有正确的父子关系和唯一的 ID
2. **性能优化**: 对于大量数据，建议使用懒加载机制
3. **用户体验**: 提供明确的加载状态和展开收起反馈
4. **层级控制**: 合理控制树形结构的层级深度，避免过深的嵌套
5. **操作交互**: 为树形节点提供合适的操作按钮和右键菜单

## 注意事项

- `rowKey` 是必需的，用于唯一标识每一行数据
- 懒加载模式下，`hasChildren` 字段用于判断节点是否有子节点
- 展开状态通过 `expandRowKeys` 控制，需要保证数组中的值与 `rowKey` 对应
- 树形数据的修改需要保持数据结构的完整性