import type {DefaultTheme} from "vitepress";
import { createLibraryNavItems, createProductVersionNavItems } from "../shared";

const nav:DefaultTheme.NavItem[] = [
    { 
        text: '📚 Guide', 
        link: '/v3/guide/introduce/mineadmin',
        activeMatch: '/v3/guide/'
    },
    { 
        text: '🎨 Frontend', 
        link: '/v3/front/base/concept',
        activeMatch: '/v3/front/'
    },
    { 
        text: '🔧 Backend', 
        link: '/v3/backend/index',
        activeMatch: '/v3/backend/'
    },
    { 
        text: '🧩 Plugins',
        link: "/v3/plugin/index",
        activeMatch: '/v3/plugin/'
    },
    { 
        text: '❓ FAQ', 
        link: '/v3/faq/index',
        activeMatch: '/v3/faq/'
    },
    {
        text: '📦 Libraries',
        items: [
            { text: 'Library Overview', link: '/libs/' },
            ...createLibraryNavItems()
        ]
    },
    {
        text: '🏷️ Version',
        items: createProductVersionNavItems()
    },
    { 
        text: '🔗 More Recommendations',
        items:[
            { 
                text: '📖 Old Version Docs', 
                link: 'https://docv2.mineadmin.com' 
            },
            { 
                text: '📦 Out-of-the-box Hyperf Component Library', 
                link: 'https://hyperf.fans/' 
            },
            { 
                text: '🎭 Fantastic-admin Frontend Framework',
                link: 'https://fantastic-admin.hurui.me/'
            },
        ]
    },
    { 
        text: '🌍 Language Switch', 
        items: [
            { text: '🇨🇳 Chinese (Simplified)', link: 'https://doc.mineadmin.com' },
            { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
            { text: '🇯🇵 Japanese', link: 'https://ja.doc.mineadmin.com' },
            { text: '🇭🇰 Traditional Chinese (Hong Kong)', link: 'https://zh-hk.doc.mineadmin.com' },
            { text: '🇹🇼 Traditional Chinese (Taiwan)', link: 'https://zh-tw.doc.mineadmin.com' }
        ]
    }
]

export default nav