# System Parameter Configuration  

::: tip Configuration Files  
- Default configuration file: `src/provider/settings/index.ts`  
- Custom configuration file: `src/provider/settings/settings.config.ts`  

To modify configurations, copy the default settings to `settings.config.ts` and make changes there. The system will automatically merge them upon loading.  
:::  

## Default Configuration  
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
    title: 'Welcome Page',  
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