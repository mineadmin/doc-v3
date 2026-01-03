import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: '介紹',
      collapsed: false,
      items: [
        {
          text: '為什麼選擇我們?',
          link: '/guide/introduce/mineadmin',
        },
        {
          text: '更新日誌',
          link: '/guide/changelog',
        },
        {
          text: '免責聲明',
          link: '/guide/introduce/declaration',
        },
        {
          text: '鳴謝',
          link: '/guide/introduce/thank',
        },
        {
          text: '聯繫我們',
          link: '/guide/introduce/contact',
        }
      ]
    },
    {
      text: '快速開始',
      collapsed: false,
      items: [
        {
          text: '快速安裝',
          link: '/guide/start/fast-install',
        },
        {
          text: "部署",
          link: "/guide/start/deployment"
        }
      ]
    },
    {
      text: '其他資源',
      collapsed: true,
      items: [
        {
          text:"發行説明",
          link:'/guide/releases'
        },
        {
          text:"升級指南",
          link:"/guide/upgrade"
        },
        {
          text:"貢獻指南",
          link:"/guide/contributions"
        }
      ]
    }
  ],
  '/front/': [
    {
      text: '基礎入門',
      collapsed: false,
      items: [
        {
          text: '基礎概念',
          link: '/front/base/concept'
        },
        {
          text: '快速開始',
          link: '/front/base/start'
        },
        {
          text: '路由和菜單',
          link: '/front/base/route-menu'
        },
        {
          text: '配置',
          link: '/front/base/configure'
        },
        {
          text: '圖標',
          link: '/front/base/icon'
        },
        {
          text: '構建與預覽',
          link: '/front/base/build-preview'
        }
      ]
    },
    {
      text: '進階開發',
      collapsed: false,
      items: [
        {
          text: '系統參數配置',
          link: '/front/advanced/system-config'
        },
        {
          text: '自動導入',
          link: '/front/advanced/auto-import'
        },
        {
          text: '請求與攔截器',
          link: '/front/advanced/request'
        },
        {
          text: '登錄與歡迎頁',
          link: '/front/advanced/login-welcome'
        },
        {
          text: '模塊化',
          link: '/front/advanced/module'
        },
        {
          text: '佈局',
          link: '/front/advanced/layout'
        },
        {
          text: '工具欄擴展',
          link: '/front/advanced/tools'
        },
        {
          text: '權限',
          link: '/front/advanced/permission'
        },
        {
          text: '頁面緩存',
          link: '/front/advanced/cache'
        }
      ]
    },
    {
      text: '高級主題',
      collapsed: true,
      items: [
        {
          text: '國際化配置',
          link: '/front/high/i18n'
        },
        {
          text: '服務提供器',
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
          text: '插件系統',
          link: '/front/high/plugins'
        },
        {
          text: 'JSX和TSX開發',
          link: '/front/high/tsx'
        }
      ],
    },
    {
      text: '組件教程',
      collapsed: false,
      items: [
        {
          text: 'MaForm 表單組件',
          link: '/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/front/component/ma-form/examples/basic-usage'
            },
            {
              text: '佈局系統',
              link: '/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '條件渲染',
              link: '/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '動態驗證',
              link: '/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: '組件渲染',
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
              text: '加載狀態',
              link: '/front/component/ma-form/examples/loading-states'
            },
            {
              text: '嵌套表單',
              link: '/front/component/ma-form/examples/nested-forms'
            },
            {
              text: '移動端適配',
              link: '/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高級場景',
              link: '/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: '性能演示',
              link: '/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable 表格組件',
          link: '/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基礎表格',
              link: '/front/component/ma-table/basic'
            },
            {
              text: '表格排序',
              link: '/front/component/ma-table/sorting'
            },
            {
              text: '表格篩選',
              link: '/front/component/ma-table/filter'
            },
            {
              text: '自定義渲染',
              link: '/front/component/ma-table/custom-render'
            },
            {
              text: '動態列管理',
              link: '/front/component/ma-table/dynamic-columns'
            },
            {
              text: '分頁表格',
              link: '/front/component/ma-table/pagination'
            },
            {
              text: '樹形表格',
              link: '/front/component/ma-table/tree-table'
            },
            {
              text: '多選表格',
              link: '/front/component/ma-table/selection'
            },
            {
              text: '響應式表格',
              link: '/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch 搜索組件',
          link: '/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高級搜索',
              link: '/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '摺疊搜索',
              link: '/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: '自定義操作',
              link: '/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '動態管理',
              link: '/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: '響應式佈局',
              link: '/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: '表格集成',
              link: '/front/component/ma-search/examples/table-integration'
            },
            {
              text: '表單驗證',
              link: '/front/component/ma-search/examples/form-validation'
            },
            {
              text: '方法演示',
              link: '/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable 高級表格',
          link: '/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: '基礎用法',
              link: '/front/component/ma-pro-table/examples/basic'
            },
            {
              text: '高級搜索',
              link: '/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: '自定義操作',
              link: '/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: '單元格渲染插件',
              link: '/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: '工具欄擴展',
              link: '/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: '數據管理',
              link: '/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: '響應式佈局',
              link: '/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts 圖表組件',
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
          text: "目錄結構",
          link: "/backend/base/structure"
        },
        {
          text: "生命週期",
          link: "/backend/base/lifecycle"
        },
        { text: "路由與API文檔",link: "/backend/base/router"},
        { text: "錯誤處理",link: "/backend/base/error-handler"},
        {text: "日誌",link: "/backend/base/logger"},
        {text: "事件",link: "/backend/base/event-handler"},
        {text: "文件上傳",link: "/backend/base/upload"},
        {text: "多語言",link: "/backend/base/lang"},
      ]
    },
    {
      text:"安全相關",
      collapsed: false,
      items:[
        {
          text: "用户認證",
          link: "/backend/security/passport"
        },
        {
          text: "用户授權(RBAC)",
          link: "/backend/security/access"
        },
        {
          text: "獲取客户端 IP",
          link: "/backend/security/client-ip"
        }
      ]
    },{
      text:"數據權限",
      collapsed: true,
      items:[
        {
          text: "核心概念",
          link: "/backend/data-permission/overview"
        },
        {
          text: "權限配置與效果演示",
          link: "/backend/data-permission/config"
        },
        {
          text: "API 參考與高級用法",
          link: "/backend/data-permission/example"
        },
        {
          text: "性能優化指南",
          link: "/backend/data-permission/performance"
        },
        {
          text: "故障排除指南",
          link: "/backend/data-permission/troubleshooting"
        },
        {
          text: "注意事項與最佳實踐",
          link: "/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/plugin/':[
    {
      text:"快速開始",
      collapsed: false,
      items:
          [
            {
              text:"插件系統概述",
              link:"/plugin/index"
            },
            {
              text:"快速入門指南",
              link:"/plugin/guide"
            },
            {
              text:"插件命令",
              link:"/plugin/command"
            },
            {
              text:"創建應用",
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
              text:"插件目錄結構",
              link:"/plugin/structure"
            },
            {
              text:"mine.json 配置",
              link:"/plugin/mineJson"
            },
            {
              text:"ConfigProvider 説明",
              link:"/plugin/configProvider"
            },
            {
              text:"生命週期管理",
              link:"/plugin/lifecycle"
            }
          ]
    },
    {
      text:"開發指南",
      collapsed: false,
      items:
          [
            {
              text:"插件開發指南",
              link:"/plugin/develop"
            },
            {
              text:"API 參考文檔",
              link:"/plugin/api"
            },
            {
              text:"示例代碼",
              link:"/plugin/examples"
            }
          ]
    },
    {
      text:"後端開發",
      collapsed: false,
      items:[
        {
          text: "數據庫遷移",
          link: "/plugin/backend/migrate"
        },
        {
          text: "單元測試",
          link: "/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"前端開發",
      collapsed: false,
      items:[
        {
          text: "前端開發規範",
          link: "/plugin/front/develop"
        }
      ]
    },
    {
      text:"應用上架",
      collapsed: true,
      items:[
        {
          text: "應用發佈",
          link: "/plugin/develop/publish"
        },
        {
          text: "注意事項",
          link: "/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar