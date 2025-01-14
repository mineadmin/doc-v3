import {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/en/guide/': [
    {
      text: 'Introduction',
      items: [
        {
          text: 'About MineAdmin',
          link: '/en/guide/introduce/mineadmin',
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
  '/en/front/': [
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
          text: 'Routing and Menus',
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
          text: 'Build and Preview',
          link: '/en/front/base/build-preview'
        }
      ]
    },
    {
      text: 'Advanced',
      items: [
        {
          text: 'System Parameter Configuration',
          link: '/en/front/advanced/system-config'
        },
        {
          text: 'Auto Import',
          link: '/en/front/advanced/auto-import'
        },
        {
          text: 'Requests and Interceptors',
          link: '/en/front/advanced/request'
        },
        {
          text: 'Login and Welcome Page',
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
      text: 'Advanced',
      items: [
        {
          text: 'Internationalization Configuration',
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
          text: 'JSX and TSX Development',
          link: '/en/front/high/tsx'
        }
      ],
    },
    {
      text: 'Component Tutorials',
      items: [
        {
          text: 'MaForm',
          link: '/en/front/component/ma-form'
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
  '/en/backend/':[
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
        { text: "Routing and API Documentation",link: "/en/backend/base/router"},
        { text: "Error Handling",link: "/en/backend/base/error-handler"},
        {text: "Logging",link: "/en/backend/base/logger"},
        {text: "Events",link: "/en/backend/base/event-handler"},
        {text: "File Upload",link: "/en/backend/base/upload"},
        {text: "Multilingual",link: "/en/backend/base/lang"},
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
        }
      ]
    }
  ],
  '/en/plugin/':[
    {
      text:"Quick Start",
      items:
          [
            {
              text:"Preparation",
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
              text:"Plugin Directory Structure",
              link:"/en/plugin/structure"
            },
            {
              text:"mine.json Explanation and Example",
              link:"/en/plugin/mineJson"
            },
            {
            text:"ConfigProvider Explanation",
            link:"/en/plugin/configProvider"
          }
          ]
    },
    {
      text:"Backend Development",
      items:[
        {
          text: "Database Migration",
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
          text: "Frontend Development Standards",
          link: "/en/plugin/front/develop"
        }
      ]
    },
    {
      text:"Application Publishing",
      items:[
        {
          text: "Application Release",
          link: "/en/plugin/develop/publish"
        },
        {
          text: "Considerations",
          link: "/en/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar