import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { 
        text: '📚 Guide', 
        link: '/guide/introduce/mineadmin',
        activeMatch: '/guide/'
    },
    { 
        text: '🎨 Frontend', 
        link: '/front/base/concept',
        activeMatch: '/front/'
    },
    { 
        text: '🔧 Backend', 
        link: '/backend/index',
        activeMatch: '/backend/'
    },
    { 
        text: '🧩 Plugins',
        link: "/plugin/index",
        activeMatch: '/plugin/'
    },
    { 
        text: '❓ FAQ', 
        link: '/faq/index',
        activeMatch: '/faq/'
    },
    { 
        text: '🔗 More Recommendations',
        items:[
            { 
                text: '📖 Legacy Documentation', 
                link: 'https://docv2.mineadmin.com' 
            },
            { 
                text: '📦 Out-of-the-box Hyperf Components', 
                link: 'https://hyperf.fans/' 
            },
            { 
                text: '🎭 Fantastic-admin Frontend Framework',
                link: 'https://fantastic-admin.hurui.me/'
            },
        ]
    },
    { 
        text: '🌍 Language', 
        items: [
            { text: '🇨🇳 Chinese (Simplified)', link: 'https://doc.mineadmin.com' },
            { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
            { text: '🇯🇵 日本語', link: 'https://ja.doc.mineadmin.com' },
            { text: '🇭🇰 Chinese (Hong Kong)', link: 'https://zh-hk.doc.mineadmin.com' },
            { text: '🇹🇼 Chinese (Taiwan)', link: 'https://zh-tw.doc.mineadmin.com' }
        ]
    }
]

export default nav