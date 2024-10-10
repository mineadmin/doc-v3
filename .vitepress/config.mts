import { defineConfig } from 'vitepress'
import enGetNavs from "./src/en/nav";
import zhGetNavs from "./src/zh/nav";
import enGetConfig from "./src/en/config";
import zhGetConfig from "./src/zh/config";
import zhGetSidebar from "./src/zh/sidebars";
import enGetSidebar from "./src/en/sidebars";


// https://vitepress.dev/reference/site-config
export default defineConfig({
  ...zhGetConfig,
  locales:{
    root:{
      label:"中文",
      lang:"zh"
    },
    en:{
      label:"English",
      lang:"en",
      link:"/en/index",
      ...enGetConfig,
      themeConfig:{
        logo: '/images/logo.svg',
        nav: enGetNavs,
        sidebar:enGetSidebar
      }
    }
  },
  themeConfig: {

    search:{
      provider:"local",
      options:{
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search documents',
                buttonAriaLabel: 'Search documents'
              },
              modal: {
                noResultsText: 'No relevant results found',
                resetButtonTitle: 'Clear query conditions',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Switch'
                }
              }
            }
          }
        }
      }
    },
    i18nRouting:false,
    // https://vitepress.dev/reference/default-theme-config

    nav: zhGetNavs,

    sidebar: zhGetSidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mineadmin/mineadmin' },
      { icon:{
        svg:"<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1728462084565\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1443\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z\" fill=\"#C71D23\" p-id=\"1444\"></path></svg>"
        }, link: 'https://gitee.com/mineadmin/mineadmin' }
    ]
  },
  srcDir:'docs',
})
