import {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh-tw/guide/': [
    {
      text: '介紹',
      items: [
        {
          text: '關於 MineAdmin',
          link: '/zh-tw/guide/introduce/mineadmin',
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
          link: '/zh-tw/front/component/ma-form'
        },
        {
          text: 'MaTable',
          link: '/zh-tw/front/component/ma-table'
        },
        {
          text: 'MaSearch',
          link: '/zh-tw/front/component/ma-search'
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