# Advanced Search

Demonstrates various search component types and complex search logic, including date ranges, numeric ranges, multi-select functionality, and more.

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

## Features

- **Rich Search Components**: Supports input, select, date-range, slider, checkbox, etc.
- **Multi-Condition Combination**: Allows complex search condition combinations.
- **Search Events**: Listen for search submission and reset events.
- **Default Expansion**: Configurable number of search items to display by default.
- **Responsive Layout**: Search forms support responsive layouts.

## Search Component Types

### Basic Input Component
```javascript
{
  label: 'Name',
  prop: 'name',
  render: 'input',
  renderProps: {
    placeholder: 'Please enter name',
    clearable: true
  }
}
```

### Selector Component
```javascript
// Single select
{
  label: 'Department',
  prop: 'department',
  render: 'select',
  options: [
    { label: 'Tech', value: 'Tech' },
    { label: 'Product', value: 'Product' }
  ],
  renderProps: {
    placeholder: 'Please select department'
  }
}

// Multi-select
{
  label: 'Departments',
  prop: 'departments',
  render: 'select',
  options: [
    { label: 'Tech', value: 'Tech' },
    { label: 'Product', value: 'Product' },
    { label: 'Design', value: 'Design' }
  ],
  renderProps: {
    multiple: true,
    placeholder: 'Please select departments'
  }
}
```

### Numeric Range Component
```javascript
{
  label: 'Salary Range',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="Min salary"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="Max salary"
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

### Date Range Component
```javascript
{
  label: 'Join Date Range',
  prop: 'joinDateRange',
  render: 'date-picker',
  renderProps: {
    type: 'daterange',
    startPlaceholder: 'Start date',
    endPlaceholder: 'End date',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  }
}
```

### Slider Component
```javascript
{
  label: 'Experience',
  prop: 'experience',
  render: 'slider',
  renderProps: {
    min: 0,
    max: 15,
    range: true,
    marks: {
      0: '0 years',
      5: '5 years',
      10: '10 years',
      15: '15+ years'
    }
  }
}
```

### Checkbox Group Component
```javascript
{
  label: 'Level',
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

### Radio Group Component
```javascript
{
  label: 'Employment Status',
  prop: 'status',
  render: 'radio-group',
  options: [
    { label: 'All', value: '' },
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
  ]
}
```

## Custom Rendering Components

### JSX Custom Rendering
For complex input components, use JSX for custom rendering:

```javascript
// Need to add reactive data in script setup
const formData = reactive({
  salaryMin: undefined,
  salaryMax: undefined
})

// Search item configuration
{
  label: 'Salary Range',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="Min salary"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="Max salary"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
    </div>
  ),
  span: 2  // Occupies two column widths
}
```

### Component Configuration Points
- `options` array is configured directly in the search item, no need to nest in `renderProps`
- `renderProps` is used to configure other component properties (like placeholder, multiple, etc.)
- Custom JSX rendering requires reactive data
- Use `span` property to control the number of columns a form item occupies

## Search Configuration

### Display Control
```javascript
const options = {
  searchOptions: {
    showNumber: 3,      // Show 3 search items by default
    layout: 'auto'      // Layout mode: auto/inline/vertical
  }
}
```

### Search Events
```javascript
const options = {
  onSearchSubmit: (form) => {
    console.log('Search conditions:', form)
    // Preprocess search conditions if needed
    return form
  },
  onSearchReset: (form) => {
    console.log('Reset search')
    return form
  }
}
```

## Advanced Table Columns

### Progress Bar Display
```javascript
{
  label: 'Performance Score',
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

### Multi-Tag Display
```javascript
{
  label: 'Skill Tags',
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

### Conditional Operations
```javascript
{
  type: 'operation',
  operationConfigure: {
    type: 'auto',
    fold: 2,               // Collapse when more than 2 actions
    actions: [
      {
        name: 'promote',
        text: 'Promote',
        show: (data) => data.row.performance >= 85,  // Conditional display
        onClick: (data) => {
          console.log('Promote employee:', data.row.name)
        }
      }
    ]
  }
}
```

Advanced search functionality allows you to build complex query interfaces to meet various business scenario search requirements.