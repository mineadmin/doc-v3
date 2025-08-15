# サービスプロバイダー

## 概要

### コア機能
サービスプロバイダー（Provider）は MineAdmin 3.0 フロントエンドアーキテクチャのコア機能の一つで、バックエンドのサービスプロバイダーデザインを参考にし、フロントエンドアプリケーションにモジュール化されたサービス登録と管理メカニズムを提供します。

::: tip 主な機能
- **グローバルサービス登録**: サービスを Vue の `globalProperties` または `provide/inject` システムに登録
- **コンポーネント初期化**: グローバルコンポーネントの自動初期化と設定
- **プラグイン設定管理**: プラグインのデフォルト設定とパラメータ管理を提供
- **依存性注入**: サービス間の依存関係管理を実現
- **モジュール化アーキテクチャ**: 機能モジュールごとにサービスを組織化することをサポート
:::

### 初期化順序
::: danger 重要事項
サービスプロバイダーはアプリケーション初期化の早い段階でロードされ、`pinia`、`vue-router`、`vue-i18n` などのライブラリの初期化**よりも前**に行われます。そのため、サービスプロバイダー内ではこれらのライブラリの機能を直接使用できません。

**初期化順序**:
1. サービスプロバイダースキャンと登録 ⚡
2. Pinia 状態管理初期化
3. Vue Router ルーティング初期化
4. Vue I18n 国際化初期化
5. アプリケーション本体起動
:::

## アーキテクチャ設計

### ディレクトリ構造
```
src/provider/
├── dictionary/          # 辞書サービスプロバイダー
│   ├── index.ts        # サービスプロバイダーメインファイル
│   └── data/           # 辞書データファイル
├── echarts/            # チャートサービスプロバイダー
│   └── index.ts
├── plugins/            # プラグイン設定サービスプロバイダー
│   └── index.ts
├── mine-core/          # コアコンポーネントサービスプロバイダー
│   └── index.ts
├── settings/           # システム設定サービスプロバイダー
│   ├── index.ts
│   └── settings.config.ts
└── toolbars/           # ツールバーサービスプロバイダー
    └── index.ts
```

### 自動検出メカニズム
システム起動時に `src/provider/` ディレクトリ内のすべてのサブディレクトリを自動スキャンし、各サブディレクトリの `index.ts` ファイルがサービスプロバイダーとして認識され、自動登録されます。

## システム組み込みサービス

### Dictionary（辞書サービス）

**機能説明**: 統一されたデータ辞書管理機能を提供し、多言語とテーマカラーをサポートします。

**ソースコード場所**: 
- GitHub: [src/provider/dictionary/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/dictionary)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/dictionary/`

**コア機能**:
- 多言語国際化識別子のサポート
- 組み込みテーマカラーシステム
- 自動型推論
- リアクティブデータ更新

**辞書データ例** (`src/provider/dictionary/data/system-status.ts`):
```ts
import type { Dictionary } from '#/global'

export default [
  { 
    label: '有効', 
    value: 1, 
    i18n: 'dictionary.system.statusEnabled', 
    color: 'primary' 
  },
  { 
    label: '無効', 
    value: 2, 
    i18n: 'dictionary.system.statusDisabled', 
    color: 'danger' 
  },
] as Dictionary[]
```

**使用方法**:
```ts
// コンポーネント内で辞書データを使用
import { useDictionary } from '@/composables/useDictionary'

const { getDictionary } = useDictionary()
const statusDict = getDictionary('system-status')
```

### ECharts（チャートサービス）

**機能説明**: ECharts チャートライブラリの初期化、設定、テーマ管理機能を提供します。

**ソースコード場所**:
- GitHub: [src/provider/echarts/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/echarts)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/echarts/`

**コア機能**:
- 必要なチャートコンポーネントのみをインポートし、バンドルサイズを削減
- システムテーマ（明暗モード）への自動適応
- Vue へのグローバルインスタンス登録
- リアクティブなチャートサイズ調整

**使用方法**:
```ts
// コンポーネント内で ECharts インスタンスを取得
import { useGlobal } from '@/composables/useGlobal'

const { $echarts } = useGlobal()

// チャート初期化
const chartInstance = $echarts.init(chartRef.value)
```

参考コンポーネント: [MaEcharts](/front/component/ma-echarts)

### Plugins（プラグイン設定サービス）

**機能説明**: MineAdmin プラグインシステムにデフォルト設定管理を提供し、プラグインパラメータの統一設定と管理をサポートします。

**ソースコード場所**:
- GitHub: [src/provider/plugins/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/plugins)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/plugins/`

**コア機能**:
- プラグイン設定の集中管理
- デフォルトパラメータ登録
- 設定のホットアップデートサポート
- プラグイン依存関係管理

参考ドキュメント: [プラグインシステム](/front/high/plugins)

### MineCore（コアコンポーネントサービス）

**機能説明**: MineAdmin コアコンポーネントライブラリを初期化し、グローバル設定とコンポーネント登録サービスを提供します。

**ソースコード場所**:
- GitHub: [src/provider/mine-core/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/mine-core)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/mine-core/`

**管理するコンポーネント**:
- `ma-table` - データテーブルコンポーネント
- `ma-search` - 検索フォームコンポーネント
- `ma-form` - フォームコンポーネント
- `ma-pro-table` - 高度なテーブルコンポーネント

**使用方法**:
```ts
import { useGlobal } from '@/composables/useGlobal'

const { $mineCore } = useGlobal()
const tableConfig = $mineCore.table
```

### Settings（システム設定サービス）

**機能説明**: フロントエンドアプリケーションのグローバル設定パラメータ管理を提供し、開発環境と本番環境の設定分離をサポートします。

**ソースコード場所**:
- GitHub: [src/provider/settings/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/settings)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/settings/`

**設定ファイル**:
- `index.ts` - デフォルト設定（直接編集不可）
- `settings.config.ts` - ユーザーカスタム設定ファイル

**設定例**:
```ts
// settings.config.ts
export default {
  // システム基本設定
  app: {
    name: 'MineAdmin',
    version: '3.0.0',
    logo: '/logo.png'
  },
  // API 設定
  api: {
    baseUrl: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:9501' 
      : 'https://api.example.com',
    timeout: 10000
  },
  // テーマ設定
  theme: {
    primaryColor: '#409eff',
    darkMode: 'auto'
  }
}
```

## 開発ガイド

### 基本サービスプロバイダーの作成

**ステップ 1**: サービスディレクトリ作成
```bash
mkdir src/provider/my-service
```

**ステップ 2**: サービスプロバイダーファイル作成 (`src/provider/my-service/index.ts`)
```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// サービスインターフェース定義
interface MyService {
  version: string
  getName: () => string
  setConfig: (config: any) => void
}

const provider: ProviderService.Provider<MyService> = {
  name: 'myService',
  
  init() {
    console.log('MyService 初期化中...')
  },
  
  setProvider(app: App) {
    const service: MyService = {
      version: '1.0.0',
      getName: () => 'My Custom Service',
      setConfig: (config) => {
        console.log('設定更新:', config)
      }
    }
    
    // グローバルプロパティに登録
    app.config.globalProperties.$myService = service
    
    // または provide/inject を使用
    app.provide('myService', service)
  },
  
  getProvider() {
    return useGlobal().$myService
  }
}

export default provider
```

### 設定付き高度なサービスプロバイダーの作成

```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// サービス設定インターフェース
interface ServiceConfig {
  apiUrl: string
  timeout: number
  retries: number
}

// サービスインスタンスインターフェース
interface AdvancedService {
  config: ServiceConfig
  request: (url: string) => Promise<any>
  updateConfig: (newConfig: Partial<ServiceConfig>) => void
}

const provider: ProviderService.Provider<AdvancedService> = {
  name: 'advancedService',
  
  config: {
    enabled: true,
    priority: 10,
    dependencies: ['settings'] // settings サービスに依存
  },
  
  async init() {
    // 非同期初期化ロジック
    await this.loadExternalLibrary()
  },
  
  setProvider(app: App) {
    const defaultConfig: ServiceConfig = {
      apiUrl: '/api/v1',
      timeout: 5000,
      retries: 3
    }
    
    const service: AdvancedService = {
      config: { ...defaultConfig },
      
      async request(url: string) {
        // リクエストロジック実装
        return fetch(`${this.config.apiUrl}${url}`, {
          timeout: this.config.timeout
        })
      },
      
      updateConfig(newConfig) {
        Object.assign(this.config, newConfig)
      }
    }
    
    app.config.globalProperties.$advancedService = service
  },
  
  getProvider() {
    return useGlobal().$advancedService
  },
  
  async loadExternalLibrary() {
    // 外部ライブラリ読み込みロジック
  }
}

export default provider
```

### サービスプロバイダーの使用

**Vue コンポーネント内での使用**:
```vue
<template>
  <div>
    <h3>{{ serviceName }}</h3>
    <p>バージョン: {{ version }}</p>
  </div>
</template>

<script setup lang="ts">
import { useGlobal } from '@/composables/useGlobal'

const { $myService } = useGlobal()

const serviceName = $myService.getName()
const version = $myService.version

// 設定更新
$myService.setConfig({ theme: 'dark' })
</script>
```

**Composable 内での使用**:
```ts
// composables/useMyService.ts
import { useGlobal } from '@/composables/useGlobal'

export function useMyService() {
  const { $myService } = useGlobal()
  
  const updateServiceConfig = (config: any) => {
    $myService.setConfig(config)
  }
  
  return {
    service: $myService,
    updateServiceConfig
  }
}
```

## ベストプラクティス

### 1. 命名規則
- サービスプロバイダー名は **camelCase** 形式
- ディレクトリ名は **kebab-case** 形式
- グローバルプロパティは `$` プレフィックスを使用

### 2. 型安全性
```ts
// グローバルプロパティ型を拡張
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $myService: MyService
  }
}
```

### 3. 依存関係管理
```ts
const provider: ProviderService.Provider = {
  name: 'dependentService',
  config: {
    dependencies: ['settings', 'dictionary']
  },
  // ...その他の設定
}
```

### 4. エラー処理
```ts
setProvider(app: App) {
  try {
    // サービス初期化ロジック
    app.config.globalProperties.$service = createService()
  } catch (error) {
    console.error(`サービス ${this.name} 初期化失敗:`, error)
    // フォールバックソリューション提供
    app.config.globalProperties.$service = createFallbackService()
  }
}
```

## サービス管理

### サービスプロバイダーの無効化
```ts
const provider: ProviderService.Provider = {
  name: 'optionalService',
  config: {
    enabled: false // このサービスを無効化
  },
  // ...その他の設定
}
```

### サービスプロバイダーの削除
対応するサービスプロバイダーディレクトリを削除:
```bash
rm -rf src/provider/unwanted-service
```

### サービスプロバイダーのデバッグ
```ts
const provider: ProviderService.Provider = {
  name: 'debugService',
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Provider] ${this.name} 初期化完了`)
    }
  },
  
  setProvider(app: App) {
    // 開発環境下でデバッグ情報を追加
    if (process.env.NODE_ENV === 'development') {
      window.__DEBUG_PROVIDERS__ = window.__DEBUG_PROVIDERS__ || {}
      window.__DEBUG_PROVIDERS__[this.name] = this
    }
    
    // 通常のサービス登録ロジック
  }
}
```

## よくある質問

| 問題 | 原因 | 解決策 |
|------|------|----------|
| サービス登録失敗 | `index.ts` ファイルがないか、必要なインターフェース未実装 | ファイルの存在とインターフェース実装を確認 |
| Pinia 使用不可 | サービスプロバイダー初期化が Pinia より早い | Pinia 関連ロジックをコンポーネントまたは Composable に移動 |
| サービス依存関係衝突 | 循環依存または依存順序エラー | 依存関係を再設計するか、イベントバスを使用 |
| 型推論エラー | グローバルプロパティ型が正しく拡張されていない | TypeScript モジュール宣言を追加 |
| ホットアップデート失敗 | サービスキャッシュ問題 | 開発サーバーを再起動 |

## 関連リソース

**ソースコード参考**:
- GitHub リポジトリ: [MineAdmin ソースコード](https://github.com/mineadmin/mineadmin)
- サービスプロバイダーディレクトリ: [web/src/provider/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider)
- ローカルソースコード: `/Users/zhuzhu/project/mineadmin/web/src/provider/`

**関連ドキュメント**:
- [プラグインシステム](/front/high/plugins)
- [MaEcharts コンポーネント](/front/component/ma-echarts)