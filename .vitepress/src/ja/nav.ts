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
    ]}
]

export default nav