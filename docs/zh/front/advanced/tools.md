# 工具栏扩展

:::tip 提示
右上角一排图标按钮，就是工具栏，系统开放了接口可以扩展工具栏。
:::
![工具栏](https://s21.ax1x.com/2024/10/24/pAwKsvq.jpg)

## 获取工具栏助手函数实例

::: code-group

```vue [useGlobal() 方式]
<!-- 在 `setup()` 生命周期或者可以获取到 `Vue上下文` 中的代码里获取方式 -->
<script setup lang="ts">
const toolbar = useGlobal().$toolbars
</script>
```

```ts [通过 Vue 实例获取]
// 通过当前实例获取
const { appContext } = getCurrentInstance()
const toolbar = appContext.config.globalProperties.$toolbars

```

```ts [插件内获取方法]
/**
 * 系统插件 `install` 方法，外部会传入 Vue 实例，然后获取 toolbar
 * 可参考 `src/plugins/mine-admin/demo/index.ts`
 **/
install(app: App) {
  const toolbar = app.config.globalProperties.$toolbars
}
```
:::

## toolbar API列表
|       API        |               类型               |     说明     |      返回值       |
|:----------------:|:------------------------------:|:----------:|:--------------:|
|  getShowToolbar  |            Function            | 获取启用的工具列表  | MineToolbar[]  |
|     toolbars     |       Ref<MineToolbar[]>       |  注册的工具列表   | MineToolbar[]  |
|  add  | Function(toolbar: MineToolbar) | 向工具栏注册新工具  |      void      |
|  remove  |     Function(name: string)     | 移除工具栏注册的工具 |      void      |

## MineToolbar 类型
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
## 注册新工具

:::tip
`handle` 事件和 `component` 属性冲突，两者只会生效一种，`handle` 优先级高。
如若使用 `component` 请不要定义 `handle` 或者注释掉
:::

```ts
const toolbar = useGlobal().$toolbars
toolbar.add({
  name: 'test',
  title: '测试',
  show: true,
  icon: 'heroicons:archive-box',
  // 工具被点击时，触发 handle 方法，可用于简单的弹窗提示等等
  handle: () => alert('我是注册的新工具哦'),
  /**
   * 指定组件，完全通过组件来渲染显示
   * 同时上面的 icon 属性将不被渲染，handle 方法也将失效
   * 
   * 注意：实际开发中，在使用 component 后需要将 handle 注释掉
   **/
  component: () => import('@/modules/demo/views/demo.vue')
})
```

## 移除已注册的工具

```ts
const toolbar = useGlobal().$toolbars

// 移除 name 为 test 的工具
toolbar.remove('test')
```