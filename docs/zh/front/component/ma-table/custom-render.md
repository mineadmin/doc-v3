# 自定义渲染

展示如何使用 cellRender 和 headerRender 进行自定义单元格和表头渲染。

## 自定义渲染演示

<DemoPreview dir="demos/ma-table/custom-render" />

## 功能特性

### 渲染类型
- **单元格渲染**: 通过 `cellRender` 自定义单元格内容
- **表头渲染**: 通过 `headerRender` 自定义表头内容
- **JSX语法**: 支持 JSX 和 TSX 语法编写渲染函数
- **组件渲染**: 可以渲染任意 Vue 组件

### 渲染参数
渲染函数接收 `TableColumnRenderer` 参数：
- `row`: 当前行数据
- `column`: 当前列配置
- `$index`: 当前行索引
- `options`: 列选项配置
- `attrs`: 其他属性

## 配置示例

### 基础单元格渲染
```javascript
const columns = [
  { 
    label: '头像', 
    prop: 'avatar',
    cellRender: ({ row }) => (
      <el-image
        style="width: 40px; height: 40px; border-radius: 50%;"
        src={row.avatar}
        fit="cover"
      />
    )
  }
]
```

### 进度条渲染
```javascript
const columns = [
  { 
    label: '技能等级', 
    prop: 'skillLevel',
    cellRender: ({ row }) => (
      <el-progress
        percentage={row.skillLevel}
        color={row.skillLevel >= 80 ? '#67c23a' : '#e6a23c'}
        stroke-width={8}
        text-inside
      />
    )
  }
]
```

### 自定义表头
```javascript
const columns = [
  { 
    label: '技能等级', 
    prop: 'skillLevel',
    headerRender: () => (
      <div style="display: flex; align-items: center; gap: 4px;">
        <span>⚡</span>
        <span style="color: #e74c3c;">技能等级</span>
      </div>
    )
  }
]
```

### 操作按钮组
```javascript
const columns = [
  { 
    label: '操作', 
    prop: 'actions',
    cellRender: ({ row }) => (
      <div style="display: flex; gap: 8px;">
        <el-button size="small" type="primary" onClick={() => handleEdit(row)}>
          编辑
        </el-button>
        <el-button size="small" type="danger" onClick={() => handleDelete(row)}>
          删除
        </el-button>
      </div>
    )
  }
]
```

### 状态标签渲染
```javascript
const columns = [
  { 
    label: '状态', 
    prop: 'status',
    cellRender: ({ row }) => {
      const statusConfig = {
        'online': { type: 'success', icon: '🟢', text: '在线' },
        'busy': { type: 'warning', icon: '🟡', text: '忙碌' },
        'offline': { type: 'danger', icon: '🔴', text: '离线' }
      }
      const config = statusConfig[row.status]
      return (
        <el-tag type={config.type}>
          <span style="margin-right: 4px;">{config.icon}</span>
          {config.text}
        </el-tag>
      )
    }
  }
]
```

### 复杂内容渲染
```javascript
const columns = [
  { 
    label: '用户信息', 
    prop: 'userInfo',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 12px;">
        <el-avatar size={40} src={row.avatar}>
          {row.name.charAt(0)}
        </el-avatar>
        <div>
          <div style="font-weight: bold; color: #333;">
            {row.name}
          </div>
          <div style="font-size: 12px; color: #999;">
            {row.email}
          </div>
        </div>
      </div>
    )
  }
]
```

### 评分组件渲染
```javascript
const columns = [
  { 
    label: '评价', 
    prop: 'rating',
    cellRender: ({ row }) => (
      <el-rate
        v-model={row.rating}
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value} 分"
      />
    )
  }
]
```

## 渲染函数类型定义

```typescript
interface TableColumnRenderer {
  row: any              // 当前行数据
  column: TableColumn   // 当前列配置  
  $index: number        // 当前行索引
  options: TableColumn  // 列选项
  attrs: any            // 其他属性
}

type CellRenderFunction = (data: TableColumnRenderer) => VNode | string
type HeaderRenderFunction = (data: TableColumnRenderer) => VNode | string
```

## 最佳实践

1. **性能考虑**: 避免在渲染函数中进行复杂计算，建议在数据处理阶段预处理
2. **事件处理**: 渲染函数中的事件处理函数建议在组件外部定义，避免重复创建
3. **样式控制**: 使用内联样式或CSS类来控制渲染内容的样式
4. **组件复用**: 复杂的渲染逻辑可以抽取成独立的组件进行复用
5. **类型安全**: 在TypeScript项目中，建议为渲染函数的参数添加类型注解

## 注意事项

- 渲染函数返回值可以是 VNode、字符串或组件
- 支持所有 Element Plus 组件的渲染
- 可以在渲染函数中访问和修改行数据
- 渲染函数中的事件需要手动处理
- 建议使用 JSX/TSX 语法以获得更好的开发体验