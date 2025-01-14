# Routing and Menus

Similar to `2.x`, the system provides a basic routing system based on `vue-router`, which is divided into **static routes** and **dynamic routes**.

## Routing and Menu Explanation

### Static Routes
Static routes are predefined in the frontend and are determined at startup. If your page does not require permission control, you can directly use static routes. All static route configurations within the system are located in the `src/router/static-routes` directory; they are loaded by the system and merged with dynamic routes to form the final routing data.

::: tip Future Vision
Actually, it could have been implemented as a `file-based routing` mode, where **files are routes**. However, no suitable scenario has been matched within `MineAdmin` yet. Perhaps in the future, a file-based routing system might be introduced.
:::

### Dynamic Routes
Dynamic routes are generated based on the menu permission data returned by the server after the user logs in and requests the `/admin/permission/menus` interface. This step also requires the system to convert the server-returned data into routes recognized by the frontend, which are then transformed into displayable menus.

### Menus
Menus are another representation of routes. Whether static or dynamic, routes are ultimately converted into menus and displayed on the interface. They are closely related.

## Route Configuration

### Basic Configuration
First, you can find the data type `MineRouter` defined in `#/types/global.d.ts` as follows:
::: details View Data Type Definition
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

The important configurations for routes are defined in the `meta` metadata. You can click to view the data type structure above. Below is an example configuration:

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

### META Item Explanation

#### title
- Type: `string`
- Default: `''`

Used to configure the title of the route, which will be displayed in menus, tabs, browser titles, and other scenarios. If the `i18n` item is not set, this will be the default displayed title.

#### icon
- Type: `string`
- Default: `''`

Used to configure the icon of the route, which will be displayed in menus, breadcrumbs, and tabs. It is generally used in conjunction with an icon library.

#### type
- Type: `'M' | 'B' | 'I' | 'L'`
- Default: `''`

Used to configure the type of the route `M: Menu, B: Button, I: iFrame, L: External Link`. In routes, `B` type routes will not be displayed in the menu and cannot have sub-routes. `I` and `L` types cannot have secondary or multi-level routes. Only `M` type routes can contain all other types of routes.

#### badge
- Type: `string`
- Default: `''`

Used to configure the badge of the route, which will display a red background badge after the menu to mark the menu's uniqueness.

#### affix
- Type: `boolean`
- Default: `false`

Used to configure whether the page is fixed in the tab by default.

#### cache
- Type: `boolean`
- Default: `false`

Used to configure whether the page is cached. If this is enabled, the page needs to define:
`defineOptions({ name: 'Menu Name' })`

#### hidden
- Type: `boolean`
- Default: `false`

Used to configure whether the route is displayed in the menu. Although not displayed, the route is indeed registered and can be accessed by entering the address.

#### subForceShow
- Type: `boolean`
- Default: `false`

Used to configure whether the route is forcibly displayed in the sub-sidebar. It does not conflict with `hidden`.

#### copyright
- Type: `boolean`
- Default: `false`

Used to configure whether the page displays the copyright information at the bottom.

#### link
- Type: `string`
- Default: `''`

Used to configure the link for external and iFrame type menus. This property only takes effect when `type === 'I' | 'L'`.

#### breadcrumb
- Type: `routeRecord[]`
- Default: `[]`

This property can be ignored as it is automatically handled by the system internally.

#### breadcrumbEnable
- Type: `boolean`
- Default: `false`

Used to configure whether the route is displayed in the breadcrumb.

#### activeName
- Type: `string`
- Default: `''`

Used to configure which menu is highlighted when the route is activated.

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