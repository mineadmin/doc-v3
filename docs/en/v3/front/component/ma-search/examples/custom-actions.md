# Custom Action Buttons

Demonstrates all slot usage methods, including completely replacing the action button area, prepending content, appending content, and other custom scenarios.

## Custom Action Demo

<DemoPreview dir="demos/ma-search/custom-actions" />

## Slot Usage Instructions

### actions Slot
Completely replaces the default action button area, offering maximum customization flexibility:

```vue
<template #actions="{ searchLoading, resetLoading }">
  <div class="custom-actions">
    <el-button 
      type="primary" 
      :loading="searchLoading"
      @click="handleCustomSearch"
    >
      Search Now
    </el-button>
    <el-button @click="handleAdvancedSearch">
      Advanced Search
    </el-button>
    <el-button 
      :loading="resetLoading"
      @click="handleCustomReset"
    >
      Clear Conditions
    </el-button>
  </div>
</template>
```

### beforeActions Slot
Inserts custom content before the default action buttons:

```vue
<template #beforeActions>
  <el-button type="info" @click="handleImport">
    Import Conditions
  </el-button>
  <el-button type="warning" @click="handleExport">
    Export Conditions
  </el-button>
</template>
```

### afterActions Slot
Appends custom content after the default action buttons:

```vue
<template #afterActions>
  <el-button type="success" @click="handleSaveTemplate">
    Save Template
  </el-button>
  <el-dropdown @command="handleQuickAction">
    <el-button>
      Quick Actions <el-icon><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="clear">Clear All</el-dropdown-item>
        <el-dropdown-item command="today">Today's Data</el-dropdown-item>
        <el-dropdown-item command="week">This Week's Data</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
```

## Use Cases

### 1. Search Template Management
Add functionality to save and load search templates, allowing users to reuse common search conditions.

### 2. Data Import/Export
Add import/export functionality in the search area to support batch operations and data exchange.

### 3. Quick Action Menu
Provide dropdown menu-style quick actions, such as quickly filtering today's, this week's, or this month's data.

### 4. Multi-Step Search Process
Implement a wizard-style search process, controlling search steps through custom buttons.

## Slot Parameter Description

### actions Slot Parameters
- `searchLoading: boolean` - Search button loading state
- `resetLoading: boolean` - Reset button loading state

### beforeActions & afterActions Slots
- No parameters, pure content insertion

## Key Features

- 🎨 Fully customizable action area
- 🔧 Flexible slot system design
- 📦 Extends capabilities while preserving original functionality
- 🎯 Supports complex business scenario customization
- ⚡ High-performance slot rendering mechanism

## Design Patterns

### Replacement Pattern (actions)
Suitable for scenarios requiring a completely redesigned action area:

```vue
<!-- Completely custom action area -->
<template #actions>
  <CustomActionBar />
</template>
```

### Extension Pattern (beforeActions/afterActions)
Suitable for adding extra operations while maintaining default functionality:

```vue
<!-- Extending based on default buttons -->
<template #beforeActions>
  <ExtraActions />
</template>
```

## Best Practices

### 1. Maintain Operational Consistency
When customizing action buttons, maintain visual style consistency with the overall system.

### 2. Use Loading States Reasonably
Utilize the `loading` state in slot parameters to add loading effects to custom buttons.

### 3. Responsive Design
Ensure custom actions display and operate correctly across different screen sizes.

### 4. User Experience Optimization
- Provide clear action feedback
- Add appropriate confirmation dialogs
- Implement action undo functionality

## Related Links

- [Method Demo](./methods-demo) - Learn about all exposed method usage
- [Dynamic Management](./dynamic-items) - Learn about dynamic search item management
- [Form Validation](./form-validation) - Learn about form validation functionality