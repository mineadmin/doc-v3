# スロットシステム

MaFormのスロットシステムを紹介します。グローバルスロット、フォームアイテムレベルのスロット、動的スロット命名、およびネストされたコンポーネントスロットの使用方法を含みます。

<DemoPreview dir="demos/ma-form/slots-examples" />

## 機能特性

- **マルチレベルスロット**: グローバル、フォームアイテム、コンポーネントの3つのレベルのスロットをサポート
- **動的スロット命名**: propベースの動的スロット命名メカニズム
- **設定可能なスロット**: 設定方法でスロット内容を定義
- **テンプレートスロット**: テンプレート方式のスロット使用をサポート
- **スコープ付きスロット**: 豊富なスコープデータを提供

## グローバルスロット

### 1. デフォルトスロット
デフォルトスロットを使用する場合、設定方法は自動的に無効になり、完全にテンプレート方式を使用します:

```vue
<ma-form v-model="formData" :options="formOptions">
  <el-form-item label="ユーザー名" prop="username">
    <el-input v-model="formData.username" placeholder="ユーザー名を入力してください" />
  </el-form-item>
  
  <el-form-item label="パスワード" prop="password">
    <el-input 
      v-model="formData.password" 
      type="password" 
      placeholder="パスワードを入力してください" 
    />
  </el-form-item>
</ma-form>
```

### 2. Footer スロット
フォーム下部の操作ボタンを配置するために使用:

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions" 
  :items="formItems"
>
  <template #footer="{ formRef, model, loading }">
    <div class="form-footer">
      <el-button @click="handleReset">リセット</el-button>
      <el-button 
        type="primary" 
        :loading="loading"
        @click="handleSubmit(formRef)"
      >
        送信
      </el-button>
    </div>
  </template>
</ma-form>
```

### 3. Loading スロット
カスタムローディング状態表示:

```vue
<ma-form 
  v-model="formData" 
  :options="formOptions" 
  :items="formItems"
>
  <template #loading="{ loading }">
    <div v-if="loading" class="custom-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>処理中...</span>
    </div>
  </template>
</ma-form>
```

## 動的スロット命名

### 1. フォームアイテム内容スロット
形式: `#item-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- propが'username'のフィールドをカスタムレンダリング -->
  <template #item-username="{ item, model, disabled, readonly, size }">
    <div class="custom-username-field">
      <el-input 
        v-model="model[item.prop]"
        :disabled="disabled"
        :readonly="readonly"
        :size="size"
        prefix-icon="User"
        placeholder="ユーザー名を入力してください"
      >
        <template #append>
          <el-button icon="Check" @click="checkUsername">検証</el-button>
        </template>
      </el-input>
    </div>
  </template>
</ma-form>
```

### 2. フォームアイテムラベルスロット
形式: `#label-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- propが'password'のフィールドのカスタムラベル -->
  <template #label-password>
    <span class="custom-label">
      <el-icon color="#409EFF"><Lock /></el-icon>
      <span style="margin-left: 4px;">ログインパスワード</span>
      <el-tooltip content="パスワード長さ8-16文字、英字と数字を含む" placement="top">
        <el-icon style="margin-left: 4px;"><QuestionFilled /></el-icon>
      </el-tooltip>
    </span>
  </template>
</ma-form>
```

### 3. フォームアイテムエラースロット
形式: `#error-{prop}`

```vue
<ma-form v-model="formData" :items="formItems">
  <!-- propが'email'のフィールドのカスタムエラー表示 -->
  <template #error-email="{ error }">
    <div class="custom-error">
      <el-icon color="#F56C6C"><WarningFilled /></el-icon>
      <span>{{ error }}</span>
    </div>
  </template>
</ma-form>
```

## フォームアイテムレベルスロット設定

### 1. itemSlots 設定
設定方法でフォームアイテムスロットを定義:

```typescript
{
  label: 'ユーザー情報',
  prop: 'userInfo',
  render: 'input',
  itemSlots: {
    // カスタムラベル
    label: ({ label }) => {
      return h('div', { class: 'custom-label' }, [
        h('el-icon', { color: '#409EFF' }, [h('User')]),
        h('span', { style: 'margin-left: 4px;' }, label)
      ])
    },
    
    // 前置き内容
    prepend: ({ item, model }) => {
      return h('div', { class: 'prepend-content' }, [
        h('el-text', { type: 'info', size: 'small' }, 'ヒント情報')
      ])
    },
    
    // 後置き内容
    append: ({ item, model }) => {
      return h('div', { class: 'append-content' }, [
        h('el-button', {
          size: 'small',
          type: 'text',
          onClick: () => console.log('操作ボタンクリック')
        }, '操作')
      ])
    },
    
    // ヘルプ情報
    help: ({ item, model }) => {
      return h('div', { class: 'help-text' }, [
        h('el-text', { type: 'info', size: 'small' }, 'これはヘルプ情報です')
      ])
    },
    
    // エラー情報
    error: ({ error }) => {
      return h('div', { class: 'custom-error' }, [
        h('el-icon', { color: '#F56C6C' }, [h('WarningFilled')]),
        h('span', { style: 'margin-left: 4px;' }, error)
      ])
    }
  }
}
```

### 2. 複雑なスロット例

```typescript
{
  label: 'アバターアップロード',
  prop: 'avatar',
  render: 'upload',
  renderProps: {
    action: '/api/upload/avatar',
    showFileList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      return isImage && isLt2M
    }
  },
  itemSlots: {
    prepend: ({ item, model }) => {
      const avatarUrl = model[item.prop]
      return h('div', { class: 'avatar-preview' }, [
        avatarUrl 
          ? h('img', { src: avatarUrl, style: 'width: 60px; height: 60px; border-radius: 50%;' })
          : h('div', { 
              class: 'avatar-placeholder',
              style: 'width: 60px; height: 60px; border-radius: 50%; background: #f5f7fa; display: flex; align-items: center; justify-content: center;'
            }, [
              h('el-icon', { size: 24, color: '#cdd0d6' }, [h('Plus')])
            ])
      ])
    },
    
    help: ({ item, model }) => {
      return h('div', { class: 'upload-help' }, [
        h('el-text', { type: 'info', size: 'small' }, 'jpg、png形式をサポート、ファイルサイズは2MB以下')
      ])
    }
  }
}
```

## ネストされたコンポーネントスロット

### 1. renderSlots 設定
レンダリングされるコンポーネントのスロットを設定:

```typescript
{
  label: 'セレクター',
  prop: 'selector',
  render: 'select',
  renderProps: {
    placeholder: 'オプションを選択してください',
    clearable: true,
    filterable: true
  },
  renderSlots: {
    // デフォルトスロット - オプションリスト
    default: () => [
      h('el-option', { label: 'オプション1', value: '1' }),
      h('el-option', { label: 'オプション2', value: '2' }),
      h('el-option', { label: 'オプション3', value: '3' })
    ],
    
    // プレフィックススロット
    prefix: () => h('el-icon', [h('Search')]),
    
    // 空状態スロット
    empty: () => h('div', { style: 'text-align: center; color: #999;' }, [
      h('el-icon', { size: 24 }, [h('DocumentDelete')]),
      h('div', '利用可能なオプションはありません')
    ])
  }
}
```

### 2. Upload コンポーネントスロット

```typescript
{
  label: 'ファイルアップロード',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    multiple: true,
    drag: true,
    accept: '.pdf,.doc,.docx'
  },
  renderSlots: {
    // アップロードトリガー
    trigger: () => h('div', { class: 'upload-trigger' }, [
      h('el-icon', { size: 32, color: '#409EFF' }, [h('UploadFilled')]),
      h('div', { style: 'margin-top: 8px;' }, 'クリックまたはドラッグしてファイルをアップロード')
    ]),
    
    // ヒント情報
    tip: () => h('div', { class: 'upload-tip' }, [
      h('el-text', { type: 'info', size: 'small' }, 'PDF、Word形式をサポート、単一ファイルは10MB以下')
    ]),
    
    // ファイルリスト
    file: ({ file }) => h('div', { class: 'custom-file-item' }, [
      h('el-icon', [h('Document')]),
      h('span', { style: 'margin-left: 8px;' }, file.name),
      h('el-button', {
        size: 'small',
        type: 'danger',
        text: true,
        style: 'margin-left: auto;',
        onClick: () => {
          // ファイル削除ロジック
        }
      }, '削除')
    ])
  }
}
```

## スロットスコープデータ

### FormItemScope インターフェース
フォームアイテムスロットのスコープデータ:

```typescript
interface FormItemScope {
  item: MaFormItem        // 現在のフォームアイテム設定
  model: Record<string, any>  // フォームデータモデル
  disabled: boolean       // 無効かどうか
  readonly: boolean       // 読み取り専用かどうか
  size: ComponentSize     // コンポーネントサイズ
  formRef: Ref<FormInstance | undefined>  // フォームインスタンス参照
}
```

### 使用例

```vue
<template #item-complex="{ item, model, disabled, readonly, size, formRef }">
  <div class="complex-field">
    <!-- スコープデータを使用 -->
    <el-input 
      v-model="model[item.prop]"
      :disabled="disabled"
      :readonly="readonly" 
      :size="size"
      placeholder="複雑なフィールド"
    />
    
    <!-- 操作ボタン -->
    <el-button 
      :size="size"
      @click="handleFieldAction(item, model, formRef)"
    >
      操作
    </el-button>
  </div>
</template>
```

## スロット優先順位

複数のスロット定義方法が同時に存在する場合、優先順位は次のとおりです:

1. **テンプレートスロット** (最高優先順位)
2. **itemSlots 設定スロット**
3. **renderSlots 設定スロット**
4. **デフォルトレンダリング** (最低優先順位)

### 例

```typescript
// 設定で定義されたスロット
{
  label: 'テストフィールド',
  prop: 'testField',
  render: 'input',
  itemSlots: {
    label: () => h('span', '設定スロットラベル')
  }
}
```

```vue
<!-- テンプレートスロットは設定スロットを上書き -->
<ma-form v-model="formData" :items="items">
  <template #label-testField>
    <span>テンプレートスロットラベル</span>  <!-- これが有効 -->
  </template>
</ma-form>
```

## ベストプラクティス

### 1. スロットパフォーマンス最適化

```typescript
// ✅ 推奨: アロー関数でキャッシュ
const labelSlot = () => h('span', 'ラベル')

// ❌ 回避: レンダリングごとに新しい関数を作成
itemSlots: {
  label: () => h('span', 'ラベル')  // 毎回新しい関数
}
```

### 2. 条件付きスロット

```typescript
{
  label: '条件付きスロット',
  prop: 'conditionalSlot',
  render: 'input',
  itemSlots: {
    append: ({ item, model }) => {
      // 条件に応じて異なる内容を表示
      return model.showButton 
        ? h('el-button', { size: 'small' }, '操作')
        : null
    }
  }
}
```

### 3. レスポンシブスロット

```typescript
{
  label: 'レスポンシブスロット',
  prop: 'responsiveSlot',
  render: 'input',
  itemSlots: {
    help: ({ item, model }) => {
      const isMobile = window.innerWidth < 768
      return h('div', { 
        class: isMobile ? 'mobile-help' : 'desktop-help' 
      }, 'レスポンシブヘルプ情報')
    }
  }
}
```

## 関連リンク

- [スロットシステム詳細](/ja/front/component/ma-form#スロットシステム)
- [MaFormItem itemSlots 設定](/ja/front/component/ma-form#レイアウト設定)
- [コンポーネントレンダリング renderSlots](/ja/front/component/ma-form/examples/component-rendering)