import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: '指南', link: '/guide/introduce/mineadmin' },
    { text: '前端', link: '/front/base/concept' },
    { text: '后端', link: '/backend/index' },
    { text: '插件',link: "/plugin/index"},
    { text: '常见问题', link: '/faq/index' },
    { text: '更多推荐' ,items:[
        { text: '老版本文档', link: 'https://docv2.mineadmin.com' },
        { text: '开箱即用的 Hyperf 组件库', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-admin前端框架',link: 'https://fantastic-admin.hurui.me/'},
    ]},
    { text: '语言切换', items: [
        { text: '🇨🇳 中文 (简体)', link: 'https://doc.mineadmin.com' },
        { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
        { text: '🇯🇵 日本語', link: 'https://ja.doc.mineadmin.com' },
        { text: '🇭🇰 繁體中文 (香港)', link: 'https://zh-hk.doc.mineadmin.com' },
        { text: '🇹🇼 繁體中文 (台灣)', link: 'https://zh-tw.doc.mineadmin.com' }
    ]}
]

export default nav
