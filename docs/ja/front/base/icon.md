# アイコン

## ソリューション
システムには実際には `Element plus` アイコンライブラリが統合されていません。`Iconify` が既に含まれているためです。

- Iconify アイコン （推奨）
- 阿里巴巴（Alibaba）アイコンライブラリの使用


## Iconify アイコンの使用
::: tip 説明
`Iconify` は汎用アイコンフレームワークで、FontAwesome、Material Design Icons、DashIcons、Feather Icons、EmojiOne、Noto Emojiなどのアイコンセットを含んでいます。
150以上のアイコンセットと200k以上のアイコンを保有し、多くのフロントエンドフレームワークをサポートしています。
:::

アイコンを探す際には、一般的に [Icônes](https://icones.js.org/) を利用することをお勧めします。これは `Iconify` をベースにしたオンラインアイコン検索サイトで、ユーザーエクスペリエンスがより優れています。

![https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg](https://s21.ax1x.com/2024/10/14/pAt0w8S.jpg)

::: info 注意
コピーされるアイコンの形式は `i-{コレクション名}:{アイコン名}` です。
:::

### MaSvgIcon コンポーネントの使用

アイコンを見つけたら、アイコン名をコピーし、`MaSvgIcon` コンポーネントを使用してアイコンを表示します：

```vue
<!-- コピーしたアイコン名をname属性に入力 -->
<ma-svg-icon name="i-vscode-icons:file-type-php" />
```

### Class での使用
`html` タグで直接使用できますが、**非同期** や **文字列の連結** 形式での使用はサポートされていません。

```html
<span class="i-vscode-icons:file-type-php" />
<i class="i-vscode-icons:file-type-php" />
```

### オフラインモード
`Iconify` アイコンはデフォルトでオンラインサービスを提供しており、初回呼び出し時にSVGの元データを取得するために外部ネットワークリクエストが発生します。
取得したデータは `localStorage` にキャッシュされ、次回以降の呼び出し時にはキャッシュから直接取得して表示されます。しかし、ネットワークがない場合、アイコンが正しく表示されない可能性があります。

この問題に対処するため、システムでは `pnpm run gen:icons` コマンドを提供しています。このコマンドに従って必要なアイコンセットを選択し、使用モードをオフラインモードに設定すると、オフラインアイコンライブラリが生成されます。

::: warning 注意
コマンドで生成されたオフラインアイコンライブラリは、`アイコンセレクター` で表示されるアイコンセットでもあります。
:::

## 阿里巴巴（Alibaba）アイコンライブラリの使用

[阿里巴巴アイコンライブラリ](https://www.iconfont.cn/) または他の場所からダウンロードしたSVGアイコンファイルを `./src/assets/icons/` ディレクトリに配置し、
`MaSvgIcon` コンポーネントを使用します：
```vue
<!-- SVGアイコンファイルのパス ./src/assets/icons/newIcon.svg -->

<ma-svg-icon name="newIcon" />
```