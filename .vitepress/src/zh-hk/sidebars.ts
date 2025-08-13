import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh-hk/guide/': [
    {
      text: '介紹',
      items: [
        {
          text: '為什麼選擇我們?',
          link: '/zh-hk/guide/introduce/mineadmin',
        },
        {
          text: '更新日誌',
          link: '/zh-hk/guide/changelog',
        },
        {
          text: '免責聲明',
          link: '/zh-hk/guide/introduce/declaration',
        },
        {
          text: '鳴謝',
          link: '/zh-hk/guide/introduce/thank',
        }
      ]
    },
    {
      text: '開始',
      items: [
        {
          text: '快速安裝',
          link: '/zh-hk/guide/start/fast-install',
        },
        {
          text: "部署",
          link: "/zh-hk/guide/start/deployment"
        }
      ]
    },
    {
      text: '其他',
      items: [
        {
          text:"發行説明",
          link:'/zh-hk/guide/releases'
        },
        {
          text:"升級指南",
          link:"/zh-hk/guide/upgrade"
        },
        {
          text:"貢獻指南",
          link:"/zh-hk/guide/contributions"
        }
      ]
    }
  ],
  '/zh-hk/front/': [
    {
      text: '基礎',
      items: [
        {
          text: '基礎概念',
          link: '/zh-hk/front/base/concept'
        },
        {
          text: '開始',
          link: '/zh-hk/front/base/start'
        },
        {
          text: '路由和菜單',
          link: '/zh-hk/front/base/route-menu'
        },
        {
          text: '配置',
          link: '/zh-hk/front/base/configure'
        },
        {
          text: '圖標',
          link: '/zh-hk/front/base/icon'
        },
        {
          text: '構建與預覽',
          link: '/zh-hk/front/base/build-preview'
        }
      ]
    },
    {
      text: '進階',
      items: [
        {
          text: '系統參數配置',
          link: '/zh-hk/front/advanced/system-config'
        },
        {
          text: '自動導入',
          link: '/zh-hk/front/advanced/auto-import'
        },
        {
          text: '請求與攔截器',
          link: '/zh-hk/front/advanced/request'
        },
        {
          text: '登錄與歡迎頁',
          link: '/zh-hk/front/advanced/login-welcome'
        },
        {
          text: '模塊化',
          link: '/zh-hk/front/advanced/module'
        },
        {
          text: '佈局',
          link: '/zh-hk/front/advanced/layout'
        },
        {
          text: '工具欄擴展',
          link: '/zh-hk/front/advanced/tools'
        },
        {
          text: '權限',
          link: '/zh-hk/front/advanced/permission'
        },
        {
          text: '頁面緩存',
          link: '/zh-hk/front/advanced/cache'
        }
      ]
    },
    {
      text: '高級',
      items: [
        {
          text: '國際化配置',
          link: '/zh-hk/front/high/i18n'
        },
        {
          text: '服務提供器',
          link: '/zh-hk/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/zh-hk/front/high/hooks'
        },
        {
          text: '常用Store',
          link: '/zh-hk/front/high/store'
        },
        {
          text: '插件系統',
          link: '/zh-hk/front/high/plugins'
        },
        {
          text: 'JSX和TSX開發',
          link: '/zh-hk/front/high/tsx'
        }
      ],
    },
    {
      text: '組件教程',
      items: [
        {
          text: 'MaForm',
          link: '/zh-hk/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/zh-hk/front/component/ma-form/examples/basic-usage'
            },
            {
              text: '佈局系統',
              link: '/zh-hk/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '條件渲染',
              link: '/zh-hk/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '動態驗證',
              link: '/zh-hk/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: '組件渲染',
              link: '/zh-hk/front/component/ma-form/examples/component-rendering'
            },
            {
              text: '插槽示例',
              link: '/zh-hk/front/component/ma-form/examples/slots-examples'
            },
            {
              text: '暴露方法',
              link: '/zh-hk/front/component/ma-form/examples/expose-methods'
            },
            {
              text: '加載狀態',
              link: '/zh-hk/front/component/ma-form/examples/loading-states'
            },
            {
              text: '嵌套表單',
              link: '/zh-hk/front/component/ma-form/examples/nested-forms'
            },
            {
              text: '移動端適配',
              link: '/zh-hk/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高級場景',
              link: '/zh-hk/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: '性能演示',
              link: '/zh-hk/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable',
          link: '/zh-hk/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基礎表格',
              link: '/zh-hk/front/component/ma-table/basic'
            },
            {
              text: '表格排序',
              link: '/zh-hk/front/component/ma-table/sorting'
            },
            {
              text: '表格篩選',
              link: '/zh-hk/front/component/ma-table/filter'
            },
            {
              text: '自定義渲染',
              link: '/zh-hk/front/component/ma-table/custom-render'
            },
            {
              text: '動態列管理',
              link: '/zh-hk/front/component/ma-table/dynamic-columns'
            },
            {
              text: '分頁表格',
              link: '/zh-hk/front/component/ma-table/pagination'
            },
            {
              text: '樹形表格',
              link: '/zh-hk/front/component/ma-table/tree-table'
            },
            {
              text: '多選表格',
              link: '/zh-hk/front/component/ma-table/selection'
            },
            {
              text: '響應式表格',
              link: '/zh-hk/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch',
          link: '/zh-hk/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/zh-hk/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高級搜索',
              link: '/zh-hk/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '摺疊搜索',
              link: '/zh-hk/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: '自定義操作',
              link: '/zh-hk/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '動態管理',
              link: '/zh-hk/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: '響應式佈局',
              link: '/zh-hk/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: '表格集成',
              link: '/zh-hk/front/component/ma-search/examples/table-integration'
            },
            {
              text: '表單驗證',
              link: '/zh-hk/front/component/ma-search/examples/form-validation'
            },
            {
              text: '方法演示',
              link: '/zh-hk/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable',
          link: '/zh-hk/front/component/ma-pro-table'
        },
        {
          text: 'MaEcharts',
          link: '/zh-hk/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/zh-hk/backend/':[
    {
      text:"進階",
      items:[
        {
          text: "目錄結構",
          link: "/zh-hk/backend/base/structure"
        },
        {
          text: "生命週期",
          link: "/zh-hk/backend/base/lifecycle"
        },
        { text: "路由與API文檔",link: "/zh-hk/backend/base/router"},
        { text: "錯誤處理",link: "/zh-hk/backend/base/error-handler"},
        {text: "日誌",link: "/zh-hk/backend/base/logger"},
        {text: "事件",link: "/zh-hk/backend/base/event-handler"},
        {text: "文件上傳",link: "/zh-hk/backend/base/upload"},
        {text: "多語言",link: "/zh-hk/backend/base/lang"},
      ]
    },
    {
      text:"安全相關",
      items:[
        {
          text: "用户認證",
          link: "/zh-hk/backend/security/passport"
        },
        {
          text: "用户授權(RBAC)",
          link: "/zh-hk/backend/security/access"
        },
        {
          text: "獲取客户端 IP",
          link: "/zh-hk/backend/security/client-ip"
        }
      ]
    },{
      text:"數據權限",
      items:[
        {
          text: "核心概念",
          link: "/zh-hk/backend/data-permission/overview"
        },
        {
          text: "權限配置與效果演示",
          link: "/zh-hk/backend/data-permission/config"
        },
        {
          text: "使用示例",
            link: "/zh-hk/backend/data-permission/example"
        },
        {
          text: "注意事項",
            link: "/zh-hk/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/zh-hk/plugin/':[
    {
      text:"快速開始",
      items:
          [
            {
              text:"準備工作",
              link:"/zh-hk/plugin"
            },
            {
              text:"插件命令",
              link:"/zh-hk/plugin/command"
            },
            {
              text:"創建應用",
              link:"/zh-hk/plugin/create"
            },
            {
              text:"插件目錄結構",
              link:"/zh-hk/plugin/structure"
            },
            {
              text:"mine.json 説明及示例",
              link:"/zh-hk/plugin/mineJson"
            },
            {
            text:"ConfigProvider 説明",
            link:"/zh-hk/plugin/configProvider"
          }
          ]
    },
    {
      text:"後端開發",
      items:[
        {
          text: "數據庫遷移",
          link: "/zh-hk/plugin/backend/migrate"
        },
        {
          text: "單元測試",
          link: "/zh-hk/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"前端開發",
      items:[
        {
          text: "前端開發規範",
          link: "/zh-hk/plugin/front/develop"
        }
      ]
    },
    {
      text:"應用上架",
      items:[
        {
          text: "應用發佈",
          link: "/zh-hk/plugin/develop/publish"
        },
        {
          text: "注意事項",
          link: "/zh-hk/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar