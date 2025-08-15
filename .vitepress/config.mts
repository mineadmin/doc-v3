import {defineConfigWithTheme, type MarkdownRenderer, type UserConfig} from 'vitepress'

import { AnnouncementPlugin } from 'vitepress-plugin-announcement'
import { plantuml } from "@mdit/plugin-plantuml";
import { demoPreviewPlugin } from './plugins/previewPlugin'
import UnoCSS from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import llmstxt from 'vitepress-plugin-llms'
import { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'
import {defineConfig} from "unocss";
import type {UserConfig as ViteConfig} from "vite"
import { visualizer } from 'rollup-plugin-visualizer'


// 根据环境变量获取当前语言，默认为中文
const currentLanguage = process.env.CURRENT_LANGUAGE || 'zh'

// 动态导入语言配置函数
async function getLangConfig() {
  switch (currentLanguage) {
    case 'en':
      return {
        nav: (await import("./src/en/nav")).default,
        config: (await import("./src/en/config")).default,
        sidebar: (await import("./src/en/sidebars")).default
      }
    case 'zh-hk':
      return {
        nav: (await import("./src/zh-hk/nav")).default,
        config: (await import("./src/zh-hk/config")).default,
        sidebar: (await import("./src/zh-hk/sidebars")).default
      }
    case 'zh-tw':
      return {
        nav: (await import("./src/zh-tw/nav")).default,
        config: (await import("./src/zh-tw/config")).default,
        sidebar: (await import("./src/zh-tw/sidebars")).default
      }
    case 'ja':
      return {
        nav: (await import("./src/ja/nav")).default,
        config: (await import("./src/ja/config")).default,
        sidebar: (await import("./src/ja/sidebars")).default
      }
    default: // 'zh' 或其他情况默认中文
      return {
        nav: (await import("./src/zh/nav")).default,
        config: (await import("./src/zh/config")).default,
        sidebar: (await import("./src/zh/sidebars")).default
      }
  }
}

const { nav: langNav, config: langConfig, sidebar: langSidebar } = await getLangConfig()
const viteConfig:ViteConfig = {
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
        ignoreFiles:['changelog.md','index.md']
      }),
    visualizer({
      filename: 'stats.html',
      open: true
    })
  ]
}

const config:UserConfig = {
  vite:viteConfig,
  ignoreDeadLinks: true,
  lang: currentLanguage,
  ...langConfig,
  srcDir: `docs/${currentLanguage}`,
  themeConfig: {
    logo: '/logo.svg',
    outline:{
      level: [2, 4],
    },
    nav: langNav,
    sidebar: langSidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mineadmin/mineadmin' },
      { icon: { svg: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z"></path></svg>' }, link: 'https://gitee.com/mineadmin/mineadmin' },
    ],
    ...langConfig.themeConfig
  },
  markdown:{
    lineNumbers: true,
    languages: [
      'javascript', 'typescript', 'php', 'html', 'css', 'vue', 'json', 
      'yaml', 'xml', 'bash', 'shell', 'sql', 'python', 'java', 'go',
      'dotenv', 'properties', 'nginx', 'apache', 'toml', 'ini'
    ],
    languageAlias: {
      'env': 'dotenv',
      'conf': 'properties', 
      'haproxy': 'nginx',
      'redis': 'properties'
    },
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
};

export default defineConfig(config)
