import {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: '指南', link: '/zh-hk/guide/introduce/mineadmin' },
    { text: '前端', link: '/zh-hk/front/base/concept' },
    { text: '後端', link: '/zh-hk/backend/index' },
    { text: '插件',link: "/zh-hk/plugin/index"},
    { text: '常見問題', link: '/zh-hk/faq/index' },
    { text: '更多推薦' ,items:[
        { text: '老版本文檔', link: 'https://docv2.mineadmin.com' },
        { text: '開箱即用的 Hyperf 組件庫', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-admin前端框架',link: 'https://fantastic-admin.hurui.me/'},
    ]}
]

export default nav
