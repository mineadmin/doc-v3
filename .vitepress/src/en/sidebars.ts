import type {DefaultTheme} from "vitepress";
import { createLibrarySidebar } from "../shared";

const sidebar:DefaultTheme.Sidebar = {
  '/v3/guide/': [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        {
          text: 'Why Choose Us?',
          link: '/v3/guide/introduce/mineadmin',
        },
        {
          text: 'Changelog',
          link: '/v3/guide/changelog',
        },
        {
          text: 'Disclaimer',
          link: '/v3/guide/introduce/declaration',
        },
        {
          text: 'Acknowledgments',
          link: '/v3/guide/introduce/thank',
        },
        {
          text: 'Contact Us',
          link: '/v3/guide/introduce/contact',
        }
      ]
    },
    {
      text: 'Quick Start',
      collapsed: false,
      items: [
        {
          text: 'Fast Installation',
          link: '/v3/guide/start/fast-install',
        },
        {
          text: "Deployment",
          link: "/v3/guide/start/deployment"
        }
      ]
    },
    {
      text: 'Other Resources',
      collapsed: true,
      items: [
        {
          text:"Release Notes",
          link:'/v3/guide/releases'
        },
        {
          text:"Upgrade Guide",
          link:"/v3/guide/upgrade"
        },
        {
          text:"Contribution Guide",
          link:"/v3/guide/contributions"
        }
      ]
    }
  ],
  '/v3/front/': [
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        {
          text: 'Basic Concepts',
          link: '/v3/front/base/concept'
        },
        {
          text: 'Quick Start',
          link: '/v3/front/base/start'
        },
        {
          text: 'Routes and Menus',
          link: '/v3/front/base/route-menu'
        },
        {
          text: 'Configuration',
          link: '/v3/front/base/configure'
        },
        {
          text: 'Icons',
          link: '/v3/front/base/icon'
        },
        {
          text: 'Build and Preview',
          link: '/v3/front/base/build-preview'
        }
      ]
    },
    {
      text: 'Advanced Development',
      collapsed: false,
      items: [
        {
          text: 'System Parameter Configuration',
          link: '/v3/front/advanced/system-config'
        },
        {
          text: 'Auto Import',
          link: '/v3/front/advanced/auto-import'
        },
        {
          text: 'Request and Interceptors',
          link: '/v3/front/advanced/request'
        },
        {
          text: 'Login and Welcome Page',
          link: '/v3/front/advanced/login-welcome'
        },
        {
          text: 'Modularization',
          link: '/v3/front/advanced/module'
        },
        {
          text: 'Layout',
          link: '/v3/front/advanced/layout'
        },
        {
          text: 'Toolbar Extensions',
          link: '/v3/front/advanced/tools'
        },
        {
          text: 'Permissions',
          link: '/v3/front/advanced/permission'
        },
        {
          text: 'Page Caching',
          link: '/v3/front/advanced/cache'
        }
      ]
    },
    {
      text: 'Advanced Topics',
      collapsed: true,
      items: [
        {
          text: 'Internationalization Configuration',
          link: '/v3/front/high/i18n'
        },
        {
          text: 'Service Provider',
          link: '/v3/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/v3/front/high/hooks'
        },
        {
          text: '🗄️ Common Stores',
          link: '/v3/front/high/store'
        },
        {
          text: 'Plugin System',
          link: '/v3/front/high/plugins'
        },
        {
          text: 'JSX and TSX Development',
          link: '/v3/front/high/tsx'
        }
      ],
    },
    {
      text: 'Component Tutorials',
      collapsed: false,
      items: [
        {
          text: 'MaTable Table Component',
          link: '/v3/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: 'Basic Table',
              link: '/v3/front/component/ma-table/basic'
            },
            {
              text: 'Table Sorting',
              link: '/v3/front/component/ma-table/sorting'
            },
            {
              text: 'Table Filtering',
              link: '/v3/front/component/ma-table/filter'
            },
            {
              text: 'Custom Rendering',
              link: '/v3/front/component/ma-table/custom-render'
            },
            {
              text: 'Dynamic Column Management',
              link: '/v3/front/component/ma-table/dynamic-columns'
            },
            {
              text: 'Pagination Table',
              link: '/v3/front/component/ma-table/pagination'
            },
            {
              text: 'Tree Table',
              link: '/v3/front/component/ma-table/tree-table'
            },
            {
              text: 'Selection Table',
              link: '/v3/front/component/ma-table/selection'
            },
            {
              text: 'Responsive Table',
              link: '/v3/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch Search Component',
          link: '/v3/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: 'Basic Usage',
              link: '/v3/front/component/ma-search/examples/basic-usage'
            },
            {
              text: 'Advanced Search',
              link: '/v3/front/component/ma-search/examples/advanced-search'
            },
            {
              text: 'Collapsible Search',
              link: '/v3/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: 'Custom Actions',
              link: '/v3/front/component/ma-search/examples/custom-actions'
            },
            {
              text: 'Dynamic Management',
              link: '/v3/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: 'Responsive Layout',
              link: '/v3/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: 'Table Integration',
              link: '/v3/front/component/ma-search/examples/table-integration'
            },
            {
              text: 'Form Validation',
              link: '/v3/front/component/ma-search/examples/form-validation'
            },
            {
              text: 'Methods Demo',
              link: '/v3/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable Advanced Table',
          link: '/v3/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: 'Basic Usage',
              link: '/v3/front/component/ma-pro-table/examples/basic'
            },
            {
              text: 'Advanced Search',
              link: '/v3/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: 'Custom Operations',
              link: '/v3/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: 'Cell Render Plugins',
              link: '/v3/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: 'Toolbar Extensions',
              link: '/v3/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: 'Data Management',
              link: '/v3/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: 'Responsive Layout',
              link: '/v3/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts Chart Component',
          link: '/v3/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/v3/backend/':[
    {
      text:"Core Features",
      collapsed: false,
      items:[
        {
          text: "Directory Structure",
          link: "/v3/backend/base/structure"
        },
        {
          text: "Lifecycle",
          link: "/v3/backend/base/lifecycle"
        },
        { text: "Routing and API Documentation",link: "/v3/backend/base/router"},
        { text: "Error Handling",link: "/v3/backend/base/error-handler"},
        {text: "Logging",link: "/v3/backend/base/logger"},
        {text: "Events",link: "/v3/backend/base/event-handler"},
        {text: "File Upload",link: "/v3/backend/base/upload"},
        {text: "Multilingual",link: "/v3/backend/base/lang"},
      ]
    },
    {
      text:"Security Related",
      collapsed: false,
      items:[
        {
          text: "User Authentication",
          link: "/v3/backend/security/passport"
        },
        {
          text: "User Authorization (RBAC)",
          link: "/v3/backend/security/access"
        },
        {
          text: "Getting Client IP",
          link: "/v3/backend/security/client-ip"
        }
      ]
    },{
      text:"Data Permissions",
      collapsed: true,
      items:[
        {
          text: "Core Concepts",
          link: "/v3/backend/data-permission/overview"
        },
        {
          text: "Permission Configuration and Effect Demo",
          link: "/v3/backend/data-permission/config"
        },
        {
          text: "API Reference and Advanced Usage",
          link: "/v3/backend/data-permission/example"
        },
        {
          text: "Performance Optimization Guide",
          link: "/v3/backend/data-permission/performance"
        },
        {
          text: "Troubleshooting Guide",
          link: "/v3/backend/data-permission/troubleshooting"
        },
        {
          text: "Notes and Best Practices",
          link: "/v3/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/v3/plugin/':[
    {
      text:"Quick Start",
      collapsed: false,
      items:
          [
            {
              text:"Plugin System Overview",
              link:"/v3/plugin/index"
            },
            {
              text:"Quick Start Guide",
              link:"/v3/plugin/guide"
            },
            {
              text:"Plugin Commands",
              link:"/v3/plugin/command"
            },
            {
              text:"Creating an Application",
              link:"/v3/plugin/create"
            }
          ]
    },
    {
      text:"Core Concepts",
      collapsed: false,
      items:
          [
            {
              text:"Plugin Directory Structure",
              link:"/v3/plugin/structure"
            },
            {
              text:"mine.json Configuration",
              link:"/v3/plugin/mineJson"
            },
            {
              text:"ConfigProvider Explanation",
              link:"/v3/plugin/configProvider"
            },
            {
              text:"Lifecycle Management",
              link:"/v3/plugin/lifecycle"
            }
          ]
    },
    {
      text:"Development Guide",
      collapsed: false,
      items:
          [
            {
              text:"Plugin Development Guide",
              link:"/v3/plugin/develop"
            },
            {
              text:"API Reference Documentation",
              link:"/v3/plugin/api"
            },
            {
              text:"Example Code",
              link:"/v3/plugin/examples"
            }
          ]
    },
    {
      text:"Backend Development",
      collapsed: false,
      items:[
        {
          text: "Database Migration",
          link: "/v3/plugin/backend/migrate"
        },
        {
          text: "Unit Testing",
          link: "/v3/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"Frontend Development",
      collapsed: false,
      items:[
        {
          text: "Frontend Development Standards",
          link: "/v3/plugin/front/develop"
        }
      ]
    },
    {
      text:"Application Publishing",
      collapsed: true,
      items:[
        {
          text: "Application Release",
          link: "/v3/plugin/develop/publish"
        },
        {
          text: "Notes",
          link: "/v3/plugin/develop/question"
        }
      ]
    }
  ],
  '/libs/': createLibrarySidebar({
    title: 'Independent Libraries',
    overview: 'Library Overview',
    currentVersion: 'Current Version'
  })
}

export default sidebar
