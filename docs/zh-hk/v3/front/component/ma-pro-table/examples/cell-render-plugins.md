# 單元格渲染插件

展示各種單元格渲染插件的使用方法，包含內置插件和自定義插件。

<DemoPreview dir="demos/ma-pro-table-examples/cell-render-plugins" />

## 功能特點

- **插件機制**：通過插件系統擴展單元格渲染能力
- **內置插件**：提供常用的渲染插件（如標籤、進度條等）
- **自定義插件**：支持註冊自定義渲染插件
- **靈活配置**：支持動態屬性配置和條件渲染
- **代碼複用**：避免重複編寫相同的渲染邏輯

## 內置插件

### Tag 標籤插件
```javascript
{
  label: '狀態',
  prop: 'status',
  cellRenderTo: {
    name: 'tag',
    props: (data) => ({
      type: data.row.status === 1 ? 'success' : 'danger'
    })
  },
  formatter: (row) => row.status === 1 ? '在職' : '離職'
}
```

## 自定義插件

### 註冊插件
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { h } from 'vue'

const { addPlugin } = useProTableRenderPlugin()

// 註冊進度條插件
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

### 使用自定義插件
```javascript
{
  label: '工作進度',
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

### 1. 進度條插件
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

### 2. 評分插件
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

### 3. 圖片插件
```javascript
addPlugin({
  name: 'image',
  render: (data, props) => {
    const src = data.row[data.column.property]
    if (!src) return '暫無圖片'
    
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

### 4. 開關插件
```javascript
addPlugin({
  name: 'switch',
  render: (data, props, proxy) => {
    return h(ElSwitch, {
      modelValue: !!data.row[data.column.property],
      onChange: (value) => {
        // 處理開關變化
        console.log(`${data.row.name} 的狀態已${value ? '開啓' : '關閉'}`)
      },
      ...props
    })
  }
})
```

### 5. 鏈接插件
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

### 6. 多標籤插件
```javascript
addPlugin({
  name: 'tags',
  render: (data, props) => {
    const tags = data.row[data.column.property] || []
    if (!Array.isArray(tags)) return '無標籤'
    
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

### 頭像顯示
```javascript
{
  label: '頭像',
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

### 技能標籤
```javascript
{
  label: '技能標籤',
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

### 能力評分
```javascript
{
  label: '能力評分',
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

### 個人主頁鏈接
```javascript
{
  label: '個人主頁',
  prop: 'website',
  width: 120,
  cellRenderTo: {
    name: 'link',
    props: (data) => ({
      type: 'primary',
      href: data.row.website,
      target: '_blank',
      onClick: (linkData) => {
        console.log(`訪問 ${linkData.row.name} 的主頁`)
      }
    })
  },
  formatter: () => '訪問主頁'
}
```

## 插件管理

### 獲取插件信息
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'

const { getPlugins, getPluginByName, removePlugin } = useProTableRenderPlugin()

// 獲取所有插件
const allPlugins = getPlugins()

// 獲取特定插件
const tagPlugin = getPluginByName('tag')

// 移除插件
removePlugin('custom-plugin')
```

### 插件參數説明
```javascript
// 插件定義
interface MaProTableRenderPlugin {
  name: string                    // 插件名稱（唯一標識）
  render: (                       // 渲染函數
    data: TableColumnRenderer,    // 表格數據和列信息
    props: any,                   // 插件參數
    proxy: MaProTableExpose       // 表格實例
  ) => VNode | string
}

// 使用插件
{
  cellRenderTo: {
    name: 'plugin-name',          // 插件名稱
    props: any | any[] | (data) => any  // 插件參數（支持動態計算）
  }
}
```

## 最佳實踐

### 1. 插件命名
- 使用描述性的名稱，如 `progress`、`image`、`tags`
- 避免與內置插件重名
- 如果要發佈到應用市場，建議加上前綴

### 2. 性能優化
- 避免在 render 函數中進行復雜計算
- 使用 props 函數進行條件判斷和屬性計算
- 合理使用 Vue 的響應式特性

### 3. 錯誤處理
```javascript
addPlugin({
  name: 'safe-plugin',
  render: (data, props) => {
    try {
      // 插件邏輯
      return h(SomeComponent, props)
    } catch (error) {
      console.error('插件渲染錯誤:', error)
      return '渲染錯誤'
    }
  }
})
```

### 4. 類型安全
```typescript
// TypeScript 插件定義
import type { MaProTableRenderPlugin } from '@mineadmin/pro-table'

const myPlugin: MaProTableRenderPlugin = {
  name: 'my-plugin',
  render: (data, props) => {
    // 類型安全的插件邏輯
    return h('div', data.row[data.column.property])
  }
}
```

單元格渲染插件系統提供了強大的擴展能力，讓你可以輕鬆構建豐富的表格展示效果。