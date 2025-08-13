# セルレンダリングプラグイン

様々なセルレンダリングプラグインの使用方法を紹介します。組み込みプラグインとカスタムプラグインを含みます。

<DemoPreview dir="demos/ma-pro-table-examples/cell-render-plugins" />

## 機能特徴

- **プラグインメカニズム**: プラグインシステムでセルレンダリング機能を拡張
- **組み込みプラグイン**: よく使われるレンダリングプラグインを提供（タグ、プログレスバーなど）
- **カスタムプラグイン**: カスタムレンダリングプラグインの登録をサポート
- **柔軟な設定**: 動的な属性設定と条件付きレンダリングをサポート
- **コード再利用**: 同じレンダリングロジックの重複記述を回避

## 組み込みプラグイン

### タグプラグイン
```javascript
{
  label: '状態',
  prop: 'status',
  cellRenderTo: {
    name: 'tag',
    props: (data) => ({
      type: data.row.status === 1 ? 'success' : 'danger'
    })
  },
  formatter: (row) => row.status === 1 ? '在職中' : '退職'
}
```

## カスタムプラグイン

### プラグイン登録
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'
import { h } from 'vue'

const { addPlugin } = useProTableRenderPlugin()

// プログレスバープラグインを登録
addPlugin({
  name: 'progress',
  render: (data, props) => {
    return h(ElProgress, {
      percentage: data.row[data.column.property] || 0,
      color: props?.color || '#409eff',
      strokeWidth: props?.strokeWidth || 10,
      textInside: props?.textInside !== false,
      ...props
    })
  }
})
```

### カスタムプラグインの使用
```javascript
{
  label: '作業進捗',
  prop: 'progress',
  cellRenderTo: {
    name: 'progress',
    props: (data) => ({
      color: data.row.progress >= 90 ? '#67c23a' : '#e6a23c',
      strokeWidth: 12,
      textInside: true
    })
  }
}
```

## よく使われるプラグイン例

### 1. プログレスバープラグイン
```javascript
addPlugin({
  name: 'progress',
  render: (data, props) => {
    return h(ElProgress, {
      percentage: data.row[data.column.property] || 0,
      color: props?.color || '#409eff',
      strokeWidth: props?.strokeWidth || 10,
      textInside: props?.textInside !== false,
      ...props
    })
  }
})
```

### 2. 評価プラグイン
```javascript
addPlugin({
  name: 'rate',
  render: (data, props) => {
    return h(ElRate, {
      modelValue: data.row[data.column.property] || 0,
      disabled: true,
      showScore: props?.showScore !== false,
      scoreTemplate: props?.scoreTemplate || '{value} 点',
      ...props
    })
  }
})
```

### 3. 画像プラグイン
```javascript
addPlugin({
  name: 'image',
  render: (data, props) => {
    const src = data.row[data.column.property]
    if (!src) return '画像なし'
    
    return h(ElImage, {
      src,
      style: { width: '60px', height: '40px' },
      fit: 'cover',
      previewSrcList: [src],
      ...props
    })
  }
})
```

### 4. スイッチプラグイン
```javascript
addPlugin({
  name: 'switch',
  render: (data, props, proxy) => {
    return h(ElSwitch, {
      modelValue: !!data.row[data.column.property],
      onChange: (value) => {
        // スイッチ変更処理
        console.log(`${data.row.name} の状態が${value ? '有効' : '無効'}になりました`)
      },
      ...props
    })
  }
})
```

### 5. リンクプラグイン
```javascript
addPlugin({
  name: 'link',
  render: (data, props) => {
    const text = data.row[data.column.property]
    return h(ElLink, {
      type: props?.type || 'primary',
      href: props?.href || '#',
      target: props?.target || '_blank',
      onClick: () => {
        if (props?.onClick) {
          props.onClick(data)
        }
      },
      ...props
    }, {
      default: () => text
    })
  }
})
```

### 6. 複数タグプラグイン
```javascript
addPlugin({
  name: 'tags',
  render: (data, props) => {
    const tags = data.row[data.column.property] || []
    if (!Array.isArray(tags)) return 'タグなし'
    
    return h('div', tags.map((tag, index) => 
      h('el-tag', {
        key: index,
        size: 'small',
        type: props?.type || 'primary',
        style: 'margin-right: 4px; margin-bottom: 2px;',
        ...props
      }, {
        default: () => tag
      })
    ))
  }
})
```

## プラグイン使用例

### アバター表示
```javascript
{
  label: 'アバター',
  prop: 'avatar',
  width: 100,
  cellRenderTo: {
    name: 'image',
    props: {
      style: { width: '50px', height: '50px', borderRadius: '50%' }
    }
  }
}
```

### スキルタグ
```javascript
{
  label: 'スキルタグ',
  prop: 'skills',
  width: 200,
  cellRenderTo: {
    name: 'tags',
    props: {
      type: 'info'
    }
  }
}
```

### 能力評価
```javascript
{
  label: '能力評価',
  prop: 'rating',
  width: 150,
  cellRenderTo: {
    name: 'rate',
    props: {
      showScore: true,
      scoreTemplate: '{value} 点'
    }
  }
}
```

### 個人ホームページリンク
```javascript
{
  label: '個人ホームページ',
  prop: 'website',
  width: 120,
  cellRenderTo: {
    name: 'link',
    props: (data) => ({
      type: 'primary',
      href: data.row.website,
      target: '_blank',
      onClick: (linkData) => {
        console.log(`${linkData.row.name} のホームページにアクセス`)
      }
    })
  },
  formatter: () => 'ホームページへ'
}
```

## プラグイン管理

### プラグイン情報取得
```javascript
import { useProTableRenderPlugin } from '@mineadmin/pro-table'

const { getPlugins, getPluginByName, removePlugin } = useProTableRenderPlugin()

// 全てのプラグインを取得
const allPlugins = getPlugins()

// 特定のプラグインを取得
const tagPlugin = getPluginByName('tag')

// プラグインを削除
removePlugin('custom-plugin')
```

### プラグインパラメータ説明
```javascript
// プラグイン定義
interface MaProTableRenderPlugin {
  name: string                    // プラグイン名（ユニーク識別子）
  render: (                       // レンダリング関数
    data: TableColumnRenderer,    // テーブルデータと列情報
    props: any,                   // プラグインパラメータ
    proxy: MaProTableExpose       // テーブルインスタンス
  ) => VNode | string
}

// プラグイン使用
{
  cellRenderTo: {
    name: 'plugin-name',          // プラグイン名
    props: any | any[] | (data) => any  // プラグインパラメータ（動的計算をサポート）
  }
}
```

## ベストプラクティス

### 1. プラグイン命名
- 説明的な名前を使用（例: `progress`、`image`、`tags`）
- 組み込みプラグインとの重複を避ける
- アプリケーション市場に公開する場合はプレフィックスを推奨

### 2. パフォーマンス最適化
- render関数内で複雑な計算を避ける
- props関数で条件判断と属性計算を行う
- Vueのリアクティブ特性を適切に使用

### 3. エラー処理
```javascript
addPlugin({
  name: 'safe-plugin',
  render: (data, props) => {
    try {
      // プラグインロジック
      return h(SomeComponent, props)
    } catch (error) {
      console.error('プラグインレンダリングエラー:', error)
      return 'レンダリングエラー'
    }
  }
})
```

### 4. タイプセーフ
```typescript
// TypeScriptプラグイン定義
import type { MaProTableRenderPlugin } from '@mineadmin/pro-table'

const myPlugin: MaProTableRenderPlugin = {
  name: 'my-plugin',
  render: (data, props) => {
    // タイプセーフなプラグインロジック
    return h('div', data.row[data.column.property])
  }
}
```

セルレンダリングプラグインシステムは強力な拡張機能を提供し、リッチなテーブル表示効果を簡単に構築できます。