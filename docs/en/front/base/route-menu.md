# Routing and Menu  

Similar to `2.x`, the system provides a basic routing system based on `vue-router`, which is divided into **static routes** and **dynamic routes**.  

## Routing and Menu Explanation  

### Static Routes  
Static routes are predefined in the frontend and are determined at startup.  
If your page does not require permission control, you can directly use static routes. All static route configurations in the system are located in the `src/router/static-routes` directory.  
These routes are loaded by the system and merged with dynamic routes to form the final routing data.  

::: Tip Future Vision  
Originally, we considered implementing a `file-based routing` mode, where **files act as routes**. However, no suitable scenario has been identified in `MineAdmin` yet.  
Perhaps in the future, we may introduce a file-based routing system.  
:::  

### Dynamic Routes  
Dynamic routes are generated after a user logs in by requesting the `/admin/permission/menus` interface. The system dynamically generates routes based on the menu permission data returned by the server.  
This process involves converting the server's response into frontend-recognizable routes, which are then transformed into displayable menus.  

### Menu  
Menus are another representation of routes. Whether static or dynamic, all routes are ultimately converted into menus and displayed on the interface. They are closely related.  

## Route Configuration  

### Basic Configuration  
First, you can find the data type `MineRouter` for defining routes in `#/types/global.d.ts`, as shown below:  
::: Details View Data Type Definition  
```ts  
declare namespace MineRoute {  
  interface routeRecord {  
    name?: string  
    path?: string  
    redirect?: string  
    expand?: boolean  
    component?: () => Promise<any>  
    components?: () => Promise<any>  
    meta?: RouteMeta  
    children?: routeRecord[]  
  }  
  interface RouteMeta {  
    title?: string | (() => string)  
    i18n?: string | (() => string)  
    badge?: () => string | number  
    icon?: string  
    affix?: boolean  
    hidden?: boolean  
    subForceShow?: boolean  
    copyright?: boolean  
    link?: string  
    breadcrumb?: routeRecord[]  
    breadcrumbEnable?: boolean  
    activeName?: string  
    cache?: boolean  
    type?: 'M' | 'B' | 'I' | 'L' | string  
    // Permission verification configuration  
    auth?: string[]  
    role?: string[]  
    user?: string[]  
  }  
}  
```  
:::  

The important configurations for routes are defined in the `meta` metadata. Click above to view the data type structure. Below is an example configuration:  

```ts {6-10}  
const routes = [  
  {  
    name: 'welcome',  
    path: '/welcome',  
    component: () => import('~/base/views/welcome/index.vue'),  
    meta: {  
      icon: 'icon-park-outline:jewelry',  
      title: 'Welcome Page',  
      i18n: 'menu.welcome',  
    },  
  },  
];  
```  

### META Field Explanations  

#### title  

- Type: `string`  
- Default: `''`  

Used to configure the title of the route, which will be displayed in menus, tabs, browser titles, and other scenarios. If the `i18n` field is not set, this will be the default displayed title.  

#### icon  

- Type: `string`  
- Default: `''`  

Used to configure the icon for the route, which will be displayed in menus, breadcrumbs, and tabs. Typically used in conjunction with an icon library.  

#### type  

- Type: `'M' | 'B' | 'I' | 'L'`  
- Default: `''`  

Used to configure the type of route: `M: Menu, B: Button, I: iFrame, L: External Link`. Routes of type `B` will not appear in menus and cannot have sub-routes.  
Routes of type `I` and `L` cannot have secondary or multi-level routes. Only routes of type `M` can contain all other types of routes.  

#### badge  

- Type: `string`  
- Default: `''`  

Used to configure a badge for the route, which will display a red-background badge next to the menu to highlight its uniqueness.  

#### affix  

- Type: `boolean`  
- Default: `false`  

Used to configure whether the page is pinned to the tabs by default.  

#### cache  

- Type: `boolean`  
- Default: `false`  

Used to configure whether the page is cached. If enabled, the page must define:  

`defineOptions({ name: 'Menu Name' })`  

#### hidden  

- Type: `boolean`  
- Default: `false`  

Used to configure whether the route is displayed in the menu. Even if hidden, the route is still registered and can be accessed by entering the URL.  

#### subForceShow  

- Type: `boolean`  
- Default: `false`  

Used to configure whether the route is forcibly displayed in the sub-sidebar. This does not conflict with `hidden`.  

#### copyright  

- Type: `boolean`  
- Default: `false`  

Used to configure whether the page displays copyright information at the bottom.  

#### link  

- Type: `string`  
- Default: `''`  

Used to configure the link for external or iFrame-type menus. This property only takes effect when `type === 'I' | 'L'`.  

#### breadcrumb  

- Type: `routeRecord[]`  
- Default: `[]`  

This property can be ignored, as it is automatically handled by the system internally.  

#### breadcrumbEnable  

- Type: `boolean`  
- Default: `false`  

Used to configure whether the route is displayed in the breadcrumb.  

#### activeName  

- Type: `string`  
- Default: `''`  

Used to configure which menu item should be highlighted when the route is active.  

#### auth  

- Type: `string[]`  
- Default: `[]`  

Used to specify which permissions can access the route.  

#### role  

- Type: `string[]`  
- Default: `[]`  

Used to specify which roles can access the route.  

#### user  

- Type: `string[]`  
- Default: `[]`  

Used to specify which users can access the route.