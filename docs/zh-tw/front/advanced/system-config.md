# 系統引數配置

::: tip 配置檔案
- 預設配置檔案：`src/provider/settings/index.ts`
- 自定義配置檔案：`src/provider/settings/settings.config.ts`

修改配置，請將預設配置複製到 `settings.config.ts` 檔案後，再修改，系統載入時會自動合併。
:::

## 預設配置
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
    title: '歡迎頁',
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
    putOnRecord: '豫ICP備00000000號-1',
  },
}
```