import type {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: 'ガイド', link: '/guide/introduce/mineadmin' },
    { text: 'フロントエンド', link: '/front/base/concept' },
    { text: 'バックエンド', link: '/backend/index' },
    { text: 'プラグイン',link: "/plugin/index"},
    { text: 'よくある質問', link: '/faq/index' },
    { text: 'その他のおすすめ' ,items:[
        { text: '旧版ドキュメント', link: 'https://docv2.mineadmin.com' },
        { text: 'すぐ使えるHyperfコンポーネントライブラリ', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-adminフロントエンドフレームワーク',link: 'https://fantastic-admin.hurui.me/'},
    ]},
    { text: '言語', items: [
        { text: '🇨🇳 中文 (简体)', link: 'https://doc.mineadmin.com' },
        { text: '🇺🇸 English', link: 'https://en.doc.mineadmin.com' },
        { text: '🇯🇵 日本語', link: 'https://ja.doc.mineadmin.com' },
        { text: '🇭🇰 繁體中文 (香港)', link: 'https://zh-hk.doc.mineadmin.com' },
        { text: '🇹🇼 繁體中文 (台灣)', link: 'https://zh-tw.doc.mineadmin.com' }
    ]}
]

export default nav