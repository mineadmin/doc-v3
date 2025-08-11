# レイアウト

レイアウトは `2.0` と大きく異なり、個別のディレクトリを分けて異なるレイアウト形式を構築する方法を取らず、全体が `src/layouts/index.tsx` に記述されています。
この章では、`レイアウト関連API` および `グローバルCSS` を使用して、メインサイドバー、サブサイドバー、ヘッダーの幅などを変更する方法について説明します。

## レイアウト関連API

`useSettingStore()` には、フロントエンド全体の設定に関する `API` が定義されています。レイアウトに関連するものは以下の通りです。その他の詳細はソースコードを参照するか、[よく使うStore](/ja/front/high/store) をご覧ください。

- `isMixedLayout()`  混合レイアウトかどうか
- `isColumnsLayout()`  カラムレイアウトかどうか
- `isClassicLayout()`  クラシックレイアウトかどうか
- `getFixedAsideState()`  サブサイドバーが固定状態かどうかを取得
- `getMenuCollapseState()` メニューが折りたたまれているかどうかを取得
- `getMobileState()` モバイル端末かどうか

## グローバルデフォルトCSS

::: tip ヒント
ファイルパス: `src/assets/styles/global.scss`
:::

レイアウトのデフォルトの高さや幅などを設定できます。

```css
/* 変数定義 */
:root {
  /* ヘッダーの高さ */
  --mine-g-header-height: 55px;
  /* フッターの高さ */
  --mine-g-footer-height: 50px;
  /* メインサイドバーメニューの幅 */
  --mine-g-main-aside-width: 80px;
  /* サブサイドバーメニュー展開時の幅 */
  --mine-g-sub-aside-width: 200px;
  /* サブサイドバーメニュー折りたたみ時の幅 */
  --mine-g-sub-aside-collapse-width: 65px;
  /* メニューのインデント幅 */
  --mine-g-menu-retract-width: 15px;
  /* ツールバーの高さ */
  --mine-g-toolbar-height: 55px;
  /* タブバーの高さ */
  --mine-g-tabbar-height: 40px;
  /* ボックスシャドウ */
  --mine-g-box-shadow-color: rgb(0 0 0 / 18%);
  /* メインカラー */
  --el-color-primary: --ui-primery;
}
```