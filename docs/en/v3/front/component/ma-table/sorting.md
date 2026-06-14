# Table Sorting

Supports multiple sorting methods: built-in sorting, custom sorting, multi-level sorting, etc.

## Sorting Demo

<DemoPreview dir="demos/ma-table/sorting" />

## Features

### Sorting Types
- **Built-in Sorting**: Directly set `sortable: true` to use the default sorting algorithm
- **Custom Sorting**: Set `sortable: 'custom'` and implement custom sorting logic through event listening
- **Disabled Sorting**: Do not set `sortable` or set it to `false`

### Sorting Control
- **Default Sorting**: Set the table's initial sorting state via `defaultSort`
- **Sort Order**: Control the switching order of sorting via `sortOrders`
- **Sort Event**: Listen for the `sort-change` event to get sorting changes

## Configuration Example

### Basic Sorting
```javascript
const columns = [
  { 
    label: 'Product Name', 
    prop: 'name', 
    sortable: true  // Enable built-in sorting
  },
  { 
    label: 'Price', 
    prop: 'price', 
    sortable: 'custom'  // Custom sorting
  }
]
```

### Sorting Configuration
```javascript
const options = {
  // Set default sorting
  defaultSort: { 
    prop: 'price', 
    order: 'descending' 
  },
  // Listen for sorting events
  on: {
    onSortChange: ({ column, prop, order }) => {
      console.log('Sort change:', column.label, order)
    }
  }
}
```

### Custom Sort Order
```javascript
const columns = [
  { 
    label: 'Sales', 
    prop: 'sales', 
    sortable: true,
    // Custom sort order: ascending -> descending -> no sorting
    sortOrders: ['ascending', 'descending', null]
  }
]
```

## Sorting Parameters

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `sortable` | Whether the column can be sorted | `boolean \| 'custom'` | `false` |
| `sortMethod` | Method used when sorting data | `Function(a, b)` | - |
| `sortBy` | Specifies which property to sort by | `string \| array \| Function(row, index)` | - |
| `sortOrders` | Rotation order of sorting strategies used when sorting data | `array` | `['ascending', 'descending', null]` |
| `defaultSort` | Default sorting column's prop and order | `object` | - |

## Event Description

| Event Name | Description | Parameters |
|-------|------|------|
| `sort-change` | Triggered when the table's sorting condition changes | `{ column, prop, order }` |

Where the value of `order` is:
- `'ascending'`: Ascending order
- `'descending'`: Descending order  
- `null`: Cancel sorting