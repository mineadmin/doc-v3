# Toolbar Extension

:::tip Note
The row of icon buttons in the upper right corner constitutes the toolbar. The system provides an interface for extending the toolbar. The toolbar system is based on a componentized architecture, supporting dynamic addition, removal, and management of various tools.
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
| notification | Message Notifications | `heroicons:bell` | `@/layouts/components/bars/toolbar/components/notification.tsx` |
| translate | Language Switch | `heroicons:language-20-solid` | `@/layouts/components/bars/toolbar/components/translate.tsx` |
| fullscreen | Fullscreen Toggle | `mingcute:fullscreen-line` | `@/layouts/components/bars/toolbar/components/fullscreen.tsx` |
| switchMode | Theme Switch | `lets-icons:color-mode-light` | `@/layouts/components/bars/toolbar/components/switch-mode.tsx` |
| settings | System Settings | `heroicons:cog-solid` | `@/layouts/components/bars/toolbar/components/settings.tsx` |

## Obtaining Toolbar Instance

::: code-group

```vue [via useGlobal()]
<!-- How to obtain within `setup()` lifecycle or code that can access Vue context -->
<script setup lang="ts">
import { useGlobal } from '@/hooks/useGlobal'

const toolbar = useGlobal().$toolbars
</script>
```

```ts [via Vue Instance]
import { getCurrentInstance } from 'vue'

// Obtain through current instance
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars
```

```ts [Obtaining in Plugins]
import type { App } from 'vue'
import type { MineToolbarExpose } from '#/global'

/**
 * System plugin `install` method, where the Vue instance is passed externally to obtain toolbar
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

Complete toolbar API interface definition (source: [`web/types/global.d.ts#L329-336`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L329-336)):

```ts
interface MineToolbarExpose {
  state: Ref<boolean>                    // Toolbar state
  defaultToolbars: Ref<MineToolbar[]>    // Default toolbar list (read-only)
  toolbars: Ref<MineToolbar[]>          // Current toolbar list
  getShowToolbar: () => MineToolbar[]   // Get visible toolbars
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
| `toolbars` | `Ref<MineToolbar[]>` | Currently registered toolbars | `MineToolbar[]` |
| `getShowToolbar()` | `Function` | Get currently enabled and visible toolbars | `MineToolbar[]` |
| `add(toolbar)` | `Function` | Register new tool to toolbar | `void` |
| `remove(name)` | `Function` | Remove toolbar by name | `void` |
| `render()` | `Function` | Render toolbar components (internal use) | `Promise<any[]>` |

## MineToolbar Type Definition

Complete toolbar item type definition (source: [`web/types/global.d.ts#L319-327`](https://github.com/mineadmin/mineadmin/blob/master/web/types/global.d.ts#L319-327)):

```ts
interface MineToolbar {
  name: string                          // Unique tool identifier
  icon: string                          // Icon name (supports multiple icon libraries)
  title: string | (() => string)        // Tooltip text, supports dynamic function return
  show: boolean                         // Whether to display this tool
  className?: string | (() => string)   // Custom CSS class
  component?: () => any                 // Custom component (mutually exclusive with handle)
  handle?: (toolbar: MineToolbar) => any // Click handler (mutually exclusive with component)
}
```

### Property Explanation

- **name**: Unique identifier for tool management
- **icon**: Icon name, supports heroicons, mingcute and other icon libraries
- **title**: Tooltip text, supports i18n functions
- **show**: Controls tool visibility in toolbar
- **className**: Optional CSS class for custom styling
- **component**: Custom Vue component for complex tool implementations
- **handle**: Simple click handler for quick functionality

:::warning Note
`handle` and `component` properties are mutually exclusive. If both are defined, `handle` takes precedence and `component` will be ignored.
:::

## Extending Toolbar

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

### Component-based Tool Extension

Add a complex tool using custom component:

```ts
const toolbar = useGlobal().$toolbars

// Add a component-based tool
toolbar.add({
  name: 'custom-component',
  title: 'Custom Component',
  show: true,
  icon: 'heroicons:puzzle-piece',
  // Note: When using component, do not define handle
  component: () => import('@/components/custom-toolbar-item.vue')
})
```

### Dynamic Toolbar

Dynamically display tools based on conditions:

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
      message.warning('You lack admin permissions')
    }
  }
})
```

### Toolbar Extension in Plugins

Extending toolbar in plugin development (reference: [`web/src/plugins/mine-admin/demo/index.ts#L19-26`](https://github.com/mineadmin/mineadmin/blob/master/web/src/plugins/mine-admin/demo/index.ts#L19-26)):

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
      handle: () => Message.info('I am a toolbar extended in plugin!')
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
- Consider usage scenarios for different permission levels

## FAQ

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

// View visible toolbars
console.log(window.__vue_app__.config.globalProperties.$toolbars.getShowToolbar())
```

### Q: Toolbar permission control?

**A**: Utilize `show` property with permission system:
```ts
const userStore = useUserStore()

toolbar.add({
  name: 'admin-only',
  title: 'Admin Feature',
  show: userStore.hasRole('admin'), // Display based on permission
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