import type {DefaultTheme} from "vitepress";
import { createLibrarySidebar } from "../shared";

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
          text: 'MaTable 表格元件',
          link: '/v3/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基礎表格',
              link: '/v3/front/component/ma-table/basic'
            },
            {
              text: '表格排序',
              link: '/v3/front/component/ma-table/sorting'
            },
            {
              text: '表格篩選',
              link: '/v3/front/component/ma-table/filter'
            },
            {
              text: '自定義渲染',
              link: '/v3/front/component/ma-table/custom-render'
            },
            {
              text: '動態列管理',
              link: '/v3/front/component/ma-table/dynamic-columns'
            },
            {
              text: '分頁表格',
              link: '/v3/front/component/ma-table/pagination'
            },
            {
              text: '樹形表格',
              link: '/v3/front/component/ma-table/tree-table'
            },
            {
              text: '多選表格',
              link: '/v3/front/component/ma-table/selection'
            },
            {
              text: '響應式表格',
              link: '/v3/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch 搜尋元件',
          link: '/v3/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/v3/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高階搜尋',
              link: '/v3/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '摺疊搜尋',
              link: '/v3/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: '自定義操作',
              link: '/v3/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '動態管理',
              link: '/v3/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: '響應式佈局',
              link: '/v3/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: '表格整合',
              link: '/v3/front/component/ma-search/examples/table-integration'
            },
            {
              text: '表單驗證',
              link: '/v3/front/component/ma-search/examples/form-validation'
            },
            {
              text: '方法演示',
              link: '/v3/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable 高階表格',
          link: '/v3/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/v3/front/component/ma-pro-table/examples/basic'
            },
            {
              text: '高階搜尋',
              link: '/v3/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: '自定義操作',
              link: '/v3/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: '單元格渲染外掛',
              link: '/v3/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: '工具欄擴充套件',
              link: '/v3/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: '資料管理',
              link: '/v3/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: '響應式佈局',
              link: '/v3/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts 圖表元件',
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
          text: "目錄結構",
          link: "/v3/backend/base/structure"
        },
        {
          text: "生命週期",
          link: "/v3/backend/base/lifecycle"
        },
        { text: "路由與API文件",link: "/v3/backend/base/router"},
        { text: "錯誤處理",link: "/v3/backend/base/error-handler"},
        {text: "日誌",link: "/v3/backend/base/logger"},
        {text: "事件",link: "/v3/backend/base/event-handler"},
        {text: "檔案上傳",link: "/v3/backend/base/upload"},
        {text: "多語言",link: "/v3/backend/base/lang"},
      ]
    },
    {
      text:"安全相關",
      collapsed: false,
      items:[
        {
          text: "使用者認證",
          link: "/v3/backend/security/passport"
        },
        {
          text: "使用者授權(RBAC)",
          link: "/v3/backend/security/access"
        },
        {
          text: "獲取客戶端 IP",
          link: "/v3/backend/security/client-ip"
        }
      ]
    },{
      text:"資料許可權",
      collapsed: true,
      items:[
        {
          text: "核心概念",
          link: "/v3/backend/data-permission/overview"
        },
        {
          text: "許可權配置與效果演示",
          link: "/v3/backend/data-permission/config"
        },
        {
          text: "API 參考與高階用法",
          link: "/v3/backend/data-permission/example"
        },
        {
          text: "效能最佳化指南",
          link: "/v3/backend/data-permission/performance"
        },
        {
          text: "故障排除指南",
          link: "/v3/backend/data-permission/troubleshooting"
        },
        {
          text: "注意事項與最佳實踐",
          link: "/v3/backend/data-permission/notice"
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
