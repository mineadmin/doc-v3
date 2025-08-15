import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: 'Introduction',
      items: [
        {
          text: 'Why Choose Us?',
          link: '/guide/introduce/mineadmin',
        },
        {
          text: 'Changelog',
          link: '/guide/changelog',
        },
        {
          text: 'Disclaimer',
          link: '/guide/introduce/declaration',
        },
        {
          text: 'Acknowledgements',
          link: '/guide/introduce/thank',
        }
      ]
    },
    {
      text: 'Getting Started',
      items: [
        {
          text: 'Quick Installation',
          link: '/guide/start/fast-install',
        },
        {
          text: "Deployment",
          link: "/guide/start/deployment"
        }
      ]
    },
    {
      text: 'Others',
      items: [
        {
          text:"Release Notes",
          link:'/guide/releases'
        },
        {
          text:"Upgrade Guide",
          link:"/guide/upgrade"
        },
        {
          text:"Contribution Guide",
          link:"/guide/contributions"
        }
      ]
    }
  ],
  '/front/': [
    {
      text: 'Basics',
      items: [
        {
          text: 'Basic Concepts',
          link: '/front/base/concept'
        },
        {
          text: 'Getting Started',
          link: '/front/base/start'
        },
        {
          text: 'Routes & Menus',
          link: '/front/base/route-menu'
        },
        {
          text: 'Configuration',
          link: '/front/base/configure'
        },
        {
          text: 'Icons',
          link: '/front/base/icon'
        },
        {
          text: 'Build & Preview',
          link: '/front/base/build-preview'
        }
      ]
    },
    {
      text: 'Advanced',
      items: [
        {
          text: 'System Configuration',
          link: '/front/advanced/system-config'
        },
        {
          text: 'Auto Import',
          link: '/front/advanced/auto-import'
        },
        {
          text: 'Requests & Interceptors',
          link: '/front/advanced/request'
        },
        {
          text: 'Login & Welcome Page',
          link: '/front/advanced/login-welcome'
        },
        {
          text: 'Modularization',
          link: '/front/advanced/module'
        },
        {
          text: 'Layout',
          link: '/front/advanced/layout'
        },
        {
          text: 'Toolbar Extensions',
          link: '/front/advanced/tools'
        },
        {
          text: 'Permissions',
          link: '/front/advanced/permission'
        },
        {
          text: 'Page Caching',
          link: '/front/advanced/cache'
        }
      ]
    },
    {
      text: 'Expert',
      items: [
        {
          text: 'Internationalization',
          link: '/front/high/i18n'
        },
        {
          text: 'Service Providers',
          link: '/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/front/high/hooks'
        },
        {
          text: 'Common Stores',
          link: '/front/high/store'
        },
        {
          text: 'Plugin System',
          link: '/front/high/plugins'
        },
        {
          text: 'JSX & TSX Development',
          link: '/front/high/tsx'
        }
      ],
    },
    {
      text: 'Component Tutorials',
      items: [
        {
          text: 'MaForm',
          link: '/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: 'Basic Usage',
              link: '/front/component/ma-form/examples/basic-usage'
            },
            {
              text: 'Layout System',
              link: '/front/component/ma-form/examples/layout-systems'
            },
            {
              text: 'Conditional Rendering',
              link: '/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: 'Dynamic Validation',
              link: '/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: 'Component Rendering',
              link: '/front/component/ma-form/examples/component-rendering'
            },
            {
              text: 'Slot Examples',
              link: '/front/component/ma-form/examples/slots-examples'
            },
            {
              text: 'Exposed Methods',
              link: '/front/component/ma-form/examples/expose-methods'
            },
            {
              text: 'Loading States',
              link: '/front/component/ma-form/examples/loading-states'
            },
            {
              text: 'Nested Forms',
              link: '/front/component/ma-form/examples/nested-forms'
            },
            {
              text: 'Mobile Responsive',
              link: '/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: 'Advanced Scenarios',
              link: '/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: 'Performance Demo',
              link: '/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable',
          link: '/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: 'Basic Table',
              link: '/front/component/ma-table/basic'
            },
            {
              text: 'Table Sorting',
              link: '/front/component/ma-table/sorting'
            },
            {
              text: 'Table Filtering',
              link: '/front/component/ma-table/filter'
            },
            {
              text: 'Custom Rendering',
              link: '/front/component/ma-table/custom-render'
            },
            {
              text: 'Dynamic Columns',
              link: '/front/component/ma-table/dynamic-columns'
            },
            {
              text: 'Pagination Table',
              link: '/front/component/ma-table/pagination'
            },
            {
              text: 'Tree Table',
              link: '/front/component/ma-table/tree-table'
            },
            {
              text: 'Multi-select Table',
              link: '/front/component/ma-table/selection'
            },
            {
              text: 'Responsive Table',
              link: '/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch',
          link: '/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: 'Basic Usage',
              link: '/front/component/ma-search/examples/basic-usage'
            },
            {
              text: 'Advanced Search',
              link: '/front/component/ma-search/examples/advanced-search'
            },
            {
              text: 'Collapsible Search',
              link: '/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: 'Custom Actions',
              link: '/front/component/ma-search/examples/custom-actions'
            },
            {
              text: 'Dynamic Items',
              link: '/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: 'Responsive Layout',
              link: '/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: 'Table Integration',
              link: '/front/component/ma-search/examples/table-integration'
            },
            {
              text: 'Form Validation',
              link: '/front/component/ma-search/examples/form-validation'
            },
            {
              text: 'Methods Demo',
              link: '/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable',
          link: '/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: 'Basic Usage',
              link: '/front/component/ma-pro-table/examples/basic'
            },
            {
              text: 'Advanced Search',
              link: '/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: 'Custom Operations',
              link: '/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: 'Cell Render Plugins',
              link: '/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: 'Toolbar Extensions',
              link: '/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: 'Data Management',
              link: '/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: 'Responsive Layout',
              link: '/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts',
          link: '/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/backend/':[
    {
      text:"Advanced",
      items:[
        {
          text: "Directory Structure",
          link: "/backend/base/structure"
        },
        {
          text: "Lifecycle",
          link: "/backend/base/lifecycle"
        },
        { text: "Routes & API Docs",link: "/backend/base/router"},
        { text: "Error Handling",link: "/backend/base/error-handler"},
        {text: "Logging",link: "/backend/base/logger"},
        {text: "Events",link: "/backend/base/event-handler"},
        {text: "File Upload",link: "/backend/base/upload"},
        {text: "Internationalization",link: "/backend/base/lang"},
      ]
    },
    {
      text:"Security",
      items:[
        {
          text: "User Authentication",
          link: "/backend/security/passport"
        },
        {
          text: "User Authorization (RBAC)",
          link: "/backend/security/access"
        },
        {
          text: "Client IP Retrieval",
          link: "/backend/security/client-ip"
        }
      ]
    },{
      text:"Data Permissions",
      items:[
        {
          text: "Core Concepts",
          link: "/backend/data-permission/overview"
        },
        {
          text: "Permission Configuration & Demo",
          link: "/backend/data-permission/config"
        },
        {
          text: "Usage Examples",
            link: "/backend/data-permission/example"
        },
        {
          text: "Notes",
            link: "/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/plugin/':[
    {
      text:"Quick Start",
      items:
          [
            {
              text:"Preparation",
              link:"/plugin"
            },
            {
              text:"Plugin Commands",
              link:"/plugin/command"
            },
            {
              text:"Create Application",
              link:"/plugin/create"
            },
            {
              text:"Plugin Directory Structure",
              link:"/plugin/structure"
            },
            {
              text:"mine.json Documentation & Examples",
              link:"/plugin/mineJson"
            },
            {
            text:"ConfigProvider Documentation",
            link:"/plugin/configProvider"
          }
          ]
    },
    {
      text:"Backend Development",
      items:[
        {
          text: "Database Migrations",
          link: "/plugin/backend/migrate"
        },
        {
          text: "Unit Testing",
          link: "/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"Frontend Development",
      items:[
        {
          text: "Frontend Development Standards",
          link: "/plugin/front/develop"
        }
      ]
    },
    {
      text:"App Publishing",
      items:[
        {
          text: "App Release",
          link: "/plugin/develop/publish"
        },
        {
          text: "Notes",
          link: "/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar