import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh/guide/': [
    {
      text: '介绍',
      items: [
        {
          text: '为什么选择我们?',
          link: '/zh/guide/introduce/mineadmin',
        },
        {
          text: '更新日志',
          link: '/zh/guide/changelog',
        },
        {
          text: '免责声明',
          link: '/zh/guide/introduce/declaration',
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
          text: "部署",
          link: "/zh/guide/start/deployment"
        }
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
          text: '系统参数配置',
          link: '/zh/front/advanced/system-config'
        },
        {
          text: '自动导入',
          link: '/zh/front/advanced/auto-import'
        },
        {
          text: '请求与拦截器',
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
          text: 'Hooks',
          link: '/zh/front/high/hooks'
        },
        {
          text: '常用Store',
          link: '/zh/front/high/store'
        },
        {
          text: '插件系统',
          link: '/zh/front/high/plugins'
        },
        {
          text: 'JSX和TSX开发',
          link: '/zh/front/high/tsx'
        }
      ],
    },
    {
      text: '组件教程',
      items: [
        {
          text: 'MaForm',
          link: '/zh/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基础用法',
              link: '/zh/front/component/ma-form/examples/basic-usage'
            },
            {
              text: '布局系统',
              link: '/zh/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '条件渲染',
              link: '/zh/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '动态验证',
              link: '/zh/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: '组件渲染',
              link: '/zh/front/component/ma-form/examples/component-rendering'
            },
            {
              text: '插槽示例',
              link: '/zh/front/component/ma-form/examples/slots-examples'
            },
            {
              text: '暴露方法',
              link: '/zh/front/component/ma-form/examples/expose-methods'
            },
            {
              text: '加载状态',
              link: '/zh/front/component/ma-form/examples/loading-states'
            },
            {
              text: '嵌套表单',
              link: '/zh/front/component/ma-form/examples/nested-forms'
            },
            {
              text: '移动端适配',
              link: '/zh/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高级场景',
              link: '/zh/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: '性能演示',
              link: '/zh/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable',
          link: '/zh/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基础表格',
              link: '/zh/front/component/ma-table/basic'
            },
            {
              text: '表格排序',
              link: '/zh/front/component/ma-table/sorting'
            },
            {
              text: '表格筛选',
              link: '/zh/front/component/ma-table/filter'
            },
            {
              text: '自定义渲染',
              link: '/zh/front/component/ma-table/custom-render'
            },
            {
              text: '动态列管理',
              link: '/zh/front/component/ma-table/dynamic-columns'
            },
            {
              text: '分页表格',
              link: '/zh/front/component/ma-table/pagination'
            },
            {
              text: '树形表格',
              link: '/zh/front/component/ma-table/tree-table'
            },
            {
              text: '多选表格',
              link: '/zh/front/component/ma-table/selection'
            },
            {
              text: '响应式表格',
              link: '/zh/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch',
          link: '/zh/front/component/ma-search'
        },
        {
          text: 'MaProTable',
          link: '/zh/front/component/ma-pro-table'
        },
        {
          text: 'MaEcharts',
          link: '/zh/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/zh/backend/':[
    {
      text:"进阶",
      items:[
        {
          text: "目录结构",
          link: "/zh/backend/base/structure"
        },
        {
          text: "生命周期",
          link: "/zh/backend/base/lifecycle"
        },
        { text: "路由与API文档",link: "/zh/backend/base/router"},
        { text: "错误处理",link: "/zh/backend/base/error-handler"},
        {text: "日志",link: "/zh/backend/base/logger"},
        {text: "事件",link: "/zh/backend/base/event-handler"},
        {text: "文件上传",link: "/zh/backend/base/upload"},
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
        },
        {
          text: "获取客户端 IP",
          link: "/zh/backend/security/client-ip"
        }
      ]
    },{
      text:"数据权限",
      items:[
        {
          text: "核心概念",
          link: "/zh/backend/data-permission/overview"
        },
        {
          text: "权限配置与效果演示",
          link: "/zh/backend/data-permission/config"
        },
        {
          text: "使用示例",
            link: "/zh/backend/data-permission/example"
        },
        {
          text: "注意事项",
            link: "/zh/backend/data-permission/notice"
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