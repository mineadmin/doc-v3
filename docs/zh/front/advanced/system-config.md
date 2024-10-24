# 系统参数配置

::: tip 配置文件
- 默认配置文件：`src/provider/settings/index.ts`
- 自定义配置文件：`src/provider/settings/settings.config.ts`

修改配置，请将默认配置拷贝到 `settings.config.ts` 文件后，再修改，系统加载时会自动合并。
:::

## 默认配置
```ts
const defaultGlobalConfigSettings: RecursiveRequired<SystemSettings.all> = {
  app: {
    colorMode: 'autoMode',
    useLocale: 'zh_CN',
    whiteRoute: ['login'],
    layout: 'classic',
    pageAnimate: 'ma-slide-down',
    enableWatermark: false,
    primaryColor: '#2563EB',
    asideDark: false,
    showBreadcrumb: true,
    loadUserSetting: true,
    watermarkText: import.meta.env.VITE_APP_TITLE,
  },
  welcomePage: {
    name: 'welcome',
    path: '/welcome',
    title: '欢迎页',
    icon: 'icon-park-outline:jewelry',
  },
  mainAside: {
    showIcon: true,
    showTitle: true,
    enableOpenFirstRoute: false,
  },
  subAside: {
    showIcon: true,
    showTitle: true,
    fixedAsideState: false,
    showCollapseButton: true,
  },
  tabbar: {
    enable: true,
    mode: 'rectangle',
  },
  copyright: {
    enable: true,
    dates: useDayjs().format('YYYY'),
    company: 'MineAdmin Team',
    website: 'https://www.mineadmin.com',
    putOnRecord: '豫ICP备00000000号-1',
  },
}
```