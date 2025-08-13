# 高级搜索

展示多种搜索组件类型和复杂搜索逻辑，包含日期范围、数字范围、多选等功能。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

## 功能特点

- **丰富的搜索组件**：支持 input、select、date-range、slider、checkbox 等
- **多条件组合**：支持复杂的搜索条件组合
- **搜索事件**：可监听搜索提交和重置事件
- **默认展开**：可配置默认显示的搜索项数量
- **响应式布局**：搜索表单支持响应式布局

## 搜索组件类型

### 基础输入组件
```javascript
{
  label: '姓名',
  prop: 'name',
  render: 'input',
  renderProps: {
    placeholder: '请输入姓名',
    clearable: true
  }
}
```

### 选择器组件
```javascript
// 单选
{
  label: '部门',
  prop: 'department',
  render: 'select',
  options: [
    { label: '技术部', value: '技术部' },
    { label: '产品部', value: '产品部' }
  ],
  renderProps: {
    placeholder: '请选择部门'
  }
}

// 多选
{
  label: '部门',
  prop: 'departments',
  render: 'select',
  options: [
    { label: '技术部', value: '技术部' },
    { label: '产品部', value: '产品部' },
    { label: '设计部', value: '设计部' }
  ],
  renderProps: {
    multiple: true,
    placeholder: '请选择部门'
  }
}
```

### 数字范围组件
```javascript
{
  label: '薪资范围',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="最低薪资"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="最高薪资"
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

### 日期范围组件
```javascript
{
  label: '入职时间',
  prop: 'joinDateRange',
  render: 'date-picker',
  renderProps: {
    type: 'daterange',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  }
}
```

### 滑块组件
```javascript
{
  label: '工作经验',
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

### 复选框组组件
```javascript
{
  label: '职级',
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

### 单选框组组件
```javascript
{
  label: '在职状态',
  prop: 'status',
  render: 'radio-group',
  options: [
    { label: '全部', value: '' },
    { label: '在职', value: 1 },
    { label: '离职', value: 0 }
  ]
}
```

## 自定义渲染组件

### JSX 自定义渲染
对于复杂的输入组件，可以使用 JSX 进行自定义渲染：

```javascript
// 需要在 script setup 中添加响应式数据
const formData = reactive({
  salaryMin: undefined,
  salaryMax: undefined
})

// 搜索项配置
{
  label: '薪资范围',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="最低薪资"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="最高薪资"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
    </div>
  ),
  span: 2  // 占据两列宽度
}
```

### 组件配置要点
- `options` 数组直接配置在搜索项中，不需要嵌套在 `renderProps` 内
- `renderProps` 用于配置组件的其他属性（如 placeholder、multiple 等）
- 自定义 JSX 渲染需要配合响应式数据使用
- 使用 `span` 属性控制表单项占据的列数

## 搜索配置

### 展示控制
```javascript
const options = {
  searchOptions: {
    showNumber: 3,      // 默认显示3个搜索项
    layout: 'auto'      // 布局模式：auto/inline/vertical
  }
}
```

### 搜索事件
```javascript
const options = {
  onSearchSubmit: (form) => {
    console.log('搜索条件:', form)
    // 可以对搜索条件进行预处理
    return form
  },
  onSearchReset: (form) => {
    console.log('重置搜索')
    return form
  }
}
```

## 高级表格列

### 进度条显示
```javascript
{
  label: '绩效评分',
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

### 多标签显示
```javascript
{
  label: '技能标签',
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

### 条件操作
```javascript
{
  type: 'operation',
  operationConfigure: {
    type: 'auto',
    fold: 2,               // 超过2个操作时折叠
    actions: [
      {
        name: 'promote',
        text: '晋升',
        show: (data) => data.row.performance >= 85,  // 条件显示
        onClick: (data) => {
          console.log('晋升员工:', data.row.name)
        }
      }
    ]
  }
}
```

高级搜索功能让你可以构建复杂的查询界面，满足各种业务场景的搜索需求。