import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh/guide/': [
    {
      text: '紹介',
      items: [
        {
          text: 'なぜ私たちを選ぶのか？',
          link: '/zh/guide/introduce/mineadmin',
        },
        {
          text: '更新履歴',
          link: '/zh/guide/changelog',
        },
        {
          text: '免責事項',
          link: '/zh/guide/introduce/declaration',
        },
        {
          text: '謝辞',
          link: '/zh/guide/introduce/thank',
        }
      ]
    },
    {
      text: 'スタート',
      items: [
        {
          text: 'クイックインストール',
          link: '/zh/guide/start/fast-install',
        },
        {
          text: "デプロイ",
          link: "/zh/guide/start/deployment"
        }
      ]
    },
    {
      text: 'その他',
      items: [
        {
          text:"リリースノート",
          link:'/zh/guide/releases'
        },
        {
          text:"アップグレードガイド",
          link:"/zh/guide/upgrade"
        },
        {
          text:"貢献ガイド",
          link:"/zh/guide/contributions"
        }
      ]
    }
  ],
  '/zh/front/': [
    {
      text: '基礎',
      items: [
        {
          text: '基本概念',
          link: '/zh/front/base/concept'
        },
        {
          text: 'スタート',
          link: '/zh/front/base/start'
        },
        {
          text: 'ルートとメニュー',
          link: '/zh/front/base/route-menu'
        },
        {
          text: '設定',
          link: '/zh/front/base/configure'
        },
        {
          text: 'アイコン',
          link: '/zh/front/base/icon'
        },
        {
          text: 'ビルドとプレビュー',
          link: '/zh/front/base/build-preview'
        }
      ]
    },
    {
      text: '応用',
      items: [
        {
          text: 'システムパラメータ設定',
          link: '/zh/front/advanced/system-config'
        },
        {
          text: '自動インポート',
          link: '/zh/front/advanced/auto-import'
        },
        {
          text: 'リクエストとインターセプター',
          link: '/zh/front/advanced/request'
        },
        {
          text: 'ログインとウェルカムページ',
          link: '/zh/front/advanced/login-welcome'
        },
        {
          text: 'モジュール化',
          link: '/zh/front/advanced/module'
        },
        {
          text: 'レイアウト',
          link: '/zh/front/advanced/layout'
        },
        {
          text: 'ツールバー拡張',
          link: '/zh/front/advanced/tools'
        },
        {
          text: '権限',
          link: '/zh/front/advanced/permission'
        },
        {
          text: 'ページキャッシュ',
          link: '/zh/front/advanced/cache'
        }
      ]
    },
    {
      text: '高度',
      items: [
        {
          text: '国際化設定',
          link: '/zh/front/high/i18n'
        },
        {
          text: 'サービスプロバイダー',
          link: '/zh/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/zh/front/high/hooks'
        },
        {
          text: '常用Store',
          link: '/zh/front/high/store'
        },
        {
          text: 'プラグインシステム',
          link: '/zh/front/high/plugins'
        },
        {
          text: 'JSXとTSX開発',
          link: '/zh/front/high/tsx'
        }
      ],
    },
    {
      text: 'コンポーネントチュートリアル',
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
      text:"応用",
      items:[
        {
          text: "ディレクトリ構造",
          link: "/zh/backend/base/structure"
        },
        {
          text: "ライフサイクル",
          link: "/zh/backend/base/lifecycle"
        },
        { text: "ルートとAPIドキュメント",link: "/zh/backend/base/router"},
        { text: "エラー処理",link: "/zh/backend/base/error-handler"},
        {text: "ログ",link: "/zh/backend/base/logger"},
        {text: "イベント",link: "/zh/backend/base/event-handler"},
        {text: "ファイルアップロード",link: "/zh/backend/base/upload"},
        {text: "多言語",link: "/zh/backend/base/lang"},
      ]
    },
    {
      text:"セキュリティ関連",
      items:[
        {
          text: "ユーザー認証",
          link: "/zh/backend/security/passport"
        },
        {
          text: "ユーザー権限(RBAC)",
          link: "/zh/backend/security/access"
        },
        {
          text: "クライアントIP取得",
          link: "/zh/backend/security/client-ip"
        }
      ]
    },{
      text:"データ権限",
      items:[
        {
          text: "コア概念",
          link: "/zh/backend/data-permission/overview"
        },
        {
          text: "権限設定と効果デモ",
          link: "/zh/backend/data-permission/config"
        },
        {
          text: "使用例",
            link: "/zh/backend/data-permission/example"
        },
        {
          text: "注意事項",
            link: "/zh/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/zh/plugin/':[
    {
      text:"クイックスタート",
      items:
          [
            {
              text:"準備作業",
              link:"/zh/plugin"
            },
            {
              text:"プラグインコマンド",
              link:"/zh/plugin/command"
            },
            {
              text:"アプリケーション作成",
              link:"/zh/plugin/create"
            },
            {
              text:"プラグインディレクトリ構造",
              link:"/zh/plugin/structure"
            },
            {
              text:"mine.json 説明と例",
              link:"/zh/plugin/mineJson"
            },
            {
            text:"ConfigProvider 説明",
            link:"/zh/plugin/configProvider"
          }
          ]
    },
    {
      text:"バックエンド開発",
      items:[
        {
          text: "データベースマイグレーション",
          link: "/zh/plugin/backend/migrate"
        },
        {
          text: "ユニットテスト",
          link: "/zh/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"フロントエンド開発",
      items:[
        {
          text: "フロントエンド開発規約",
          link: "/zh/plugin/front/develop"
        }
      ]
    },
    {
      text:"アプリ公開",
      items:[
        {
          text: "アプリリリース",
          link: "/zh/plugin/develop/publish"
        },
        {
          text: "注意事項",
          link: "/zh/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar