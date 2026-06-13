# 高度検索

複数の検索コンポーネントタイプと複雑な検索ロジックを表示します。日付範囲、数値範囲、複数選択などの機能を含みます。

<DemoPreview dir="demos/ma-pro-table-examples/advanced-search" />

## 機能特徴

- **豊富な検索コンポーネント**：input、select、date-range、slider、checkbox などをサポート
- **複数条件の組み合わせ**：複雑な検索条件の組み合わせをサポート
- **検索イベント**：検索送信イベントとリセットイベントをリッスン可能
- **デフォルト展開**：デフォルトで表示する検索項目数を設定可能
- **レスポンシブレイアウト**：検索フォームはレスポンシブレイアウトに対応

## 検索コンポーネントのタイプ

### 基本入力コンポーネント

```javascript
{
  label: '氏名',
  prop: 'name',
  render: 'input',
  renderProps: {
    placeholder: '氏名を入力してください',
    clearable: true
  }
}
```

### セレクターコンポーネント

```javascript
// 単一選択
{
  label: '部署',
  prop: 'department',
  render: 'select',
  options: [
    { label: '技術部', value: '技術部' },
    { label: '製品部', value: '製品部' }
  ],
  renderProps: {
    placeholder: '部署を選択してください'
  }
}

// 複数選択
{
  label: '部署',
  prop: 'departments',
  render: 'select',
  options: [
    { label: '技術部', value: '技術部' },
    { label: '製品部', value: '製品部' },
    { label: 'デザイン部', value: 'デザイン部' }
  ],
  renderProps: {
    multiple: true,
    placeholder: '部署を選択してください'
  }
}
```

### 数値範囲コンポーネント

`children`方式を使用するには `"@mineadmin/form": "^1.0.53"` バージョンが必要です

```javascript
{
  label: '給与範囲',
  prop: 'salaryRange',
  render: () => <div class="!p-0 flex gap-2 w-full" />,
  children: [
    {
      prop: 'salaryMin',
      render: 'InputNumber',
      renderProps: {
        controlsPosition: 'right',
        placeholder: '最低給与',
      },
      cols: { md: 12, xs: 24 },
    },
    {
      prop: 'salaryMax',
      render: 'InputNumber',
      renderProps: {
        controlsPosition: 'right',
        placeholder: '最高給与',
      },
      cols: { md: 12, xs: 24 },
    },
  ],
},
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
  label: '業務経験',
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
      15: '15年以上'
    }
  }
}
```

### チェックボックスグループコンポーネント

```javascript
{
  label: '職位',
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
  label: '在職状況',
  prop: 'status',
  render: 'radio-group',
  options: [
    { label: '全て', value: '' },
    { label: '在職中', value: 1 },
    { label: '退職済み', value: 0 }
  ]
}
```

## カスタムレンダリングコンポーネント

### JSXカスタムレンダリング

複雑な入力コンポーネントには、JSXを使用したカスタムレンダリングが可能です：

```javascript
// script setup にリアクティブデータを追加する必要があります
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
  span: 2  // 2列分の幅を占有
}
```

### コンポーネント設定のポイント

- `options` 配列は検索項目内に直接設定し、`renderProps` 内にネストする必要はありません
- `renderProps` はコンポーネントのその他の属性（placeholder、multiple など）の設定に使用します
- カスタムJSXレンダリングはリアクティブデータと組み合わせて使用する必要があります
- `span` 属性を使用してフォーム項目が占める列数を制御します

## 検索設定

### 表示制御

```javascript
const options = {
  searchOptions: {
    showNumber: 3, // デフォルトで3つの検索項目を表示
    layout: "auto", // レイアウトモード：auto/inline/vertical
  },
};
```

### 検索イベント

```javascript
const options = {
  onSearchSubmit: (form) => {
    console.log("検索条件:", form);
    // 検索条件の前処理が可能
    return form;
  },
  onSearchReset: (form) => {
    console.log("検索をリセット");
    return form;
  },
};
```

## 高度なテーブル列

### プログレスバー表示

```javascript
{
  label: 'パフォーマンス評価',
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
    fold: 2,               // 2つ以上の操作で折りたたみ
    actions: [
      {
        name: 'promote',
        text: '昇格',
        show: (data) => data.row.performance >= 85,  // 条件表示
        onClick: (data) => {
          console.log('社員を昇格:', data.row.name)
        }
      }
    ]
  }
}
```

高度な検索機能により、複雑なクエリインターフェースを構築し、様々なビジネスシナリオの検索要件を満たすことができます。