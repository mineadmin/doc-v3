# Advanced Search

Demonstrates various search component types and complex search logic, including date ranges, numeric ranges, multi-select, and more.

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

## Features

- **Rich Search Components**: Supports input, select, date-range, slider, checkbox, etc.
- **Multi-Condition Combination**: Supports complex search condition combinations
- **Search Events**: Can listen for search submission and reset events
- **Default Expansion**: Configurable number of search items to display by default
- **Responsive Layout**: Search form supports responsive layout

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
  renderProps: {
    options: [
      { label: 'Tech Department', value: 'Tech Department' },
      { label: 'Product Department', value: 'Product Department' }
    ]
  }
}

// Multiple select
{
  label: 'Departments',
  prop: 'departments',
  render: 'select',
  renderProps: {
    multiple: true,
    options: [...options]
  }
}
```

### Numeric Range Component
```javascript
{
  label: 'Salary Range',
  prop: 'salaryRange',
  render: 'input-number-range',
  renderProps: {
    startPlaceholder: 'Minimum salary',
    endPlaceholder: 'Maximum salary',
    min: 0,
    max: 100000
  }
}
```

### Date Range Component
```javascript
{
  label: 'Join Date',
  prop: 'joinDateRange',
  render: 'date-range',
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
  renderProps: {
    options: [
      { label: 'P4', value: 'P4' },
      { label: 'P5', value: 'P5' },
      { label: 'P6', value: 'P6' }
    ]
  }
}
```

### Radio Group Component
```javascript
{
  label: 'Employment Status',
  prop: 'status',
  render: 'radio-group',
  renderProps: {
    options: [
      { label: 'All', value: '' },
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ]
  }
}
```

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
    // Can preprocess search conditions
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
    fold: 2,               // Fold when more than 2 operations
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