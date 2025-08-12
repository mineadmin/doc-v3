import type { DefaultTheme } from "vitepress";

const nav: DefaultTheme.NavItem[] = [
    { text: 'Guide', link: '/en/guide/introduce/mineadmin' },
    { text: 'Frontend', link: '/en/front/base/concept' },
    { text: 'Backend', link: '/en/backend/index' },
    { text: 'Plugins', link: "/en/plugin/index" },
    { text: 'FAQ', link: '/en/faq/index' },
    { 
        text: 'More Recommendations',
        items: [
            { text: 'Legacy Documentation', link: 'https://docv2.mineadmin.com' },
            { text: 'Out-of-the-box Hyperf Components', link: 'https://hyperf.fans/' },
            { text: 'Fantastic-admin Frontend Framework', link: 'https://fantastic-admin.hurui.me/' },
        ]
    }
]

export default nav