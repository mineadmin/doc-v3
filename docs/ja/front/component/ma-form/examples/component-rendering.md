# コンポーネントレンダリング

MaFormがサポートするすべてのElement Plusコンポーネントのレンダリング方法を展示します。入力類、選択類、日付類、特殊コンポーネントを含みます。

<DemoPreview dir="demos/ma-form/component-rendering" />

## 機能特徴

- **全面的なサポート**: すべてのElement Plusフォームコンポーネントをサポート
- **複数のレンダリング方法**: 文字列、コンポーネント、関数の3種類のレンダリング方法
- **スロットサポート**: 完全なスロットシステムをサポート
- **プロパティ伝達**: renderPropsを通じてコンポーネントプロパティを伝達
- **イベント処理**: コンポーネントのすべてのネイティブイベントをサポート

## 入力類コンポーネント

### Input 入力ボックス
```typescript
{
  label: 'ユーザー名',
  prop: 'username',
  render: 'input',
  renderProps: {
    placeholder: 'ユーザー名を入力してください',
    clearable: true,
    prefixIcon: 'User',
    maxlength: 20,
    showWordLimit: true
  }
}
```

### InputNumber 数値入力ボックス
```typescript
{
  label: '数量',
  prop: 'quantity',
  render: 'inputNumber',
  renderProps: {
    min: 1,
    max: 999,
    step: 1,
    stepStrictly: true,
    precision: 0,
    controlsPosition: 'right'
  }
}
```

### Textarea テキストエリア
```typescript
{
  label: '説明',
  prop: 'description',
  render: 'textarea',
  renderProps: {
    rows: 4,
    placeholder: '説明情報を入力してください',
    maxlength: 500,
    showWordLimit: true,
    autosize: { minRows: 2, maxRows: 6 },
    resize: 'vertical'
  }
}
```

## 選択類コンポーネント

### Select セレクター
```typescript
{
  label: '都市',
  prop: 'city',
  render: 'select',
  renderProps: {
    placeholder: '都市を選択してください',
    clearable: true,
    filterable: true,
    multiple: false,
    multipleLimit: 3
  },
  renderSlots: {
    default: () => [
      h('el-option', { label: '北京', value: 'beijing' }),
      h('el-option', { label: '上海', value: 'shanghai' }),
      h('el-option', { label: '広州', value: 'guangzhou' }),
      h('el-option', { label: '深圳', value: 'shenzhen' })
    ]
  }
}
```

### Cascader カスケードセレクター
```typescript
{
  label: '地域',
  prop: 'region',
  render: 'cascader',
  renderProps: {
    options: [
      {
        value: 'guangdong',
        label: '広東省',
        children: [
          { value: 'guangzhou', label: '広州市' },
          { value: 'shenzhen', label: '深圳市' }
        ]
      }
    ],
    props: {
      expandTrigger: 'hover',
      multiple: false,
      checkStrictly: false
    },
    showAllLevels: true,
    collapseTags: true,
    filterable: true
  }
}
```

### RadioGroup ラジオボタングループ
```typescript
{
  label: '性別',
  prop: 'gender',
  render: 'radioGroup',
  renderProps: {
    size: 'default',
    textColor: '#409EFF',
    fill: '#a0cfff'
  },
  renderSlots: {
    default: () => [
      h('el-radio', { label: 'male' }, '男性'),
      h('el-radio', { label: 'female' }, '女性'),
      h('el-radio', { label: 'other' }, 'その他')
    ]
  }
}
```

### CheckboxGroup チェックボックスグループ
```typescript
{
  label: '趣味',
  prop: 'hobbies',
  render: 'checkboxGroup',
  renderProps: {
    min: 1,
    max: 3
  },
  renderSlots: {
    default: () => [
      h('el-checkbox', { label: 'reading' }, '読書'),
      h('el-checkbox', { label: 'music' }, '音楽'),
      h('el-checkbox', { label: 'sports' }, 'スポーツ'),
      h('el-checkbox', { label: 'travel' }, '旅行')
    ]
  }
}
```

## 日付時間類コンポーネント

### DatePicker 日付ピッカー
```typescript
{
  label: '生年月日',
  prop: 'birthDate',
  render: 'datePicker',
  renderProps: {
    type: 'date',
    placeholder: '日付を選択',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
    disabledDate: (time) => {
      return time.getTime() > Date.now()
    },
    shortcuts: [
      {
        text: '今日',
        value: new Date()
      },
      {
        text: '昨日',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return date
        }
      }
    ]
  }
}
```

### TimePicker 時間ピッカー
```typescript
{
  label: '時間',
  prop: 'time',
  render: 'timePicker',
  renderProps: {
    placeholder: '時間を選択',
    format: 'HH:mm:ss',
    valueFormat: 'HH:mm:ss',
    clearable: true,
    selectableRange: ['09:00:00 - 18:00:00']
  }
}
```

### DateTimePicker 日付時間ピッカー
```typescript
{
  label: '予約時間',
  prop: 'appointmentTime',
  render: 'dateTimePicker',
  renderProps: {
    type: 'datetime',
    placeholder: '日付と時間を選択',
    format: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    timePickerOptions: {
      selectableRange: '09:00:00 - 18:00:00'
    }
  }
}
```

## 特殊コンポーネント

### Switch スイッチ
```typescript
{
  label: '有効状態',
  prop: 'enabled',
  render: 'switch',
  renderProps: {
    activeText: '有効',
    inactiveText: '無効', 
    activeValue: true,
    inactiveValue: false,
    activeColor: '#13ce66',
    inactiveColor: '#ff4949',
    beforeChange: () => {
      return new Promise((resolve) => {
        ElMessageBox.confirm('状態を切り替えますか？')
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })
    }
  }
}
```

### Rate レーティング
```typescript
{
  label: '評価',
  prop: 'rating',
  render: 'rate',
  renderProps: {
    max: 5,
    allowHalf: true,
    showText: true,
    showScore: true,
    scoreTemplate: '{value} 点',
    texts: ['非常に悪い', '失望', '普通', '満足', '驚き'],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900']
  }
}
```

### Slider スライダー
```typescript
{
  label: '進捗',
  prop: 'progress',
  render: 'slider',
  renderProps: {
    min: 0,
    max: 100,
    step: 5,
    showInput: true,
    showInputControls: true,
    showStops: true,
    showTooltip: true,
    range: false,
    marks: {
      0: '0%',
      25: '25%',
      50: '50%',
      75: '75%',
      100: '100%'
    }
  }
}
```

### Upload アップロード
```typescript
{
  label: 'ファイルアップロード',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    drag: true,
    accept: '.jpg,.jpeg,.png,.gif',
    listType: 'picture-card',
    autoUpload: true,
    showFileList: true,
    limit: 5,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isImage) {
        ElMessage.error('画像ファイルのみアップロード可能です!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('アップロードファイルサイズは2MBを超えてはいけません!')
        return false
      }
      return true
    },
    onSuccess: (response, file) => {
      console.log('アップロード成功:', response, file)
    },
    onError: (error) => {
      console.error('アップロード失敗:', error)
    }
  },
  renderSlots: {
    trigger: () => h('el-button', { size: 'small', type: 'primary' }, 'ファイルを選択'),
    tip: () => h('div', { class: 'el-upload__tip' }, 'jpg/pngファイルのみ、2MB以下')
  }
}
```

## カスタムレンダリング

### 1. 関数レンダリング方式
```typescript
{
  label: 'カスタム内容',
  prop: 'custom',
  render: ({ item, model, formRef, disabled, readonly, size }) => {
    return h('div', { class: 'custom-field' }, [
      h('el-input', {
        modelValue: model[item.prop],
        'onUpdate:modelValue': (value) => model[item.prop] = value,
        disabled,
        readonly,
        size,
        placeholder: 'カスタムレンダリングの入力ボックス'
      }),
      h('el-button', {
        size: 'small',
        type: 'text',
        onClick: () => {
          ElMessage.info('カスタムボタンクリック')
        }
      }, '操作')
    ])
  }
}
```

### 2. コンポーネントレンダリング方式
```typescript
import CustomComponent from './CustomComponent.vue'

{
  label: 'カスタムコンポーネント',
  prop: 'customComponent',
  render: CustomComponent,
  renderProps: {
    customProp: 'customValue',
    onCustomEvent: (data) => {
      console.log('カスタムイベント:', data)
    }
  }
}
```

### 3. JSX レンダリング方式
```tsx
{
  label: 'JSX レンダリング',
  prop: 'jsxField',
  render: ({ item, model }) => (
    <div class="jsx-field">
      <el-input
        v-model={model[item.prop]}
        placeholder="JSX 方式でレンダリング"
        clearable
        v-slots={{
          append: () => <el-button icon="Search">検索</el-button>
        }}
      />
    </div>
  )
}
```

## コンポーネントイベント処理

### 統一イベント処理
```typescript
{
  label: 'イベント処理',
  prop: 'eventField',
  render: 'select',
  renderProps: {
    // Element Plus ネイティブイベント
    onChange: (value) => {
      console.log('選択変更:', value)
    },
    onFocus: () => {
      console.log('フォーカス取得')
    },
    onBlur: () => {
      console.log('フォーカス喪失')
    },
    onClear: () => {
      console.log('選択クリア')
    }
  }
}
```

## 関連リンク

- [コンポーネントレンダリングシステム](/ja/front/component/ma-form#コンポーネントレンダリングシステム)
- [サポートする Element Plus コンポーネント](/ja/front/component/ma-form#サポートする-element-plus-コンポーネント)
- [スロットシステム](/ja/front/component/ma-form#スロットシステム)