# 佈局

佈局跟 `2.0` 有很大差別，沒有再區分一個個目錄去構造不同的佈局形式，整體都寫在了 `src/layouts/index.tsx` 下。
本章節講解一些 `佈局相關API` 以及 `全域性css` 修改佈局主側邊欄、子側邊欄、頭部的寬度等等。

## 佈局相關API

在 `useSettingStore()` 裡定義了整個前端設定的 `api`，關於佈局的有以下幾個，其他的可以檢視原始碼，或者看[常用Store](/zh-tw/front/high/store)

- `isMixedLayout()`  是否為混合佈局
- `isColumnsLayout()`  是否為分欄佈局
- `isClassicLayout()`  是否為經典佈局
- `getFixedAsideState()`  獲取子側邊欄狀態是否為固定狀態
- `getMenuCollapseState()` 獲取選單是否為摺疊狀態
- `getMobileState()` 是否為移動端狀態

## 全域性預設css

::: tip 提示
檔案路徑: `src/assets/styles/global.scss`
:::

可設定佈局預設的一些高度、高度等等

```css
/* 變數定義 */
:root {
  /* 頭部高度 */
  --mine-g-header-height: 55px;
  /* 腳部高度 */
  --mine-g-footer-height: 50px;
  /* 側邊欄主選單寬度 */
  --mine-g-main-aside-width: 80px;
  /* 側邊欄子選單展開寬度 */
  --mine-g-sub-aside-width: 200px;
  /* 側邊欄子選單摺疊後寬度 */
  --mine-g-sub-aside-collapse-width: 65px;
  /* 選單縮排寬度 */
  --mine-g-menu-retract-width: 15px;
  /* 工具欄高度 */
  --mine-g-toolbar-height: 55px;
  /* 標籤欄高度 */
  --mine-g-tabbar-height: 40px;
  /* 盒子陰影 */
  --mine-g-box-shadow-color: rgb(0 0 0 / 18%);
  /* 主顏色 */
  --el-color-primary: --ui-primery;
}
```

