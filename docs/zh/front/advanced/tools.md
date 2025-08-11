# 工具栏扩展

:::tip 提示
右上角一排图标按钮，就是工具栏，系统开放了接口可以扩展工具栏。工具栏系统基于组件化架构，支持动态添加、移除和管理各种工具。
:::

![工具栏](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## 系统架构

工具栏系统的核心实现位于以下文件中：

- **主要实现**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts) (本地: `/web/src/utils/toolbars.ts`)
- **类型定义**: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327) (本地: `/web/types/global.d.ts:319`)
- **全局注册**: [`web/src/bootstrap.ts#L85`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85) (本地: `/web/src/bootstrap.ts:85`)
- **插件示例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts) (本地: `/web/src/plugins/mine-admin/demo/index.ts`)

## 默认工具栏

系统内置了以下默认工具栏：

| 工具名称 | 功能描述 | 图标 | 组件位置 |
|---------|---------|------|----------|
| search | 全局搜索 | `heroicons:magnifying-glass-20-solid` | `@/layouts/components/bars/toolbar/components/search.tsx` |
| notification | 消息通知 | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | 语言切换 | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | 全屏切换 | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | 主题切换 | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | 系统设置 | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## 获取工具栏实例

::: code-group

```vue [useGlobal() 方式]
<!-- 在 `setup()` 生命周期或者可以获取到 `Vue上下文` 中的代码里获取方式 -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [通过 Vue 实例获取]
import { getCurrentInstance } from 'vue'

// 通过当前实例获取
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [插件内获取方法]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * 系统插件 `install` 方法，外部会传入 Vue 实例，然后获取 toolbar
 * 参考: web/src/plugins/mine-admin/demo/index.ts
 **/
function install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars as MineToolbarExpose
  // 在这里可以添加自定义工具栏
}
```
:::

## API 接口

### MineToolbarExpose 类型

完整的工具栏 API 接口定义如下（来源：[`web/types/global.d.ts#L329-336`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L329-336)）：

```ts
interface MineToolbarExpose {
  state: Ref<boolean>                    // 工具栏状态
  defaultToolbars: Ref<MineToolbar[]>    // 默认工具栏列表
  toolbars: Ref<MineToolbar[]>          // 当前工具栏列表
  getShowToolbar: () => MineToolbar[]   // 获取显示的工具栏
  add: (toolbar: MineToolbar) => void   // 添加工具栏
  remove: (name: string) => void        // 移除工具栏
  render: () => Promise<any[]>          // 渲染工具栏
}
```

### API 方法详解

| API | 类型 | 说明 | 返回值 |
|-----|------|------|--------|
| `state` | `Ref<boolean>` | 工具栏整体显示状态 | `boolean` |
| `defaultToolbars` | `Ref<MineToolbar[]>` | 系统默认工具栏（只读） | `MineToolbar[]` |
| `toolbars` | `Ref<MineToolbar[]>` | 当前注册的所有工具栏 | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | 获取当前启用并显示的工具栏 | `MineToolbar[]` |
| `add(toolbar)` | `Function` | 向工具栏注册新工具 | `void` |
| `remove(name)` | `Function` | 移除指定名称的工具栏 | `void` |
| `render()` | `Function` | 渲染工具栏组件（内部使用） | `Promise<any[]>` |

## MineToolbar 类型定义

工具栏项的完整类型定义（来源：[`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)）：

```ts
interface MineToolbar {
  name: string                          // 工具唯一标识符
  icon: string                          // 图标名称（支持多种图标库）
  title: string | (() => string)        // 工具标题，支持函数动态返回
  show: boolean                         // 是否显示该工具
  className?: string | (() => string)   // 自定义CSS类名
  component?: () => any                 // 自定义组件（与handle互斥）
  handle?: (toolbar: MineToolbar) => any // 点击处理函数（与component互斥）
}
```

### 属性说明

- **name**: 工具的唯一标识，用于识别和管理工具
- **icon**: 图标名称，支持 heroicons、mingcute 等图标库
- **title**: 工具提示文本，支持国际化函数
- **show**: 控制工具是否在工具栏中显示
- **className**: 可选的CSS类名，用于自定义样式
- **component**: 自定义Vue组件，用于复杂的工具实现
- **handle**: 简单的点击处理函数，用于快速功能实现

:::warning 注意
`handle` 和 `component` 属性是互斥的。如果同时定义，`handle` 优先级更高，`component` 将被忽略。
:::

## 扩展工具栏

### 简单工具扩展

添加一个带有简单点击事件的工具：

```ts
const toolbar = useGlobal().$toolbars

// 添加一个简单的提示工具
toolbar.add({
  name: 'simple-alert',
  title: '简单提示',
  show: true,
  icon: 'heroicons:information-circle',
  handle: (toolbar) => {
    console.log('点击了工具:', toolbar.name)
    alert('这是一个简单的工具扩展！')
  }
})
```

### 组件化工具扩展

添加一个使用自定义组件的复杂工具：

```ts
const toolbar = useGlobal().$toolbars

// 添加一个组件化工具
toolbar.add({
  name: 'custom-component',
  title: '自定义组件',
  show: true,
  icon: 'heroicons:puzzle-piece',
  // 注意：使用 component 时不要定义 handle
  component: () => import('@/components/custom-toolbar-item.vue')
})
```

### 动态工具栏

根据条件动态显示工具：

```ts
const toolbar = useGlobal().$toolbars
const userStore = useUserStore()

// 添加管理员专用工具
toolbar.add({
  name: 'admin-panel',
  title: () => userStore.hasPermission('admin') ? '管理面板' : '无权限',
  show: userStore.hasPermission('admin'),
  icon: 'heroicons:cog-8-tooth',
  className: () => userStore.hasPermission('admin') ? 'admin-tool' : 'disabled-tool',
  handle: () => {
    if (userStore.hasPermission('admin')) {
      // 打开管理面板
      router.push('/admin/panel')
    } else {
      message.warning('您没有管理员权限')
    }
  }
})
```

### 插件中的工具栏扩展

在插件开发中扩展工具栏（参考：[`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)）：

```ts
import type { Plugin, MineToolbarExpose } from '#/global'
import Message from 'vue-m-message'

const pluginConfig: Plugin.PluginConfig = {
  install(app) {
    const $toolbars = app.config.globalProperties.$toolbars as MineToolbarExpose
    
    // 插件扩展的工具栏
    $toolbars.add({
      name: 'plugin-demo',
      title: '插件演示',
      show: true,
      icon: 'heroicons:archive-box',
      handle: () => Message.info('我是在插件中扩展的工具栏！')
    })
  }
}

export default pluginConfig
```

## 移除工具栏

### 移除单个工具

```ts
const toolbar = useGlobal().$toolbars

// 移除指定名称的工具
toolbar.remove('test')
```

### 批量移除工具

```ts
const toolbar = useGlobal().$toolbars
const toolsToRemove = ['tool1', 'tool2', 'tool3']

// 批量移除
toolsToRemove.forEach(name => {
  toolbar.remove(name)
})
```

## 最佳实践

### 命名规范

- 使用有意义的名称：`user-profile` 而不是 `tool1`
- 使用短横线分隔：`admin-panel` 而不是 `adminPanel`
- 避免与系统默认工具重名

### 图标选择

系统支持多种图标库，推荐使用：
- **Heroicons**: `heroicons:user-circle`
- **Mingcute**: `mingcute:settings-line`
- **Tabler**: `tabler:dashboard`

### 性能考虑

- 使用 `component` 时，利用动态导入进行代码分割
- 避免在 `handle` 函数中执行重操作
- 合理设置 `show` 属性，减少不必要的渲染

### 用户体验

- 提供清晰的 `title` 描述工具功能
- 使用一致的图标风格
- 考虑不同权限用户的使用场景

## 常见问题

### Q: 工具栏不显示？

**A**: 检查以下几点：
1. `show` 属性是否设置为 `true`
2. 工具名称是否与现有工具重复
3. 是否正确获取了 `$toolbars` 实例

### Q: `handle` 和 `component` 同时定义了会怎样？

**A**: `handle` 优先级更高，`component` 会被忽略。建议只定义其中一个。

### Q: 如何调试工具栏问题？

**A**: 在浏览器开发者工具中：
```js
// 查看当前所有工具栏
console.log(window.__vue_app__.config.globalProperties.$toolbars.toolbars.value)

// 查看显示的工具栏
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: 工具栏权限控制？

**A**: 利用 `show` 属性和权限系统：
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: '管理功能',
  show: userStore.hasRole('admin'), // 基于权限显示
  icon: 'heroicons:shield-check',
  handle: () => { /* 管理功能 */ }
})
```

## 源码参考

- **核心实现**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts)
- **类型定义**: [`web/types/global.d.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-336) 
- **默认组件**: [`web/src/layouts/components/bars/toolbar/components/`](https://github.com/mineadmin/mineadmin/tree/master/web/src/layouts/components/bars/toolbar/components)
- **插件示例**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts)
- **全局注册**: [`web/src/bootstrap.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85)