import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: '介绍',
      collapsed: false,
      items: [
        {
          text: '为什么选择我们?',
          link: '/guide/introduce/mineadmin',
        },
        {
          text: '更新日志',
          link: '/guide/changelog',
        },
        {
          text: '免责声明',
          link: '/guide/introduce/declaration',
        },
        {
          text: '鸣谢',
          link: '/guide/introduce/thank',
        },
        {
          text: '联系我们',
          link: '/guide/introduce/contact',
        }
      ]
    },
    {
      text: '快速开始',
      collapsed: false,
      items: [
        {
          text: '快速安装',
          link: '/guide/start/fast-install',
        },
        {
          text: "部署",
          link: "/guide/start/deployment"
        }
      ]
    },
    {
      text: '其他资源',
      collapsed: true,
      items: [
        {
          text:"发行说明",
          link:'/guide/releases'
        },
        {
          text:"升级指南",
          link:"/guide/upgrade"
        },
        {
          text:"贡献指南",
          link:"/guide/contributions"
        }
      ]
    }
  ],
  '/front/': [
    {
      text: '基础入门',
      collapsed: false,
      items: [
        {
          text: '基础概念',
          link: '/front/base/concept'
        },
        {
          text: '快速开始',
          link: '/front/base/start'
        },
        {
          text: '路由和菜单',
          link: '/front/base/route-menu'
        },
        {
          text: '配置',
          link: '/front/base/configure'
        },
        {
          text: '图标',
          link: '/front/base/icon'
        },
        {
          text: '构建与预览',
          link: '/front/base/build-preview'
        }
      ]
    },
    {
      text: '进阶开发',
      collapsed: false,
      items: [
        {
          text: '系统参数配置',
          link: '/front/advanced/system-config'
        },
        {
          text: '自动导入',
          link: '/front/advanced/auto-import'
        },
        {
          text: '请求与拦截器',
          link: '/front/advanced/request'
        },
        {
          text: '登录与欢迎页',
          link: '/front/advanced/login-welcome'
        },
        {
          text: '模块化',
          link: '/front/advanced/module'
        },
        {
          text: '布局',
          link: '/front/advanced/layout'
        },
        {
          text: '工具栏扩展',
          link: '/front/advanced/tools'
        },
        {
          text: '权限',
          link: '/front/advanced/permission'
        },
        {
          text: '页面缓存',
          link: '/front/advanced/cache'
        }
      ]
    },
    {
      text: '高级主题',
      collapsed: true,
      items: [
        {
          text: '国际化配置',
          link: '/front/high/i18n'
        },
        {
          text: '服务提供器',
          link: '/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/front/high/hooks'
        },
        {
          text: '🗄️ 常用Store',
          link: '/front/high/store'
        },
        {
          text: '插件系统',
          link: '/front/high/plugins'
        },
        {
          text: 'JSX和TSX开发',
          link: '/front/high/tsx'
        }
      ],
    },
    {
      text: '组件教程',
      collapsed: false,
      items: [
        {
          text: 'MaForm 表单组件',
          link: '/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基础用法',
              link: '/front/component/ma-form/examples/basic-usage'
            },
            {
              text: '布局系统',
              link: '/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '条件渲染',
              link: '/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '动态验证',
              link: '/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: '组件渲染',
              link: '/front/component/ma-form/examples/component-rendering'
            },
            {
              text: '插槽示例',
              link: '/front/component/ma-form/examples/slots-examples'
            },
            {
              text: '暴露方法',
              link: '/front/component/ma-form/examples/expose-methods'
            },
            {
              text: '加载状态',
              link: '/front/component/ma-form/examples/loading-states'
            },
            {
              text: '嵌套表单',
              link: '/front/component/ma-form/examples/nested-forms'
            },
            {
              text: '移动端适配',
              link: '/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高级场景',
              link: '/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: '性能演示',
              link: '/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable 表格组件',
          link: '/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基础表格',
              link: '/front/component/ma-table/basic'
            },
            {
              text: '表格排序',
              link: '/front/component/ma-table/sorting'
            },
            {
              text: '表格筛选',
              link: '/front/component/ma-table/filter'
            },
            {
              text: '自定义渲染',
              link: '/front/component/ma-table/custom-render'
            },
            {
              text: '动态列管理',
              link: '/front/component/ma-table/dynamic-columns'
            },
            {
              text: '分页表格',
              link: '/front/component/ma-table/pagination'
            },
            {
              text: '树形表格',
              link: '/front/component/ma-table/tree-table'
            },
            {
              text: '多选表格',
              link: '/front/component/ma-table/selection'
            },
            {
              text: '响应式表格',
              link: '/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch 搜索组件',
          link: '/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基础用法',
              link: '/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高级搜索',
              link: '/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '折叠搜索',
              link: '/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: '自定义操作',
              link: '/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '动态管理',
              link: '/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: '响应式布局',
              link: '/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: '表格集成',
              link: '/front/component/ma-search/examples/table-integration'
            },
            {
              text: '表单验证',
              link: '/front/component/ma-search/examples/form-validation'
            },
            {
              text: '方法演示',
              link: '/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable 高级表格',
          link: '/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: '基础用法',
              link: '/front/component/ma-pro-table/examples/basic'
            },
            {
              text: '高级搜索',
              link: '/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: '自定义操作',
              link: '/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: '单元格渲染插件',
              link: '/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: '工具栏扩展',
              link: '/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: '数据管理',
              link: '/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: '响应式布局',
              link: '/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts 图表组件',
          link: '/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/backend/':[
    {
      text:"核心功能",
      collapsed: false,
      items:[
        {
          text: "目录结构",
          link: "/backend/base/structure"
        },
        {
          text: "生命周期",
          link: "/backend/base/lifecycle"
        },
        { text: "路由与API文档",link: "/backend/base/router"},
        { text: "错误处理",link: "/backend/base/error-handler"},
        {text: "日志",link: "/backend/base/logger"},
        {text: "事件",link: "/backend/base/event-handler"},
        {text: "文件上传",link: "/backend/base/upload"},
        {text: "多语言",link: "/backend/base/lang"},
      ]
    },
    {
      text:"安全相关",
      collapsed: false,
      items:[
        {
          text: "用户认证",
          link: "/backend/security/passport"
        },
        {
          text: "用户授权(RBAC)",
          link: "/backend/security/access"
        },
        {
          text: "获取客户端 IP",
          link: "/backend/security/client-ip"
        }
      ]
    },{
      text:"数据权限",
      collapsed: true,
      items:[
        {
          text: "核心概念",
          link: "/backend/data-permission/overview"
        },
        {
          text: "权限配置与效果演示",
          link: "/backend/data-permission/config"
        },
        {
          text: "API 参考与高级用法",
          link: "/backend/data-permission/example"
        },
        {
          text: "性能优化指南",
          link: "/backend/data-permission/performance"
        },
        {
          text: "故障排除指南",
          link: "/backend/data-permission/troubleshooting"
        },
        {
          text: "注意事项与最佳实践",
          link: "/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/plugin/':[
    {
      text:"快速开始",
      collapsed: false,
      items:
          [
            {
              text:"插件系统概述",
              link:"/plugin/index"
            },
            {
              text:"快速入门指南",
              link:"/plugin/guide"
            },
            {
              text:"插件命令",
              link:"/plugin/command"
            },
            {
              text:"创建应用",
              link:"/plugin/create"
            }
          ]
    },
    {
      text:"核心概念",
      collapsed: false,
      items:
          [
            {
              text:"插件目录结构",
              link:"/plugin/structure"
            },
            {
              text:"mine.json 配置",
              link:"/plugin/mineJson"
            },
            {
              text:"ConfigProvider 说明",
              link:"/plugin/configProvider"
            },
            {
              text:"生命周期管理",
              link:"/plugin/lifecycle"
            }
          ]
    },
    {
      text:"开发指南",
      collapsed: false,
      items:
          [
            {
              text:"插件开发指南",
              link:"/plugin/develop"
            },
            {
              text:"API 参考文档",
              link:"/plugin/api"
            },
            {
              text:"示例代码",
              link:"/plugin/examples"
            }
          ]
    },
    {
      text:"后端开发",
      collapsed: false,
      items:[
        {
          text: "数据库迁移",
          link: "/plugin/backend/migrate"
        },
        {
          text: "单元测试",
          link: "/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"前端开发",
      collapsed: false,
      items:[
        {
          text: "前端开发规范",
          link: "/plugin/front/develop"
        }
      ]
    },
    {
      text:"应用上架",
      collapsed: true,
      items:[
        {
          text: "应用发布",
          link: "/plugin/develop/publish"
        },
        {
          text: "注意事项",
          link: "/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar