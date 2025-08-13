# Custom Action Buttons

Demonstrates the usage of all slots, including scenarios for completely replacing the action button area, prepending content, appending content, and various other customization options.

## Custom Action Demo

<DemoPreview dir="demos/ma-search/custom-actions" />

## Slot Usage Instructions

### actions Slot
Completely replace the default action button area for maximum customization flexibility:

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
Insert custom content before the default action buttons:

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
Append custom content after the default action buttons:

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
      </el-dropdown-Menu>
    </template>
  </el-dropdown>
</template>
```

## Usage Scenarios

### 1. Search Template Management
Add functionality to save and load search templates for easy reuse of common search conditions.

### 2. Data Import/Export
Add import/export functionality to the search area to support batch operations and data exchange.

### 3. Quick Action Menu
Provide dropdown menus for quick actions like filtering today's, this week's, or this month's data.

### 4. Multi-step Search Process
Implement a wizard-style search process controlled by custom buttons.

## Slot Parameter Description

### actions Slot Parameters
- `searchLoading: boolean` - Search button loading state
- `resetLoading: boolean` - Reset button loading state

### beforeActions & afterActions Slots
- No parameters, pure content insertion

## Key Features

- 🎨 Fully customizable action area
- 🔧 Flexible slot system design
- 📦 Extend capabilities while maintaining original functionality
- 🎯 Support for complex business scenario customization
- ⚡ High-performance slot rendering mechanism

## Design Patterns

### Replacement Mode (actions)
Suitable for scenarios requiring complete redesign of the action area:

```vue
<!-- Fully customized action area -->
<template #actions>
  <CustomActionBar />
</template>
```

### Extension Mode (beforeActions/afterActions)
Suitable for adding extra actions while preserving default functionality:

```vue
<!-- Extend on top of default buttons -->
<template #beforeActions>
  <ExtraActions />
</template>
```

## Best Practices

### 1. Maintain Operational Consistency
Keep custom action buttons visually consistent with the overall system style.

### 2. Proper Use of Loading States
Utilize the `loading` state from slot parameters to add loading effects to custom buttons.

### 3. Responsive Design
Ensure custom actions display and function properly across different screen sizes.

### 4. User Experience Optimization
- Provide clear operation feedback
- Add appropriate confirmation dialogs
- Implement operation undo functionality

## Related Links

- [Method Demo](./methods-demo) - Learn about all exposed method usages
- [Dynamic Management](./dynamic-items) - Learn about dynamic search item management
- [Form Validation](./form-validation) - Learn about form validation features