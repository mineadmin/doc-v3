# 圖示

## 解決方案
系統內並未實際整合 `Element plus` 圖示庫，因為 `Iconify` 已包含。

- Iconify 圖示 （推薦）
- 使用阿里巴巴圖示庫


## Iconify 圖示使用
::: tip 說明
`Iconify` 是一個通用圖示框架，包含 FontAwesome、Material Design Icons、DashIcons、Feather Icons、EmojiOne、Noto Emoji等等圖示集合。
裡面擁有超過 150 個圖示集和 200k 個圖示，支援很多前端框架。
:::

尋找圖示一般建議去 [Icônes](https://icones.js.org/) 來搜尋圖示，這是一個基於 `Iconify` 的線上圖示搜尋網站，它的使用者體驗更好一些。

![https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg](https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg)

::: info 注意
複製的圖示格式為：`i-{集合名}:{圖示名}`
:::

### MaSvgIcon 元件使用


找到圖示後，複製好圖示名稱，使用 `MaSvgIcon` 元件顯示圖示：

```vue
<!-- 複製好的圖示名稱，填入name屬性即可 -->
<ma-svg-icon name="i-vscode-icons:file-type-php" />
```

### Class 使用
可透過 `html` 標記直接使用，不過需要注意的是，不支援 **非同步** 和 **拼接** 字串形式使用。

```html
<span class="i-vscode-icons:file-type-php" />
<i class="i-vscode-icons:file-type-php" />
```

### 離線模式
由於 `Iconify` 圖示預設是提供線上的服務，首次呼叫會觸發一個外部網路請求去獲取 svg 原始資料，
並快取在 `localStorage` 當中，這樣下次再呼叫的時候，則直接從快取中獲取並展示。但如果沒有網路的情況下，圖示可能就不會正常顯示了。

為此，系統提供了一個命令：`pnpm run gen:icons`，按照命令指引選擇你需要用到的圖示集，並選擇使用方式為離線模式，即可生成離線圖示庫。

::: warning 注意
命令生成的離線圖示庫，也是 `圖示選擇器` 裡展示的圖示集合。
:::

## 使用阿里巴巴圖示庫

在[阿里巴巴圖示庫](https://www.iconfont.cn/)裡或者從其他地方下載的svg圖示檔案放到 `./src/assets/icons/` 目錄下，
透過 `MaSvgIcon` 元件使用即可：
```vue
<!-- svg圖示檔案地址 ./src/assets/icons/newIcon.svg -->

<ma-svg-icon name="newIcon" />
```