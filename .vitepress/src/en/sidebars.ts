```typescript
import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh/guide/': [
    {
      text: 'Introduction',
      items: [
        {
          text: 'Why Choose Us?',
          link: '/en/guide/introduce/mineadmin',
        },
        {
          text: 'Changelog',
          link: '/en/guide/changelog',
        },
        {
          text: 'Disclaimer',
          link: '/en/guide/introduce/declaration',
        },
        {
          text: 'Acknowledgements',
          link: '/en/guide/introduce/thank',
        }
      ]
    },
    {
      text: 'Getting Started',
      items: [
        {
          text: 'Quick Installation',
          link: '/en/guide/start/fast-install',
        },
        {
          text: "Deployment",
          link: "/en/guide/start/deployment"
        }
      ]
    },
    {
      text: 'Others',
      items: [
        {
          text:"Release Notes",
          link:'/en/guide/releases'
        },
        {
          text:"Upgrade Guide",
          link:"/en/guide/upgrade"
        },
        {
          text:"Contribution Guide",
          link:"/en/guide/contributions"
        }
      ]
    }
  ],
  '/zh/front/': [
    {
      text: 'Basics',
      items: [
        {
          text: 'Basic Concepts',
          link: '/en/front/base/concept'
        },
        {
          text: 'Getting Started',
          link: '/en/front/base/start'
        },
        {
          text: 'Routes & Menus',
          link: '/en/front/base/route-menu'
        },
        {
          text: 'Configuration',
          link: '/en/front/base/configure'
        },
        {
          text: 'Icons',
          link: '/en/front/base/icon'
        },
        {
          text: 'Build & Preview',
          link: '/en/front/base/build-preview'
        }
      ]
    },
    {
      text: 'Advanced',
      items: [
        {
          text: 'System Configuration',
          link: '/en/front/advanced/system-config'
        },
        {
          text: 'Auto Import',
          link: '/en/front/advanced/auto-import'
        },
        {
          text: 'Requests & Interceptors',
          link: '/en/front/advanced/request'
        },
        {
          text: 'Login & Welcome Page',
          link: '/en/front/advanced/login-welcome'
        },
        {
          text: 'Modularization',
          link: '/en/front/advanced/module'
        },
        {
          text: 'Layout',
          link: '/en/front/advanced/layout'
        },
        {
          text: 'Toolbar Extensions',
          link: '/en/front/advanced/tools'
        },
        {
          text: 'Permissions',
          link: '/en/front/advanced/permission'
        },
        {
          text: 'Page Caching',
          link: '/en/front/advanced/cache'
        }
      ]
    },
    {
      text: 'Expert',
      items: [
        {
          text: 'i18n Configuration',
          link: '/en/front/high/i18n'
        },
        {
          text: 'Service Providers',
          link: '/en/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/en/front/high/hooks'
        },
        {
          text: 'Common Stores',
          link: '/en/front/high/store'
        },
        {
          text: 'Plugin System',
          link: '/en/front/high/plugins'
        },
        {
          text: 'JSX & TSX Development',
          link: '/en/front/high/tsx'
        }
      ],
    },
    {
      text: 'Component Tutorials',
      items: [
        {
          text: 'MaForm',
          link: '/en/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: 'Basic Usage',
              link: '/en/front/component/ma-form/examples/basic-usage'
            },
            {
              text: 'Layout Systems',
              link: '/en/front/component/ma-form/examples/layout-systems'
            },
            {
              text: 'Conditional Rendering',
              link: '/en/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: 'Dynamic Validation',
              link: '/en/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: 'Component Rendering',
              link: '/en/front/component/ma-form/examples/component-rendering'
            },
            {
              text: 'Slot Examples',
              link: '/en/front/component/ma-form/examples/slots-examples'
            },
            {
              text: 'Exposed Methods',
              link: '/en/front/component/ma-form/examples/expose-methods'
            },
            {
              text: 'Loading States',
              link: '/en/front/component/ma-form/examples/loading-states'
            },
            {
              text: 'Nested Forms',
              link: '/en/front/component/ma-form/examples/nested-forms'
            },
            {
              text: 'Mobile Responsive',
              link: '/en/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: 'Advanced Scenarios',
              link: '/en/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: 'Performance Demo',
              link: '/en/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable',
          link: '/en/front/component/ma-table'
        },
        {
          text: 'MaSearch',
          link: '/en/front/component/ma-search'
        },
        {
          text: 'MaProTable',
          link: '/en/front/component/ma-pro-table'
        },
        {
          text: 'MaEcharts',
          link: '/en/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/zh/backend/':[
    {
      text:"Advanced",
      items:[
        {
          text: "Directory Structure",
          link: "/en/backend/base/structure"
        },
        {
          text: "Lifecycle",
          link: "/en/backend/base/lifecycle"
        },
        { text: "Routes & API Docs",link: "/en/backend/base/router"},
        { text: "Error Handling",link: "/en/backend/base/error-handler"},
        {text: "Logging",link: "/en/backend/base/logger"},
        {text: "Events",link: "/en/backend/base/event-handler"},
        {text: "File Uploads",link: "/en/backend/base/upload"},
        {text: "i18n",link: "/en/backend/base/lang"},
      ]
    },
    {
      text:"Security",
      items:[
        {
          text: "User Authentication",
          link: "/en/backend/security/passport"
        },
        {
          text: "User Authorization (RBAC)",
          link: "/en/backend/security/access"
        },
        {
          text: "Client IP Detection",
          link: "/en/backend/security/client-ip"
        }
      ]
    },{
      text:"Data Permissions",
      items:[
        {
          text: "Core Concepts",
          link: "/en/backend/data-permission/overview"
        },
        {
          text: "Configuration & Demo",
          link: "/en/backend/data-permission/config"
        },
        {
          text: "Usage Examples",
            link: "/en/backend/data-permission/example"
        },
        {
          text: "Notes",
            link: "/en/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/zh/plugin/':[
    {
      text:"Quick Start",
      items:
          [
            {
              text:"Prerequisites",
              link:"/en/plugin"
            },
            {
              text:"Plugin Commands",
              link:"/en/plugin/command"
            },
            {
              text:"Create Application",
              link:"/en/plugin/create"
            },
            {
              text:"Plugin Structure",
              link:"/en/plugin/structure"
            },
            {
              text:"mine.json Documentation",
              link:"/en/plugin/mineJson"
            },
            {
            text:"ConfigProvider Guide",
            link:"/en/plugin/configProvider"
          }
          ]
    },
    {
      text:"Backend Development",
      items:[
        {
          text: "Database Migrations",
          link: "/en/plugin/backend/migrate"
        },
        {
          text: "Unit Testing",
          link: "/en/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"Frontend Development",
      items:[
        {
          text: "Frontend Standards",
          link: "/en/plugin/front/develop"
        }
      ]
    },
    {
      text:"Publishing",
      items:[
        {
          text: "App Publishing",
          link: "/en/plugin/develop/publish"
        },
        {
          text: "Notes",
          link: "/en/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar
```