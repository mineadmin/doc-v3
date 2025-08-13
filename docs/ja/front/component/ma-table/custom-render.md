# カスタムレンダリング

セルとヘッダーのカスタムレンダリングに `cellRender` と `headerRender` を使用する方法を紹介します。

## カスタムレンダリングデモ

<DemoPreview dir="demos/ma-table/custom-render" />

## 機能特徴

### レンダリングタイプ
- **セルレンダリング**: `cellRender` でセル内容をカスタマイズ
- **ヘッダーレンダリング**: `headerRender` でヘッダー内容をカスタマイズ
- **JSX構文**: JSX と TSX 構文でレンダリング関数を記述可能
- **コンポーネントレンダリング**: 任意の Vue コンポーネントをレンダリング可能

### レンダリングパラメータ
レンダリング関数は `TableColumnRenderer` パラメータを受け取ります:
- `row`: 現在の行データ
- `column`: 現在の列設定
- `$index`: 現在の行インデックス
- `options`: 列オプション設定
- `attrs`: その他の属性

## 設定例

### 基本セルレンダリング
```javascript
const columns = [
  { 
    label: 'アバター', 
    prop: 'avatar',
    cellRender: ({ row }) => (
      <el-image
        style="width: 40px; height: 40px; border-radius: 50%;"
        src={row.avatar}
        fit="cover"
      />
    )
  }
]
```

### プログレスバーレンダリング
```javascript
const columns = [
  { 
    label: 'スキルレベル', 
    prop: 'skillLevel',
    cellRender: ({ row }) => (
      <el-progress
        percentage={row.skillLevel}
        color={row.skillLevel >= 80 ? '#67c23a' : '#e6a23c'}
        stroke-width={8}
        text-inside
      />
    )
  }
]
```

### カスタムヘッダー
```javascript
const columns = [
  { 
    label: 'スキルレベル', 
    prop: 'skillLevel',
    headerRender: () => (
      <div style="display: flex; align-items: center; gap: 4px;">
        <span>⚡</span>
        <span style="color: #e74c3c;">スキルレベル</span>
      </div>
    )
  }
]
```

### 操作ボタングループ
```javascript
const columns = [
  { 
    label: '操作', 
    prop: 'actions',
    cellRender: ({ row }) => (
      <div style="display: flex; gap: 8px;">
        <el-button size="small" type="primary" onClick={() => handleEdit(row)}>
          編集
        </el-button>
        <el-button size="small" type="danger" onClick={() => handleDelete(row)}>
          削除
        </el-button>
      </div>
    )
  }
]
```

### ステータスタグレンダリング
```javascript
const columns = [
  { 
    label: 'ステータス', 
    prop: 'status',
    cellRender: ({ row }) => {
      const statusConfig = {
        'online': { type: 'success', icon: '🟢', text: 'オンライン' },
        'busy': { type: 'warning', icon: '🟡', text: '忙しい' },
        'offline': { type: 'danger', icon: '🔴', text: 'オフライン' }
      }
      const config = statusConfig[row.status]
      return (
        <el-tag type={config.type}>
          <span style="margin-right: 4px;">{config.icon}</span>
          {config.text}
        </el-tag>
      )
    }
  }
]
```

### 複雑な内容レンダリング
```javascript
const columns = [
  { 
    label: 'ユーザー情報', 
    prop: 'userInfo',
    cellRender: ({ row }) => (
      <div style="display: flex; align-items: center; gap: 12px;">
        <el-avatar size={40} src={row.avatar}>
          {row.name.charAt(0)}
        </el-avatar>
        <div>
          <div style="font-weight: bold; color: #333;">
            {row.name}
          </div>
          <div style="font-size: 12px; color: #999;">
            {row.email}
          </div>
        </div>
      </div>
    )
  }
]
```

### 評価コンポーネントレンダリング
```javascript
const columns = [
  { 
    label: '評価', 
    prop: 'rating',
    cellRender: ({ row }) => (
      <el-rate
        v-model={row.rating}
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value} 点"
      />
    )
  }
]
```

## レンダリング関数型定義

```typescript
interface TableColumnRenderer {
  row: any              // 現在の行データ
  column: TableColumn   // 現在の列設定  
  $index: number        // 現在の行インデックス
  options: TableColumn  // 列オプション
  attrs: any            // その他の属性
}

type CellRenderFunction = (data: TableColumnRenderer) => VNode | string
type HeaderRenderFunction = (data: TableColumnRenderer) => VNode | string
```

## ベストプラクティス

1. **パフォーマンス考慮**: レンダリング関数での複雑な計算は避け、データ処理段階で前処理することを推奨
2. **イベント処理**: レンダリング関数内のイベントハンドラはコンポーネント外部で定義し、重複作成を回避
3. **スタイル制御**: インラインスタイルまたはCSSクラスを使用してレンダリング内容のスタイルを制御
4. **コンポーネント再利用**: 複雑なレンダリングロジックは独立したコンポーネントとして抽出して再利用
5. **型安全**: TypeScriptプロジェクトでは、レンダリング関数のパラメータに型注釈を追加することを推奨

## 注意事項

- レンダリング関数の戻り値は VNode、文字列、またはコンポーネント
- すべての Element Plus コンポーネントのレンダリングをサポート
- レンダリング関数内で行データにアクセスして変更可能
- レンダリング関数内のイベントは手動で処理する必要あり
- より良い開発体験のために JSX/TSX 構文を使用することを推奨