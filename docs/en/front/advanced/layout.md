# Layout  

The layout has significant differences from `2.0`, no longer separating directories to construct different layout forms. Instead, everything is consolidated in `src/layouts/index.tsx`.  
This section explains some `layout-related APIs` and `global CSS` for modifying the widths of the main sidebar, sub-sidebar, header, and more.  

## Layout-Related APIs  

In `useSettingStore()`, the APIs for the entire frontend settings are defined. The following are related to layouts. For others, you can check the source code or refer to [Common Stores](/en/front/high/store).  

- `isMixedLayout()` – Whether it is a mixed layout  
- `isColumnsLayout()` – Whether it is a column layout  
- `isClassicLayout()` – Whether it is a classic layout  
- `getFixedAsideState()` – Gets whether the sub-sidebar is in a fixed state  
- `getMenuCollapseState()` – Gets whether the menu is collapsed  
- `getMobileState()` – Whether it is in mobile mode  

## Global Default CSS  

::: tip Note  
File path: `src/assets/styles/global.scss`  
:::  

You can set default heights, widths, etc., for the layout here.  

```css  
/* Variable Definitions */  
:root {  
  /* Header Height */  
  --mine-g-header-height: 55px;  
  /* Footer Height */  
  --mine-g-footer-height: 50px;  
  /* Main Sidebar Width */  
  --mine-g-main-aside-width: 80px;  
  /* Expanded Sub-Sidebar Width */  
  --mine-g-sub-aside-width: 200px;  
  /* Collapsed Sub-Sidebar Width */  
  --mine-g-sub-aside-collapse-width: 65px;  
  /* Menu Indentation Width */  
  --mine-g-menu-retract-width: 15px;  
  /* Toolbar Height */  
  --mine-g-toolbar-height: 55px;  
  /* Tab Bar Height */  
  --mine-g-tabbar-height: 40px;  
  /* Box Shadow */  
  --mine-g-box-shadow-color: rgb(0 0 0 / 18%);  
  /* Primary Color */  
  --el-color-primary: --ui-primery;  
}  
```