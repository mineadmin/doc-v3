import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: '指南', link: '/zh-tw/guide/introduce/mineadmin' },
    { text: '前端', link: '/zh-tw/front/base/concept' },
    { text: '後端', link: '/zh-tw/backend/index' },
    { text: '外掛',link: "/zh-tw/plugin/index"},
    { text: '常見問題', link: '/zh-tw/faq/index' },
    { text: '更多推薦' ,items:[
        { text: '老版本文件', link: 'https://docv2.mineadmin.com' },
        { text: '開箱即用的 Hyperf 元件庫', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-admin前端框架',link: 'https://fantastic-admin.hurui.me/'},
    ]}
]

export default nav
