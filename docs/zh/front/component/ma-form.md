# MaForm

基于 `Element plus` 的表单二次封装的 `Form` 组件，支持所有原生表单的参数、事件、插槽、写法，还支持通过配置方式来实现。
另外还支持了基于 `el-row` 和 `el-space` 的布局来规划表单

::: tip 说明
由于全部兼容及支持原生 `el-from` 的所有参数、事件、插槽，所以只讲扩展参数。

官方表单参数请参考 [Element plus](https://element-plus.org/zh-CN/component/form.html) 官方文档。
:::

## 配置方式使用
<DemoPreview dir="demos/ma-form/config" />

## 模板方式使用
<DemoPreview dir="demos/ma-form/template" />

## 获取`组件`和`el-form-item`的`Ref`
:::tip 提示
这个方式用于 **配置形式**，`template` 里可以自己定义 `ref` 
:::

<DemoPreview dir="demos/ma-form/getRef" />

## Props

| 参数        | 说明                             | 类型         | Ele-官网文档                                                                   | 版本    |
|-----------|--------------------------------|-------------------|----------------------------------------------------------------------------|-------|
| `v-model` | `ma-form`数据，双向绑定               | `MaModel`   | -                                                                          | 1.0.0 |
| `options` | `el-form` 参数及[扩展参数](#extraprops) | `MaFormOptions`   | [表单属性](https://element-plus.org/zh-CN/component/form.html#form-attributes) | 1.0.0 |
| `items`   | [ma-form-item参数](#maformitem)  | `MaFormItem[]` | -                                                                          | 1.0.0 |

### ExtraProps
::: tip 说明
此为 `ma-form` 对 `el-form` 的扩展参数
:::
| 参数        | 说明                                                                    | 类型                                                                                              | 默认值      | 版本    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | 表单容器类名                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | 是否开启加载动画                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | 加载动画的相关配置                                                             | [LoadingConfig](#loadingconfig说明)                                                               | -        | 1.0.0 |
| `layout` | <el-tooltip content="布局方式，在使用`flex`时，可在 `item` 的 `itemProps` 配置项里设置 `cols` 参数 ，默认值：`flex`">`鼠标放上查看`</el-tooltip>  | `flex, grid` | `flex` | 1.0.0 |
| `grid` | <el-tooltip content=" `grid` 布局，在 `layout` 为 `grid` 时生效。实际是用的 `el-space`，配置可参考 `element-plus` 的 `el-space` 文档">`鼠标放上查看`</el-tooltip> | [el-space文档](https://element-plus.org/zh-CN/component/space.html#attributes)     | -        | 1.0.0 |
| `flex` | <el-tooltip content=" `flex` 布局，在 `layout` 为 `flex` 时生效。实际是用的 `el-row`，配置可参考 `element-plus` 的 `el-row` 文档">`鼠标放上查看`</el-tooltip> | [el-row文档](https://element-plus.org/zh-CN/component/layout.html#row-attributes)     | -        | 1.0.0 |
| `footerSlot` | <el-tooltip content="配置型插槽，在 `template` 写法为 #footer">`鼠标放上查看`</el-tooltip>       | `() => {}`  | -  | 1.0.0 |

#### LoadingConfig说明
| 参数        | 说明      | 类型   | 默认值 | 版本    |
|-----------|----------|------|-----|-------|
| `text` | 显示在加载图标下方的加载文案   | `string`  | -   | 1.0.0 |
| `spinner` | 自定义加载图标   | `string` | -   | 1.0.0 |
| `svg` | 自定义 `svg` 加载图标   | `string` | -   | 1.0.0 |
| `viewBox` | 加载图标的大小   | `string` | -   | 1.0.0 |
| `background` | 背景遮罩的颜色   | `string` | -   | 1.0.0 |
| `customClass` | 自定义 class 类名   | `string` | -   | 1.0.0 |

### MaFormItem

| 参数             | 说明                                                                                                                                                                              | 类型                                                                                                 | 默认值     | 版本    |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|-------|
| `label`        | 增强原生参数，添加支持函数类型                                                                                                                                                                 | `string, () => string`                                                                             | -       | 1.0.0 |
| `prop`         | 增强原生参数，添加支持函数类型                                                                                                                                                                 | `string, () => string`                                                                             | -       | 1.0.0 |
| `hide`   | <el-tooltip content="是否隐藏该项，隐藏后还是有数据的，默认: `false`，自定义组件下可能无效">`鼠标放上查看`</el-tooltip>                                                                                             | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`鼠标放上查看`</el-tooltip> | `false` | 1.0.0 |
| `show` | <el-tooltip content="是否显示该项，不显示后实际不渲染，也没有数据，默认: `true`，自定义组件下可能无效">`鼠标放上查看`</el-tooltip>                                                                                        | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`鼠标放上查看`</el-tooltip> | `true`  | 1.0.0 |
| `cols` | 在 `options.layout 为 flex` 下生效                                                                                                                                                   | [el-col文档](https://element-plus.org/zh-CN/component/layout.html#col-attributes)                    | -       | 1.0.0 |
| `itemProps` | `el-form-item` 原生属性                                                                                                                                                             | [表单项属性](https://element-plus.org/zh-CN/component/form.html#formitem-attributes)                    | -       | 1.0.0 |
| `itemSlots` | `el-form-item` 原生插槽                                                                                                                                                             | [表单项插槽](https://element-plus.org/zh-CN/component/form.html#formitem-slots)                         | -       | 1.0.0 |
| `render` | 渲染单元格：<el-tooltip content="设置要渲染的组件，可设置 `element plus` 的所有 `form` 组件，例如：`input`, `datePicker`，也可以传入 `tsx`, `jsx` 语法的虚拟dom，也可以传入一个组件，函数式，例如：() => ElInput">`鼠标放上查看`</el-tooltip> | `string, (data) => any`                                                                            | -       | 1.0.0 |
| `renderProps` | 被渲染组件的 `props` 属性                                                                                                                                                               | `Record<string, any>`                                                                              | -       | 1.0.0 |
| `renderSlots` | 被渲染组件的插槽  | `Record<string, (...args) => {}>`                                                                  | -       | 1.0.0 |

## Slot

| 名称              | 说明                                    | 参数 |
|-----------------|---------------------------------------|----|
| `default`       | 默认插槽，可写原生标签 `<el-form-item>`，配置方式自动失效 | -  |
| `footer`        | 表单底部插槽                                | -  |


## Expose
| 名称                  | 说明                | 参数                | 返回值             |
|---------------------|-------------------|-------------------|-----------------|
| `setLoadingState()` | 设置表单 `loading` 状态 | `(boolean)`       | -               |
| `setOptions()`      | 设置 `ma-form` 配置   | `(MaFormOptions)` | -               |
| `getOptions()`      | 获取 `ma-form` 配置   | -                 | `MaFormOptions` |
| `setItems()`        | 设置表单项             | `(MaFormItem[])`  | -               |
| `getItems()`        | 获取表单项             | -                 | `MaFormItem[]`  |
| `appendItem()`      | 追加表单项             | `(MaFormItem)`    | -               |
| `removeItem()`      | 移除表单项             | `(prop: string)`  | -              |
| `getItemByProp()`   | 按`prop`获取表单项      | `(prop: string)`  | `MaFormItem`    |
| `isMobileState()`   | 检查是否为移动端模式        | -                 | `boolean`    |
| `getElFormRef()`    | 获取 `el-form` Ref  | -                 | `El-Form`       |
