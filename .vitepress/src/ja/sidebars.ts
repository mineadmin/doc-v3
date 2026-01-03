import type {DefaultTheme} from "vitepress";

const sidebar:DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: '紹介',
      collapsed: false,
      items: [
        {
          text: 'なぜ私たちを選ぶのか?',
          link: '/guide/introduce/mineadmin',
        },
        {
          text: '更新履歴',
          link: '/guide/changelog',
        },
        {
          text: '免責事項',
          link: '/guide/introduce/declaration',
        },
        {
          text: '謝辞',
          link: '/guide/introduce/thank',
        },
        {
          text: 'お問い合わせ',
          link: '/guide/introduce/contact',
        }
      ]
    },
    {
      text: 'クイックスタート',
      collapsed: false,
      items: [
        {
          text: 'クイックインストール',
          link: '/guide/start/fast-install',
        },
        {
          text: "デプロイ",
          link: "/guide/start/deployment"
        }
      ]
    },
    {
      text: 'その他のリソース',
      collapsed: true,
      items: [
        {
          text:"リリースノート",
          link:'/guide/releases'
        },
        {
          text:"アップグレードガイド",
          link:"/guide/upgrade"
        },
        {
          text:"貢献ガイド",
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
          text: '基本概念',
          link: '/front/base/concept'
        },
        {
          text: 'クイックスタート',
          link: '/front/base/start'
        },
        {
          text: 'ルートとメニュー',
          link: '/front/base/route-menu'
        },
        {
          text: '設定',
          link: '/front/base/configure'
        },
        {
          text: 'アイコン',
          link: '/front/base/icon'
        },
        {
          text: 'ビルドとプレビュー',
          link: '/front/base/build-preview'
        }
      ]
    },
    {
      text: '高度な開発',
      collapsed: false,
      items: [
        {
          text: 'システムパラメータ設定',
          link: '/front/advanced/system-config'
        },
        {
          text: '自動インポート',
          link: '/front/advanced/auto-import'
        },
        {
          text: 'リクエストとインターセプター',
          link: '/front/advanced/request'
        },
        {
          text: 'ログインとウェルカムページ',
          link: '/front/advanced/login-welcome'
        },
        {
          text: 'モジュール化',
          link: '/front/advanced/module'
        },
        {
          text: 'レイアウト',
          link: '/front/advanced/layout'
        },
        {
          text: 'ツールバー拡張',
          link: '/front/advanced/tools'
        },
        {
          text: '権限',
          link: '/front/advanced/permission'
        },
        {
          text: 'ページキャッシュ',
          link: '/front/advanced/cache'
        }
      ]
    },
    {
      text: '高度なトピック',
      collapsed: true,
      items: [
        {
          text: '国際化設定',
          link: '/front/high/i18n'
        },
        {
          text: 'サービスプロバイダー',
          link: '/front/high/provider'
        },
        {
          text: 'フック',
          link: '/front/high/hooks'
        },
        {
          text: '🗄️ 一般的なストア',
          link: '/front/high/store'
        },
        {
          text: 'プラグインシステム',
          link: '/front/high/plugins'
        },
        {
          text: 'JSXとTSX開発',
          link: '/front/high/tsx'
        }
      ],
    },
    {
      text: 'コンポーネントチュートリアル',
      collapsed: false,
      items: [
        {
          text: 'MaForm フォームコンポーネント',
          link: '/front/component/ma-form',
          collapsed: true,
          items: [
            {
              text: '基本的な使い方',
              link: '/front/component/ma-form/examples/basic-usage'
            },
            {
              text: 'レイアウトシステム',
              link: '/front/component/ma-form/examples/layout-systems'
            },
            {
              text: '条件付きレンダリング',
              link: '/front/component/ma-form/examples/conditional-rendering'
            },
            {
              text: '動的バリデーション',
              link: '/front/component/ma-form/examples/dynamic-validation'
            },
            {
              text: 'コンポーネントレンダリング',
              link: '/front/component/ma-form/examples/component-rendering'
            },
            {
              text: 'スロット例',
              link: '/front/component/ma-form/examples/slots-examples'
            },
            {
              text: '公開メソッド',
              link: '/front/component/ma-form/examples/expose-methods'
            },
            {
              text: 'ローディング状態',
              link: '/front/component/ma-form/examples/loading-states'
            },
            {
              text: 'ネストされたフォーム',
              link: '/front/component/ma-form/examples/nested-forms'
            },
            {
              text: 'モバイル対応',
              link: '/front/component/ma-form/examples/mobile-responsive'
            },
            {
              text: '高度なシナリオ',
              link: '/front/component/ma-form/examples/advanced-scenarios'
            },
            {
              text: 'パフォーマンスデモ',
              link: '/front/component/ma-form/examples/performance-demo'
            }
          ]
        },
        {
          text: 'MaTable テーブルコンポーネント',
          link: '/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基本テーブル',
              link: '/front/component/ma-table/basic'
            },
            {
              text: 'テーブルソート',
              link: '/front/component/ma-table/sorting'
            },
            {
              text: 'テーブルフィルター',
              link: '/front/component/ma-table/filter'
            },
            {
              text: 'カスタムレンダリング',
              link: '/front/component/ma-table/custom-render'
            },
            {
              text: '動的カラム管理',
              link: '/front/component/ma-table/dynamic-columns'
            },
            {
              text: 'ページネーションテーブル',
              link: '/front/component/ma-table/pagination'
            },
            {
              text: 'ツリーテーブル',
              link: '/front/component/ma-table/tree-table'
            },
            {
              text: '複数選択テーブル',
              link: '/front/component/ma-table/selection'
            },
            {
              text: 'レスポンシブテーブル',
              link: '/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch 検索コンポーネント',
          link: '/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基本的な使い方',
              link: '/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高度な検索',
              link: '/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '折りたたみ検索',
              link: '/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: 'カスタム操作',
              link: '/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '動的管理',
              link: '/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: 'レスポンシブレイアウト',
              link: '/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: 'テーブル統合',
              link: '/front/component/ma-search/examples/table-integration'
            },
            {
              text: 'フォームバリデーション',
              link: '/front/component/ma-search/examples/form-validation'
            },
            {
              text: 'メソッドデモ',
              link: '/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable 高度なテーブル',
          link: '/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: '基本的な使い方',
              link: '/front/component/ma-pro-table/examples/basic'
            },
            {
              text: '高度な検索',
              link: '/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: 'カスタム操作',
              link: '/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: 'セルレンダリングプラグイン',
              link: '/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: 'ツールバー拡張',
              link: '/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: 'データ管理',
              link: '/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: 'レスポンシブレイアウト',
              link: '/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts チャートコンポーネント',
          link: '/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/backend/':[
    {
      text:"コア機能",
      collapsed: false,
      items:[
        {
          text: "ディレクトリ構造",
          link: "/backend/base/structure"
        },
        {
          text: "ライフサイクル",
          link: "/backend/base/lifecycle"
        },
        { text: "ルートとAPIドキュメント",link: "/backend/base/router"},
        { text: "エラー処理",link: "/backend/base/error-handler"},
        {text: "ログ",link: "/backend/base/logger"},
        {text: "イベント",link: "/backend/base/event-handler"},
        {text: "ファイルアップロード",link: "/backend/base/upload"},
        {text: "多言語",link: "/backend/base/lang"},
      ]
    },
    {
      text:"セキュリティ関連",
      collapsed: false,
      items:[
        {
          text: "ユーザー認証",
          link: "/backend/security/passport"
        },
        {
          text: "ユーザー認可(RBAC)",
          link: "/backend/security/access"
        },
        {
          text: "クライアントIP取得",
          link: "/backend/security/client-ip"
        }
      ]
    },{
      text:"データ権限",
      collapsed: true,
      items:[
        {
          text: "コアコンセプト",
          link: "/backend/data-permission/overview"
        },
        {
          text: "権限設定と効果デモ",
          link: "/backend/data-permission/config"
        },
        {
          text: "APIリファレンスと高度な使い方",
          link: "/backend/data-permission/example"
        },
        {
          text: "パフォーマンス最適化ガイド",
          link: "/backend/data-permission/performance"
        },
        {
          text: "トラブルシューティングガイド",
          link: "/backend/data-permission/troubleshooting"
        },
        {
          text: "注意事項とベストプラクティス",
          link: "/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/plugin/':[
    {
      text:"クイックスタート",
      collapsed: false,
      items:
          [
            {
              text:"プラグインシステム概要",
              link:"/plugin/index"
            },
            {
              text:"クイックスタートガイド",
              link:"/plugin/guide"
            },
            {
              text:"プラグインコマンド",
              link:"/plugin/command"
            },
            {
              text:"アプリケーション作成",
              link:"/plugin/create"
            }
          ]
    },
    {
      text:"コアコンセプト",
      collapsed: false,
      items:
          [
            {
              text:"プラグインディレクトリ構造",
              link:"/plugin/structure"
            },
            {
              text:"mine.json 設定",
              link:"/plugin/mineJson"
            },
            {
              text:"ConfigProvider 説明",
              link:"/plugin/configProvider"
            },
            {
              text:"ライフサイクル管理",
              link:"/plugin/lifecycle"
            }
          ]
    },
    {
      text:"開発ガイド",
      collapsed: false,
      items:
          [
            {
              text:"プラグイン開発ガイド",
              link:"/plugin/develop"
            },
            {
              text:"API リファレンス",
              link:"/plugin/api"
            },
            {
              text:"サンプルコード",
              link:"/plugin/examples"
            }
          ]
    },
    {
      text:"バックエンド開発",
      collapsed: false,
      items:[
        {
          text: "データベースマイグレーション",
          link: "/plugin/backend/migrate"
        },
        {
          text: "ユニットテスト",
          link: "/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"フロントエンド開発",
      collapsed: false,
      items:[
        {
          text: "フロントエンド開発規約",
          link: "/plugin/front/develop"
        }
      ]
    },
    {
      text:"アプリケーション公開",
      collapsed: true,
      items:[
        {
          text: "アプリケーションリリース",
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