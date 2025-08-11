# Layout  

The layout differs significantly from `2.0`, no longer categorizing different layout forms into separate directories. Instead, everything is consolidated in `src/layouts/index.tsx`.  
This section explains some `layout-related APIs` and how to modify the widths of the main sidebar, sub-sidebar, header, etc., through `global CSS`.  

## Layout-Related APIs  

In `useSettingStore()`, several APIs related to frontend settings are defined. The following pertain to the layout—others can be viewed in the source code or under [Common Stores](/en/front/high/store).  

- `isMixedLayout()` – Whether it is a mixed layout.  
- `isColumnsLayout()` – Whether it is a columnar layout.  
- `isClassicLayout()` – Whether it is a classic layout.  
- `getFixedAsideState()` – Gets whether the sub-sidebar is in a fixed state.  
- `getMenuCollapseState()` – Gets whether the menu is collapsed.  
- `getMobileState()` – Whether it is in mobile mode.  

## Global Default CSS  

::: tip Note  
File path: `src/assets/styles/global.scss`  
:::  

You can set default layout properties such as height and width here.  

```css
/* Variable definitions */  
:root {  
  /* Header height */  
  --mine-g-header-height: 55px;  
  /* Footer height */  
  --mine-g-footer-height: 50px;  
  /* Main sidebar menu width */  
  --mine-g-main-aside-width: 80px;  
  /* Expanded sub-sidebar menu width */  
  --mine-g-sub-aside-width: 200px;  
  /* Collapsed sub-sidebar menu width */  
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