# サービスプロバイダー

## 概要

### コアな役割
サービスプロバイダー（Provider）は、MineAdmin 3.0 フロントエンドアーキテクチャの主要機能の一つであり、バックエンドのサービスプロバイダーの設計思想を借鉴し、フロントエンドアプリケーションにモジュール化されたサービス登録と管理メカニズムを提供します。

::: tip 主な機能
- **グローバルサービス登録**: サービスを Vue の `globalProperties` または `provide/inject` システムに登録
- **コンポーネント初期化**: グローバルコンポーネントの自動初期化と設定
- **プラグイン設定管理**: プラグインのデフォルト設定とパラメータ管理を提供
- **依存性注入**: サービス間の依存関係管理を実現
- **モジュール化アーキテクチャ**: 機能モジュールごとにサービスを整理することをサポート
:::

### 初期化順序
::: danger 重要なお知らせ
サービスプロバイダーはアプリケーション初期化の早期段階でロードされ、`pinia`、`vue-router`、`vue-i18n` などのライブラリの初期化**よりも前に**実行されます。そのため、サービスプロバイダー内ではこれらのライブラリの機能を直接使用することはできません。

**初期化順序**:
1. サービスプロバイダーのスキャンと登録 ⚡
2. Pinia 状態管理の初期化
3. Vue Router ルーティングの初期化
4. Vue I18n 国際化の初期化
5. アプリケーション本体の起動
:::

## アーキテクチャ設計

### ディレクトリ構造
```
src/provider/
├── dictionary/          # 辞書サービスプロバイダー
│   ├── index.ts        # サービスプロバイダーのメインファイル
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
システム起動時に `src/provider/` ディレクトリ配下のすべてのサブディレクトリが自動的にスキャンされ、各サブディレクトリの `index.ts` ファイルがサービスプロバイダーとして認識され、自動登録されます。

## システム組み込みサービス

### Dictionary（辞書サービス）

**機能説明**: 統一的にデータ辞書を管理する機能を提供し、多言語とテーマ配色に対応します。

**ソースコードの場所**: 
- GitHub: [src/provider/dictionary/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/dictionary)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/dictionary/`

**主な特徴**:
- 多言語国際化識別子に対応
- 組み込みテーマカラーシステム
- 自動型推論
- リアクティブなデータ更新

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
// コンポーネントで辞書データを使用する
import { useDictionary } from '@/composables/useDictionary'

const { getDictionary } = useDictionary()
const statusDict = getDictionary('system-status')
```

### ECharts（チャートサービス）

**機能説明**: ECharts チャートライブラリの初期化、設定、テーマ管理機能を提供します。

**ソースコードの場所**:
- GitHub: [src/provider/echarts/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/echarts)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/echarts/`

**主な特徴**:
- チャートコンポーネントの必要な時だけのインポートにより、バンドルサイズを削減
- システムテーマ（ライト/ダークモード）への自動適応
- Vue へのグローバルインスタンス登録
- リアクティブなチャートサイズ調整

**使用方法**:
```ts
// コンポーネントで ECharts インスタンスを取得する
import { useGlobal } from '@/composables/useGlobal'

const { $echarts } = useGlobal()

// チャートの初期化
const chartInstance = $echarts.init(chartRef.value)
```

参考コンポーネント: [MaEcharts](/v3/front/component/ma-echarts)

### Plugins（プラグイン設定サービス）

**機能説明**: MineAdmin プラグインシステムにデフォルト設定を提供し、プラグインパラメータの統一的な設定と管理をサポートします。

**ソースコードの場所**:
- GitHub: [src/provider/plugins/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/plugins)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/plugins/`

**主な特徴**:
- プラグイン設定の集中管理
- デフォルトパラメータの登録
- 設定のホットリロード対応
- プラグイン依存関係の管理

参考ドキュメント: [プラグインシステム](/v3/front/high/plugins)

### MineCore（コアコンポーネントサービス）

**機能説明**: MineAdmin のコアコンポーネントライブラリを初期化し、グローバル設定とコンポーネント登録サービスを提供します。

**ソースコードの場所**:
- GitHub: [src/provider/mine-core/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/mine-core)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/mine-core/`

**管理対象コンポーネント**:
- `ma-table` - データテーブルコンポーネント
- `ma-search` - 検索フォームコンポーネント
- `ma-form` - フォームコンポーネント
- `ma-pro-table` - 拡張テーブルコンポーネント

**使用方法**:
```ts
import { useGlobal } from '@/composables/useGlobal'

const { $mineCore } = useGlobal()
const tableConfig = $mineCore.table
```

### Settings（システム設定サービス）

**機能説明**: フロントエンドアプリケーションのグローバル設定パラメータを管理し、開発環境と本番環境の設定分離をサポートします。

**ソースコードの場所**:
- GitHub: [src/provider/settings/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider/settings)
- ローカル: `/Users/zhuzhu/project/mineadmin/web/src/provider/settings/`

**設定ファイル**:
- `index.ts` - デフォルト設定（直接編集しないでください）
- `settings.config.ts` - ユーザー定義設定ファイル

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

### 基本的なサービスプロバイダーの作成

**ステップ 1**: サービスディレクトリの作成
```bash
mkdir src/provider/my-service
```

**ステップ 2**: サービスプロバイダーファイルの作成 (`src/provider/my-service/index.ts`)
```ts
import type { App } from 'vue'
import type { ProviderService } from '#/global'

// サービスインターフェースの定義
interface MyService {
  version: string
  getName: () => string
  setConfig: (config: any) => void
}

const provider: ProviderService.Provider<MyService> = {
  name: 'myService',
  
  init() {
    console.log('MyService を初期化中...')
  },
  
  setProvider(app: App) {
    const service: MyService = {
      version: '1.0.0',
      getName: () => 'My Custom Service',
      setConfig: (config) => {
        console.log('設定が更新されました:', config)
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

### 設定付きの高度なサービスプロバイダーの作成

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
        // リクエストロジックの実装
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
    // 外部依存ライブラリをロードするロジック
  }
}

export default provider
```

### サービスプロバイダーの使用

**Vue コンポーネント内で使用**:
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

// 設定の更新
$myService.setConfig({ theme: 'dark' })
</script>
```

**Composable 内で使用**:
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
- サービスプロバイダー名は **camelCase** 形式を使用
- ディレクトリ名は **kebab-case** 形式を使用
- グローバルプロパティは `$` プレフィックスを使用

### 2. 型安全性
```ts
// グローバルプロパティの型を拡張
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

### 4. エラーハンドリング
```ts
setProvider(app: App) {
  try {
    // サービス初期化ロジック
    app.config.globalProperties.$service = createService()
  } catch (error) {
    console.error(`サービス ${this.name} の初期化に失敗しました:`, error)
    // フォールバックプランを提供
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
対応するサービスプロバイダーのディレクトリを削除するだけです：
```bash
rm -rf src/provider/unwanted-service
```

### サービスプロバイダーのデバッグ
```ts
const provider: ProviderService.Provider = {
  name: 'debugService',
  
  init() {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Provider] ${this.name} の初期化が完了しました`)
    }
  },
  
  setProvider(app: App) {
    // 開発環境でデバッグ情報を追加
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
| サービスが登録されない | `index.ts` ファイルがない、または必要なインターフェースが実装されていない | ファイルの存在とインターフェースの実装を確認 |
| Pinia が使用できない | サービスプロバイダーの初期化が Pinia より先に行われる | Pinia 関連のロジックをコンポーネントまたは Composable に移動 |
| サービスの依存競合 | 循環依存または依存順序の誤り | 依存関係を再設計するか、イベントバスを使用 |
| 型推論エラー | グローバルプロパティの型が正しく拡張されていない | TypeScript モジュール宣言を追加 |
| ホットリロードが無効 | サービスのキャッシュ問題 | 開発サーバーを再起動 |

## 関連リソース

**ソースコード参照**:
- GitHub リポジトリ: [MineAdmin ソースコード](https://github.com/mineadmin/mineadmin)
- サービスプロバイダーディレクトリ: [web/src/provider/](https://github.com/mineadmin/mineadmin/tree/master/web/src/provider)
- ローカルソースコード: `/Users/zhuzhu/project/mineadmin/web/src/provider/`

**関連ドキュメント**:
- [プラグインシステム](/v3/front/high/plugins)
- [MaEcharts コンポーネント](/v3/front/component/ma-echarts)