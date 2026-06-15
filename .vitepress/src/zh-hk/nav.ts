import type {DefaultTheme} from "vitepress";
import { createLibraryNavItems, createProductVersionNavItems } from "../shared";

const nav:DefaultTheme.NavItem[] = [
    { 
        text: '📚 指南', 
        link: '/v3/guide/introduce/mineadmin',
        activeMatch: '/v3/guide/'
    },
    { 
        text: '🎨 前端', 
        link: '/v3/front/base/concept',
        activeMatch: '/v3/front/'
    },
    { 
        text: '🔧 後端', 
        link: '/v3/backend/index',
        activeMatch: '^/(v3/backend|backend/frameworks)/'
    },
    { 
        text: '🧩 插件',
        link: "/v3/plugin/index",
        activeMatch: '/v3/plugin/'
    },
    { 
        text: '❓ 常見問題', 
        link: '/v3/faq/index',
        activeMatch: '/v3/faq/'
    },
    {
        text: '📦 庫',
        items: [
            { text: '庫總覽', link: '/libs/' },
            ...createLibraryNavItems()
        ]
    },
    {
        text: '🏷️ 版本',
        items: createProductVersionNavItems()
    },
    { 
        text: '🔗 更多推薦',
        items:[
            { 
                text: '📖 老版本文檔', 
                link: 'https://docv2.mineadmin.com' 
            },
            { 
                text: '📦 開箱即用的 Hyperf 組件庫', 
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
            { text: '🇹🇼 繁體中文 (台灣)', link: 'https://zh-tw.doc.mineadmin.com' }
        ]
    }
]

export default nav
