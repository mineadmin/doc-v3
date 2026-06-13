import type {DefaultTheme} from "vitepress";
import { createLibraryNavItems, createProductVersionNavItems } from "../shared";

const nav:DefaultTheme.NavItem[] = [
    { 
        text: '📚 ガイド', 
        link: '/v3/guide/introduce/mineadmin',
        activeMatch: '/v3/guide/'
    },
    { 
        text: '🎨 フロントエンド', 
        link: '/v3/front/base/concept',
        activeMatch: '/v3/front/'
    },
    { 
        text: '🔧 バックエンド', 
        link: '/v3/backend/index',
        activeMatch: '/v3/backend/'
    },
    { 
        text: '🧩 プラグイン',
        link: "/v3/plugin/index",
        activeMatch: '/v3/plugin/'
    },
    { 
        text: '❓ よくある質問', 
        link: '/v3/faq/index',
        activeMatch: '/v3/faq/'
    },
    {
        text: '📦 ライブラリ',
        items: [
            { text: 'ライブラリ一覧', link: '/libs/' },
            ...createLibraryNavItems()
        ]
    },
    {
        text: '🏷️ バージョン',
        items: createProductVersionNavItems()
    },
    { 
        text: '🔗 その他のおすすめ',
        items:[
            { 
                text: '📖 旧バージョンドキュメント', 
                link: 'https://docv2.mineadmin.com' 
            },
            { 
                text: '📦 すぐに使える Hyperf コンポーネントライブラリ', 
                link: 'https://hyperf.fans/' 
            },
            { 
                text: '🎭 Fantastic-admin フロントエンドフレームワーク',
                link: 'https://fantastic-admin.hurui.me/'
            },
        ]
    },
    { 
        text: '🌍 言語切替', 
        items: [
            { text: '🇨🇳 中国語 (簡体字)', link: 'https://doc.mineadmin.com' },
            { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
            { text: '🇯🇵 日本語', link: 'https://ja.doc.mineadmin.com' },
            { text: '🇭🇰 繁体字中国語 (香港)', link: 'https://zh-hk.doc.mineadmin.com' },
            { text: '🇹🇼 繁体字中国語 (台湾)', link: 'https://zh-tw.doc.mineadmin.com' }
        ]
    }
]

export default nav