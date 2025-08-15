import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { 
        text: '📚 指南', 
        link: '/guide/introduce/mineadmin',
        activeMatch: '/guide/'
    },
    { 
        text: '🎨 前端', 
        link: '/front/base/concept',
        activeMatch: '/front/'
    },
    { 
        text: '🔧 後端', 
        link: '/backend/index',
        activeMatch: '/backend/'
    },
    { 
        text: '🧩 外掛',
        link: "/plugin/index",
        activeMatch: '/plugin/'
    },
    { 
        text: '❓ 常見問題', 
        link: '/faq/index',
        activeMatch: '/faq/'
    },
    { 
        text: '🔗 更多推薦',
        items:[
            { 
                text: '📖 老版本文件', 
                link: 'https://docv2.mineadmin.com' 
            },
            { 
                text: '📦 開箱即用的 Hyperf 元件庫', 
                link: 'https://hyperf.fans/' 
            },
            { 
                text: '🎭 Fantastic-admin前端框架',
                link: 'https://fantastic-admin.hurui.me/'
            },
        ]
    },
    { 
        text: '🌍 語言切換', 
        items: [
            { text: '🇨🇳 中文 (簡體)', link: 'https://doc.mineadmin.com' },
            { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
            { text: '🇯🇵 日本語', link: 'https://ja.doc.mineadmin.com' },
            { text: '🇭🇰 繁體中文 (香港)', link: 'https://zh-hk.doc.mineadmin.com' },
            { text: '🇹🇼 繁體中文 (臺灣)', link: 'https://zh-tw.doc.mineadmin.com' }
        ]
    }
]

export default nav
