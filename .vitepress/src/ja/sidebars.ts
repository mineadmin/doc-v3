import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/ja/guide/': [
    {
      text: '紹介',
      items: [
        {
          text: 'MineAdminについて',
          link: '/ja/guide/introduce/mineadmin',
        },
        {
          text: '免責事項',
          link: '/ja/guide/introduce/declaration',
        },
        {
          text: '謝辞',
          link: '/ja/guide/introduce/thank',
        }
      ]
    },
    {
      text: 'スタート',
      items: [
        {
          text: 'クイックインストール',
          link: '/ja/guide/start/fast-install',
        },
        {
          text: "デプロイ",
          link: "/ja/guide/start/deployment"
        }
      ]
    },
    {
      text: 'その他',
      items: [
        {
          text:"リリースノート",
          link:'/ja/guide/releases'
        },
        {
          text:"アップグレードガイド",
          link:"/ja/guide/upgrade"
        },
        {
          text:"コントリビューションガイド",
          link:"/ja/guide/contributions"
        }
      ]
    }
  ],
  '/ja/front/': [
    {
      text: '基礎',
      items: [
        {
          text: '基本概念',
          link: '/ja/front/base/concept'
        },
        {
          text: 'スタート',
          link: '/ja/front/base/start'
        },
        {
          text: 'ルートとメニュー',
          link: '/ja/front/base/route-menu'
        },
        {
          text: '設定',
          link: '/ja/front/base/configure'
        },
        {
          text: 'アイコン',
          link: '/ja/front/base/icon'
        },
        {
          text: 'ビルドとプレビュー',
          link: '/ja/front/base/build-preview'
        }
      ]
    },
    {
      text: '応用',
      items: [
        {
          text: 'システムパラメータ設定',
          link: '/ja/front/advanced/system-config'
        },
        {
          text: '自動インポート',
          link: '/ja/front/advanced/auto-import'
        },
        {
          text: 'リクエストとインターセプター',
          link: '/ja/front/advanced/request'
        },
        {
          text: 'ログインとウェルカムページ',
          link: '/ja/front/advanced/login-welcome'
        },
        {
          text: 'モジュール化',
          link: '/ja/front/advanced/module'
        },
        {
          text: 'レイアウト',
          link: '/ja/front/advanced/layout'
        },
        {
          text: 'ツールバー拡張',
          link: '/ja/front/advanced/tools'
        },
        {
          text: '権限',
          link: '/ja/front/advanced/permission'
        },
        {
          text: 'ページキャッシュ',
          link: '/ja/front/advanced/cache'
        }
      ]
    },
    {
      text: '高度',
      items: [
        {
          text: '国際化設定',
          link: '/ja/front/high/i18n'
        },
        {
          text: 'サービスプロバイダー',
          link: '/ja/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/ja/front/high/hooks'
        },
        {
          text: 'よく使うStore',
          link: '/ja/front/high/store'
        },
        {
          text: 'プラグインシステム',
          link: '/ja/front/high/plugins'
        },
        {
          text: 'JSXとTSX開発',
          link: '/ja/front/high/tsx'
        }
      ],
    },
    {
      text: 'コンポーネントチュートリアル',
      items: [
        {
          text: 'MaForm',
          link: '/ja/front/component/ma-form'
        },
        {
          text: 'MaTable',
          link: '/ja/front/component/ma-table'
        },
        {
          text: 'MaSearch',
          link: '/ja/front/component/ma-search'
        },
        {
          text: 'MaProTable',
          link: '/ja/front/component/ma-pro-table'
        },
        {
          text: 'MaEcharts',
          link: '/ja/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/ja/backend/':[
    {
      text:"応用",
      items:[
        {
          text: "ディレクトリ構造",
          link: "/ja/backend/base/structure"
        },
        {
          text: "ライフサイクル",
          link: "/ja/backend/base/lifecycle"
        },
        { text: "ルートとAPIドキュメント",link: "/ja/backend/base/router"},
        { text: "エラーハンドリング",link: "/ja/backend/base/error-handler"},
        {text: "ログ",link: "/ja/backend/base/logger"},
        {text: "イベント",link: "/ja/backend/base/event-handler"},
        {text: "ファイルアップロード",link: "/ja/backend/base/upload"},
        {text: "多言語",link: "/ja/backend/base/lang"},
      ]
    },
    {
      text:"セキュリティ関連",
      items:[
        {
          text: "ユーザー認証",
          link: "/ja/backend/security/passport"
        },
        {
          text: "ユーザー認可(RBAC)",
          link: "/ja/backend/security/access"
        },
        {
          text: "クライアントIP取得",
          link: "/ja/backend/security/client-ip"
        }
      ]
    },{
      text:"データ権限",
      items:[
        {
          text: "コアコンセプト",
          link: "/ja/backend/data-permission/overview"
        },
        {
          text: "権限設定とデモ",
          link: "/ja/backend/data-permission/config"
        },
        {
          text: "使用例",
            link: "/ja/backend/data-permission/example"
        },
        {
          text: "注意事項",
            link: "/ja/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/ja/plugin/':[
    {
      text:"クイックスタート",
      items:
          [
            {
              text:"準備作業",
              link:"/ja/plugin"
            },
            {
              text:"プラグインコマンド",
              link:"/ja/plugin/command"
            },
            {
              text:"アプリ作成",
              link:"/ja/plugin/create"
            },
            {
              text:"プラグインディレクトリ構造",
              link:"/ja/plugin/structure"
            },
            {
              text:"mine.json 説明と例",
              link:"/ja/plugin/mineJson"
            },
            {
            text:"ConfigProvider 説明",
            link:"/ja/plugin/configProvider"
          }
          ]
    },
    {
      text:"バックエンド開発",
      items:[
        {
          text: "データベースマイグレーション",
          link: "/ja/plugin/backend/migrate"
        },
        {
          text: "ユニットテスト",
          link: "/ja/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"フロントエンド開発",
      items:[
        {
          text: "フロントエンド開発規約",
          link: "/ja/plugin/front/develop"
        }
      ]
    },
    {
      text:"アプリ公開",
      items:[
        {
          text: "アプリリリース",
          link: "/ja/plugin/develop/publish"
        },
        {
          text: "注意事項",
          link: "/ja/plugin/develop/question"
        }
      ]
    }
  ]
}

export default sidebar