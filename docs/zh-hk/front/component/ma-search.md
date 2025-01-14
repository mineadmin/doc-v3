# MaSearch

`ma-search` 基於 `ma-form` 封裝而來，用於快速構建一個搜索表單。

:::tip 提示
`form` 和 `form-item` 與 `ma-form` 的參數一致。
:::

## 使用
<DemoPreview dir="demos/ma-search" />

## Props
::: tip 參數説明
- `options` 是搜索組件的配置項
- `formOptions` 是 `ma-form` 的配置項
- `searchItems` 是在 [ma-form-item](ma-form#maformitem) 基礎上增加了新的屬性
:::
| 參數       | 説明                          | 類型         | 版本    |
|----------|-----------------------------|-------------------|--------|
| `options` | `ma-search` 參數              | `MaFormOptions`   | 1.0.0 |
| `formOptions`  | [ma-form參數](ma-form#props)  | `MaFormOptions` | 1.0.0 |
| `searchItems`  | [form-item參數](#searchitems) | `MaSearchItem[]` | 1.0.0 |

### MaFormOptions
| 參數        | 説明       | 類型                                                  | 默認值     | 版本    |
|-----------|----------|-----------------------------------------------------|---------|-------|
| `defaultValue` | 搜索默認值配置  | `Record<string, any>`                               | -       | 1.0.0 |
| `cols` | 搜索設置列數   | Record<[MediaBreakPoint](#mediabreakpoint), number> | -       | 1.0.0 |
| `fold` | 是否摺疊搜索面板 | `boolean`                                           | `false` | 1.0.0 |
| `foldRows` | 摺疊後顯示個數  | `number`                                            | 2       | 1.0.0 |
| `show` | 是否顯示搜索面板 | `boolean`                                           | `true`  | 1.0.0 |
| `text` | 文案配置     | [文案配置](#文案配置)                                   | -       | 1.0.0 |

#### MediaBreakPoint
| 參數   | 説明           | 類型       | 默認值 | 版本    |
|------|--------------|----------|-----|-------|
| `xs` | <768px 顯示列數  | `number` | 1   | 1.0.0 |
| `sm` | ≥768px 顯示列數  | `number` | 2   | 1.0.0 |
| `md` | ≥992px 顯示列數  | `number` | 2   | 1.0.0 |
| `lg` | ≥1200px 顯示列數     | `number` | 3   | 1.0.0 |
| `xl` | ≥1920px 顯示列數     | `number` | 4   | 1.0.0 |

#### 文案配置
| 參數           | 説明        | 類型         | 默認值 | 版本    |
|--------------|-----------|------------|----|-------|
| `searchBtn`  | 搜索按鈕文案  | `() => {}` | 搜索 | 1.0.0 |
| `resetBtn`   | 重置按鈕文案  |  `() => {}`   | 重置 | 1.0.0 |
| `isFoldBtn`  | 展開按鈕文案  |  `() => {}`   | 展開 | 1.0.0 |
| `notFoldBtn` | 摺疊按鈕文案  |  `() => {}`   | 摺疊 | 1.0.0 |

### SearchItems

| 參數       | 説明                     | 類型                        | 默認值 | 版本    |
|----------|------------------------|---------------------------|---|-------|
| `span`   | 合併跨列數                  | `number`                  | 1 | 1.0.0 |
| `offset` | 間隔大小                   | `number`                  | 0 | 1.0.0 |
| `hide`   | 是否隱藏                   | `boolean & () => boolean` | false | 1.0.0 |
| ...      | 其餘都是 `ma-form-item` 參數 | -                         | - | 1.0.0 |

## Event

| 名稱              | 説明       | 參數                       |
|-----------------|----------|--------------------------|
| `search`       | 提交搜索     | `(formData: any) => {}`               |
| `reset`        | 重置搜索     | `(formData: any) => {}`  |
| `fold`        | 摺疊、展開時觸發 | `(state: boolean) => {}` |

## Slot

| 名稱              | 説明                                   | 參數 |
|-----------------|--------------------------------------|----|
| `default`       | 默認插槽，可寫原生標籤 `<el-form-item>`，配置方式自動失效 | -  |
| `actions`        | 覆蓋掉組件內的 `搜索`，`重置` 按鈕插槽               | -  |
| `beforeActions`        | 在`操作按鈕`前面插入內容插槽                      | -  |
| `afterActions`        | 在`操作按鈕`後面追加內容插槽                      | -  |

## Expose
| 名稱                | 説明                 | 參數                    | 返回值                   |
|-------------------|--------------------|-----------------------|-----------------------|
| `getMaFormRef()`  | 獲取 `ma-form` 的Ref  | -                     | MaForm                |
| `foldToggle()`    | 展開、摺疊切換            | -                     | -                     |
| `getFold()`       | 獲取摺疊狀態             | -                     | `boolean`             |
| `setSearchForm()` | 設置搜索表單值            | `(form: any) => void` | -                     |
| `getSearchForm()` | 獲取搜索表單值            | -                     | `Record<string, any>` |
| `setShowState()`  | 設置搜索是否顯示           | (boolean) => void     | -                     |
| `getShowState()`  | 獲取搜索顯示狀態           | -                     | `boolean`             |
| `setOptions()`    | 設置 `ma-search` 參數  | `(MaSearchOptions)`   | -                     |
| `getOptions()`    | 獲取 `ma-search` 參數  | -                     | `MaSearchOptions`     |
| `setFormOptions()`      | 設置 `ma-form` 參數    | `(MaFormOptions)`     | -                     |
| `getFormOptions()`      | 獲取 `ma-form` 參數    | -                     | `MaFormOptions`       |
| `setItems()`      | 設置 `ma-search` 表單項 | `(MaSearchItem[])`    | -                     |
| `getItems()`      | 獲取 `ma-search` 表單項 | -                     | `MaSearchItem`                     |
| `appendItem()`    | 追加搜索表單項              | `(MaSearchItem)`        | -                     |
| `removeItem()`    | 移除搜索表單項              | `(prop: string)`      | -                     |
| `getItemByProp()` | 按`prop`獲取搜索表單項     | `(prop: string)`      | `MaSearchItem`          |
