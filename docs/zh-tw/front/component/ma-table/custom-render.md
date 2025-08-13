# 自定義渲染

展示如何使用 cellRender 和 headerRender 進行自定義單元格和表頭渲染。

## 自定義渲染演示

<DemoPreview dir="demos/ma-table/custom-render" />

## 功能特性

### 渲染型別
- **單元格渲染**: 透過 `cellRender` 自定義單元格內容
- **表頭渲染**: 透過 `headerRender` 自定義表頭內容
- **JSX語法**: 支援 JSX 和 TSX 語法編寫渲染函式
- **元件渲染**: 可以渲染任意 Vue 元件

### 渲染引數
渲染函式接收 `TableColumnRenderer` 引數：
- `row`: 當前行資料
- `column`: 當前列配置
- `$index`: 當前行索引
- `options`: 列選項配置
- `attrs`: 其他屬性

## 配置示例

### 基礎單元格渲染
```javascript
const columns = [
  { 
    label: '頭像', 
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

### 進度條渲染
```javascript
const columns = [
  { 
    label: '技能等級', 
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

### 自定義表頭
```javascript
const columns = [
  { 
    label: '技能等級', 
    prop: 'skillLevel',
    headerRender: () => (
      <div style="display: flex; align-items: center; gap: 4px;">
        <span>⚡</span>
        <span style="color: #e74c3c;">技能等級</span>
      </div>
    )
  }
]
```

### 操作按鈕組
```javascript
const columns = [
  { 
    label: '操作', 
    prop: 'actions',
    cellRender: ({ row }) => (
      <div style="display: flex; gap: 8px;">
        <el-button size="small" type="primary" onClick={() => handleEdit(row)}>
          編輯
        </el-button>
        <el-button size="small" type="danger" onClick={() => handleDelete(row)}>
          刪除
        </el-button>
      </div>
    )
  }
]
```

### 狀態標籤渲染
```javascript
const columns = [
  { 
    label: '狀態', 
    prop: 'status',
    cellRender: ({ row }) => {
      const statusConfig = {
        'online': { type: 'success', icon: '🟢', text: '線上' },
        'busy': { type: 'warning', icon: '🟡', text: '忙碌' },
        'offline': { type: 'danger', icon: '🔴', text: '離線' }
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

### 複雜內容渲染
```javascript
const columns = [
  { 
    label: '使用者資訊', 
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

### 評分元件渲染
```javascript
const columns = [
  { 
    label: '評價', 
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

## 渲染函式型別定義

```typescript
interface TableColumnRenderer {
  row: any              // 當前行資料
  column: TableColumn   // 當前列配置  
  $index: number        // 當前行索引
  options: TableColumn  // 列選項
  attrs: any            // 其他屬性
}

type CellRenderFunction = (data: TableColumnRenderer) => VNode | string
type HeaderRenderFunction = (data: TableColumnRenderer) => VNode | string
```

## 最佳實踐

1. **效能考慮**: 避免在渲染函式中進行復雜計算，建議在資料處理階段預處理
2. **事件處理**: 渲染函式中的事件處理函式建議在元件外部定義，避免重複建立
3. **樣式控制**: 使用內聯樣式或CSS類來控制渲染內容的樣式
4. **元件複用**: 複雜的渲染邏輯可以抽取成獨立的元件進行復用
5. **型別安全**: 在TypeScript專案中，建議為渲染函式的引數新增型別註解

## 注意事項

- 渲染函式返回值可以是 VNode、字串或元件
- 支援所有 Element Plus 元件的渲染
- 可以在渲染函式中訪問和修改行資料
- 渲染函式中的事件需要手動處理
- 建議使用 JSX/TSX 語法以獲得更好的開發體驗