# MaSearch

`ma-search` 基於 `ma-form` 封裝而來，用於快速構建一個搜尋表單。

:::tip 提示
`form` 和 `form-item` 與 `ma-form` 的引數一致。
:::

## 使用
<DemoPreview dir="demos/ma-search" />

## Props
::: tip 引數說明
- `options` 是搜尋元件的配置項
- `formOptions` 是 `ma-form` 的配置項
- `searchItems` 是在 [ma-form-item](ma-form#maformitem) 基礎上增加了新的屬性
:::
| 引數       | 說明                          | 型別         | 版本    |
|----------|-----------------------------|-------------------|--------|
| `options` | `ma-search` 引數              | `MaFormOptions`   | 1.0.0 |
| `formOptions`  | [ma-form引數](ma-form#props)  | `MaFormOptions` | 1.0.0 |
| `searchItems`  | [form-item引數](#searchitems) | `MaSearchItem[]` | 1.0.0 |

### MaFormOptions
| 引數        | 說明       | 型別                                                  | 預設值     | 版本    |
|-----------|----------|-----------------------------------------------------|---------|-------|
| `defaultValue` | 搜尋預設值配置  | `Record<string, any>`                               | -       | 1.0.0 |
| `cols` | 搜尋設定列數   | Record<[MediaBreakPoint](#mediabreakpoint), number> | -       | 1.0.0 |
| `fold` | 是否摺疊搜尋面板 | `boolean`                                           | `false` | 1.0.0 |
| `foldRows` | 摺疊後顯示個數  | `number`                                            | 2       | 1.0.0 |
| `show` | 是否顯示搜尋面板 | `boolean`                                           | `true`  | 1.0.0 |
| `text` | 文案配置     | [文案配置](#文案配置)                                   | -       | 1.0.0 |

#### MediaBreakPoint
| 引數   | 說明           | 型別       | 預設值 | 版本    |
|------|--------------|----------|-----|-------|
| `xs` | <768px 顯示列數  | `number` | 1   | 1.0.0 |
| `sm` | ≥768px 顯示列數  | `number` | 2   | 1.0.0 |
| `md` | ≥992px 顯示列數  | `number` | 2   | 1.0.0 |
| `lg` | ≥1200px 顯示列數     | `number` | 3   | 1.0.0 |
| `xl` | ≥1920px 顯示列數     | `number` | 4   | 1.0.0 |

#### 文案配置
| 引數           | 說明        | 型別         | 預設值 | 版本    |
|--------------|-----------|------------|----|-------|
| `searchBtn`  | 搜尋按鈕文案  | `() => {}` | 搜尋 | 1.0.0 |
| `resetBtn`   | 重置按鈕文案  |  `() => {}`   | 重置 | 1.0.0 |
| `isFoldBtn`  | 展開按鈕文案  |  `() => {}`   | 展開 | 1.0.0 |
| `notFoldBtn` | 摺疊按鈕文案  |  `() => {}`   | 摺疊 | 1.0.0 |

### SearchItems

| 引數       | 說明                     | 型別                        | 預設值 | 版本    |
|----------|------------------------|---------------------------|---|-------|
| `span`   | 合併跨列數                  | `number`                  | 1 | 1.0.0 |
| `offset` | 間隔大小                   | `number`                  | 0 | 1.0.0 |
| `hide`   | 是否隱藏                   | `boolean & () => boolean` | false | 1.0.0 |
| ...      | 其餘都是 `ma-form-item` 引數 | -                         | - | 1.0.0 |

## Event

| 名稱              | 說明       | 引數                       |
|-----------------|----------|--------------------------|
| `search`       | 提交搜尋     | `(formData: any) => {}`               |
| `reset`        | 重置搜尋     | `(formData: any) => {}`  |
| `fold`        | 摺疊、展開時觸發 | `(state: boolean) => {}` |

## Slot

| 名稱              | 說明                                   | 引數 |
|-----------------|--------------------------------------|----|
| `default`       | 預設插槽，可寫原生標籤 `<el-form-item>`，配置方式自動失效 | -  |
| `actions`        | 覆蓋掉元件內的 `搜尋`，`重置` 按鈕插槽               | -  |
| `beforeActions`        | 在`操作按鈕`前面插入內容插槽                      | -  |
| `afterActions`        | 在`操作按鈕`後面追加內容插槽                      | -  |

## Expose
| 名稱                | 說明                 | 引數                    | 返回值                   |
|-------------------|--------------------|-----------------------|-----------------------|
| `getMaFormRef()`  | 獲取 `ma-form` 的Ref  | -                     | MaForm                |
| `foldToggle()`    | 展開、摺疊切換            | -                     | -                     |
| `getFold()`       | 獲取摺疊狀態             | -                     | `boolean`             |
| `setSearchForm()` | 設定搜尋表單值            | `(form: any) => void` | -                     |
| `getSearchForm()` | 獲取搜尋表單值            | -                     | `Record<string, any>` |
| `setShowState()`  | 設定搜尋是否顯示           | (boolean) => void     | -                     |
| `getShowState()`  | 獲取搜尋顯示狀態           | -                     | `boolean`             |
| `setOptions()`    | 設定 `ma-search` 引數  | `(MaSearchOptions)`   | -                     |
| `getOptions()`    | 獲取 `ma-search` 引數  | -                     | `MaSearchOptions`     |
| `setFormOptions()`      | 設定 `ma-form` 引數    | `(MaFormOptions)`     | -                     |
| `getFormOptions()`      | 獲取 `ma-form` 引數    | -                     | `MaFormOptions`       |
| `setItems()`      | 設定 `ma-search` 表單項 | `(MaSearchItem[])`    | -                     |
| `getItems()`      | 獲取 `ma-search` 表單項 | -                     | `MaSearchItem`                     |
| `appendItem()`    | 追加搜尋表單項              | `(MaSearchItem)`        | -                     |
| `removeItem()`    | 移除搜尋表單項              | `(prop: string)`      | -                     |
| `getItemByProp()` | 按`prop`獲取搜尋表單項     | `(prop: string)`      | `MaSearchItem`          |
