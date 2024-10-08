import {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh/guide/': [
    {
      text: '介绍',
      items: [
        {
          text: '关于 MineAdmin',
          link: '/zh/guide/introduce/mineadmin',
        },
        {
          text: '免责声明',
          link: '/zh/guide/introduce/declaration',
        },
        {
          text: '版权说明',
          link: '/zh/guide/introduce/copyright',
        },
        {
          text: '鸣谢',
          link: '/zh/guide/introduce/thank',
        }
      ]
    },
    {
      text: '开始',
      items: [
        {
          text: '快速安装',
          link: '/zh/guide/start/fast-install',
        },
        {
          text: '正式部署',
          link: '/zh/guide/start/fast-install',
        },
      ]
    },
    {
      text: '其他',
      items: [
        {
          text: '版本计划',
          link: '/zh/guide/other/version-plan',
        },
        {
          text: '更新记录',
          link: '/zh/guide/other/update-desc',
        },
      ]
    }
  ],
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