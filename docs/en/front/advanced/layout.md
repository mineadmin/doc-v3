# Layout

The layout has significant differences compared to `2.0`. It no longer separates different layout forms into individual directories. Instead, the entire layout is written in `src/layouts/index.tsx`. This chapter explains some `layout-related APIs` and how to modify the width of the main sidebar, sub-sidebar, header, etc., using `global CSS`.

## Layout-related APIs

In `useSettingStore()`, the `api` for the entire frontend settings is defined. The following are related to layout; others can be viewed in the source code or in [Common Stores](/en/front/high/store).

- `isMixedLayout()`: Whether it is a mixed layout.
- `isColumnsLayout()`: Whether it is a column layout.
- `isClassicLayout()`: Whether it is a classic layout.
- `getFixedAsideState()`: Get the state of whether the sub-sidebar is fixed.
- `getMenuCollapseState()`: Get the state of whether the menu is collapsed.
- `getMobileState()`: Whether it is in mobile state.

## Global Default CSS

::: tip Note
File path: `src/assets/styles/global.scss`
:::

You can set some default heights, widths, etc., for the layout.

```css
/* Variable definitions */
:root {
  /* Header height */
  --mine-g-header-height: 55px;
  /* Footer height */
  --mine-g-footer-height: 50px;
  /* Main sidebar menu width */
  --mine-g-main-aside-width: 80px;
  /* Sub-sidebar menu expanded width */
  --mine-g-sub-aside-width: 200px;
  /* Sub-sidebar menu collapsed width */
  --mine-g-sub-aside-collapse-width: 65px;
  /* Menu indentation width */
  --mine-g-menu-retract-width: 15px;
  /* Toolbar height */
  --mine-g-toolbar-height: 55px;
  /* Tab bar height */
  --mine-g-tabbar-height: 40px;
  /* Box shadow */
  --mine-g-box-shadow-color: rgb(0 0 0 / 18%);
  /* Primary color */
  --el-color-primary: --ui-primery;
}
```