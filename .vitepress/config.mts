import {defineConfigWithTheme, type MarkdownRenderer} from 'vitepress'

import enGetNavs from "./src/en/nav";
import enGetConfig from "./src/en/config";
import enGetSidebar from "./src/en/sidebars";

import zhGetNavs from "./src/zh/nav";
import zhGetConfig from "./src/zh/config";
import zhGetSidebar from "./src/zh/sidebars";

import hkConfig from "./src/zh-hk/config";
import hkNav from "./src/zh-hk/nav";
import hkSidebar from "./src/zh-hk/sidebars";

import twConfig from "./src/zh-tw/config";
import twNav from "./src/zh-tw/nav";
import twSidebar from "./src/zh-tw/sidebars";

import jaConfig from "./src/ja/config";
import jaNav from "./src/ja/nav";
import jaSidebar from "./src/ja/sidebars";


import { AnnouncementPlugin } from 'vitepress-plugin-announcement'
import { plantuml } from "@mdit/plugin-plantuml";
import { demoPreviewPlugin } from './plugins/previewPlugin'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import llmstxt from 'vitepress-plugin-llms'
import { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'



// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme ({
  vite:{
    plugins:[
      vueJsx(),
      UnoCSS(),
      AnnouncementPlugin({
        title:"MineAdmin 交流群",
        body:[
          {type:"text",content:"官方QQ群: 150105478"}
        ]
      }),
      llmstxt({
        domain:'https://doc.mineadmin.com',
        workDir:'en',
        experimental:{
          depth:3
        }
      })
    ]
  },
  ignoreDeadLinks: true,
  locales:{
    root:{
      label:"中文",
      lang:"zh",
      ...zhGetConfig,
    },
    en:{
      label:"English",
      lang:"en",
      link:"/en/index",
      ...enGetConfig,
      themeConfig:{
        logo: '/logo.svg',
        nav: enGetNavs,
        sidebar:enGetSidebar,
        outline:{
          level:[2 ,4],
        },
      }
    },
    "zh-hk":{
      label:"繁體中文(香港)",
      lang:"zh-hk",
      link:"/zh-hk/index",
      ...hkConfig,
      themeConfig:{
        logo: '/logo.svg',
        nav: hkNav,
        sidebar:hkSidebar,
        outline:{
          level:[2 ,4],
        },
      }
    },
    "zh-tw":{
      label:"繁體中文(台灣)",
      lang:"zh-tw",
      link:"/zh-tw/index",
      ...twConfig,
      themeConfig:{
        logo: '/logo.svg',
        nav: twNav,
        sidebar:twSidebar,
        outline:{
          level:[2 ,4],
        },
      }
    },
    "ja":{
      label:"日本語",
      lang:"ja",
      link:"/ja/index",
      ...jaConfig,
      themeConfig:{
        logo: '/logo.svg',
        nav: jaNav,
        sidebar:jaSidebar,
        outline:{
          level:[2 ,4],
        },
      }
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    outline:{
      label: '页面导航',
      level: [2, 4],
    },
    aside: 'left', // 侧边栏位置优化
    externalLinkIcon: true, // 显示外部链接图标
    editLink: {
      pattern: 'https://github.com/mineadmin/doc-v3/edit/main/docs/:path',
      text: '在Github上编辑此页面',
    },
    lastUpdated: {
      text: '最后更新于',
    },
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
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
          },
          ja: {
            translations: {
              button: {
                buttonText: 'ドキュメントを検索',
                buttonAriaLabel: 'ドキュメントを検索'
              },
              modal: {
                noResultsText: '関連する結果が見つかりません',
                resetButtonTitle: 'クエリ条件をクリア',
                footer: {
                  selectText: '選択',
                  navigateText: '切り替え'
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
      { icon: { svg: '<svg t="1663266323098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2880" width="200" height="200"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z" p-id="2881"></path></svg>' }, link: 'https://gitee.com/mineadmin/mineadmin' },
    ],

    footer: {
      message: '致力于为品牌和企业创造价值',
      copyright: 'Copyright © 2021-present MineAdmin'
    }
  },
  srcDir: 'docs',
  markdown:{
    lineNumbers: true,
    config:(md:MarkdownRenderer)=>{
      md.use(demoPreviewPlugin)
      md.use(copyOrDownloadAsMarkdownButtons)
      md.use(plantuml,{
        type:"fence",
        fence:"plantuml",
      })
    }
  },
  sitemap:{
    hostname: 'https://doc.mineadmin.com'
  }
})
