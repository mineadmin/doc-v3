# 布局

布局跟 `2.0` 有很大差别，没有再区分一个个目录去构造不同的布局形式，整体都写在了 `src/layouts/index.tsx` 下。
本章节讲解一些 `布局相关API` 以及 `全局css` 修改布局主侧边栏、子侧边栏、头部的宽度等等。

## 布局相关API

在 `useSettingStore()` 里定义了整个前端设置的 `api`，关于布局的有以下几个，其他的可以查看源码，或者看[常用Store](/zh/front/high/store)

- `isMixedLayout()`  是否为混合布局
- `isColumnsLayout()`  是否为分栏布局
- `isClassicLayout()`  是否为经典布局
- `getFixedAsideState()`  获取子侧边栏状态是否为固定状态
- `getMenuCollapseState()` 获取菜单是否为折叠状态
- `getMobileState()` 是否为移动端状态

## 全局默认css

::: tip 提示
文件路径: `src/assets/styles/global.scss`
:::

可设置布局默认的一些高度、高度等等

```css
/* 变量定义 */
:root {
  /* 头部高度 */
  --mine-g-header-height: 55px;
  /* 脚部高度 */
  --mine-g-footer-height: 50px;
  /* 侧边栏主菜单宽度 */
  --mine-g-main-aside-width: 80px;
  /* 侧边栏子菜单展开宽度 */
  --mine-g-sub-aside-width: 200px;
  /* 侧边栏子菜单折叠后宽度 */
  --mine-g-sub-aside-collapse-width: 65px;
  /* 菜单缩进宽度 */
  --mine-g-menu-retract-width: 15px;
  /* 工具栏高度 */
  --mine-g-toolbar-height: 55px;
  /* 标签栏高度 */
  --mine-g-tabbar-height: 40px;
  /* 盒子阴影 */
  --mine-g-box-shadow-color: rgb(0 0 0 / 18%);
  /* 主颜色 */
  --el-color-primary: --ui-primery;
}
```

