import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/zh/guide/': [
    {
      text: '紹介',
      items: [
        {
          text: 'なぜ私たちを選ぶのか？',
          link: '/ja/guide/introduce/mineadmin',
        },
        {
          text: '更新履歴',
          link: '/ja/guide/changelog',
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
          text:"貢献ガイド",
          link:"/ja/guide/contributions"
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
          text: 'フック',
          link: '/ja/front/high/hooks'
        },
        {
          text: '共通ストア',
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
          link: '/ja/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基本使用法',
              link: '/ja/front/component/ma-form/examples/basic-usage'
            },
            {
              text: 'レイアウトシステム',
              link: '/ja/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '条件付きレンダリング',
              link: '/ja/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '動的バリデーション',
              link: '/ja/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: 'コンポーネントレンダリング',
              link: '/ja/front/component/ma-form/examples/component-rendering'
            },
            {
              text: 'スロット例',
              link: '/ja/front/component/ma-form/examples/slots-examples'
            },
            {
              text: '公開メソッド',
              link: '/ja/front/component/ma-form/examples/expose-methods'
            },
            {
              text: 'ローディング状態',
              link: '/ja/front/component/ma-form/examples/loading-states'
            },
            {
              text: 'ネストフォーム',
              link: '/ja/front/component/ma-form/examples/nested-forms'
            },
            {
              text: 'モバイル対応',
              link: '/ja/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高度なシナリオ',
              link: '/ja/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: 'パフォーマンスデモ',
              link: '/ja/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable',
          link: '/ja/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基本テーブル',
              link: '/ja/front/component/ma-table/basic'
            },
            {
              text: 'テーブルソート',
              link: '/ja/front/component/ma-table/sorting'
            },
            {
              text: 'テーブルフィルタ',
              link: '/ja/front/component/ma-table/filter'
            },
            {
              text: 'カスタムレンダリング',
              link: '/ja/front/component/ma-table/custom-render'
            },
            {
              text: '動的カラム管理',
              link: '/ja/front/component/ma-table/dynamic-columns'
            },
            {
              text: 'ページネーションテーブル',
              link: '/ja/front/component/ma-table/pagination'
            },
            {
              text: 'ツリーテーブル',
              link: '/ja/front/component/ma-table/tree-table'
            },
            {
              text: '複数選択テーブル',
              link: '/ja/front/component/ma-table/selection'
            },
            {
              text: 'レスポンシブテーブル',
              link: '/ja/front/component/ma-table/responsive'
            }
          ]
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
  '/zh/backend/':[
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
          text: "ユーザー権限(RBAC)",
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
          text: "権限設定と効果デモ",
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
  '/zh/plugin/':[
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
              text:"アプリケーション作成",
              link:"/ja/plugin/create"
            },
            {
              text:"プラグイン構造",
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