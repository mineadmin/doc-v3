# Toolbar Extension

:::tip Note
The row of icon buttons in the upper right corner is the toolbar. The system provides an interface to extend the toolbar.
:::
![Toolbar](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## Get Toolbar Helper Function Instance

::: code-group

```vue [useGlobal() Method]
<!-- How to get it in `setup()` lifecycle or code where `Vue context` is accessible -->
<script setup lang="ts">
const toolbar = useGlobal().$toolbars
</script>
```

```ts [Get via Vue Instance]
// Get through the current instance
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars

```

```ts [Method for Plugins]
/**
 * The system plugin's `install` method, where the Vue instance is passed externally to get the toolbar
 * Refer to `src/plugins/mine-admin/demo/index.ts`
 **/
install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars
}
```
:::

## Toolbar API List
|       API        |                Type               |     Description     |      Return Value       |
|:----------------:|:------------------------------:|:---------------:|:--------------:|
|  getShowToolbar  |            Function            | Get enabled tool list  | MineToolbar[]  |
|     toolbars     |       Ref<MineToolbar[]>       |  Registered tool list   | MineToolbar[]  |
|  add  | Function(toolbar: MineToolbar) | Register a new tool in the toolbar  |      void      |
|  remove  |     Function(name: string)     | Remove a registered tool from the toolbar |      void      |

## MineToolbar Type
```ts
interface MineToolbar {
  name: string
  icon: string
  title: string | (() => string)
  show: boolean
  className?: string | (() => string)
  component?: () => any
  handle?: (toolbar: MineToolbar) => any
}
```
## Register a New Tool

:::tip
The `handle` event and `component` property conflict—only one will take effect, with `handle` having higher priority.  
If using `component`, do not define `handle` or comment it out.
:::

```ts
const toolbar = useGlobal().$toolbars
toolbar.add({
  name: 'test',
  title: 'Test',
  show: true,
  icon: 'heroicons:archive-box',
  // When the tool is clicked, the `handle` method is triggered, useful for simple popups, etc.
  handle: () => alert('I am a newly registered tool'),
  /**
   * Specify a component to render entirely through the component
   * The `icon` property above will not be rendered, and the `handle` method will also be invalid
   * 
   * Note: In actual development, after using `component`, comment out `handle`
   **/
  component: () => import('@/modules/demo/views/demo.vue')
})
```

## Remove a Registered Tool

```ts
const toolbar = useGlobal().$toolbars

// Remove the tool with the name 'test'
toolbar.remove('test')
```