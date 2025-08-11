# システムパラメータ設定

::: tip 設定ファイル
- デフォルト設定ファイル：`src/provider/settings/index.ts`
- カスタム設定ファイル：`src/provider/settings/settings.config.ts`

設定を変更する場合は、デフォルト設定を`settings.config.ts`ファイルにコピーした後、変更してください。システムはロード時に自動的にマージします。
:::

## デフォルト設定
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
    title: 'ウェルカムページ',
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