export default {
    title: "🚀 MineAdmin",
    description: "✨ 企业级后台管理系统 - 高效、安全、易用",
    tagline: "🎯 全新版本，开箱即用的现代化解决方案",
    themeConfig: {
        siteTitle: "🚀 MineAdmin",
        logo: "/logo.svg",
        editLink: {
            pattern: 'https://github.com/mineadmin/doc-v3/edit/main/docs/zh/:path',
            text: '📝 在 GitHub 上编辑此页'
        },
        lastUpdated: {
            text: '🕒 最后更新于',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },
        returnToTopLabel: '🔝 回到顶部',
        sidebarMenuLabel: '📋 菜单',
        darkModeSwitchLabel: '🌙 外观',
        lightModeSwitchTitle: '☀️ 切换到浅色模式',
        darkModeSwitchTitle: '🌙 切换到深色模式',
        skipToContentLabel: '⏭️ 跳转到主要内容',
        externalLinkIcon: true,
        footer: {
            message: '基于 MIT 许可发布 | 💖 用心打造',
            copyright: `Copyright © 2019-${new Date().getFullYear()} MineAdmin Team`
        }
    }
}