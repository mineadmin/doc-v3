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
        }
    ]
}

export default sidebar