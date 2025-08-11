import {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: 'ガイド', link: '/ja/guide/introduce/mineadmin' },
    { text: 'フロントエンド', link: '/ja/front/base/concept' },
    { text: 'バックエンド', link: '/ja/backend/index' },
    { text: 'プラグイン', link: "/ja/plugin/index"},
    { text: 'よくある質問', link: '/ja/faq/index' },
    { text: 'その他のおすすめ', items:[
        { text: '旧版ドキュメント', link: 'https://docv2.mineadmin.com' },
        { text: 'すぐ使えるHyperfコンポーネントライブラリ', link: 'https://hyperf.fans/' },
        { text: 'Fantastic-adminフロントエンドフレームワーク', link: 'https://fantastic-admin.hurui.me/'},
    ]}
]

export default nav