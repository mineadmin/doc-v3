import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: '指南', link: '/zh/guide/introduce/mineadmin' },
    { text: '前端', link: '/zh/front/base/concept' },
    { text: '后端', link: '/zh/backend/index' },
    { text: '插件',link: "/zh/plugin/index"},
    { text: '常见问题', link: '/zh/faq/index' },
    { text: '更多推荐' ,items:[
        { text: '老版本文档', link: 'https://docv2.mineadmin.com' },
        { text: '开箱即用的 Hyperf 组件库', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-admin前端框架',link: 'https://fantastic-admin.hurui.me/'},
    ]}
]

export default nav
