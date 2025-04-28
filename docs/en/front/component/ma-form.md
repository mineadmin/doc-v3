# MaForm

A `Form` component based on the secondary encapsulation of `Element plus`, supporting all native form parameters, events, slots, and syntax. It also supports configuration-based implementation.
Additionally, it supports layout planning for forms based on `el-row` and `el-space`.

::: tip Note
Since it fully supports and is compatible with all parameters, events, and slots of the native `el-form`, only the extended parameters are discussed here.

For official form parameters, please refer to the [Element plus](https://element-plus.org/zh-CN/component/form.html) official documentation.
:::

## Configuration-based Usage
<DemoPreview dir="demos/ma-form/config" />

## Template-based Usage
<DemoPreview dir="demos/ma-form/template" />

## Getting `Component` and `el-form-item` `Ref`
:::tip Tip
This method is for **configuration form**. In `template`, you can define `ref` yourself.
:::

<DemoPreview dir="demos/ma-form/getRef" />

## Props

| Parameter        | Description                             | Type         | Ele-Official Documentation                                                                   | Version    |
|-----------|--------------------------------|-------------------|----------------------------------------------------------------------------|-------|
| `v-model` | `ma-form` data, two-way binding               | `MaModel`   | -                                                                          | 1.0.0 |
| `options` | `el-form` parameters and [extended parameters](#extraprops) | `MaFormOptions`   | [Form Attributes](https://element-plus.org/zh-CN/component/form.html#form-attributes) | 1.0.0 |
| `items`   | [ma-form-item parameters](#maformitem)  | `MaFormItem[]` | -                                                                          | 1.0.0 |

### ExtraProps
::: tip Note
These are the extended parameters of `ma-form` for `el-form`.
:::
| Parameter        | Description                                                                    | Type                                                                                              | Default      | Version    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | Form container class name                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | Whether to enable loading animation                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | Loading animation related configuration                                                             | [LoadingConfig](#loadingconfig说明)                                                               | -        | 1.0.0 |
| `layout` | <el-tooltip content="Layout method, when using `flex`, you can set the `cols` parameter in the `itemProps` configuration item of `item`, default value: `flex`">`Hover to view`</el-tooltip>  | `flex, grid` | `flex` | 1.0.0 |
| `grid` | <el-tooltip content=" `grid` layout, effective when `layout` is `grid`. It actually uses `el-space`, configuration can refer to `element-plus` `el-space` documentation">`Hover to view`</el-tooltip> | [el-space documentation](https://element-plus.org/zh-CN/component/space.html#attributes)     | -        | 1.0.0 |
| `flex` | <el-tooltip content=" `flex` layout, effective when `layout` is `flex`. It actually uses `el-row`, configuration can refer to `element-plus` `el-row` documentation">`Hover to view`</el-tooltip> | [el-row documentation](https://element-plus.org/zh-CN/component/layout.html#row-attributes)     | -        | 1.0.0 |
| `footerSlot` | <el-tooltip content="Configuration slot, in `template` it is written as #footer">`Hover to view`</el-tooltip>       | `() => {}`  | -  | 1.0.0 |

#### LoadingConfig Description
| Parameter        | Description      | Type   | Default | Version    |
|-----------|----------|------|-----|-------|
| `text` | Loading text displayed below the loading icon   | `string`  | -   | 1.0.0 |
| `spinner` | Custom loading icon   | `string` | -   | 1.0.0 |
| `svg` | Custom `svg` loading icon   | `string` | -   | 1.0.0 |
| `viewBox` | Size of the loading icon   | `string` | -   | 1.0.0 |
| `background` | Background mask color   | `string` | -   | 1.0.0 |
| `customClass` | Custom class name   | `string` | -   | 1.0.0 |

### MaFormItem

| Parameter             | Description                                                                                                                                                                             | Type                                                                                                 | Default     | Version    |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|-------|
| `label`        | Enhanced native parameter, added support for function type                                                                                                                                                                | `string, () => string`                                                                             | -       | 1.0.0 |
| `prop`         | Enhanced native parameter, added support for function type                                                                                                                                                                | `string, () => string`                                                                             | -       | 1.0.0 |
| `hide`   | <el-tooltip content="Whether to hide this item, hidden items still have data, default: `false`, may not work in custom components">`Hover to view`</el-tooltip>                                                                                            | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`Hover to view`</el-tooltip> | `false` | 1.0.0 |
| `show` | <el-tooltip content="Whether to show this item, if not shown, it is not rendered and has no data, default: `true`, may not work in custom components">`Hover to view`</el-tooltip>                                                                                       | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`Hover to view`</el-tooltip> | `true`  | 1.0.0 |
| `cols` | Effective when `options.layout` is `flex`                                                                                                                                                  | [el-col documentation](https://element-plus.org/zh-CN/component/layout.html#col-attributes)                    | -       | 1.0.0 |
| `itemProps` | `el-form-item` native properties                                                                                                                                                            | [Form Item Attributes](https://element-plus.org/zh-CN/component/form.html#formitem-attributes)                    | -       | 1.0.0 |
| `itemSlots` | `el-form-item` native slots                                                                                                                                                            | [Form Item Slots](https://element-plus.org/zh-CN/component/form.html#formitem-slots)                         | -       | 1.0.0 |
| `render` | Render component: <el-tooltip content="Set the component to be rendered, can set all `form` components of `element plus`, such as: `input`, `datePicker`, can also pass in `tsx`, `jsx` syntax virtual dom, can also pass in a component, functional, such as: () => ElInput">`Hover to view`</el-tooltip> | `string, (data) => any`                                                                            | -       | 1.0.0 |
| `renderProps` | `props` properties of the rendered component                                                                                                                                                              | `Record<string, any>`                                                                              | -       | 1.0.0 |
| `renderSlots` | Slots of the rendered component                                                                                                                                                                       | `Record<string, (...args) => {}>`                                                                  | -       | 1.0.0 |
| `children`    | Sub-configuration items support unlimited nesting. Note: If the parent component uses slots, the sub-configuration items will be ineffective.                                                                                                                                                 | `MaFormItem[]`                                                                                     | -       | 1.0.33 |


## Slot

| Name              | Description                                    | Parameters |
|-----------------|---------------------------------------|----|
| `default`       | Default slot, can write native tags `<el-form-item>`, configuration method automatically invalid | -  |
| `footer`        | Form footer slot                                | -  |


## Expose
| Name                  | Description                | Parameters                | Return Value             |
|---------------------|-------------------|-------------------|-----------------|
| `setLoadingState()` | Set form `loading` state | `(boolean)`       | -               |
| `setOptions()`      | Set `ma-form` configuration   | `(MaFormOptions)` | -               |
| `getOptions()`      | Get `ma-form` configuration   | -                 | `MaFormOptions` |
| `setItems()`        | Set form items             | `(MaFormItem[])`  | -               |
| `getItems()`        | Get form items             | -                 | `MaFormItem[]`  |
| `appendItem()`      | Append form item             | `(MaFormItem)`    | -               |
| `removeItem()`      | Remove form item             | `(prop: string)`  | -              |
| `getItemByProp()`   | Get form item by `prop`      | `(prop: string)`  | `MaFormItem`    |
| `isMobileState()`   | Check if it is mobile mode        | -                 | `boolean`    |
| `getElFormRef()`    | Get `el-form` Ref  | -                 | `El-Form`       |