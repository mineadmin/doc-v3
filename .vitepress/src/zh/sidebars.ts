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
        }
    ]
}

export default sidebar