# MaForm

基於 `Element plus` 的表單二次封裝的 `Form` 組件，支持所有原生表單的參數、事件、插槽、寫法，還支持通過配置方式來實現。
另外還支持了基於 `el-row` 和 `el-space` 的佈局來規劃表單

::: tip 説明
由於全部兼容及支持原生 `el-from` 的所有參數、事件、插槽，所以只講擴展參數。

官方表單參數請參考 [Element plus](https://element-plus.org/zh-CN/component/form.html) 官方文檔。
:::

## 配置方式使用
<DemoPreview dir="demos/ma-form/config" />

## 模板方式使用
<DemoPreview dir="demos/ma-form/template" />

## 獲取`組件`和`el-form-item`的`Ref`
:::tip 提示
這個方式用於 **配置形式**，`template` 裏可以自己定義 `ref` 
:::

<DemoPreview dir="demos/ma-form/getRef" />

## Props

| 參數        | 説明                             | 類型         | Ele-官網文檔                                                                   | 版本    |
|-----------|--------------------------------|-------------------|----------------------------------------------------------------------------|-------|
| `v-model` | `ma-form`數據，雙向綁定               | `MaModel`   | -                                                                          | 1.0.0 |
| `options` | `el-form` 參數及[擴展參數](#extraprops) | `MaFormOptions`   | [表單屬性](https://element-plus.org/zh-CN/component/form.html#form-attributes) | 1.0.0 |
| `items`   | [ma-form-item參數](#maformitem)  | `MaFormItem[]` | -                                                                          | 1.0.0 |

### ExtraProps
::: tip 説明
此為 `ma-form` 對 `el-form` 的擴展參數
:::
| 參數        | 説明                                                                    | 類型                                                                                              | 默認值      | 版本    |
|-----------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|-------|
| `containerClass` | 表單容器類名                                                                  | `string`                                                                                        | -        | 1.0.0 |
| `loading` | 是否開啓加載動畫                                                              | `boolean`                                                                                       | `false`  | 1.0.0 |
| `loadingConfig` | 加載動畫的相關配置                                                             | [LoadingConfig](#loadingconfig説明)                                                               | -        | 1.0.0 |
| `layout` | <el-tooltip content="佈局方式，在使用`flex`時，可在 `item` 的 `itemProps` 配置項裏設置 `cols` 參數 ，默認值：`flex`">`鼠標放上查看`</el-tooltip>  | `flex, grid` | `flex` | 1.0.0 |
| `grid` | <el-tooltip content=" `grid` 佈局，在 `layout` 為 `grid` 時生效。實際是用的 `el-space`，配置可參考 `element-plus` 的 `el-space` 文檔">`鼠標放上查看`</el-tooltip> | [el-space文檔](https://element-plus.org/zh-CN/component/space.html#attributes)     | -        | 1.0.0 |
| `flex` | <el-tooltip content=" `flex` 佈局，在 `layout` 為 `flex` 時生效。實際是用的 `el-row`，配置可參考 `element-plus` 的 `el-row` 文檔">`鼠標放上查看`</el-tooltip> | [el-row文檔](https://element-plus.org/zh-CN/component/layout.html#row-attributes)     | -        | 1.0.0 |
| `footerSlot` | <el-tooltip content="配置型插槽，在 `template` 寫法為 #footer">`鼠標放上查看`</el-tooltip>       | `() => {}`  | -  | 1.0.0 |

#### LoadingConfig説明
| 參數        | 説明      | 類型   | 默認值 | 版本    |
|-----------|----------|------|-----|-------|
| `text` | 顯示在加載圖標下方的加載文案   | `string`  | -   | 1.0.0 |
| `spinner` | 自定義加載圖標   | `string` | -   | 1.0.0 |
| `svg` | 自定義 `svg` 加載圖標   | `string` | -   | 1.0.0 |
| `viewBox` | 加載圖標的大小   | `string` | -   | 1.0.0 |
| `background` | 背景遮罩的顏色   | `string` | -   | 1.0.0 |
| `customClass` | 自定義 class 類名   | `string` | -   | 1.0.0 |

### MaFormItem

| 參數             | 説明                                                                                                                                                                             | 類型                                                                                                 | 默認值     | 版本    |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------|-------|
| `label`        | 增強原生參數，添加支持函數類型                                                                                                                                                                | `string, () => string`                                                                             | -       | 1.0.0 |
| `prop`         | 增強原生參數，添加支持函數類型                                                                                                                                                                | `string, () => string`                                                                             | -       | 1.0.0 |
| `hide`   | <el-tooltip content="是否隱藏該項，隱藏後還是有數據的，默認: `false`，自定義組件下可能無效">`鼠標放上查看`</el-tooltip>                                                                                            | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`鼠標放上查看`</el-tooltip> | `false` | 1.0.0 |
| `show` | <el-tooltip content="是否顯示該項，不顯示後實際不渲染，也沒有數據，默認: `true`，自定義組件下可能無效">`鼠標放上查看`</el-tooltip>                                                                                       | <el-tooltip content="boolean, (item: MaFormItem, model: MaModel) => boolean">`鼠標放上查看`</el-tooltip> | `true`  | 1.0.0 |
| `cols` | 在 `options.layout 為 flex` 下生效                                                                                                                                                  | [el-col文檔](https://element-plus.org/zh-CN/component/layout.html#col-attributes)                    | -       | 1.0.0 |
| `itemProps` | `el-form-item` 原生屬性                                                                                                                                                            | [表單項屬性](https://element-plus.org/zh-CN/component/form.html#formitem-attributes)                    | -       | 1.0.0 |
| `itemSlots` | `el-form-item` 原生插槽                                                                                                                                                            | [表單項插槽](https://element-plus.org/zh-CN/component/form.html#formitem-slots)                         | -       | 1.0.0 |
| `render` | 渲染組件：<el-tooltip content="設置要渲染的組件，可設置 `element plus` 的所有 `form` 組件，例如：`input`, `datePicker`，也可以傳入 `tsx`, `jsx` 語法的虛擬dom，也可以傳入一個組件，函數式，例如：() => ElInput">`鼠標放上查看`</el-tooltip> | `string, (data) => any`                                                                            | -       | 1.0.0 |
| `renderProps` | 被渲染組件的 `props` 屬性                                                                                                                                                              | `Record<string, any>`                                                                              | -       | 1.0.0 |
| `renderSlots` | 被渲染組件的插槽                                                                                                                                                                       | `Record<string, (...args) => {}>`                                                                  | -       | 1.0.0 |
| `children`    | 子配置項，支持無限嵌套，註：父組件如使用插槽，子配置項則失效                                                                                                                                                 | `MaFormItem[]`                                                                                     | -       | 1.0.33 |


## Slot

| 名稱              | 説明                                    | 參數 |
|-----------------|---------------------------------------|----|
| `default`       | 默認插槽，可寫原生標籤 `<el-form-item>`，配置方式自動失效 | -  |
| `footer`        | 表單底部插槽                                | -  |


## Expose
| 名稱                  | 説明                | 參數                | 返回值             |
|---------------------|-------------------|-------------------|-----------------|
| `setLoadingState()` | 設置表單 `loading` 狀態 | `(boolean)`       | -               |
| `setOptions()`      | 設置 `ma-form` 配置   | `(MaFormOptions)` | -               |
| `getOptions()`      | 獲取 `ma-form` 配置   | -                 | `MaFormOptions` |
| `setItems()`        | 設置表單項             | `(MaFormItem[])`  | -               |
| `getItems()`        | 獲取表單項             | -                 | `MaFormItem[]`  |
| `appendItem()`      | 追加表單項             | `(MaFormItem)`    | -               |
| `removeItem()`      | 移除表單項             | `(prop: string)`  | -              |
| `getItemByProp()`   | 按`prop`獲取表單項      | `(prop: string)`  | `MaFormItem`    |
| `isMobileState()`   | 檢查是否為移動端模式        | -                 | `boolean`    |
| `getElFormRef()`    | 獲取 `el-form` Ref  | -                 | `El-Form`       |
