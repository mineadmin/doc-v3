import {defineConfigWithTheme} from 'vitepress'

export default defineConfigWithTheme ({
  vite:{
    plugins:[]
  },
  ignoreDeadLinks: true,
  lang: 'zh',
  title: '测试文档',
  description: '最小化测试',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' }
    ],
    sidebar: [
      { text: '测试', link: '/index' }
    ]
  },
  srcDir: 'docs/zh-test',
  outDir: '.vitepress/dist-test',
  markdown:{
    lineNumbers: false
  }
})