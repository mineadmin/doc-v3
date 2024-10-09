import {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: '指南', link: '/zh/guide/index' },
    { text: '前端', link: '/zh/front/index' },
    {text: '后端',link: "/zh/backend/index"},
    { text: '常见问题', link: '/zh/faq/index' },
    {
        text: '老版本文档',
        items: [
            { text: '1.x ~ 2.x开发文档', link: 'https://doc.mineadmin/v1-2/index.html' },
            { text: '0.x开发文档', link: '/v0/' }
        ]
    },
]

export default nav