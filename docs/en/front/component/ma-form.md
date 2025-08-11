# MaForm

A secondary encapsulation of the `Form` component based on `Element Plus`, supporting all native form parameters, events, slots, and syntax, as well as configuration-based implementation.  
Additionally, it supports layout planning for forms using `el-row` and `el-space`.

::: tip Note  
Since it fully supports all parameters, events, and slots of the native `el-form`, only the extended parameters will be discussed here.  

For official form parameters, please refer to the [Element Plus](https://element-plus.org/zh-CN/component/form.html) documentation.  
:::

## Configuration-Based Usage  
<DemoPreview dir="demos/ma-form/config" />

## Template-Based Usage  
<DemoPreview dir="demos/ma-form/template" />

## Getting the `Ref` of Components and `el-form-item`  
:::tip Tip  
This method is for **configuration-based** usage. In `template` mode, you can define `ref` yourself.  
:::

<DemoPreview dir="demos/ma-form/getRef" />

## Props  

| Parameter      | Description                          | Type         | Ele-Official Docs                                                                 | Version |
|---------------|--------------------------------------|--------------|----------------------------------------------------------------------------------|---------|
| `v-model`     | `ma-form` data, two-way binding      | `MaModel`    | -                                                                                | 1.0.0   |
| `options`     | `el-form` parameters and [extended parameters](#extraprops) | `MaFormOptions` | [Form Attributes](https://element-plus.org/zh-CN/component/form.html#form-attributes) | 1.0.0   |
| `items`       | [ma-form-item parameters](#maformitem) | `MaFormItem[]` | -                                                                                | 1.0.0   |

### ExtraProps  
::: tip Note  
These are the extended parameters of `ma-form` for `el-form`.  
:::
| Parameter           | Description                                                                 | Type                                                                                              | Default    | Version |
|--------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|------------|---------|
| `containerClass`   | Form container class name                                                   | `string`                                                                                        | -          | 1.0.0   |
| `loading`         | Whether to enable loading animation                                         | `boolean`                                                                                       | `false`    | 1.0.0   |
| `loadingConfig`   | Configuration for loading animation                                         | [LoadingConfig](#loadingconfig-description)                                                     | -          | 1.0.0   |
| `layout`          | <el-tooltip content="Layout method. When using `flex`, you can set the `cols` parameter in `itemProps` of `item`. Default: `flex`">`Hover to view`</el-tooltip> | `flex, grid` | `flex` | 1.0.0   |
| `grid`            | <el-tooltip content="`grid` layout, effective when `layout` is `grid`. Uses `el-space` internally. Configuration refers to `el-space` docs in `element-plus`">`Hover to view`</el-tooltip> | [el-space docs](https://element-plus.org/zh-CN/component/space.html#attributes) | - | 1.0.0   |
| `flex`            | <el-tooltip content="`flex` layout, effective when `layout` is `flex`. Uses `el-row` internally. Configuration refers to `el-row` docs in `element-plus`">`Hover to view`</el-tooltip> | [el-row docs](https://element-plus.org/zh-CN/component/layout.html#row-attributes) | - | 1.0.0   |
| `footerSlot`      | <el-tooltip content="Configuration-based slot. In `template` mode, it is written as `#footer`">`Hover to view`</el-tooltip> | `() => {}` | - | 1.0.0   |

#### LoadingConfig Description  
| Parameter       | Description                     | Type     | Default | Version |
|----------------|--------------------------------|----------|---------|---------|
| `text`         | Loading text below the icon     | `string` | -       | 1.0.0   |
| `spinner`      | Custom loading icon             | `string` | -       | 1.0.0   |
| `svg`          | Custom `svg` loading icon       | `string` | -       | 1.0.0   |
| `viewBox`      | Size of the loading icon        | `string` | -       | 1.0.0   |
| `background`   | Background mask color           | `string` | -       | 1.0.0   |
| `customClass`  | Custom class name               | `string` | -       | 1.0.0   |

### MaFormItem  

| Parameter         | Description                                                                                                                                                                             | Type                                                                                                 | Default   | Version  |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|-----------|----------|
| `label`          | Enhanced native parameter, supports function type                                                                                                                                       | `string, () => string`                                                                             | -         | 1.0.0    |
| `prop`           | Enhanced native parameter, supports function type                                                                                                                                       | `string, () => string`                                                                             | -         | 1.0.0    |
| `hide`           | <el-tooltip content="Whether to hide this item. Hidden items still retain data. Default: `false`. May not work with custom components.">`Hover to view`</el-tooltip>                     | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`Hover to view`</el-tooltip> | `false`   | 1.0.0    |
| `show`           | <el-tooltip content="Whether to display this item. Non-displayed items are not rendered and have no data. Default: `true`. May not work with custom components.">`Hover to view`</el-tooltip> | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`Hover to view`</el-tooltip> | `true`    | 1.0.0    |
| `cols`           | Effective when `options.layout` is `flex`                                                                                                                                               | [el-col docs](https://element-plus.org/zh-CN/component/layout.html#col-attributes)                    | -         | 1.0.0    |
| `itemProps`      | Native attributes of `el-form-item`                                                                                                                                                     | [Form Item Attributes](https://element-plus.org/zh-CN/component/form.html#formitem-attributes)        | -         | 1.0.0    |
| `itemSlots`      | Native slots of `el-form-item`                                                                                                                                                          | [Form Item Slots](https://element-plus.org/zh-CN/component/form.html#formitem-slots)                   | -         | 1.0.0    |
| `render`         | Rendered component: <el-tooltip content="Set the component to render. Supports all `form` components of `element plus`, such as `input`, `datePicker`. Also supports `tsx`, `jsx` virtual DOM or a functional component, e.g., `() => ElInput`">`Hover to view`</el-tooltip> | `string, (data) => any`                                                                            | -         | 1.0.0    |
| `renderProps`    | `props` of the rendered component                                                                                                                                                       | `Record<string, any>`                                                                              | -         | 1.0.0    |
| `renderSlots`    | Slots of the rendered component                                                                                                                                                         | `Record<string, (...args) => {}>`                                                                  | -         | 1.0.0    |
| `children`       | Child configurations, supports infinite nesting. Note: If the parent component uses slots, child configurations will be invalid.                                                                 | `MaFormItem[]`                                                                                     | -         | 1.0.33   |

## Slot  

| Name             | Description                                  | Parameters |
|------------------|---------------------------------------------|------------|
| `default`        | Default slot, can write native `<el-form-item>`. Configuration mode is automatically disabled. | -          |
| `footer`         | Form footer slot                            | -          |

## Expose  

| Name                  | Description                | Parameters                | Return Value       |
|-----------------------|---------------------------|---------------------------|-------------------|
| `setLoadingState()`   | Set form `loading` state   | `(boolean)`               | -                 |
| `setOptions()`        | Set `ma-form` configuration | `(MaFormOptions)`         | -                 |
| `getOptions()`        | Get `ma-form` configuration | -                         | `MaFormOptions`   |
| `setItems()`          | Set form items             | `(MaFormItem[])`          | -                 |
| `getItems()`          | Get form items             | -                         | `MaFormItem[]`    |
| `appendItem()`        | Append form item           | `(MaFormItem)`            | -                 |
| `removeItem()`        | Remove form item           | `(prop: string)`          | -                 |
| `getItemByProp()`     | Get form item by `prop`    | `(prop: string)`          | `MaFormItem`      |
| `isMobileState()`     | Check if in mobile mode    | -                         | `boolean`         |
| `getElFormRef()`      | Get `el-form` Ref         | -                         | `El-Form`         |