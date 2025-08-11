# Toolbar Extension

:::tip Note
The row of icon buttons in the upper right corner is the toolbar. The system provides interfaces for extending the toolbar. The toolbar system is based on a componentized architecture, supporting dynamic addition, removal, and management of various tools.
:::

![Toolbar](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## System Architecture

The core implementation of the toolbar system is located in the following files:

- **Main Implementation**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts) (Local: `/web/src/utils/toolbars.ts`)
- **Type Definitions**: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327) (Local: `/web/types/global.d.ts:319`)
- **Global Registration**: [`web/src/bootstrap.ts#L85`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85) (Local: `/web/src/bootstrap.ts:85`)
- **Plugin Example**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts) (Local: `/web/src/plugins/mine-admin/demo/index.ts`)

## Default Toolbar

The system includes the following default toolbar items:

| Tool Name | Description | Icon | Component Location |
|---------|---------|------|----------|
| search | Global Search | `heroicons:magnifying-glass-20-solid` | `@/layouts/components/bars/toolbar/components/search.tsx` |
| notification | Notifications | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | Language Switch | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | Fullscreen Toggle | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | Theme Switch | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | System Settings | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## Getting Toolbar Instance

::: code-group

```vue [useGlobal() Method]
<!-- Access method within `setup()` lifecycle or code that can obtain Vue context -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [Via Vue Instance]
import { getCurrentInstance } from 'vue'

// Get through current instance
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [Plugin Access Method]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * System plugin `install` method, Vue instance will be passed externally to get toolbar
 * Reference: web/src/plugins/mine-admin/demo/index.ts
 **/
function install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars as MineToolbarExpose
  // Custom toolbars can be added here
}
```
:::

## API Interface

### MineToolbarExpose Type

Complete toolbar API interface definition (Source: [`web/types/global.d.ts#L329-336`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L329-336)):

```ts
interface MineToolbarExpose {
  state: Ref<boolean>                    // Toolbar state
  defaultToolbars: Ref<MineToolbar[]>    // Default toolbar list (read-only)
  toolbars: Ref<MineToolbar[]>          // Current toolbar list
  getShowToolbar: () => MineToolbar[]   // Get displayed toolbars
  add: (toolbar: MineToolbar) => void   // Add toolbar
  remove: (name: string) => void        // Remove toolbar
  render: () => Promise<any[]>          // Render toolbar (internal use)
}
```

### API Method Details

| API | Type | Description | Return Value |
|-----|------|------|--------|
| `state` | `Ref<boolean>` | Overall toolbar visibility state | `boolean` |
| `defaultToolbars` | `Ref<MineToolbar[]>` | System default toolbars (read-only) | `MineToolbar[]` |
| `toolbars` | `Ref<MineToolbar[]>` | All currently registered toolbars | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | Get currently enabled and visible toolbars | `MineToolbar[]` |
| `add(toolbar)` | `Function` | Register new toolbar item | `void` |
| `remove(name)` | `Function` | Remove toolbar by name | `void` |
| `render()` | `Function` | Render toolbar components (internal use) | `Promise<any[]>` |

## MineToolbar Type Definition

Complete toolbar item type definition (Source: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)):

```ts
interface MineToolbar {
  name: string                          // Unique identifier
  icon: string                          // Icon name (supports multiple icon libraries)
  title: string | (() => string)        // Tooltip text, supports dynamic function return
  show: boolean                         // Whether to display the tool
  className?: string | (() => string)   // Custom CSS class
  component?: () => any                 // Custom component (mutually exclusive with handle)
  handle?: (toolbar: MineToolbar) => any // Click handler (mutually exclusive with component)
}
```

### Property Explanation

- **name**: Unique identifier for the tool
- **icon**: Icon name, supports heroicons, mingcute and other icon libraries
- **title**: Tooltip text, supports i18n functions
- **show**: Controls whether the tool is displayed
- **className**: Optional CSS class for custom styling
- **component**: Custom Vue component for complex tool implementations
- **handle**: Simple click handler for quick functionality

:::warning Note
The `handle` and `component` properties are mutually exclusive. If both are defined, `handle` takes precedence and `component` will be ignored.
:::

## Extending the Toolbar

### Simple Tool Extension

Add a tool with simple click event:

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
    alert('This is a simple toolbar extension!')
  }
})
```

### Component-Based Tool Extension

Add a complex tool using custom component:

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

### Dynamic Toolbar

Show tools conditionally:

```ts
const toolbar = useGlobal().$toolbars
const userStore = useUserStore()

// Add admin-only tool
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
      message.warning('You don't have admin privileges')
    }
  }
})
```

### Toolbar Extension in Plugins

Extend toolbar in plugin development (Reference: [`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)):

```ts
import type { Plugin, MineToolbarExpose } from '#/global'
import Message from 'vue-m-message'

const pluginConfig: Plugin.PluginConfig = {
  install(app) {
    const $toolbars = app.config.globalProperties.$toolbars as MineToolbarExpose
    
    // Plugin-extended toolbar
    $toolbars.add({
      name: 'plugin-demo',
      title: 'Plugin Demo',
      show: true,
      icon: 'heroicons:archive-box',
      handle: () => Message.info('I am a toolbar extended in a plugin!')
    })
  }
}

export default pluginConfig
```

## Removing Toolbar Items

### Remove Single Tool

```ts
const toolbar = useGlobal().$toolbars

// Remove tool by name
toolbar.remove('test')
```

### Batch Remove Tools

```ts
const toolbar = useGlobal().$toolbars
const toolsToRemove = ['tool1', 'tool2', 'tool3']

// Batch removal
toolsToRemove.forEach(name => {
  toolbar.remove(name)
})
```

## Best Practices

### Naming Conventions

- Use meaningful names: `user-profile` instead of `tool1`
- Use kebab-case: `admin-panel` instead of `adminPanel`
- Avoid conflicts with system default tools

### Icon Selection

System supports multiple icon libraries, recommended:
- **Heroicons**: `heroicons:user-circle`
- **Mingcute**: `mingcute:settings-line`
- **Tabler**: `tabler:dashboard`

### Performance Considerations

- Use dynamic imports for code splitting with `component`
- Avoid heavy operations in `handle` functions
- Set `show` property appropriately to reduce unnecessary rendering

### User Experience

- Provide clear `title` describing tool functionality
- Use consistent icon styles
- Consider different permission scenarios

## Frequently Asked Questions

### Q: Toolbar not showing?

**A**: Check:
1. Is `show` property set to `true`?
2. Does tool name conflict with existing tools?
3. Is `$toolbars` instance obtained correctly?

### Q: What if both `handle` and `component` are defined?

**A**: `handle` takes precedence, `component` will be ignored. Recommend defining only one.

### Q: How to debug toolbar issues?

**A**: In browser developer tools:
```js
// View all current toolbars
console.log(window.__vue_app__.config.globalProperties.$toolbars.toolbars.value)

// View displayed toolbars
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: Toolbar permission control?

**A**: Use `show` property with permission system:
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: 'Admin Feature',
  show: userStore.hasRole('admin'), // Permission-based display
  icon: 'heroicons:shield-check',
  handle: () => { /* Admin feature */ }
})
```

## Source Code Reference

- **Core Implementation**: [`web/src/utils/toolbars.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/utils/toolbars.ts)
- **Type Definitions**: [`web/types/global.d.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-336) 
- **Default Components**: [`web/src/layouts/components/bars/toolbar/components/`](https://github.com/mineadmin/mineadmin/tree/master/web/src/layouts/components/bars/toolbar/components)
- **Plugin Example**: [`web/src/plugins/mine-admin/demo/index.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts)
- **Global Registration**: [`web/src/bootstrap.ts`](https://github.com/mineadmin/mineadmin/blob/master/web/src/bootstrap.ts#L85)