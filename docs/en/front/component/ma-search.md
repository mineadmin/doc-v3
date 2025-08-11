# MaSearch

`ma-search` is built upon `ma-form` for quickly constructing a search form.

:::tip Note
The parameters for `form` and `form-item` are consistent with those in `ma-form`.
:::

## Usage
<DemoPreview dir="demos/ma-search" />

## Props
::: tip Parameter Description
- `options` are the configuration items for the search component.
- `formOptions` are the configuration items for `ma-form`.
- `searchItems` adds new properties based on [ma-form-item](ma-form#maformitem).
:::
| Parameter       | Description                          | Type         | Version    |
|----------|-----------------------------|-------------------|--------|
| `options` | Parameters for `ma-search`              | `MaFormOptions`   | 1.0.0 |
| `formOptions`  | [ma-form parameters](ma-form#props)  | `MaFormOptions` | 1.0.0 |
| `searchItems`  | [form-item parameters](#searchitems) | `MaSearchItem[]` | 1.0.0 |

### MaFormOptions
| Parameter        | Description       | Type                                                  | Default     | Version    |
|-----------|----------|-----------------------------------------------------|---------|-------|
| `defaultValue` | Default search value configuration  | `Record<string, any>`                               | -       | 1.0.0 |
| `cols` | Number of search columns   | Record<[MediaBreakPoint](#mediabreakpoint), number> | -       | 1.0.0 |
| `fold` | Whether to fold the search panel | `boolean`                                           | `false` | 1.0.0 |
| `foldRows` | Number of items displayed when folded  | `number`                                            | 2       | 1.0.0 |
| `show` | Whether to show the search panel | `boolean`                                           | `true`  | 1.0.0 |
| `text` | Text configuration     | [Text Configuration](#text-configuration)                                   | -       | 1.0.0 |

#### MediaBreakPoint
| Parameter   | Description           | Type       | Default | Version    |
|------|--------------|----------|-----|-------|
| `xs` | Number of columns for <768px  | `number` | 1   | 1.0.0 |
| `sm` | Number of columns for ≥768px  | `number` | 2   | 1.0.0 |
| `md` | Number of columns for ≥992px  | `number` | 2   | 1.0.0 |
| `lg` | Number of columns for ≥1200px     | `number` | 3   | 1.0.0 |
| `xl` | Number of columns for ≥1920px     | `number` | 4   | 1.0.0 |

#### Text Configuration
| Parameter           | Description        | Type         | Default | Version    |
|--------------|-----------|------------|----|-------|
| `searchBtn`  | Search button text  | `() => {}` | Search | 1.0.0 |
| `resetBtn`   | Reset button text  |  `() => {}`   | Reset | 1.0.0 |
| `isFoldBtn`  | Expand button text  |  `() => {}`   | Expand | 1.0.0 |
| `notFoldBtn` | Collapse button text  |  `() => {}`   | Collapse | 1.0.0 |

### SearchItems

| Parameter       | Description                     | Type                        | Default | Version    |
|----------|------------------------|---------------------------|---|-------|
| `span`   | Column span                  | `number`                  | 1 | 1.0.0 |
| `offset` | Offset size                   | `number`                  | 0 | 1.0.0 |
| `hide`   | Whether to hide                   | `boolean & () => boolean` | false | 1.0.0 |
| ...      | Other parameters are `ma-form-item` properties | -                         | - | 1.0.0 |

## Event

| Name              | Description       | Parameters                       |
|-----------------|----------|--------------------------|
| `search`       | Submit search     | `(formData: any) => {}`               |
| `reset`        | Reset search     | `(formData: any) => {}`  |
| `fold`        | Triggered when folding/expanding | `(state: boolean) => {}` |

## Slot

| Name              | Description                                   | Parameters |
|-----------------|--------------------------------------|----|
| `default`       | Default slot, can write native `<el-form-item>` tags, automatic configuration will be disabled | -  |
| `actions`        | Override the built-in `Search` and `Reset` buttons               | -  |
| `beforeActions`        | Insert content before the `action buttons`                      | -  |
| `afterActions`        | Append content after the `action buttons`                      | -  |

## Expose
| Name                | Description                 | Parameters                    | Return Value                   |
|-------------------|--------------------|-----------------------|-----------------------|
| `getMaFormRef()`  | Get the Ref of `ma-form`  | -                     | MaForm                |
| `foldToggle()`    | Toggle expand/collapse            | -                     | -                     |
| `getFold()`       | Get the fold state             | -                     | `boolean`             |
| `setSearchForm()` | Set the search form value            | `(form: any) => void` | -                     |
| `getSearchForm()` | Get the search form value            | -                     | `Record<string, any>` |
| `setShowState()`  | Set whether the search is displayed           | (boolean) => void     | -                     |
| `getShowState()`  | Get the search display state           | -                     | `boolean`             |
| `setOptions()`    | Set `ma-search` parameters  | `(MaSearchOptions)`   | -                     |
| `getOptions()`    | Get `ma-search` parameters  | -                     | `MaSearchOptions`     |
| `setFormOptions()`      | Set `ma-form` parameters    | `(MaFormOptions)`     | -                     |
| `getFormOptions()`      | Get `ma-form` parameters    | -                     | `MaFormOptions`       |
| `setItems()`      | Set `ma-search` form items | `(MaSearchItem[])`    | -                     |
| `getItems()`      | Get `ma-search` form items | -                     | `MaSearchItem`                     |
| `appendItem()`    | Append a search form item              | `(MaSearchItem)`        | -                     |
| `removeItem()`    | Remove a search form item              | `(prop: string)`      | -                     |
| `getItemByProp()` | Get a search form item by `prop`     | `(prop: string)`      | `MaSearchItem`          |