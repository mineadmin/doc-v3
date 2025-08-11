import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh/guide/': [
    {
      text: 'Introduction',
      items: [
        {
          text: 'Why Choose Us?',
          link: '/zh/guide/introduce/mineadmin',
        },
        {
          text: 'Changelog',
          link: '/zh/guide/changelog',
        },
        {
          text: 'Disclaimer',
          link: '/zh/guide/introduce/declaration',
        },
        {
          text: 'Acknowledgements',
          link: '/zh/guide/introduce/thank',
        }
      ]
    },
    {
      text: 'Getting Started',
      items: [
        {
          text: 'Quick Installation',
          link: '/zh/guide/start/fast-install',
        },
        {
          text: "Deployment",
          link: "/zh/guide/start/deployment"
        }
      ]
    },
    {
      text: 'Others',
      items: [
        {
          text:"Release Notes",
          link:'/zh/guide/releases'
        },
        {
          text:"Upgrade Guide",
          link:"/zh/guide/upgrade"
        },
        {
          text:"Contribution Guide",
          link:"/zh/guide/contributions"
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
          link: '/zh/front/base/concept'
        },
        {
          text: 'Getting Started',
          link: '/zh/front/base/start'
        },
        {
          text: 'Routes & Menus',
          link: '/zh/front/base/route-menu'
        },
        {
          text: 'Configuration',
          link: '/zh/front/base/configure'
        },
        {
          text: 'Icons',
          link: '/zh/front/base/icon'
        },
        {
          text: 'Build & Preview',
          link: '/zh/front/base/build-preview'
        }
      ]
    },
    {
      text: 'Advanced',
      items: [
        {
          text: 'System Configuration',
          link: '/zh/front/advanced/system-config'
        },
        {
          text: 'Auto Import',
          link: '/zh/front/advanced/auto-import'
        },
        {
          text: 'Requests & Interceptors',
          link: '/zh/front/advanced/request'
        },
        {
          text: 'Login & Welcome Page',
          link: '/zh/front/advanced/login-welcome'
        },
        {
          text: 'Modularization',
          link: '/zh/front/advanced/module'
        },
        {
          text: 'Layout',
          link: '/zh/front/advanced/layout'
        },
        {
          text: 'Toolbar Extensions',
          link: '/zh/front/advanced/tools'
        },
        {
          text: 'Permissions',
          link: '/zh/front/advanced/permission'
        },
        {
          text: 'Page Caching',
          link: '/zh/front/advanced/cache'
        }
      ]
    },
    {
      text: 'Expert',
      items: [
        {
          text: 'i18n Configuration',
          link: '/zh/front/high/i18n'
        },
        {
          text: 'Service Providers',
          link: '/zh/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/zh/front/high/hooks'
        },
        {
          text: 'Common Stores',
          link: '/zh/front/high/store'
        },
        {
          text: 'Plugin System',
          link: '/zh/front/high/plugins'
        },
        {
          text: 'JSX & TSX Development',
          link: '/zh/front/high/tsx'
        }
      ],
    },
    {
      text: 'Component Tutorials',
      items: [
        {
          text: 'MaForm',
          link: '/zh/front/component/ma-form'
        },
        {
          text: 'MaTable',
          link: '/zh/front/component/ma-table'
        },
        {
          text: 'MaSearch',
          link: '/zh/front/component/ma-search'
        },
        {
          text: 'MaProTable',
          link: '/zh/front/component/ma-pro-table'
        },
        {
          text: 'MaEcharts',
          link: '/zh/front/component/ma-echarts'
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
          link: "/zh/backend/base/structure"
        },
        {
          text: "Lifecycle",
          link: "/zh/backend/base/lifecycle"
        },
        { text: "Routing & API Docs",link: "/zh/backend/base/router"},
        { text: "Error Handling",link: "/zh/backend/base/error-handler"},
        {text: "Logging",link: "/zh/backend/base/logger"},
        {text: "Events",link: "/zh/backend/base/event-handler"},
        {text: "File Upload",link: "/zh/backend/base/upload"},
        {text: "i18n",link: "/zh/backend/base/lang"},
      ]
    },
    {
      text:"Security",
      items:[
        {
          text: "User Authentication",
          link: "/zh/backend/security/passport"
        },
        {
          text: "User Authorization (RBAC)",
          link: "/zh/backend/security/access"
        },
        {
          text: "Client IP Detection",
          link: "/zh/backend/security/client-ip"
        }
      ]
    },{
      text:"Data Permissions",
      items:[
        {
          text: "Core Concepts",
          link: "/zh/backend/data-permission/overview"
        },
        {
          text: "Configuration & Demo",
          link: "/zh/backend/data-permission/config"
        },
        {
          text: "Usage Examples",
            link: "/zh/backend/data-permission/example"
        },
        {
          text: "Notes",
            link: "/zh/backend/data-permission/notice"
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
              link:"/zh/plugin"
            },
            {
              text:"Plugin Commands",
              link:"/zh/plugin/command"
            },
            {
              text:"Create Application",
              link:"/zh/plugin/create"
            },
            {
              text:"Plugin Structure",
              link:"/zh/plugin/structure"
            },
            {
              text:"mine.json Documentation",
              link:"/zh/plugin/mineJson"
            },
            {
            text:"ConfigProvider Guide",
            link:"/zh/plugin/configProvider"
          }
          ]
    },
    {
      text:"Backend Development",
      items:[
        {
          text: "Database Migrations",
          link: "/zh/plugin/backend/migrate"
        },
        {
          text: "Unit Testing",
          link: "/zh/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"Frontend Development",
      items:[
        {
          text: "Frontend Standards",
          link: "/zh/plugin/front/develop"
        }
      ]
    },
    {
      text:"Publishing",
      items:[
        {
          text: "Application Release",
          link: "/zh/plugin/develop/publish"
        },
        {
          text: "Notes",
          link: "/zh/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar