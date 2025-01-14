# 圖標

## 解決方案
系統內並未實際集成 `Element plus` 圖標庫，因為 `Iconify` 已包含。

- Iconify 圖標 （推薦）
- 使用阿里巴巴圖標庫


## Iconify 圖標使用
::: tip 説明
`Iconify` 是一個通用圖標框架，包含 FontAwesome、Material Design Icons、DashIcons、Feather Icons、EmojiOne、Noto Emoji等等圖標集合。
裏面擁有超過 150 個圖標集和 200k 個圖標，支持很多前端框架。
:::

尋找圖標一般建議去 [Icônes](https://icones.js.org/) 來搜索圖標，這是一個基於 `Iconify` 的在線圖標搜索網站，它的用户體驗更好一些。

![https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg](https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg)

::: info 注意
複製的圖標格式為：`i-{集合名}:{圖標名}`
:::

### MaSvgIcon 組件使用


找到圖標後，複製好圖標名稱，使用 `MaSvgIcon` 組件顯示圖標：

```vue
<!-- 複製好的圖標名稱，填入name屬性即可 -->
<ma-svg-icon name="i-vscode-icons:file-type-php" />
```

### Class 使用
可通過 `html` 標記直接使用，不過需要注意的是，不支持 **異步** 和 **拼接** 字符串形式使用。

```html
<span class="i-vscode-icons:file-type-php" />
<i class="i-vscode-icons:file-type-php" />
```

### 離線模式
由於 `Iconify` 圖標默認是提供在線的服務，首次調用會觸發一個外部網絡請求去獲取 svg 原始數據，
並緩存在 `localStorage` 當中，這樣下次再調用的時候，則直接從緩存中獲取並展示。但如果沒有網絡的情況下，圖標可能就不會正常顯示了。

為此，系統提供了一個命令：`pnpm run gen:icons`，按照命令指引選擇你需要用到的圖標集，並選擇使用方式為離線模式，即可生成離線圖標庫。

::: warning 注意
命令生成的離線圖標庫，也是 `圖標選擇器` 裏展示的圖標集合。
:::

## 使用阿里巴巴圖標庫

在[阿里巴巴圖標庫](https://www.iconfont.cn/)裏或者從其他地方下載的svg圖標文件放到 `./src/assets/icons/` 目錄下，
通過 `MaSvgIcon` 組件使用即可：
```vue
<!-- svg圖標文件地址 ./src/assets/icons/newIcon.svg -->

<ma-svg-icon name="newIcon" />
```