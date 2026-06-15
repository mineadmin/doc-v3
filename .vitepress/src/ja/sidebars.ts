import type {DefaultTheme} from "vitepress";
import { createLibrarySidebar } from "../shared";

const sidebar:DefaultTheme.Sidebar = {
  '/v3/guide/': [
    {
      text: '紹介',
      collapsed: false,
      items: [
        {
          text: 'なぜ私たちを選ぶのか？',
          link: '/v3/guide/introduce/mineadmin',
        },
        {
          text: '更新履歴',
          link: '/v3/guide/changelog',
        },
        {
          text: '免責事項',
          link: '/v3/guide/introduce/declaration',
        },
        {
          text: '謝辞',
          link: '/v3/guide/introduce/thank',
        },
        {
          text: 'お問い合わせ',
          link: '/v3/guide/introduce/contact',
        }
      ]
    },
    {
      text: 'クイックスタート',
      collapsed: false,
      items: [
        {
          text: 'クイックインストール',
          link: '/v3/guide/start/fast-install',
        },
        {
          text: "デプロイ",
          link: "/v3/guide/start/deployment"
        }
      ]
    },
    {
      text: 'その他のリソース',
      collapsed: true,
      items: [
        {
          text:"リリースノート",
          link:'/v3/guide/releases'
        },
        {
          text:"アップグレードガイド",
          link:"/v3/guide/upgrade"
        },
        {
          text:"コントリビューションガイド",
          link:"/v3/guide/contributions"
        }
      ]
    }
  ],
  '/v3/front/': [
    {
      text: '基礎入門',
      collapsed: false,
      items: [
        {
          text: '基本概念',
          link: '/v3/front/base/concept'
        },
        {
          text: 'クイックスタート',
          link: '/v3/front/base/start'
        },
        {
          text: 'ルーティングとメニュー',
          link: '/v3/front/base/route-menu'
        },
        {
          text: '設定',
          link: '/v3/front/base/configure'
        },
        {
          text: 'アイコン',
          link: '/v3/front/base/icon'
        },
        {
          text: 'ビルドとプレビュー',
          link: '/v3/front/base/build-preview'
        }
      ]
    },
    {
      text: '応用開発',
      collapsed: false,
      items: [
        {
          text: 'システムパラメータ設定',
          link: '/v3/front/advanced/system-config'
        },
        {
          text: '自動インポート',
          link: '/v3/front/advanced/auto-import'
        },
        {
          text: 'リクエストとインターセプター',
          link: '/v3/front/advanced/request'
        },
        {
          text: 'ログインとウェルカムページ',
          link: '/v3/front/advanced/login-welcome'
        },
        {
          text: 'モジュール化',
          link: '/v3/front/advanced/module'
        },
        {
          text: 'レイアウト',
          link: '/v3/front/advanced/layout'
        },
        {
          text: 'ツールバー拡張',
          link: '/v3/front/advanced/tools'
        },
        {
          text: '権限',
          link: '/v3/front/advanced/permission'
        },
        {
          text: 'ページキャッシュ',
          link: '/v3/front/advanced/cache'
        }
      ]
    },
    {
      text: '高度なトピック',
      collapsed: true,
      items: [
        {
          text: '国際化設定',
          link: '/v3/front/high/i18n'
        },
        {
          text: 'サービスプロバイダー',
          link: '/v3/front/high/provider'
        },
        {
          text: 'Hooks',
          link: '/v3/front/high/hooks'
        },
        {
          text: '🗄️ よく使うStore',
          link: '/v3/front/high/store'
        },
        {
          text: 'プラグインシステム',
          link: '/v3/front/high/plugins'
        },
        {
          text: 'JSXとTSX開発',
          link: '/v3/front/high/tsx'
        }
      ],
    },
    {
      text: 'コンポーネントチュートリアル',
      collapsed: false,
      items: [
        {
          text: 'MaTable テーブルコンポーネント',
          link: '/v3/front/component/ma-table',
          collapsed: true,
          items: [
            {
              text: '基本テーブル',
              link: '/v3/front/component/ma-table/basic'
            },
            {
              text: 'テーブルソート',
              link: '/v3/front/component/ma-table/sorting'
            },
            {
              text: 'テーブルフィルター',
              link: '/v3/front/component/ma-table/filter'
            },
            {
              text: 'カスタムレンダリング',
              link: '/v3/front/component/ma-table/custom-render'
            },
            {
              text: '動的列管理',
              link: '/v3/front/component/ma-table/dynamic-columns'
            },
            {
              text: 'ページネーションテーブル',
              link: '/v3/front/component/ma-table/pagination'
            },
            {
              text: 'ツリーテーブル',
              link: '/v3/front/component/ma-table/tree-table'
            },
            {
              text: '複数選択テーブル',
              link: '/v3/front/component/ma-table/selection'
            },
            {
              text: 'レスポンシブテーブル',
              link: '/v3/front/component/ma-table/responsive'
            }
          ]
        },
        {
          text: 'MaSearch 検索コンポーネント',
          link: '/v3/front/component/ma-search',
          collapsed: true,
          items: [
            {
              text: '基本的な使い方',
              link: '/v3/front/component/ma-search/examples/basic-usage'
            },
            {
              text: '高度な検索',
              link: '/v3/front/component/ma-search/examples/advanced-search'
            },
            {
              text: '折りたたみ検索',
              link: '/v3/front/component/ma-search/examples/collapsible-search'
            },
            {
              text: 'カスタム操作',
              link: '/v3/front/component/ma-search/examples/custom-actions'
            },
            {
              text: '動的管理',
              link: '/v3/front/component/ma-search/examples/dynamic-items'
            },
            {
              text: 'レスポンシブレイアウト',
              link: '/v3/front/component/ma-search/examples/responsive-layout'
            },
            {
              text: 'テーブル統合',
              link: '/v3/front/component/ma-search/examples/table-integration'
            },
            {
              text: 'フォームバリデーション',
              link: '/v3/front/component/ma-search/examples/form-validation'
            },
            {
              text: 'メソッドデモ',
              link: '/v3/front/component/ma-search/examples/methods-demo'
            }
          ]
        },
        {
          text: 'MaProTable 高度なテーブル',
          link: '/v3/front/component/ma-pro-table',
          collapsed: true,
          items: [
            {
              text: '基本的な使い方',
              link: '/v3/front/component/ma-pro-table/examples/basic'
            },
            {
              text: '高度な検索',
              link: '/v3/front/component/ma-pro-table/examples/advanced-search'
            },
            {
              text: 'カスタム操作',
              link: '/v3/front/component/ma-pro-table/examples/custom-operations'
            },
            {
              text: 'セルレンダリングプラグイン',
              link: '/v3/front/component/ma-pro-table/examples/cell-render-plugins'
            },
            {
              text: 'ツールバー拡張',
              link: '/v3/front/component/ma-pro-table/examples/toolbar-extensions'
            },
            {
              text: 'データ管理',
              link: '/v3/front/component/ma-pro-table/examples/data-management'
            },
            {
              text: 'レスポンシブレイアウト',
              link: '/v3/front/component/ma-pro-table/examples/responsive-layout'
            }
          ]
        },
        {
          text: 'MaEcharts チャートコンポーネント',
          link: '/v3/front/component/ma-echarts'
        },
      ]
    }
  ],
  '/v3/backend/':[
    {
      text:"コア機能",
      collapsed: false,
      items:[
        {
          text: "ディレクトリ構造",
          link: "/v3/backend/base/structure"
        },
        {
          text: "ライフサイクル",
          link: "/v3/backend/base/lifecycle"
        },
        { text: "ルーティングとAPIドキュメント",link: "/v3/backend/base/router"},
        { text: "エラーハンドリング",link: "/v3/backend/base/error-handler"},
        {text: "ログ",link: "/v3/backend/base/logger"},
        {text: "イベント",link: "/v3/backend/base/event-handler"},
        {text: "ファイルアップロード",link: "/v3/backend/base/upload"},
        {text: "多言語",link: "/v3/backend/base/lang"},
      ]
    },
    {
      text:"セキュリティ関連",
      collapsed: false,
      items:[
        {
          text: "ユーザー認証",
          link: "/v3/backend/security/passport"
        },
        {
          text: "ユーザー認可(RBAC)",
          link: "/v3/backend/security/access"
        },
        {
          text: "クライアントIPの取得",
          link: "/v3/backend/security/client-ip"
        }
      ]
    },{
      text:"データ権限",
      collapsed: true,
      items:[
        {
          text: "コアコンセプト",
          link: "/v3/backend/data-permission/overview"
        },
        {
          text: "権限設定と効果デモ",
          link: "/v3/backend/data-permission/config"
        },
        {
          text: "APIリファレンスと高度な使い方",
          link: "/v3/backend/data-permission/example"
        },
        {
          text: "パフォーマンス最適化ガイド",
          link: "/v3/backend/data-permission/performance"
        },
        {
          text: "トラブルシューティングガイド",
          link: "/v3/backend/data-permission/troubleshooting"
        },
        {
          text: "注意事項とベストプラクティス",
          link: "/v3/backend/data-permission/notice"
        }
      ]
    }
  ],
  '/v3/plugin/':[
    {
      text:"クイックスタート",
      collapsed: false,
      items:
          [
            {
              text:"プラグインシステム概要",
              link:"/v3/plugin/index"
            },
            {
              text:"クイックスタートガイド",
              link:"/v3/plugin/guide"
            },
            {
              text:"プラグインコマンド",
              link:"/v3/plugin/command"
            },
            {
              text:"アプリケーションの作成",
              link:"/v3/plugin/create"
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
              link:"/v3/plugin/structure"
            },
            {
              text:"mine.json 設定",
              link:"/v3/plugin/mineJson"
            },
            {
              text:"ConfigProvider の説明",
              link:"/v3/plugin/configProvider"
            },
            {
              text:"ライフサイクル管理",
              link:"/v3/plugin/lifecycle"
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
              link:"/v3/plugin/develop"
            },
            {
              text:"API リファレンス",
              link:"/v3/plugin/api"
            },
            {
              text:"サンプルコード",
              link:"/v3/plugin/examples"
            }
          ]
    },
    {
      text:"バックエンド開発",
      collapsed: false,
      items:[
        {
          text: "データベースマイグレーション",
          link: "/v3/plugin/backend/migrate"
        },
        {
          text: "ユニットテスト",
          link: "/v3/plugin/backend/unit-test"
        },
      ]
    },
    {
      text:"フロントエンド開発",
      collapsed: false,
      items:[
        {
          text: "フロントエンド開発規約",
          link: "/v3/plugin/front/develop"
        }
      ]
    },
    {
      text:"アプリケーション公開",
      collapsed: true,
      items:[
        {
          text: "アプリケーションリリース",
          link: "/v3/plugin/develop/publish"
        },
        {
          text: "注意事項",
          link: "/v3/plugin/develop/question"
        }
      ]
    }
  ],
  '/libs/': createLibrarySidebar({
    title: '独立ライブラリ',
    overview: 'ライブラリ概要',
    currentVersion: '現在のバージョン'
  })
}

export default sidebar
