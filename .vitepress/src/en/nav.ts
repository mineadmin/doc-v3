import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: 'Guide', link: '/guide/introduce/mineadmin' },
    { text: 'Frontend', link: '/front/base/concept' },
    { text: 'Backend', link: '/backend/index' },
    { text: 'Plugins',link: "/plugin/index"},
    { text: 'FAQ', link: '/faq/index' },
    { text: 'More Recommendations' ,items:[
        { text: 'Legacy Documentation', link: 'https://docv2.mineadmin.com' },
        { text: 'Out-of-the-box Hyperf Components', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-admin Frontend Framework',link: 'https://fantastic-admin.hurui.me/'},
    ]},
    { text: 'Language', items: [
        { text: '🇨🇳 中文 (简体)', link: 'https://doc.mineadmin.com' },
        { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
        { text: '🇯🇵 日本語', link: 'https://ja.doc.mineadmin.com' },
        { text: '🇭🇰 繁體中文 (香港)', link: 'https://zh-hk.doc.mineadmin.com' },
        { text: '🇹🇼 繁體中文 (台灣)', link: 'https://zh-tw.doc.mineadmin.com' }
    ]}
]

export default nav