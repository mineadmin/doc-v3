import type {DefaultTheme} from "vitepress";
import { createBackendFrameworkSidebarItems, createLibrarySidebar } from "../shared";

const createHyperfSidebarItems = (version: '3.1' | '3.2'): DefaultTheme.SidebarItem[] => {
  const base = `/backend/frameworks/hyperf/${version}`

  return [
    {
      text: "目錄結構",
      link: `${base}/base/structure`
    },
    {
      text: "生命週期",
      link: `${base}/base/lifecycle`
    },
    {
      text: "路由與API文件",
      link: `${base}/base/router`
    },
    {
      text: "錯誤處理",
      link: `${base}/base/error-handler`
    },
    {
      text: "日誌",
      link: `${base}/base/logger`
    },
    {
      text: "事件",
      link: `${base}/base/event-handler`
    },
    {
      text: "檔案上傳",
      link: `${base}/base/upload`
    },
    {
      text: "多語言",
      link: `${base}/base/lang`
    },
    {
      text: "安全相關",
      link: `${base}/security/passport`,
      collapsed: true,
      items: [
        {
          text: "使用者認證",
          link: `${base}/security/passport`
        },
        {
          text: "使用者授權(RBAC)",
          link: `${base}/security/access`
        },
        {
          text: "獲取客戶端 IP",
          link: `${base}/security/client-ip`
        }
      ]
    },
    {
      text:"資料許可權",
      link: `${base}/data-permission/overview`,
      collapsed: true,
      items:[
        {
          text: "核心概念",
          link: `${base}/data-permission/overview`
        },
        {
          text: "架構設計",
          link: `${base}/data-permission/architecture`
        },
        {
          text: "許可權配置與效果演示",
          link: `${base}/data-permission/config`
        },
        {
          text: "API 參考與高階用法",
          link: `${base}/data-permission/example`
        },
        {
          text: "效能最佳化指南",
          link: `${base}/data-permission/performance`
        },
        {
          text: "故障排除指南",
          link: `${base}/data-permission/troubleshooting`
        },
        {
          text: "注意事項與最佳實踐",
          link: `${base}/data-permission/notice`
        }
      ]
    }
  ]
}

const sidebar:DefaultTheme.Sidebar = {
  '/v3/guide/': [
    {
      text: '介紹',
      collapsed: false,
      items: [
        {
          text: '為什麼選擇我們?',
          link: '/v3/guide/introduce/mineadmin',
        },
        {
          text: '更新日誌',
          link: '/v3/guide/changelog',
        },
        {
          text: '免責宣告',
          link: '/v3/guide/introduce/declaration',
        },
        {
          text: '鳴謝',
          link: '/v3/guide/introduce/thank',
        },
        {
          text: '聯絡我們',
          link: '/v3/guide/introduce/contact',
        }
      ]
    },
    {
      text: '快速開始',
      collapsed: false,
      items: [
        {
          text: '快速安裝',
          link: '/v3/guide/start/fast-install',
        },
        {
          text: "部署",
          link: "/v3/guide/start/deployment"
        }
      ]
    },
    {
      text: '其他資源',
      collapsed: true,
      items: [
        {
          text:"發行說明",
          link:'/v3/guide/releases'
        },
        {
          text:"升級指南",
          link:"/v3/guide/upgrade"
        },
        {
          text:"貢獻指南",
          link:"/v3/guide/contributions"
        }
      ]
    }
  ],
  '/v3/front/': [
    {
      text: '基礎入門',
      collapsed: false,
      items: [
        {
          text: '基礎概念',
          link: '/v3/front/base/concept'
        },
        {
          text: '快速開始',
          link: '/v3/front/base/start'
        },
        {
          text: '路由和選單',
          link: '/v3/front/base/route-menu'
        },
        {
          text: '配置',
          link: '/v3/front/base/configure'
        },
        {
          text: '圖示',
          link: '/v3/front/base/icon'
        },
        {
          text: '構建與預覽',
          link: '/v3/front/base/build-preview'
        }
      ]
    },
    {
      text: '進階開發',
      collapsed: false,
      items: [
        {
          text: '系統引數配置',
          link: '/v3/front/advanced/system-config'
        },
        {
          text: '自動匯入',
          link: '/v3/front/advanced/auto-import'
        },
        {
          text: '請求與攔截器',
          link: '/v3/front/advanced/request'
        },
        {
          text: '登入與歡迎頁',
          link: '/v3/front/advanced/login-welcome'
        },
        {
          text: '模組化',
          link: '/v3/front/advanced/module'
        },
        {
          text: '佈局',
          link: '/v3/front/advanced/layout'
        },
        {
          text: '工具欄擴充套件',
          link: '/v3/front/advanced/tools'
        },
        {
          text: '許可權',
          link: '/v3/front/advanced/permission'
        },
        {
          text: '頁面快取',
          link: '/v3/front/advanced/cache'
        }
      ]
    },
    {
      text: '高階主題',
      collapsed: true,
      items: [
        {
          text: '國際化配置',
          link: '/v3/front/high/i18n'
        },
        {
          text: '服務提供器',
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
          text: '外掛系統',
          link: '/v3/front/high/plugins'
        },
        {
          text: 'JSX和TSX開發',
          link: '/v3/front/high/tsx'
        }
      ],
    },
    {
      text: '元件教程',
      collapsed: false,
      items: [
        {
          text: 'MaEcharts 圖表元件',
          link: '/v3/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/v3/backend/':[
    {
      text:"後端概覽",
      collapsed: false,
      items:[
        {
          text: "後端總覽",
          link: "/v3/backend/index"
        }
      ]
    },
    {
      text:"公共契約",
      collapsed: false,
      items:[
        {
          text: "契約總覽",
          link: "/v3/backend/contracts/"
        },
        {
          text: "資料模型",
          link: "/v3/backend/contracts/data-model"
        },
        {
          text: "後臺路由",
          link: "/v3/backend/contracts/routing"
        },
        {
          text: "介面元資料",
          link: "/v3/backend/contracts/api-metadata"
        },
        {
          text: "響應結構",
          link: "/v3/backend/contracts/response"
        },
        {
          text: "前臺模板對接",
          link: "/v3/backend/contracts/frontend-template"
        }
      ]
    },
    {
      text:"框架實現",
      collapsed: false,
      items:createBackendFrameworkSidebarItems({
        stable: '穩定實現',
        planned: '規劃中',
        latest: 'latest'
      })
    }
  ],
  '/backend/frameworks/': [
    {
      text:"框架實現",
      collapsed: false,
      items:[
        {
          text: "實現總覽",
          link: "/backend/frameworks/"
        },
        {
          text: "Hyperf latest / 3.2",
          link: "/backend/frameworks/hyperf/",
          collapsed: false,
          items: createHyperfSidebarItems('3.2')
        },
        {
          text: "Hyperf 3.1",
          link: "/backend/frameworks/hyperf/3.1/",
          collapsed: true,
          items: createHyperfSidebarItems('3.1')
        },
        {
          text: "Laravel 1.0",
          link: "/backend/frameworks/laravel/1.0/",
          collapsed: true
        }
      ]
    }
  ],
  '/v3/plugin/':[
    {
      text:"快速開始",
      collapsed: false,
      items:
          [
            {
              text:"外掛系統概述",
              link:"/v3/plugin/index"
            },
            {
              text:"快速入門指南",
              link:"/v3/plugin/guide"
            },
            {
              text:"外掛命令",
              link:"/v3/plugin/command"
            },
            {
              text:"建立應用",
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
              text:"外掛目錄結構",
              link:"/v3/plugin/structure"
            },
            {
              text:"mine.json 配置",
              link:"/v3/plugin/mineJson"
            },
            {
              text:"ConfigProvider 說明",
              link:"/v3/plugin/configProvider"
            },
            {
              text:"生命週期管理",
              link:"/v3/plugin/lifecycle"
            }
          ]
    },
    {
      text:"開發指南",
      collapsed: false,
      items:
          [
            {
              text:"外掛開發指南",
              link:"/v3/plugin/develop"
            },
            {
              text:"API 參考文件",
              link:"/v3/plugin/api"
            },
            {
              text:"示例程式碼",
              link:"/v3/plugin/examples"
            }
          ]
    },
    {
      text:"後端開發",
      collapsed: false,
      items:[
        {
          text: "資料庫遷移",
          link: "/v3/plugin/backend/migrate"
        },
        {
          text: "單元測試",
          link: "/v3/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"前端開發",
      collapsed: false,
      items:[
        {
          text: "前端開發規範",
          link: "/v3/plugin/front/develop"
        }
      ]
    },
    {
      text:"應用上架",
      collapsed: true,
      items:[
        {
          text: "應用釋出",
          link: "/v3/plugin/develop/publish"
        },
        {
          text: "注意事項",
          link: "/v3/plugin/develop/question"
        }
      ]
    }
  ],
  '/libs/': createLibrarySidebar({
    title: '獨立庫',
    overview: '庫總覽',
    currentVersion: '當前版本'
  })
}

export default sidebar
