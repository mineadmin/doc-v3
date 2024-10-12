import {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: '指南', link: '/zh/guide/introduce/mineadmin' },
    { text: '前端', link: '/zh/front/base/concept' },
    { text: '后端', link: '/zh/backend/index' },
    {text: '插件',link: "/zh/plugin/index"},
    { text: '常见问题', link: '/zh/faq/index' },
    {
        text: '老版本文档',
        items: [
            { text: '1.x ~ 2.x开发文档', link: 'https://doc.mineadmin.com/v1-2/' },
            { text: '0.x开发文档', link: 'https://doc.mineadmin.com/v0/' }
        ]
    },
]

export default nav