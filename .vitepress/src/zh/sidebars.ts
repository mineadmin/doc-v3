import type {DefaultTheme} from "vitepress";
import { createLibrarySidebar } from "../shared";

const sidebar:DefaultTheme.Sidebar = {
  '/v3/guide/': [
    {
      text: '介绍',
      collapsed: false,
      items: [
        {
          text: '为什么选择我们?',
          link: '/v3/guide/introduce/mineadmin',
        },
        {
          text: '更新日志',
          link: '/v3/guide/changelog',
        },
        {
          text: '免责声明',
          link: '/v3/guide/introduce/declaration',
        },
        {
          text: '鸣谢',
          link: '/v3/guide/introduce/thank',
        },
        {
          text: '联系我们',
          link: '/v3/guide/introduce/contact',
        }
      ]
    },
    {
      text: '快速开始',
      collapsed: false,
      items: [
        {
          text: '快速安装',
          link: '/v3/guide/start/fast-install',
        },
        {
          text: "部署",
          link: "/v3/guide/start/deployment"
        }
      ]
    },
    {
      text: '其他资源',
      collapsed: true,
      items: [
        {
          text:"发行说明",
          link:'/v3/guide/releases'
        },
        {
          text:"升级指南",
          link:"/v3/guide/upgrade"
        },
        {
          text:"贡献指南",
          link:"/v3/guide/contributions"
        }
      ]
    }
  ],
  '/v3/front/': [
    {
      text: '基础入门',
      collapsed: false,
      items: [
        {
          text: '基础概念',
          link: '/v3/front/base/concept'
        },
        {
          text: '快速开始',
          link: '/v3/front/base/start'
        },
        {
          text: '路由和菜单',
          link: '/v3/front/base/route-menu'
        },
        {
          text: '配置',
          link: '/v3/front/base/configure'
        },
        {
          text: '图标',
          link: '/v3/front/base/icon'
        },
        {
          text: '构建与预览',
          link: '/v3/front/base/build-preview'
        }
      ]
    },
    {
      text: '进阶开发',
      collapsed: false,
      items: [
        {
          text: '系统参数配置',
          link: '/v3/front/advanced/system-config'
        },
        {
          text: '自动导入',
          link: '/v3/front/advanced/auto-import'
        },
        {
          text: '请求与拦截器',
          link: '/v3/front/advanced/request'
        },
        {
          text: '登录与欢迎页',
          link: '/v3/front/advanced/login-welcome'
        },
        {
          text: '模块化',
          link: '/v3/front/advanced/module'
        },
        {
          text: '布局',
          link: '/v3/front/advanced/layout'
        },
        {
          text: '工具栏扩展',
          link: '/v3/front/advanced/tools'
        },
        {
          text: '权限',
          link: '/v3/front/advanced/permission'
        },
        {
          text: '页面缓存',
          link: '/v3/front/advanced/cache'
        }
      ]
    },
    {
      text: '高级主题',
      collapsed: true,
      items: [
        {
          text: '国际化配置',
          link: '/v3/front/high/i18n'
        },
        {
          text: '服务提供器',
          link: '/v3/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/v3/front/high/hooks'
        },
        {
          text: '🗄️ 常用Store',
          link: '/v3/front/high/store'
        },
        {
          text: '插件系统',
          link: '/v3/front/high/plugins'
        },
        {
          text: 'JSX和TSX开发',
          link: '/v3/front/high/tsx'
        }
      ],
    },
    {
      text: '组件教程',
      collapsed: false,
      items: [
        {
          text: 'MaForm 表单组件',
          link: '/v3/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基础用法',
              link: '/v3/front/component/ma-form/examples/basic-usage'
            },
            {
              text: '布局系统',
              link: '/v3/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '条件渲染',
              link: '/v3/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '动态验证',
              link: '/v3/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: '组件渲染',
              link: '/v3/front/component/ma-form/examples/component-rendering'
            },
            {
              text: '插槽示例',
              link: '/v3/front/component/ma-form/examples/slots-examples'
            },
            {
              text: '暴露方法',
              link: '/v3/front/component/ma-form/examples/expose-methods'
            },
            {
              text: '加载状态',
              link: '/v3/front/component/ma-form/examples/loading-states'
            },
            {
              text: '嵌套表单',
              link: '/v3/front/component/ma-form/examples/nested-forms'
            },
            {
              text: '移动端适配',
              link: '/v3/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高级场景',
              link: '/v3/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: '性能演示',
              link: '/v3/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable 表格组件',
          link: '/v3/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基础表格',
              link: '/v3/front/component/ma-table/basic'
            },
            {
              text: '表格排序',
              link: '/v3/front/component/ma-table/sorting'
            },
            {
              text: '表格筛选',
              link: '/v3/front/component/ma-table/filter'
            },
            {
              text: '自定义渲染',
              link: '/v3/front/component/ma-table/custom-render'
            },
            {
              text: '动态列管理',
              link: '/v3/front/component/ma-table/dynamic-columns'
            },
            {
              text: '分页表格',
              link: '/v3/front/component/ma-table/pagination'
            },
            {
              text: '树形表格',
              link: '/v3/front/component/ma-table/tree-table'
            },
            {
              text: '多选表格',
              link: '/v3/front/component/ma-table/selection'
            },
            {
              text: '响应式表格',
              link: '/v3/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch 搜索组件',
          link: '/v3/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基础用法',
              link: '/v3/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高级搜索',
              link: '/v3/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '折叠搜索',
              link: '/v3/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: '自定义操作',
              link: '/v3/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '动态管理',
              link: '/v3/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: '响应式布局',
              link: '/v3/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: '表格集成',
              link: '/v3/front/component/ma-search/examples/table-integration'
            },
            {
              text: '表单验证',
              link: '/v3/front/component/ma-search/examples/form-validation'
            },
            {
              text: '方法演示',
              link: '/v3/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable 高级表格',
          link: '/v3/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: '基础用法',
              link: '/v3/front/component/ma-pro-table/examples/basic'
            },
            {
              text: '高级搜索',
              link: '/v3/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: '自定义操作',
              link: '/v3/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: '单元格渲染插件',
              link: '/v3/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: '工具栏扩展',
              link: '/v3/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: '数据管理',
              link: '/v3/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: '响应式布局',
              link: '/v3/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts 图表组件',
          link: '/v3/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/v3/backend/':[
    {
      text:"核心功能",
      collapsed: false,
      items:[
        {
          text: "目录结构",
          link: "/v3/backend/base/structure"
        },
        {
          text: "生命周期",
          link: "/v3/backend/base/lifecycle"
        },
        { text: "路由与API文档",link: "/v3/backend/base/router"},
        { text: "错误处理",link: "/v3/backend/base/error-handler"},
        {text: "日志",link: "/v3/backend/base/logger"},
        {text: "事件",link: "/v3/backend/base/event-handler"},
        {text: "文件上传",link: "/v3/backend/base/upload"},
        {text: "多语言",link: "/v3/backend/base/lang"},
      ]
    },
    {
      text:"安全相关",
      collapsed: false,
      items:[
        {
          text: "用户认证",
          link: "/v3/backend/security/passport"
        },
        {
          text: "用户授权(RBAC)",
          link: "/v3/backend/security/access"
        },
        {
          text: "获取客户端 IP",
          link: "/v3/backend/security/client-ip"
        }
      ]
    },{
      text:"数据权限",
      collapsed: true,
      items:[
        {
          text: "核心概念",
          link: "/v3/backend/data-permission/overview"
        },
        {
          text: "权限配置与效果演示",
          link: "/v3/backend/data-permission/config"
        },
        {
          text: "API 参考与高级用法",
          link: "/v3/backend/data-permission/example"
        },
        {
          text: "性能优化指南",
          link: "/v3/backend/data-permission/performance"
        },
        {
          text: "故障排除指南",
          link: "/v3/backend/data-permission/troubleshooting"
        },
        {
          text: "注意事项与最佳实践",
          link: "/v3/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/v3/plugin/':[
    {
      text:"快速开始",
      collapsed: false,
      items:
          [
            {
              text:"插件系统概述",
              link:"/v3/plugin/index"
            },
            {
              text:"快速入门指南",
              link:"/v3/plugin/guide"
            },
            {
              text:"插件命令",
              link:"/v3/plugin/command"
            },
            {
              text:"创建应用",
              link:"/v3/plugin/create"
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
              link:"/v3/plugin/structure"
            },
            {
              text:"mine.json 配置",
              link:"/v3/plugin/mineJson"
            },
            {
              text:"ConfigProvider 说明",
              link:"/v3/plugin/configProvider"
            },
            {
              text:"生命周期管理",
              link:"/v3/plugin/lifecycle"
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
              link:"/v3/plugin/develop"
            },
            {
              text:"API 参考文档",
              link:"/v3/plugin/api"
            },
            {
              text:"示例代码",
              link:"/v3/plugin/examples"
            }
          ]
    },
    {
      text:"后端开发",
      collapsed: false,
      items:[
        {
          text: "数据库迁移",
          link: "/v3/plugin/backend/migrate"
        },
        {
          text: "单元测试",
          link: "/v3/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"前端开发",
      collapsed: false,
      items:[
        {
          text: "前端开发规范",
          link: "/v3/plugin/front/develop"
        }
      ]
    },
    {
      text:"应用上架",
      collapsed: true,
      items:[
        {
          text: "应用发布",
          link: "/v3/plugin/develop/publish"
        },
        {
          text: "注意事项",
          link: "/v3/plugin/develop/question"
        }
      ]
    }
  ],
  '/libs/': createLibrarySidebar({
    title: '独立库',
    overview: '库总览',
    currentVersion: '当前版本'
  })
}

export default sidebar
