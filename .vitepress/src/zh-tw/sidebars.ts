import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh-tw/guide/': [
    {
      text: '介紹',
      items: [
        {
          text: '為什麼選擇我們?',
          link: '/zh-tw/guide/introduce/mineadmin',
        },
        {
          text: '更新日誌',
          link: '/zh-tw/guide/changelog',
        },
        {
          text: '免責宣告',
          link: '/zh-tw/guide/introduce/declaration',
        },
        {
          text: '鳴謝',
          link: '/zh-tw/guide/introduce/thank',
        }
      ]
    },
    {
      text: '開始',
      items: [
        {
          text: '快速安裝',
          link: '/zh-tw/guide/start/fast-install',
        },
        {
          text: "部署",
          link: "/zh-tw/guide/start/deployment"
        }
      ]
    },
    {
      text: '其他',
      items: [
        {
          text:"發行說明",
          link:'/zh-tw/guide/releases'
        },
        {
          text:"升級指南",
          link:"/zh-tw/guide/upgrade"
        },
        {
          text:"貢獻指南",
          link:"/zh-tw/guide/contributions"
        }
      ]
    }
  ],
  '/zh-tw/front/': [
    {
      text: '基礎',
      items: [
        {
          text: '基礎概念',
          link: '/zh-tw/front/base/concept'
        },
        {
          text: '開始',
          link: '/zh-tw/front/base/start'
        },
        {
          text: '路由和選單',
          link: '/zh-tw/front/base/route-menu'
        },
        {
          text: '配置',
          link: '/zh-tw/front/base/configure'
        },
        {
          text: '圖示',
          link: '/zh-tw/front/base/icon'
        },
        {
          text: '構建與預覽',
          link: '/zh-tw/front/base/build-preview'
        }
      ]
    },
    {
      text: '進階',
      items: [
        {
          text: '系統引數配置',
          link: '/zh-tw/front/advanced/system-config'
        },
        {
          text: '自動匯入',
          link: '/zh-tw/front/advanced/auto-import'
        },
        {
          text: '請求與攔截器',
          link: '/zh-tw/front/advanced/request'
        },
        {
          text: '登入與歡迎頁',
          link: '/zh-tw/front/advanced/login-welcome'
        },
        {
          text: '模組化',
          link: '/zh-tw/front/advanced/module'
        },
        {
          text: '佈局',
          link: '/zh-tw/front/advanced/layout'
        },
        {
          text: '工具欄擴充套件',
          link: '/zh-tw/front/advanced/tools'
        },
        {
          text: '許可權',
          link: '/zh-tw/front/advanced/permission'
        },
        {
          text: '頁面快取',
          link: '/zh-tw/front/advanced/cache'
        }
      ]
    },
    {
      text: '高階',
      items: [
        {
          text: '國際化配置',
          link: '/zh-tw/front/high/i18n'
        },
        {
          text: '服務提供器',
          link: '/zh-tw/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/zh-tw/front/high/hooks'
        },
        {
          text: '常用Store',
          link: '/zh-tw/front/high/store'
        },
        {
          text: '外掛系統',
          link: '/zh-tw/front/high/plugins'
        },
        {
          text: 'JSX和TSX開發',
          link: '/zh-tw/front/high/tsx'
        }
      ],
    },
    {
      text: '元件教程',
      items: [
        {
          text: 'MaForm',
          link: '/zh-tw/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/zh-tw/front/component/ma-form/examples/basic-usage'
            },
            {
              text: '佈局系統',
              link: '/zh-tw/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '條件渲染',
              link: '/zh-tw/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '動態驗證',
              link: '/zh-tw/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: '元件渲染',
              link: '/zh-tw/front/component/ma-form/examples/component-rendering'
            },
            {
              text: '插槽示例',
              link: '/zh-tw/front/component/ma-form/examples/slots-examples'
            },
            {
              text: '暴露方法',
              link: '/zh-tw/front/component/ma-form/examples/expose-methods'
            },
            {
              text: '載入狀態',
              link: '/zh-tw/front/component/ma-form/examples/loading-states'
            },
            {
              text: '巢狀表單',
              link: '/zh-tw/front/component/ma-form/examples/nested-forms'
            },
            {
              text: '移動端適配',
              link: '/zh-tw/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高階場景',
              link: '/zh-tw/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: '效能演示',
              link: '/zh-tw/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable',
          link: '/zh-tw/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基礎表格',
              link: '/zh-tw/front/component/ma-table/basic'
            },
            {
              text: '表格排序',
              link: '/zh-tw/front/component/ma-table/sorting'
            },
            {
              text: '表格篩選',
              link: '/zh-tw/front/component/ma-table/filter'
            },
            {
              text: '自定義渲染',
              link: '/zh-tw/front/component/ma-table/custom-render'
            },
            {
              text: '動態列管理',
              link: '/zh-tw/front/component/ma-table/dynamic-columns'
            },
            {
              text: '分頁表格',
              link: '/zh-tw/front/component/ma-table/pagination'
            },
            {
              text: '樹形表格',
              link: '/zh-tw/front/component/ma-table/tree-table'
            },
            {
              text: '多選表格',
              link: '/zh-tw/front/component/ma-table/selection'
            },
            {
              text: '響應式表格',
              link: '/zh-tw/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch',
          link: '/zh-tw/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/zh-tw/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高階搜尋',
              link: '/zh-tw/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '摺疊搜尋',
              link: '/zh-tw/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: '自定義操作',
              link: '/zh-tw/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '動態管理',
              link: '/zh-tw/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: '響應式佈局',
              link: '/zh-tw/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: '表格整合',
              link: '/zh-tw/front/component/ma-search/examples/table-integration'
            },
            {
              text: '表單驗證',
              link: '/zh-tw/front/component/ma-search/examples/form-validation'
            },
            {
              text: '方法演示',
              link: '/zh-tw/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable',
          link: '/zh-tw/front/component/ma-pro-table'
        },
        {
          text: 'MaEcharts',
          link: '/zh-tw/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/zh-tw/backend/':[
    {
      text:"進階",
      items:[
        {
          text: "目錄結構",
          link: "/zh-tw/backend/base/structure"
        },
        {
          text: "生命週期",
          link: "/zh-tw/backend/base/lifecycle"
        },
        { text: "路由與API文件",link: "/zh-tw/backend/base/router"},
        { text: "錯誤處理",link: "/zh-tw/backend/base/error-handler"},
        {text: "日誌",link: "/zh-tw/backend/base/logger"},
        {text: "事件",link: "/zh-tw/backend/base/event-handler"},
        {text: "檔案上傳",link: "/zh-tw/backend/base/upload"},
        {text: "多語言",link: "/zh-tw/backend/base/lang"},
      ]
    },
    {
      text:"安全相關",
      items:[
        {
          text: "使用者認證",
          link: "/zh-tw/backend/security/passport"
        },
        {
          text: "使用者授權(RBAC)",
          link: "/zh-tw/backend/security/access"
        },
        {
          text: "獲取客戶端 IP",
          link: "/zh-tw/backend/security/client-ip"
        }
      ]
    },{
      text:"資料許可權",
      items:[
        {
          text: "核心概念",
          link: "/zh-tw/backend/data-permission/overview"
        },
        {
          text: "許可權配置與效果演示",
          link: "/zh-tw/backend/data-permission/config"
        },
        {
          text: "使用示例",
            link: "/zh-tw/backend/data-permission/example"
        },
        {
          text: "注意事項",
            link: "/zh-tw/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/zh-tw/plugin/':[
    {
      text:"快速開始",
      items:
          [
            {
              text:"準備工作",
              link:"/zh-tw/plugin"
            },
            {
              text:"外掛命令",
              link:"/zh-tw/plugin/command"
            },
            {
              text:"建立應用",
              link:"/zh-tw/plugin/create"
            },
            {
              text:"外掛目錄結構",
              link:"/zh-tw/plugin/structure"
            },
            {
              text:"mine.json 說明及示例",
              link:"/zh-tw/plugin/mineJson"
            },
            {
            text:"ConfigProvider 說明",
            link:"/zh-tw/plugin/configProvider"
          }
          ]
    },
    {
      text:"後端開發",
      items:[
        {
          text: "資料庫遷移",
          link: "/zh-tw/plugin/backend/migrate"
        },
        {
          text: "單元測試",
          link: "/zh-tw/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"前端開發",
      items:[
        {
          text: "前端開發規範",
          link: "/zh-tw/plugin/front/develop"
        }
      ]
    },
    {
      text:"應用上架",
      items:[
        {
          text: "應用釋出",
          link: "/zh-tw/plugin/develop/publish"
        },
        {
          text: "注意事項",
          link: "/zh-tw/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar