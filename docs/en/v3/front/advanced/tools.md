# Toolbar Extension

:::tip
The row of icon buttons in the top right corner is the toolbar. The system exposes interfaces for extending the toolbar. The toolbar system is based on a component-based architecture, supporting dynamic addition, removal, and management of various tools.
:::

![Toolbar](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## System Architecture

The core implementation of the toolbar system is located in the following files:

- **Main Implementation**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts) (Local: `/web/src/utils/toolbars.ts`)
- **Type Definitions**: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327) (Local: `/web/types/global.d.ts:319`)
- **Global Registration**: [`web/src/bootstrap.ts#L85`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85) (Local: `/web/src/bootstrap.ts:85`)
- **Plugin Example**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts) (Local: `/web/src/plugins/mine-admin/demo/index.ts`)

## Default Toolbars

The system includes the following default toolbar items:

| Tool Name | Function Description | Icon | Component Location |
|-----------|---------------------|------|-------------------|
| search | Global Search | `heroicons:magnifying-glass-20-solid` | `@/layouts/components/bars/toolbar/components/search.tsx` |
| notification | Message Notifications | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | Language Switching | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | Fullscreen Toggle | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | Theme Switching | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | System Settings | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## Getting the Toolbar Instance

::: code-group

```vue [Using useGlobal()]
<!-- Get the instance within the `setup()` lifecycle or code with access to the `Vue context` -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [Via Vue Instance]
import { getCurrentInstance } from 'vue'

// Get via the current instance
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [Getting Instance Within a Plugin]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * System plugin `install` method. The Vue instance is passed in externally, then toolbar is obtained.
 * Reference: web/src/plugins/mine-admin/demo/index.ts
 **/
function install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars as MineToolbarExpose
  // Custom toolbar items can be added here
}
```
:::

## API Interface

### MineToolbarExpose Type

The complete toolbar API interface definition is as follows (source: [`web/types/global.d.ts#L329-336`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L329-336)):

```ts
interface MineToolbarExpose {
  state: Ref<boolean>                    // Toolbar state
  defaultToolbars: Ref<MineToolbar[]>    // Default toolbar list
  toolbars: Ref<MineToolbar[]>          // Current toolbar list
  getShowToolbar: () => MineToolbar[]   // Get displayed toolbars
  add: (toolbar: MineToolbar) => void   // Add a toolbar
  remove: (name: string) => void        // Remove a toolbar
  render: () => Promise<any[]>          // Render toolbars
}
```

### API Method Details

| API | Type | Description | Return Value |
|-----|------|-------------|--------------|
| `state` | `Ref<boolean>` | Overall toolbar display state | `boolean` |
| `defaultToolbars` | `Ref<MineToolbar[]>` | System default toolbars (read-only) | `MineToolbar[]` |
| `toolbars` | `Ref<MineToolbar[]>` | All currently registered toolbars | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | Get currently enabled and displayed toolbars | `MineToolbar[]` |
| `add(toolbar)` | `Function` | Register a new tool in the toolbar | `void` |
| `remove(name)` | `Function` | Remove a toolbar by name | `void` |
| `render()` | `Function` | Render toolbar components (internal use) | `Promise<any[]>` |

## MineToolbar Type Definition

Complete type definition for a toolbar item (source: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)):

```ts
interface MineToolbar {
  name: string                          // Unique tool identifier
  icon: string                          // Icon name (supports multiple icon libraries)
  title: string | (() => string)        // Tool title, supports dynamic return via function
  show: boolean                         // Whether to display the tool
  className?: string | (() => string)   // Custom CSS class name
  component?: () => any                 // Custom component (mutually exclusive with handle)
  handle?: (toolbar: MineToolbar) => any // Click handler function (mutually exclusive with component)
}
```

### Property Description

- **name**: Unique identifier for the tool, used for identification and management
- **icon**: Icon name, supports icon libraries like heroicons, mingcute, etc.
- **title**: Tooltip text for the tool, supports internationalization functions
- **show**: Controls whether the tool is displayed in the toolbar
- **className**: Optional CSS class name for custom styling
- **component**: Custom Vue component for complex tool implementations
- **handle**: Simple click handler function for quick feature implementation

:::warning Note
The `handle` and `component` properties are mutually exclusive. If both are defined, `handle` takes higher priority and `component` is ignored.
:::

## Extending the Toolbar

### Simple Tool Extension

Adding a tool with a simple click event:

```ts
const toolbar = useGlobal().$toolbars

// Add a simple alert tool
toolbar.add({
  name: 'simple-alert',
  title: 'Simple Alert',
  show: true,
  icon: 'heroicons:information-circle',
  handle: (toolbar) => {
    console.log('Tool clicked:', toolbar.name)
    alert('This is a simple tool extension!')
  }
})
```

### Component-based Tool Extension

Adding a complex tool using a custom component:

```ts
const toolbar = useGlobal().$toolbars

// Add a component-based tool
toolbar.add({
  name: 'custom-component',
  title: 'Custom Component',
  show: true,
  icon: 'heroicons:puzzle-piece',
  // Note: Do not define handle when using component
  component: () => import('@/components/custom-toolbar-item.vue')
})
```

### Dynamic Toolbars

Dynamically displaying tools based on conditions:

```ts
const toolbar = useGlobal().$toolbars
const userStore = useUserStore()

// Add an admin-only tool
toolbar.add({
  name: 'admin-panel',
  title: () => userStore.hasPermission('admin') ? 'Admin Panel' : 'No Permission',
  show: userStore.hasPermission('admin'),
  icon: 'heroicons:cog-8-tooth',
  className: () => userStore.hasPermission('admin') ? 'admin-tool' : 'disabled-tool',
  handle: () => {
    if (userStore.hasPermission('admin')) {
      // Open admin panel
      router.push('/admin/panel')
    } else {
      message.warning('You do not have administrator permissions')
    }
  }
})
```

### Toolbar Extension in Plugins

Extending the toolbar during plugin development (reference: [`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)):

```ts
import type { Plugin, MineToolbarExpose } from '#/global'
import Message from 'vue-m-message'

const pluginConfig: Plugin.PluginConfig = {
  install(app) {
    const $toolbars = app.config.globalProperties.$toolbars as MineToolbarExpose
    
    // Plugin extended toolbar
    $toolbars.add({
      name: 'plugin-demo',
      title: 'Plugin Demo',
      show: true,
      icon: 'heroicons:archive-box',
      handle: () => Message.info('This is a toolbar extended from a plugin!')
    })
  }
}

export default pluginConfig
```

## Removing Toolbars

### Removing a Single Tool

```ts
const toolbar = useGlobal().$toolbars

// Remove a tool by name
toolbar.remove('test')
```

### Removing Multiple Tools

```ts
const toolbar = useGlobal().$toolbars
const toolsToRemove = ['tool1', 'tool2', 'tool3']

// Batch remove
toolsToRemove.forEach(name => {
  toolbar.remove(name)
})
```

## Best Practices

### Naming Convention

- Use meaningful names: `user-profile` instead of `tool1`
- Use hyphen-separated words: `admin-panel` instead of `adminPanel`
- Avoid name conflicts with default system tools

### Icon Selection

The system supports multiple icon libraries, recommendations include:
- **Heroicons**: `heroicons:user-circle`
- **Mingcute**: `mingcute:settings-line`
- **Tabler**: `tabler:dashboard`

### Performance Considerations

- When using `component`, leverage dynamic imports for code splitting
- Avoid heavy operations within `handle` functions
- Properly set the `show` attribute to reduce unnecessary rendering

### User Experience

- Provide clear `title` descriptions for tool functions
- Use a consistent icon style
- Consider usage scenarios for users with different permissions

## FAQ

### Q: Toolbar not showing?

**A**: Check the following points:
1. Is the `show` property set to `true`
2. Does the tool name conflict with an existing tool
3. Was the `$toolbars` instance obtained correctly

### Q: What happens if both `handle` and `component` are defined?

**A**: `handle` takes higher priority, and `component` is ignored. It is recommended to define only one of them.

### Q: How to debug toolbar issues?

**A**: In the browser developer tools:
```js
// View all current toolbars
console.log(window.__vue_app__.config.globalProperties.$toolbars.toolbars.value)

// View displayed toolbars
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: Toolbar permission control?

**A**: Utilize the `show` property and the permission system:
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: 'Admin Function',
  show: userStore.hasRole('admin'), // Display based on permissions
  icon: 'heroicons:shield-check',
  handle: () => { /* Admin function */ }
})
```

## Source Code Reference

- **Core Implementation**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts)
- **Type Definitions**: [`web/types/global.d.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-336) 
- **Default Components**: [`web/src/layouts/components/bars/toolbar/components/`](https://github.com/mineadmin/mineadmin/tree/master/web/src/layouts/components/bars/toolbar/components)
- **Plugin Example**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts)
- **Global Registration**: [`web/src/bootstrap.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85)