# MaSearch

`ma-search` 基于 `ma-form` 封装而来，用于快速构建一个搜索表单。

:::tip 提示
`form` 和 `form-item` 与 `ma-form` 的参数一致。
:::

## 使用
<DemoPreview dir="demos/ma-search" />

## Props
::: tip 参数说明
- `options` 是搜索组件的配置项
- `formOptions` 是 `ma-form` 的配置项
- `searchItems` 是在 [ma-form-item](ma-form#maformitem) 基础上增加了新的属性
:::
| 参数       | 说明                          | 类型         | 版本    |
|----------|-----------------------------|-------------------|--------|
| `options` | `ma-search` 参数              | `MaFormOptions`   | 1.0.0 |
| `formOptions`  | [ma-form参数](ma-form#props)  | `MaFormOptions` | 1.0.0 |
| `searchItems`  | [form-item参数](#searchitems) | `MaSearchItem[]` | 1.0.0 |

### MaFormOptions
| 参数        | 说明       | 类型                                                  | 默认值     | 版本    |
|-----------|----------|-----------------------------------------------------|---------|-------|
| `defaultValue` | 搜索默认值配置  | `Record<string, any>`                               | -       | 1.0.0 |
| `cols` | 搜索设置列数   | Record<[MediaBreakPoint](#mediabreakpoint), number> | -       | 1.0.0 |
| `fold` | 是否折叠搜索面板 | `boolean`                                           | `false` | 1.0.0 |
| `foldRows` | 折叠后显示个数  | `number`                                            | 2       | 1.0.0 |
| `show` | 是否显示搜索面板 | `boolean`                                           | `true`  | 1.0.0 |
| `text` | 文案配置     | [文案配置](#文案配置)                                   | -       | 1.0.0 |

#### MediaBreakPoint
| 参数   | 说明           | 类型       | 默认值 | 版本    |
|------|--------------|----------|-----|-------|
| `xs` | <768px 显示列数  | `number` | 1   | 1.0.0 |
| `sm` | ≥768px 显示列数  | `number` | 2   | 1.0.0 |
| `md` | ≥992px 显示列数  | `number` | 2   | 1.0.0 |
| `lg` | ≥1200px 显示列数     | `number` | 3   | 1.0.0 |
| `xl` | ≥1920px 显示列数     | `number` | 4   | 1.0.0 |

#### 文案配置
| 参数           | 说明        | 类型         | 默认值 | 版本    |
|--------------|-----------|------------|----|-------|
| `searchBtn`  | 搜索按钮文案  | `() => {}` | 搜索 | 1.0.0 |
| `resetBtn`   | 重置按钮文案  |  `() => {}`   | 重置 | 1.0.0 |
| `isFoldBtn`  | 展开按钮文案  |  `() => {}`   | 展开 | 1.0.0 |
| `notFoldBtn` | 折叠按钮文案  |  `() => {}`   | 折叠 | 1.0.0 |

### SearchItems

| 参数       | 说明                     | 类型                        | 默认值 | 版本    |
|----------|------------------------|---------------------------|---|-------|
| `span`   | 合并跨列数                  | `number`                  | 1 | 1.0.0 |
| `offset` | 间隔大小                   | `number`                  | 0 | 1.0.0 |
| `hide`   | 是否隐藏                   | `boolean & () => boolean` | false | 1.0.0 |
| ...      | 其余都是 `ma-form-item` 参数 | -                         | - | 1.0.0 |

## Event

| 名称              | 说明       | 参数                       |
|-----------------|----------|--------------------------|
| `search`       | 提交搜索     | `(formData: any) => {}`               |
| `reset`        | 重置搜索     | `(formData: any) => {}`  |
| `fold`        | 折叠、展开时触发 | `(state: boolean) => {}` |

## Slot

| 名称              | 说明                                   | 参数 |
|-----------------|--------------------------------------|----|
| `default`       | 默认插槽，可写原生标签 `<el-form-item>`，配置方式自动失效 | -  |
| `actions`        | 覆盖掉组件内的 `搜索`，`重置` 按钮插槽               | -  |
| `beforeActions`        | 在`操作按钮`前面插入内容插槽                      | -  |
| `afterActions`        | 在`操作按钮`后面追加内容插槽                      | -  |

## Expose
| 名称                | 说明                 | 参数                    | 返回值                   |
|-------------------|--------------------|-----------------------|-----------------------|
| `getMaFormRef()`  | 获取 `ma-form` 的Ref  | -                     | MaForm                |
| `foldToggle()`    | 展开、折叠切换            | -                     | -                     |
| `getFold()`       | 获取折叠状态             | -                     | `boolean`             |
| `setSearchForm()` | 设置搜索表单值            | `(form: any) => void` | -                     |
| `getSearchForm()` | 获取搜索表单值            | -                     | `Record<string, any>` |
| `setShowState()`  | 设置搜索是否显示           | (boolean) => void     | -                     |
| `getShowState()`  | 获取搜索显示状态           | -                     | `boolean`             |
| `setOptions()`    | 设置 `ma-search` 参数  | `(MaSearchOptions)`   | -                     |
| `getOptions()`    | 获取 `ma-search` 参数  | -                     | `MaSearchOptions`     |
| `setFormOptions()`      | 设置 `ma-form` 参数    | `(MaFormOptions)`     | -                     |
| `getFormOptions()`      | 获取 `ma-form` 参数    | -                     | `MaFormOptions`       |
| `setItems()`      | 设置 `ma-search` 表单项 | `(MaSearchItem[])`    | -                     |
| `getItems()`      | 获取 `ma-search` 表单项 | -                     | `MaSearchItem`                     |
| `appendItem()`    | 追加搜索表单项              | `(MaSearchItem)`        | -                     |
| `removeItem()`    | 移除搜索表单项              | `(prop: string)`      | -                     |
| `getItemByProp()` | 按`prop`获取搜索表单项     | `(prop: string)`      | `MaSearchItem`          |
