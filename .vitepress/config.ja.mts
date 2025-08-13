import {defineConfigWithTheme, type MarkdownRenderer} from 'vitepress'
import jaGetNavs from "./src/ja/nav";
import jaGetConfig from "./src/ja/config";
import jaGetSidebar from "./src/ja/sidebars";
import { AnnouncementPlugin } from 'vitepress-plugin-announcement'
import { plantuml } from "@mdit/plugin-plantuml";
import { demoPreviewPlugin } from './plugins/previewPlugin'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'

export default defineConfigWithTheme ({
  vite:{
    plugins:[
      vueJsx(),
      UnoCSS(),
      AnnouncementPlugin({
        title:"MineAdmin コミュニティ",
        body:[
          {type:"text",content:"公式QQグループ: 150105478"}
        ]
      }),
    ]
  },
  ignoreDeadLinks: true,
  // 日文作为独立语言项目
  lang: 'ja',
  ...jaGetConfig,
  themeConfig: {
    logo: '/logo.svg',
    outline:{
      label: 'ページナビゲーション',
      level: [2, 4],
    },
    aside: true,
    externalLinkIcon: true,
    editLink: {
      pattern: 'https://github.com/mineadmin/doc-v3/edit/main/docs/:path',
      text: 'Githubでこのページを編集',
    },
    lastUpdated: {
      text: '最終更新',
    },
    docFooter: {
      next: '次へ',
      prev: '前へ',
    },
    sidebarMenuLabel: 'メニュー',
    returnToTopLabel: 'トップに戻る',
    search:{
      provider:"local",
      options:{
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
    },
    nav: jaGetNavs,
    sidebar: jaGetSidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mineadmin/mineadmin' },
      { icon: { svg: '<svg t="1663266323098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2880" width="200" height="200"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z" p-id="2881"></path></svg>' }, link: 'https://gitee.com/mineadmin/mineadmin' },
    ],
    footer: {
      message: 'ブランドと企業のための価値創造に専念',
      copyright: 'Copyright © 2021-present MineAdmin'
    }
  },
  srcDir: 'docs/ja',
  outDir: '.vitepress/dist/ja',
  base: '/ja/',
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
    hostname: 'https://doc.mineadmin.com/ja'
  }
})