# 图标

## 解决方案
系统内并未实际集成 `Element plus` 图标库，因为 `Iconify` 已包含。

- Iconify 图标 （推荐）
- 使用阿里巴巴图标库


## Iconify 图标使用
::: tip 说明
`Iconify` 是一个通用图标框架，包含 FontAwesome、Material Design Icons、DashIcons、Feather Icons、EmojiOne、Noto Emoji等等图标集合。
里面拥有超过 150 个图标集和 200k 个图标，支持很多前端框架。
:::

寻找图标一般建议去 [Icônes](https://icones.js.org/) 来搜索图标，这是一个基于 `Iconify` 的在线图标搜索网站，它的用户体验更好一些。

![https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg](https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg)

::: info 注意
复制的图标格式为：`i-{集合名}:{图标名}`
:::

### MaSvgIcon 组件使用


找到图标后，复制好图标名称，使用 `MaSvgIcon` 组件显示图标：

```vue
<!-- 复制好的图标名称，填入name属性即可 -->
<ma-svg-icon name="i-vscode-icons:file-type-php" />
```

### Class 使用
可通过 `html` 标记直接使用，不过需要注意的是，不支持 **异步** 和 **拼接** 字符串形式使用。

```html
<span class="i-vscode-icons:file-type-php" />
<i class="i-vscode-icons:file-type-php" />
```

### 离线模式
由于 `Iconify` 图标默认是提供在线的服务，首次调用会触发一个外部网络请求去获取 svg 原始数据，
并缓存在 `localStorage` 当中，这样下次再调用的时候，则直接从缓存中获取并展示。但如果没有网络的情况下，图标可能就不会正常显示了。

为此，系统提供了一个命令：`pnpm run gen:icons`，按照命令指引选择你需要用到的图标集，并选择使用方式为离线模式，即可生成离线图标库。

::: warning 注意
命令生成的离线图标库，也是 `图标选择器` 里展示的图标集合。
:::

## 使用阿里巴巴图标库

在[阿里巴巴图标库](https://www.iconfont.cn/)里或者从其他地方下载的svg图标文件放到 `./src/assets/icons/` 目录下，
通过 `MaSvgIcon` 组件使用即可：
```vue
<!-- svg图标文件地址 ./src/assets/icons/newIcon.svg -->

<ma-svg-icon name="newIcon" />
```