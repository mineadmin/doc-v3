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
  renderProps: {
    options: [
      { label: '技術部', value: '技術部' },
      { label: '產品部', value: '產品部' }
    ]
  }
}

// 多選
{
  label: '部門',
  prop: 'departments',
  render: 'select',
  renderProps: {
    multiple: true,
    options: [...options]
  }
}
```

### 數字範圍組件
```javascript
{
  label: '薪資範圍',
  prop: 'salaryRange',
  render: 'input-number-range',
  renderProps: {
    startPlaceholder: '最低薪資',
    endPlaceholder: '最高薪資',
    min: 0,
    max: 100000
  }
}
```

### 日期範圍組件
```javascript
{
  label: '入職時間',
  prop: 'joinDateRange',
  render: 'date-range',
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
  renderProps: {
    options: [
      { label: 'P4', value: 'P4' },
      { label: 'P5', value: 'P5' },
      { label: 'P6', value: 'P6' }
    ]
  }
}
```

### 單選框組組件
```javascript
{
  label: '在職狀態',
  prop: 'status',
  render: 'radio-group',
  renderProps: {
    options: [
      { label: '全部', value: '' },
      { label: '在職', value: 1 },
      { label: '離職', value: 0 }
    ]
  }
}
```

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