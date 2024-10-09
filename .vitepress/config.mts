import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MineAdmin 开发文档",
  description: "MineAdmin 使用手册及开发文档",
  themeConfig: {
    logo: '/images/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/guide' },
      { text: '前端', link: '/front' },
      { text: '后端', link: '/backend' },
      { text: '常见问题', link: '/faq' },
      {
        text: '老版本文档',
        items: [
          { text: '1.x ~ 2.x开发文档', link: 'https://doc.mineadmin/v1-2/index.html' },
          { text: '0.x开发文档', link: '/v0/' }
        ]
      },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mineadmin/mineadmin' }
    ]
  }
})
