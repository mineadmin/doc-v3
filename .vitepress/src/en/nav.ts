import {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: 'Guide', link: '/en/guide/introduce/mineadmin' },
    { text: 'Frontend', link: '/en/front/base/concept' },
    { text: 'Backend', link: '/en/backend/index' },
    { text: 'Plugins', link: '/en/plugin/index' },
    { text: 'FAQ', link: '/en/faq/index' },
    { text: 'More' ,items:[
        { text: 'Old Version Documentation', link: 'https://docv2.mineadmin.com' },
        { text: 'Hyperf Component Library', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-admin Framework', link: 'https://fantastic-admin.hurui.me/' },
    ]}
]

export default nav