import {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
    '/zh/backend/':[
        {
            text:'前言',
            items:[
                {
                    text:"发行说明",
                    link:'/zh/backend/releases'
                },
                {
                    text:"升级指南",
                    link:"/zh/backend/upgrade"
                },
                {
                    text:"贡献指南",
                    link:"/zh/backend/contributions"
                }
            ]
        },
        {
            text:"入门指南",
            items:[
                {
                    text: "目录结构",
                    link: "/zh/backend/guide/structure"
                },
                {
                    text: "部署",
                    link: "/zh/backend/guide/deployment"
                }
            ]
        },
        {
            text:"核心架构",
            items:[
                {
                    text: "生命周期",
                    link: "/zh/backend/kernel/lifecycle"
                }
            ]
        },
        {
            text:"安全相关",
            items:[
                {
                    text: "用户认证",
                    link: "/zh/backend/security/passport"
                },
                {
                    text: "用户授权(RBAC)",
                    link: "/zh/backend/security/access"
                }
            ]
        }
    ]
}

export default sidebar