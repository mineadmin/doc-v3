# 高級搜索

展示多種搜索組件類型和複雜搜索邏輯，包含日期範圍、數字範圍、多選等功能。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

## 功能特點

- **豐富的搜索組件**：支持 input、select、date-range、slider、checkbox 等
- **多條件組合**：支持複雜的搜索條件組合
- **搜索事件**：可監聽搜索提交和重置事件
- **默認展開**：可配置默認顯示的搜索項數量
- **響應式佈局**：搜索表單支持響應式佈局

## 搜索組件類型

### 基礎輸入組件
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

### 選擇器組件
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

### 數字範圍組件
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

### 日期範圍組件
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

### 滑塊組件
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

### 複選框組組件
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

### 單選框組組件
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

## 自定義渲染組件

### JSX 自定義渲染
對於複雜的輸入組件，可以使用 JSX 進行自定義渲染：

```javascript
// 需要在 script setup 中添加響應式數據
const formData = reactive({
  salaryMin: undefined,
  salaryMax: undefined
})

// 搜索項配置
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

### 組件配置要點
- `options` 數組直接配置在搜索項中，不需要嵌套在 `renderProps` 內
- `renderProps` 用於配置組件的其他屬性（如 placeholder、multiple 等）
- 自定義 JSX 渲染需要配合響應式數據使用
- 使用 `span` 屬性控制表單項佔據的列數

## 搜索配置

### 展示控制
```javascript
const options = {
  searchOptions: {
    showNumber: 3,      // 默認顯示3個搜索項
    layout: 'auto'      // 佈局模式：auto/inline/vertical
  }
}
```

### 搜索事件
```javascript
const options = {
  onSearchSubmit: (form) => {
    console.log('搜索條件:', form)
    // 可以對搜索條件進行預處理
    return form
  },
  onSearchReset: (form) => {
    console.log('重置搜索')
    return form
  }
}
```

## 高級表格列

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

高級搜索功能讓你可以構建複雜的查詢界面，滿足各種業務場景的搜索需求。