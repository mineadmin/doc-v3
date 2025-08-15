import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { 
        text: '📚 ガイド', 
        link: '/guide/introduce/mineadmin',
        activeMatch: '/guide/'
    },
    { 
        text: '🎨 フロントエンド', 
        link: '/front/base/concept',
        activeMatch: '/front/'
    },
    { 
        text: '🔧 バックエンド', 
        link: '/backend/index',
        activeMatch: '/backend/'
    },
    { 
        text: '🧩 プラグイン',
        link: "/plugin/index",
        activeMatch: '/plugin/'
    },
    { 
        text: '❓ よくある質問', 
        link: '/faq/index',
        activeMatch: '/faq/'
    },
    { 
        text: '🔗 その他のおすすめ',
        items:[
            { 
                text: '📖 旧版ドキュメント', 
                link: 'https://docv2.mineadmin.com' 
            },
            { 
                text: '📦 すぐ使えるHyperfコンポーネントライブラリ', 
                link: 'https://hyperf.fans/' 
            },
            { 
                text: '🎭 Fantastic-adminフロントエンドフレームワーク',
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
            { text: '🇭🇰 中国語 (繁体字・香港)', link: 'https://zh-hk.doc.mineadmin.com' },
            { text: '🇹🇼 中国語 (繁体字・台湾)', link: 'https://zh-tw.doc.mineadmin.com' }
        ]
    }
]

export default nav