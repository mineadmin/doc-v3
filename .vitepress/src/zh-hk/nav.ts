import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: '指南', link: '/guide/introduce/mineadmin' },
    { text: '前端', link: '/front/base/concept' },
    { text: '後端', link: '/backend/index' },
    { text: '插件',link: "/plugin/index"},
    { text: '常見問題', link: '/faq/index' },
    { text: '更多推薦' ,items:[
        { text: '老版本文檔', link: 'https://docv2.mineadmin.com' },
        { text: '開箱即用的 Hyperf 組件庫', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-admin前端框架',link: 'https://fantastic-admin.hurui.me/'},
    ]},
    { text: '語言切換', items: [
        { text: '🇨🇳 中文 (简体)', link: 'https://doc.mineadmin.com' },
        { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
        { text: '🇯🇵 日本語', link: 'https://ja.doc.mineadmin.com' },
        { text: '🇭🇰 繁體中文 (香港)', link: 'https://zh-hk.doc.mineadmin.com' },
        { text: '🇹🇼 繁體中文 (台灣)', link: 'https://zh-tw.doc.mineadmin.com' }
    ]}
]

export default nav
