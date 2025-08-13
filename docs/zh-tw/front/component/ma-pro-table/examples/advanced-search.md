# 高階搜尋

展示多種搜尋元件型別和複雜搜尋邏輯，包含日期範圍、數字範圍、多選等功能。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

## 功能特點

- **豐富的搜尋元件**：支援 input、select、date-range、slider、checkbox 等
- **多條件組合**：支援複雜的搜尋條件組合
- **搜尋事件**：可監聽搜尋提交和重置事件
- **預設展開**：可配置預設顯示的搜尋項數量
- **響應式佈局**：搜尋表單支援響應式佈局

## 搜尋元件型別

### 基礎輸入元件
```javascript
{
  label: '姓名',
  prop: 'name',
  render: 'input',
  renderProps: {
    placeholder: '請輸入姓名',
    clearable: true
  }
}
```

### 選擇器元件
```javascript
// 單選
{
  label: '部門',
  prop: 'department',
  render: 'select',
  options: [
    { label: '技術部', value: '技術部' },
    { label: '產品部', value: '產品部' }
  ],
  renderProps: {
    placeholder: '請選擇部門'
  }
}

// 多選
{
  label: '部門',
  prop: 'departments',
  render: 'select',
  options: [
    { label: '技術部', value: '技術部' },
    { label: '產品部', value: '產品部' },
    { label: '設計部', value: '設計部' }
  ],
  renderProps: {
    multiple: true,
    placeholder: '請選擇部門'
  }
}
```

### 數字範圍元件
```javascript
{
  label: '薪資範圍',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="最低薪資"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="最高薪資"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
    </div>
  ),
  span: 2
}
```

### 日期範圍元件
```javascript
{
  label: '入職時間',
  prop: 'joinDateRange',
  render: 'date-picker',
  renderProps: {
    type: 'daterange',
    startPlaceholder: '開始日期',
    endPlaceholder: '結束日期',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  }
}
```

### 滑塊元件
```javascript
{
  label: '工作經驗',
  prop: 'experience',
  render: 'slider',
  renderProps: {
    min: 0,
    max: 15,
    range: true,
    marks: {
      0: '0年',
      5: '5年',
      10: '10年',
      15: '15年+'
    }
  }
}
```

### 複選框組元件
```javascript
{
  label: '職級',
  prop: 'level',
  render: 'checkbox-group',
  options: [
    { label: 'P4', value: 'P4' },
    { label: 'P5', value: 'P5' },
    { label: 'P6', value: 'P6' },
    { label: 'P7', value: 'P7' },
    { label: 'P8', value: 'P8' },
    { label: 'P9', value: 'P9' }
  ]
}
```

### 單選框組元件
```javascript
{
  label: '在職狀態',
  prop: 'status',
  render: 'radio-group',
  options: [
    { label: '全部', value: '' },
    { label: '在職', value: 1 },
    { label: '離職', value: 0 }
  ]
}
```

## 自定義渲染元件

### JSX 自定義渲染
對於複雜的輸入元件，可以使用 JSX 進行自定義渲染：

```javascript
// 需要在 script setup 中新增響應式資料
const formData = reactive({
  salaryMin: undefined,
  salaryMax: undefined
})

// 搜尋項配置
{
  label: '薪資範圍',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="最低薪資"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="最高薪資"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
    </div>
  ),
  span: 2  // 佔據兩列寬度
}
```

### 元件配置要點
- `options` 陣列直接配置在搜尋項中，不需要巢狀在 `renderProps` 內
- `renderProps` 用於配置元件的其他屬性（如 placeholder、multiple 等）
- 自定義 JSX 渲染需要配合響應式資料使用
- 使用 `span` 屬性控制表單項佔據的列數

## 搜尋配置

### 展示控制
```javascript
const options = {
  searchOptions: {
    showNumber: 3,      // 預設顯示3個搜尋項
    layout: 'auto'      // 佈局模式：auto/inline/vertical
  }
}
```

### 搜尋事件
```javascript
const options = {
  onSearchSubmit: (form) => {
    console.log('搜尋條件:', form)
    // 可以對搜尋條件進行預處理
    return form
  },
  onSearchReset: (form) => {
    console.log('重置搜尋')
    return form
  }
}
```

## 高階表格列

### 進度條顯示
```javascript
{
  label: '績效評分',
  prop: 'performance',
  width: 120,
  cellRender: ({ row }) => (
    <el-progress 
      percentage={row.performance} 
      color={row.performance >= 90 ? '#67c23a' : '#e6a23c'}
      stroke-width={8}
      text-inside
    />
  )
}
```

### 多標籤顯示
```javascript
{
  label: '技能標籤',
  prop: 'skills',
  width: 200,
  cellRender: ({ row }) => (
    <div>
      {row.skills.map((skill, index) => (
        <el-tag key={index} size="small" style="margin-right: 4px;">
          {skill}
        </el-tag>
      ))}
    </div>
  )
}
```

### 條件操作
```javascript
{
  type: 'operation',
  operationConfigure: {
    type: 'auto',
    fold: 2,               // 超過2個操作時摺疊
    actions: [
      {
        name: 'promote',
        text: '晉升',
        show: (data) => data.row.performance >= 85,  // 條件顯示
        onClick: (data) => {
          console.log('晉升員工:', data.row.name)
        }
      }
    ]
  }
}
```

高階搜尋功能讓你可以構建複雜的查詢介面，滿足各種業務場景的搜尋需求。