# Table Sorting

Supports multiple sorting methods: built-in sorting, custom sorting, multi-level sorting, etc.

## Sorting Demo

<DemoPreview dir="demos/ma-table/sorting" />

## Features

### Sorting Types
- **Built-in Sorting**: Simply set `sortable: true` to use the default sorting algorithm
- **Custom Sorting**: Set `sortable: 'custom'` and implement custom sorting logic through event listeners
- **Disable Sorting**: Omit `sortable` or set it to `false`

### Sorting Control
- **Default Sorting**: Set initial table sorting state via `defaultSort`
- **Sort Order**: Control sorting toggle sequence via `sortOrders`
- **Sort Events**: Listen to `sort-change` event to track sorting changes

## Configuration Examples

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
  // Listen to sorting events
  on: {
    onSortChange: ({ column, prop, order }) => {
      console.log('Sort changed:', column.label, order)
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
    // Custom sort order: ascending -> descending -> no sort
    sortOrders: ['ascending', 'descending', null]
  }
]
```

## Sorting Parameters

| Parameter | Description | Type | Default |
|-----|------|-----|--------|
| `sortable` | Whether the column is sortable | `boolean \| 'custom'` | `false` |
| `sortMethod` | Sorting method used for data | `Function(a, b)` | - |
| `sortBy` | Specifies which property to sort by | `string \| array \| Function(row, index)` | - |
| `sortOrders` | Rotation order of sorting strategies | `array` | `['ascending', 'descending', null]` |
| `defaultSort` | Default sorted column's prop and order | `object` | - |

## Events

| Event | Description | Parameters |
|-------|------|------|
| `sort-change` | Triggered when table sorting conditions change | `{ column, prop, order }` |

Where `order` can be:
- `'ascending'`: Ascending
- `'descending'`: Descending  
- `null`: Cancel sorting