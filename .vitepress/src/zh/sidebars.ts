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
          text:"发行说明",
          link:'/zh/guide/releases'
        },
        {
          text:"升级指南",
          link:"/zh/guide/upgrade"
        },
        {
          text:"贡献指南",
          link:"/zh/guide/contributions"
        }
      ]
    }
  ],
  '/zh/front/': [
    {
      text: '基础',
      items: [
        {
          text: '基础概念',
          link: '/zh/front/base/concept'
        },
        {
          text: '开始',
          link: '/zh/front/base/start'
        },
        {
          text: '路由和菜单',
          link: '/zh/front/base/route-menu'
        },
        {
          text: '配置',
          link: '/zh/front/base/configure'
        },
        {
          text: '图标',
          link: '/zh/front/base/icon'
        },
        {
          text: '构建与预览',
          link: '/zh/front/base/build-preview'
        }
      ]
    },
    {
      text: '进阶',
      items: [
        {
          text: '请求拦截器',
          link: '/zh/front/advanced/request'
        },
        {
          text: '登录与欢迎页',
          link: '/zh/front/advanced/login-welcome'
        },
        {
          text: '模块化',
          link: '/zh/front/advanced/module'
        },
        {
          text: '布局',
          link: '/zh/front/advanced/layout'
        },
        {
          text: '工具栏扩展',
          link: '/zh/front/advanced/tools'
        },
        {
          text: '权限',
          link: '/zh/front/advanced/permission'
        },
        {
          text: '页面缓存',
          link: '/zh/front/advanced/cache'
        }
      ]
    },
    {
      text: '高级',
      items: [
        {
          text: '国际化配置',
          link: '/zh/front/high/i18n'
        },
        {
          text: '服务提供器',
          link: '/zh/front/high/provider'
        },
        {
          text: '插件',
          link: '/zh/front/advanced/plugin'
        },
        {
          text: 'Hooks',
          link: '/zh/front/advanced/hooks'
        },
        {
          text: '常用Store',
          link: '/zh/front/advanced/store'
        },
        {
          text: 'JSX和TSX开发',
          link: '/zh/front/advanced/jsx'
        }
      ],
    },
    {
      text: '组件教程',
      items: [
        {
          text: 'MaForm',
          link: '/zh/front/component/ma-form'
        },
        {
          text: 'MaTable',
          link: '/zh/front/component/ma-table'
        },
        {
          text: 'MaProTable',
          link: '/zh/front/component/ma-pro-table'
        },
        {
          text: 'MaSearch',
          link: '/zh/front/component/ma-search'
        },
        {
          text: 'MaEcharts',
          link: '/zh/front/component/ma-echarts'
        },
        {
          text: 'MaDialog',
          link: '/zh/front/component/ma-dialog'
        }
      ]
    }
  ],
  '/zh/backend/':[
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
      text:"进阶",
      items:[
        {
          text: "生命周期",
          link: "/zh/backend/base/lifecycle"
        },
        { text: "路由与API文档",link: "/zh/backend/base/router"},
        { text: "错误处理",link: "/zh/backend/base/error-handler"},
        {text: "日志",link: "/zh/backend/base/logger"},
        {text: "事件",link: "/zh/backend/base/event-handler"},
        {text: "文件上传",link: "/zh/backend/base/upload"},
        {text: "JWT",link: "/zh/backend/base/jwt"},
        {text: "多语言",link: "/zh/backend/base/lang"},
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
  ],
  '/zh/plugin/':[
    {
      text:"快速开始",
      items:
          [
            {
              text:"准备工作",
              link:"/zh/plugin"
            },
            {
              text:"插件命令",
              link:"/zh/plugin/command"
            },
            {
              text:"创建应用",
              link:"/zh/plugin/create"
            },
            {
              text:"插件目录结构",
              link:"/zh/plugin/structure"
            },
            {
              text:"mine.json 说明及示例",
              link:"/zh/plugin/mineJson"
            },
            {
            text:"ConfigProvider 说明",
            link:"/zh/plugin/configProvider"
          }
          ]
    },
    {
      text:"后端开发",
      items:[
        {
          text: "数据库迁移",
          link: "/zh/plugin/backend/migrate"
        },
        {
          text: "单元测试",
          link: "/zh/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"前端开发",
      items:[
        {
          text: "前端开发规范",
          link: "/zh/plugin/front/develop"
        }
      ]
    },
    {
      text:"应用上架",
      items:[
        {
          text: "应用发布",
          link: "/zh/plugin/develop/publish"
        },
        {
          text: "注意事项",
          link: "/zh/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar