# 自定义操作按钮

演示所有插槽的使用方法，包括完全替换操作按钮区域、前置插入内容、后置追加内容等多种自定义场景。

## 自定义操作演示

<DemoPreview dir="demos/ma-search/custom-actions" />

## 插槽使用说明

### actions 插槽
完全替换默认的操作按钮区域，获得最大的定制灵活性：

```vue
<template #actions="{ searchLoading, resetLoading }">
  <div class="custom-actions">
    <el-button 
      type="primary" 
      :loading="searchLoading"
      @click="handleCustomSearch"
    >
      立即搜索
    </el-button>
    <el-button @click="handleAdvancedSearch">
      高级搜索
    </el-button>
    <el-button 
      :loading="resetLoading"
      @click="handleCustomReset"
    >
      清空条件
    </el-button>
  </div>
</template>
```

### beforeActions 插槽
在默认操作按钮前插入自定义内容：

```vue
<template #beforeActions>
  <el-button type="info" @click="handleImport">
    导入条件
  </el-button>
  <el-button type="warning" @click="handleExport">
    导出条件
  </el-button>
</template>
```

### afterActions 插槽
在默认操作按钮后追加自定义内容：

```vue
<template #afterActions>
  <el-button type="success" @click="handleSaveTemplate">
    保存模板
  </el-button>
  <el-dropdown @command="handleQuickAction">
    <el-button>
      快捷操作 <el-icon><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="clear">清空所有</el-dropdown-item>
        <el-dropdown-item command="today">今日数据</el-dropdown-item>
        <el-dropdown-item command="week">本周数据</el-dropdown-item>
      </el-dropdown-Menu>
    </template>
  </el-dropdown>
</template>
```

## 使用场景

### 1. 搜索模板管理
添加保存、加载搜索模板的功能，方便用户复用常用的搜索条件。

### 2. 数据导入导出
在搜索区域添加导入/导出功能，支持批量操作和数据交换。

### 3. 快捷操作菜单
提供下拉菜单形式的快捷操作，如快速筛选今日、本周、本月数据。

### 4. 多步骤搜索流程
实现向导式的搜索流程，通过自定义按钮控制搜索步骤。

## 插槽参数说明

### actions 插槽参数
- `searchLoading: boolean` - 搜索按钮加载状态
- `resetLoading: boolean` - 重置按钮加载状态

### beforeActions & afterActions 插槽
- 无参数，纯内容插入

## 关键特性

- 🎨 完全自定义的操作区域
- 🔧 灵活的插槽系统设计
- 📦 保持原有功能的同时扩展能力
- 🎯 支持复杂的业务场景定制
- ⚡ 高性能的插槽渲染机制

## 设计模式

### 替换模式 (actions)
适用于需要完全重新设计操作区域的场景：

```vue
<!-- 完全自定义的操作区域 -->
<template #actions>
  <CustomActionBar />
</template>
```

### 扩展模式 (beforeActions/afterActions)
适用于在保持默认功能基础上添加额外操作：

```vue
<!-- 在默认按钮基础上扩展 -->
<template #beforeActions>
  <ExtraActions />
</template>
```

## 最佳实践

### 1. 保持操作一致性
自定义操作按钮时，保持与系统整体的视觉风格一致。

### 2. 合理使用加载状态
利用插槽参数中的 `loading` 状态，为自定义按钮添加加载效果。

### 3. 响应式设计
确保自定义操作在不同屏幕尺寸下都能正常显示和操作。

### 4. 用户体验优化
- 提供清晰的操作反馈
- 添加适当的确认对话框
- 实现操作的撤销功能

## 相关链接

- [方法演示](./methods-demo) - 了解所有暴露方法的使用
- [动态管理](./dynamic-items) - 了解动态搜索项管理
- [表单验证](./form-validation) - 了解表单验证功能