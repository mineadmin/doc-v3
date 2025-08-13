# 单元格渲染插件

展示各种单元格渲染插件的使用方法，包含内置插件和自定义插件。

<DemoPreview dir="demos/ma-pro-table-examples/cell-render-plugins" />

## 功能特点

- **插件机制**：通过插件系统扩展单元格渲染能力
- **内置插件**：提供常用的渲染插件（如标签、进度条等）
- **自定义插件**：支持注册自定义渲染插件
- **灵活配置**：支持动态属性配置和条件渲染
- **代码复用**：避免重复编写相同的渲染逻辑

## 内置插件

### Tag 标签插件
```javascript
{
  label: '状态',
  prop: 'status',
  cellRenderTo: {
    name: 'tag',
    props: (data) => ({
      type: data.row.status === 1 ? 'success' : 'danger'
    })
  },
  formatter: (row) => row.status === 1 ? '在职' : '离职'
}
```

## 自定义插件

### 注册插件
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { h } from 'vue'

const { addPlugin } = useProTableRenderPlugin()

// 注册进度条插件
addPlugin({
  name: 'progress',
  render: (data, props) => {
    return h(ElProgress, {
      percentage: data.row[data.column.property] || 0,
      color: props?.color || '#409eff',
      strokeWidth: props?.strokeWidth || 10,
      textInside: props?.textInside !== false,
      ...props
    })
  }
})
```

### 使用自定义插件
```javascript
{
  label: '工作进度',
  prop: 'progress',
  cellRenderTo: {
    name: 'progress',
    props: (data) => ({
      color: data.row.progress >= 90 ? '#67c23a' : '#e6a23c',
      strokeWidth: 12,
      textInside: true
    })
  }
}
```

## 常用插件示例

### 1. 进度条插件
```javascript
addPlugin({
  name: 'progress',
  render: (data, props) => {
    return h(ElProgress, {
      percentage: data.row[data.column.property] || 0,
      color: props?.color || '#409eff',
      strokeWidth: props?.strokeWidth || 10,
      textInside: props?.textInside !== false,
      ...props
    })
  }
})
```

### 2. 评分插件
```javascript
addPlugin({
  name: 'rate',
  render: (data, props) => {
    return h(ElRate, {
      modelValue: data.row[data.column.property] || 0,
      disabled: true,
      showScore: props?.showScore !== false,
      scoreTemplate: props?.scoreTemplate || '{value} 分',
      ...props
    })
  }
})
```

### 3. 图片插件
```javascript
addPlugin({
  name: 'image',
  render: (data, props) => {
    const src = data.row[data.column.property]
    if (!src) return '暂无图片'
    
    return h(ElImage, {
      src,
      style: { width: '60px', height: '40px' },
      fit: 'cover',
      previewSrcList: [src],
      ...props
    })
  }
})
```

### 4. 开关插件
```javascript
addPlugin({
  name: 'switch',
  render: (data, props, proxy) => {
    return h(ElSwitch, {
      modelValue: !!data.row[data.column.property],
      onChange: (value) => {
        // 处理开关变化
        console.log(`${data.row.name} 的状态已${value ? '开启' : '关闭'}`)
      },
      ...props
    })
  }
})
```

### 5. 链接插件
```javascript
addPlugin({
  name: 'link',
  render: (data, props) => {
    const text = data.row[data.column.property]
    return h(ElLink, {
      type: props?.type || 'primary',
      href: props?.href || '#',
      target: props?.target || '_blank',
      onClick: () => {
        if (props?.onClick) {
          props.onClick(data)
        }
      },
      ...props
    }, {
      default: () => text
    })
  }
})
```

### 6. 多标签插件
```javascript
addPlugin({
  name: 'tags',
  render: (data, props) => {
    const tags = data.row[data.column.property] || []
    if (!Array.isArray(tags)) return '无标签'
    
    return h('div', tags.map((tag, index) => 
      h('el-tag', {
        key: index,
        size: 'small',
        type: props?.type || 'primary',
        style: 'margin-right: 4px; margin-bottom: 2px;',
        ...props
      }, {
        default: () => tag
      })
    ))
  }
})
```

## 插件使用示例

### 头像显示
```javascript
{
  label: '头像',
  prop: 'avatar',
  width: 100,
  cellRenderTo: {
    name: 'image',
    props: {
      style: { width: '50px', height: '50px', borderRadius: '50%' }
    }
  }
}
```

### 技能标签
```javascript
{
  label: '技能标签',
  prop: 'skills',
  width: 200,
  cellRenderTo: {
    name: 'tags',
    props: {
      type: 'info'
    }
  }
}
```

### 能力评分
```javascript
{
  label: '能力评分',
  prop: 'rating',
  width: 150,
  cellRenderTo: {
    name: 'rate',
    props: {
      showScore: true,
      scoreTemplate: '{value} 分'
    }
  }
}
```

### 个人主页链接
```javascript
{
  label: '个人主页',
  prop: 'website',
  width: 120,
  cellRenderTo: {
    name: 'link',
    props: (data) => ({
      type: 'primary',
      href: data.row.website,
      target: '_blank',
      onClick: (linkData) => {
        console.log(`访问 ${linkData.row.name} 的主页`)
      }
    })
  },
  formatter: () => '访问主页'
}
```

## 插件管理

### 获取插件信息
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'

const { getPlugins, getPluginByName, removePlugin } = useProTableRenderPlugin()

// 获取所有插件
const allPlugins = getPlugins()

// 获取特定插件
const tagPlugin = getPluginByName('tag')

// 移除插件
removePlugin('custom-plugin')
```

### 插件参数说明
```javascript
// 插件定义
interface MaProTableRenderPlugin {
  name: string                    // 插件名称（唯一标识）
  render: (                       // 渲染函数
    data: TableColumnRenderer,    // 表格数据和列信息
    props: any,                   // 插件参数
    proxy: MaProTableExpose       // 表格实例
  ) => VNode | string
}

// 使用插件
{
  cellRenderTo: {
    name: 'plugin-name',          // 插件名称
    props: any | any[] | (data) => any  // 插件参数（支持动态计算）
  }
}
```

## 最佳实践

### 1. 插件命名
- 使用描述性的名称，如 `progress`、`image`、`tags`
- 避免与内置插件重名
- 如果要发布到应用市场，建议加上前缀

### 2. 性能优化
- 避免在 render 函数中进行复杂计算
- 使用 props 函数进行条件判断和属性计算
- 合理使用 Vue 的响应式特性

### 3. 错误处理
```javascript
addPlugin({
  name: 'safe-plugin',
  render: (data, props) => {
    try {
      // 插件逻辑
      return h(SomeComponent, props)
    } catch (error) {
      console.error('插件渲染错误:', error)
      return '渲染错误'
    }
  }
})
```

### 4. 类型安全
```typescript
// TypeScript 插件定义
import type { MaProTableRenderPlugin } from '@mineadmin/pro-table'

const myPlugin: MaProTableRenderPlugin = {
  name: 'my-plugin',
  render: (data, props) => {
    // 类型安全的插件逻辑
    return h('div', data.row[data.column.property])
  }
}
```

单元格渲染插件系统提供了强大的扩展能力，让你可以轻松构建丰富的表格展示效果。