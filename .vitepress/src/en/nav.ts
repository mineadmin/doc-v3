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
    ]}
]

export default nav