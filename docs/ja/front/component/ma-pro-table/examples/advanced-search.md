# 高度な検索

複数の検索コンポーネントタイプと複雑な検索ロジックを表示し、日付範囲、数値範囲、複数選択などの機能を含みます。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

## 機能特徴

- **豊富な検索コンポーネント**: input、select、date-range、slider、checkboxなどをサポート
- **複数条件の組み合わせ**: 複雑な検索条件の組み合わせをサポート
- **検索イベント**: 検索の送信とリセットイベントを監視可能
- **デフォルト展開**: デフォルトで表示する検索項目数を設定可能
- **レスポンシブレイアウト**: 検索フォームがレスポンシブレイアウトをサポート

## 検索コンポーネントタイプ

### 基本入力コンポーネント
```javascript
{
  label: '名前',
  prop: 'name',
  render: 'input',
  renderProps: {
    placeholder: '名前を入力してください',
    clearable: true
  }
}
```

### セレクターコンポーネント
```javascript
// 単一選択
{
  label: '部門',
  prop: 'department',
  render: 'select',
  options: [
    { label: '技術部', value: '技術部' },
    { label: '製品部', value: '製品部' }
  ],
  renderProps: {
    placeholder: '部門を選択してください'
  }
}

// 複数選択
{
  label: '部門',
  prop: 'departments',
  render: 'select',
  options: [
    { label: '技術部', value: '技術部' },
    { label: '製品部', value: '製品部' },
    { label: 'デザイン部', value: 'デザイン部' }
  ],
  renderProps: {
    multiple: true,
    placeholder: '部門を選択してください'
  }
}
```

### 数値範囲コンポーネント
```javascript
{
  label: '給与範囲',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="最低給与"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="最高給与"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
    </div>
  ),
  span: 2
}
```

### 日付範囲コンポーネント
```javascript
{
  label: '入社日',
  prop: 'joinDateRange',
  render: 'date-picker',
  renderProps: {
    type: 'daterange',
    startPlaceholder: '開始日',
    endPlaceholder: '終了日',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD'
  }
}
```

### スライダーコンポーネント
```javascript
{
  label: '職務経験',
  prop: 'experience',
  render: 'slider',
  renderProps: {
    min: 0,
    max: 15,
    range: true,
    marks: {
      0: '0年',
      5: '5年',
      10: '10年',
      15: '15年+'
    }
  }
}
```

### チェックボックスグループコンポーネント
```javascript
{
  label: '職位等級',
  prop: 'level',
  render: 'checkbox-group',
  options: [
    { label: 'P4', value: 'P4' },
    { label: 'P5', value: 'P5' },
    { label: 'P6', value: 'P6' },
    { label: 'P7', value: 'P7' },
    { label: 'P8', value: 'P8' },
    { label: 'P9', value: 'P9' }
  ]
}
```

### ラジオボタングループコンポーネント
```javascript
{
  label: '在職状態',
  prop: 'status',
  render: 'radio-group',
  options: [
    { label: 'すべて', value: '' },
    { label: '在職中', value: 1 },
    { label: '退職', value: 0 }
  ]
}
```

## カスタムレンダリングコンポーネント

### JSXカスタムレンダリング
複雑な入力コンポーネントにはJSXを使用してカスタムレンダリングできます:

```javascript
// script setupでリアクティブデータを追加する必要があります
const formData = reactive({
  salaryMin: undefined,
  salaryMax: undefined
})

// 検索項目設定
{
  label: '給与範囲',
  prop: 'salaryRange',
  render: () => (
    <div style="display: flex; gap: 8px; align-items: center;">
      <el-input-number
        v-model={formData.salaryMin}
        placeholder="最低給与"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
      <span>-</span>
      <el-input-number
        v-model={formData.salaryMax}
        placeholder="最高給与"
        min={0}
        max={100000}
        controls-position="right"
        style="width: 140px;"
      />
    </div>
  ),
  span: 2  // 2列の幅を占有
}
```

### コンポーネント設定ポイント
- `options`配列は検索項目に直接設定し、`renderProps`内にネストする必要はありません
- `renderProps`はコンポーネントの他の属性（placeholder、multipleなど）を設定するために使用します
- カスタムJSXレンダリングはリアクティブデータと併用する必要があります
- `span`属性を使用してフォーム項目が占有する列数を制御します

## 検索設定

### 表示制御
```javascript
const options = {
  searchOptions: {
    showNumber: 3,      // デフォルトで3つの検索項目を表示
    layout: 'auto'      // レイアウトモード: auto/inline/vertical
  }
}
```

### 検索イベント
```javascript
const options = {
  onSearchSubmit: (form) => {
    console.log('検索条件:', form)
    // 検索条件を前処理できます
    return form
  },
  onSearchReset: (form) => {
    console.log('検索をリセット')
    return form
  }
}
```

## 高度なテーブル列

### 進捗バー表示
```javascript
{
  label: '業績評価',
  prop: 'performance',
  width: 120,
  cellRender: ({ row }) => (
    <el-progress 
      percentage={row.performance} 
      color={row.performance >= 90 ? '#67c23a' : '#e6a23c'}
      stroke-width={8}
      text-inside
    />
  )
}
```

### 複数タグ表示
```javascript
{
  label: 'スキルタグ',
  prop: 'skills',
  width: 200,
  cellRender: ({ row }) => (
    <div>
      {row.skills.map((skill, index) => (
        <el-tag key={index} size="small" style="margin-right: 4px;">
          {skill}
        </el-tag>
      ))}
    </div>
  )
}
```

### 条件付き操作
```javascript
{
  type: 'operation',
  operationConfigure: {
    type: 'auto',
    fold: 2,               // 2つ以上の操作がある場合折りたたみ
    actions: [
      {
        name: 'promote',
        text: '昇進',
        show: (data) => data.row.performance >= 85,  // 条件付き表示
        onClick: (data) => {
          console.log('昇進社員:', data.row.name)
        }
      }
    ]
  }
}
```

高度な検索機能により、さまざまな業務シナリオの検索ニーズを満たす複雑なクエリインターフェースを構築できます。