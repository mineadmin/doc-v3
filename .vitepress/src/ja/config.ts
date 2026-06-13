export default {
    title: "🚀 MineAdmin",
    description: "✨ エンタープライズ向け管理システム - 高効率、安全、使いやすい",
    tagline: "🎯 新バージョン、開箱即用のモダンなソリューション",
    themeConfig: {
        siteTitle: "🚀 MineAdmin",
        logo: "/logo.svg",
        editLink: {
            pattern: 'https://github.com/mineadmin/doc-v3/edit/main/docs/zh/:path',
            text: '📝 GitHub でこのページを編集'
        },
        lastUpdated: {
            text: '🕒 最終更新日',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },
        returnToTopLabel: '🔝 トップに戻る',
        sidebarMenuLabel: '📋 メニュー',
        darkModeSwitchLabel: '🌙 外観',
        lightModeSwitchTitle: '☀️ ライトモードに切り替え',
        darkModeSwitchTitle: '🌙 ダークモードに切り替え',
        skipToContentLabel: '⏭️ メインコンテンツへスキップ',
        externalLinkIcon: true,
        footer: {
            message: 'MIT ライセンスで公開 | 💖 心を込めて開発',
            copyright: `Copyright © 2019-${new Date().getFullYear()} MineAdmin Team`
        }
    }
}