import type {DefaultTheme} from "vitepress";
import { createBackendFrameworkSidebarItems, createLibrarySidebar } from "../shared";

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
          text: 'MaEcharts 图表组件',
          link: '/v3/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/v3/backend/':[
    {
      text:"后端概览",
      collapsed: false,
      items:[
        {
          text: "后端总览",
          link: "/v3/backend/index"
        }
      ]
    },
    {
      text:"公共契约",
      collapsed: false,
      items:[
        {
          text: "契约总览",
          link: "/v3/backend/contracts/"
        },
        {
          text: "数据模型",
          link: "/v3/backend/contracts/data-model"
        },
        {
          text: "后台路由",
          link: "/v3/backend/contracts/routing"
        },
        {
          text: "接口元数据",
          link: "/v3/backend/contracts/api-metadata"
        },
        {
          text: "响应结构",
          link: "/v3/backend/contracts/response"
        },
        {
          text: "前台模板对接",
          link: "/v3/backend/contracts/frontend-template"
        }
      ]
    },
    {
      text:"框架实现",
      collapsed: false,
      items:createBackendFrameworkSidebarItems({
        stable: '稳定实现',
        planned: '规划中'
      }, {
        hyperf: [
          {
            text: "目录结构",
            link: "/v3/backend/frameworks/hyperf/base/structure"
          },
          {
            text: "生命周期",
            link: "/v3/backend/frameworks/hyperf/base/lifecycle"
          },
          {
            text: "路由与API文档",
            link: "/v3/backend/frameworks/hyperf/base/router"
          },
          {
            text: "错误处理",
            link: "/v3/backend/frameworks/hyperf/base/error-handler"
          },
          {
            text: "日志",
            link: "/v3/backend/frameworks/hyperf/base/logger"
          },
          {
            text: "事件",
            link: "/v3/backend/frameworks/hyperf/base/event-handler"
          },
          {
            text: "文件上传",
            link: "/v3/backend/frameworks/hyperf/base/upload"
          },
          {
            text: "多语言",
            link: "/v3/backend/frameworks/hyperf/base/lang"
          },
          {
            text: "安全相关",
            link: "/v3/backend/frameworks/hyperf/security/passport",
            collapsed: true,
            items: [
              {
                text: "用户认证",
                link: "/v3/backend/frameworks/hyperf/security/passport"
              },
              {
                text: "用户授权(RBAC)",
                link: "/v3/backend/frameworks/hyperf/security/access"
              },
              {
                text: "获取客户端 IP",
                link: "/v3/backend/frameworks/hyperf/security/client-ip"
              }
            ]
          },
          {
            text:"数据权限",
            link: "/v3/backend/frameworks/hyperf/data-permission/overview",
            collapsed: true,
            items:[
              {
                text: "核心概念",
                link: "/v3/backend/frameworks/hyperf/data-permission/overview"
              },
              {
                text: "架构设计",
                link: "/v3/backend/frameworks/hyperf/data-permission/architecture"
              },
              {
                text: "权限配置与效果演示",
                link: "/v3/backend/frameworks/hyperf/data-permission/config"
              },
              {
                text: "API 参考与高级用法",
                link: "/v3/backend/frameworks/hyperf/data-permission/example"
              },
              {
                text: "性能优化指南",
                link: "/v3/backend/frameworks/hyperf/data-permission/performance"
              },
              {
                text: "故障排除指南",
                link: "/v3/backend/frameworks/hyperf/data-permission/troubleshooting"
              },
              {
                text: "注意事项与最佳实践",
                link: "/v3/backend/frameworks/hyperf/data-permission/notice"
              }
            ]
          }
        ]
      })
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
