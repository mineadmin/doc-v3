# モバイルレスポンシブ

MaFormのモバイル端末向けレスポンシブ機能を紹介します。ブレークポイント適応、モバイル最適化、タッチ操作、デバイス固有の設定を含みます。

<DemoPreview dir="demos/ma-form/mobile-responsive" />

## 機能特徴

- **ブレークポイントレスポンシブ**: 画面サイズに基づいて自動的にレイアウトを適応
- **モバイル最適化**: モバイルデバイス向けの特別な最適化
- **タッチフレンドリー**: タッチ操作に適したインタラクションデザイン
- **デバイス認識**: モバイルデバイスを自動認識し対応する設定を適用
- **柔軟な設定**: モバイル専用のフィールド設定をサポート

## レスポンシブブレークポイントシステム

### 1. 組み込みブレークポイント定義

```typescript
const responsiveBreakpoints = {
  xs: 576,    // 超小画面 < 576px
  sm: 768,    // 小画面 ≥ 768px  
  md: 992,    // 中画面 ≥ 992px
  lg: 1200,   // 大画面 ≥ 1200px
  xl: 1920    // 超大画面 ≥ 1920px
}

// モバイルブレークポイント設定
const mobileFormOptions = {
  mobileBreakpoint: 768,  // モバイルブレークポイント
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // モバイル単一カラムレイアウト
    mobileHideLabels: false,       // ラベルを非表示にするか
    breakpoints: responsiveBreakpoints
  }
}
```

### 2. 適応型グリッド設定

```typescript
const responsiveFormItems = [
  {
    label: 'ユーザー名',
    prop: 'username',
    render: 'input',
    cols: {
      // 基本グリッド設定
      span: 12,
      
      // レスポンシブ設定
      xs: 24,    // 超小画面: 1行全体
      sm: 24,    // 小画面: 1行全体
      md: 12,    // 中画面: 半分
      lg: 8,     // 大画面: 3分の1
      xl: 6      // 超大画面: 4分の1
    }
  },
  {
    label: 'メールアドレス',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email'
    },
    cols: {
      xs: { span: 24, offset: 0 },
      sm: { span: 24, offset: 0 },
      md: { span: 12, offset: 0 },
      lg: { span: 8, offset: 0 },
      xl: { span: 6, offset: 0 }
    }
  },
  {
    label: '電話番号',
    prop: 'phone',
    render: 'input',
    cols: {
      xs: 24,
      sm: 24, 
      md: 12,
      lg: 8,
      xl: 6
    },
    // モバイル専用設定
    mobileProps: {
      type: 'tel',           // モバイルで電話キーボードを使用
      inputmode: 'numeric'   // 数字入力モード
    }
  }
]
```

## モバイル専用設定

### 1. mobileProps 設定

```typescript
const mobileOptimizedFields = [
  {
    label: '携帯番号',
    prop: 'mobile',
    render: 'input',
    renderProps: {
      placeholder: '携帯番号を入力してください'
    },
    // モバイル専用属性
    mobileProps: {
      type: 'tel',
      inputmode: 'numeric',
      pattern: '[0-9]*',
      autocomplete: 'tel',
      size: 'large'          // モバイルで大サイズを使用
    }
  },
  {
    label: 'メール',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: 'メールアドレスを入力してください'
    },
    mobileProps: {
      inputmode: 'email',
      autocomplete: 'email',
      autocapitalize: 'none',  // 自動大文字化を無効化
      spellcheck: false,       // スペルチェックを無効化
      size: 'large'
    }
  },
  {
    label: 'ウェブサイト',
    prop: 'website',
    render: 'input',
    renderProps: {
      placeholder: 'ウェブサイトアドレスを入力してください'
    },
    mobileProps: {
      type: 'url',
      inputmode: 'url',
      autocomplete: 'url',
      autocapitalize: 'none',
      size: 'large'
    }
  },
  {
    label: 'パスワード',
    prop: 'password',
    render: 'input',
    renderProps: {
      type: 'password',
      placeholder: 'パスワードを入力してください'
    },
    mobileProps: {
      autocomplete: 'new-password',
      size: 'large'
    }
  }
]
```

### 2. モバイル非表示設定

```typescript
const adaptiveVisibilityFields = [
  {
    label: '詳細説明',
    prop: 'description',
    render: 'textarea',
    renderProps: {
      rows: 4,
      placeholder: '詳細説明を入力してください'
    },
    // モバイルでこのフィールドを非表示
    mobileHide: true
  },
  {
    label: '備考情報',
    prop: 'remark',
    render: 'input',
    renderProps: {
      placeholder: '任意'
    },
    // 条件に基づいてモバイルで非表示
    mobileHide: (model) => !model.showAdvanced
  },
  {
    label: '詳細オプション',
    prop: 'advanced',
    render: 'switch',
    // モバイルで簡易版を表示
    show: (model, item) => {
      const isMobile = window.innerWidth < 768
      return !isMobile || model.showAdvancedOnMobile
    }
  }
]
```

## モバイルレイアウト最適化

### 1. 単一カラムレイアウト設定

```typescript
const mobileLayoutConfig = {
  // モバイル単一カラムレイアウトを有効化
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    mobileHideLabels: false,
    
    // モバイル専用ブレークポイント
    breakpoints: {
      xs: 480,   // スマホ縦画面
      sm: 768,   // スマホ横画面/タブレット縦画面
      md: 992,   // タブレット横画面
      lg: 1200,  // 小デスクトップ
      xl: 1920   // 大デスクトップ
    }
  }
}

// 手動でモバイルレイアウトを制御
const isMobileLayout = computed(() => {
  return formRef.value?.isMobileState() || false
})

// モバイル状態に応じてフォーム設定を調整
watch(isMobileLayout, (isMobile) => {
  if (formRef.value) {
    formRef.value.updateOptions(options => ({
      ...options,
      layout: isMobile ? 'grid' : 'flex',
      grid: isMobile ? { direction: 'vertical', size: 'large' } : options.grid,
      flex: isMobile ? undefined : { gutter: 16 }
    }))
  }
})
```

### 2. モバイルフォームコンポーネントサイズ

```typescript
const mobileSizedFields = [
  {
    label: 'ユーザー名',
    prop: 'username',
    render: 'input',
    renderProps: {
      size: 'default'  // デスクトップでデフォルトサイズ
    },
    mobileProps: {
      size: 'large'    // モバイルで大サイズ、タッチ操作しやすく
    }
  },
  {
    label: 'セレクター',
    prop: 'selector',
    render: 'select',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',
      teleported: false  // モバイルでポータルを使用しない（オーバーレイ問題回避）
    }
  },
  {
    label: '日付選択',
    prop: 'date',
    render: 'datePicker',
    renderProps: {
      size: 'default',
      type: 'date'
    },
    mobileProps: {
      size: 'large',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      teleported: false
    }
  }
]
```

## タッチ操作最適化

### 1. タッチフレンドリーなコンポーネント設定

```typescript
const touchFriendlyFields = [
  {
    label: 'スライダー制御',
    prop: 'slider',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 100,
      step: 5,
      showInput: false  // モバイルで入力欄を非表示
    },
    mobileProps: {
      showInput: false,
      height: 6,        // スライダー高さを増加、タッチ操作しやすく
      showTooltip: true,
      tooltipClass: 'mobile-slider-tooltip'
    }
  },
  {
    label: '評価',
    prop: 'rating',
    render: 'rate',
    renderProps: {
      max: 5,
      allowHalf: false  // モバイルで半星を無効化
    },
    mobileProps: {
      allowHalf: false,
      size: 'large',    // 星のサイズを大きく
      textColor: '#ff9900'
    }
  },
  {
    label: 'スイッチ',
    prop: 'switch',
    render: 'switch',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',    // スイッチサイズを大きく、クリックしやすく
      width: 60
    }
  }
]
```

### 2. モバイルアップロードコンポーネント

```typescript
const mobileUploadField = {
  label: 'ファイルアップロード',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    listType: 'picture-card',
    multiple: true
  },
  mobileProps: {
    listType: 'picture',     // モバイルでリストスタイルを使用
    drag: false,             // ドラッグを無効化
    showFileList: true,
    accept: 'image/*',       // カメラ/アルバムを呼び出し
    capture: 'environment'   // カメラタイプを指定
  },
  renderSlots: {
    trigger: () => {
      const isMobile = window.innerWidth < 768
      return h('el-button', {
        type: 'primary',
        size: isMobile ? 'large' : 'default',
        icon: isMobile ? 'Camera' : 'Upload'
      }, isMobile ? '写真/画像選択' : 'ファイル選択')
    }
  }
}
```

## デバイス検出と適応

### 1. デバイスタイプ検出

```typescript
const deviceDetection = {
  // デバイスタイプを検出
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },
  
  // タッチデバイスか検出
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },
  
  // 画面向きを検出
  getOrientation: () => {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  },
  
  // デバイスピクセル比を取得
  getPixelRatio: () => {
    return window.devicePixelRatio || 1
  }
}

// デバイス特性に応じてフォームを調整
const adaptFormToDevice = () => {
  const isMobile = deviceDetection.isMobile()
  const isTouchDevice = deviceDetection.isTouchDevice()
  const orientation = deviceDetection.getOrientation()
  
  const adaptiveOptions = {
    mobileBreakpoint: isMobile ? 768 : 576,
    responsiveConfig: {
      enabled: true,
      mobileSingleColumn: isMobile,
      mobileHideLabels: isMobile && orientation === 'portrait'
    },
    layout: isMobile ? 'grid' : 'flex',
    grid: isMobile ? {
      direction: 'vertical',
      size: isTouchDevice ? 'large' : 'medium'
    } : undefined
  }
  
  formRef.value?.setOptions(adaptiveOptions)
}
```

### 2. 画面向き変化処理

```typescript
// 画面向き変化を監視
const handleOrientationChange = () => {
  const isPortrait = window.innerHeight > window.innerWidth
  
  // 向きに応じてレイアウトを調整
  if (formRef.value) {
    formRef.value.updateOptions(options => ({
      ...options,
      responsiveConfig: {
        ...options.responsiveConfig,
        mobileHideLabels: isPortrait,  // 縦画面でラベルを非表示
        mobileSingleColumn: true
      }
    }))
    
    // 手動でレスポンシブ状態を更新
    formRef.value.updateResponsiveState()
  }
}

// イベントリスナーを追加
onMounted(() => {
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', debounce(handleOrientationChange, 300))
})

onUnmounted(() => {
  window.removeEventListener('orientationchange', handleOrientationChange)
  window.removeEventListener('resize', handleOrientationChange)
})
```

## PWAとモバイル最適化

### 1. PWAフォーム設定

```typescript
const pwaFormConfig = {
  // PWA環境下のフォーム設定
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    breakpoints: {
      xs: 320,   // 最小スマホ画面
      sm: 768,   // タブレット縦画面
      md: 1024,  // タブレット横画面
      lg: 1440,  // デスクトップ
      xl: 1920   // 大画面デスクトップ
    }
  },
  
  // PWA専用ローディング設定
  loadingConfig: {
    text: '処理中...',
    background: 'rgba(0, 0, 0, 0.7)',
    fullscreen: true,  // PWAで全画面ローディングを使用
    lock: true
  }
}

// PWAオフライン状態処理
const handleOfflineForm = () => {
  if (!navigator.onLine) {
    // オフライン時は非同期検証を無効化
    const items = formRef.value?.getItems() || []
    items.forEach(item => {
      if (item.asyncValidator) {
        formRef.value?.updateItem(item.prop, {
          asyncValidator: undefined,
          itemProps: {
            ...item.itemProps,
            rules: [
              ...(item.itemProps?.rules || []),
              { required: true, message: 'オフラインモードではこのフィールドを入力してください', trigger: 'blur' }
            ]
          }
        })
      }
    })
    
    ElMessage.warning('現在オフライン状態です。一部機能が制限されます')
  }
}
```

### 2. モバイルパフォーマンス最適化

```typescript
const mobilePerformanceOptimization = {
  // 非重要フィールドの遅延ロード
  lazyLoadFields: (fields: MaFormItem[]) => {
    const criticalFields = fields.filter(field => field.priority === 'high')
    const nonCriticalFields = fields.filter(field => field.priority !== 'high')
    
    // まず重要フィールドをロード
    formRef.value?.setItems(criticalFields)
    
    // 非重要フィールドを遅延ロード
    setTimeout(() => {
      nonCriticalFields.forEach(field => {
        formRef.value?.appendItem(field)
      })
    }, 100)
  },
  
  // 長いフォームの仮想スクロール
  enableVirtualScrolling: (threshold = 20) => {
    const items = formRef.value?.getItems() || []
    if (items.length > threshold) {
      // 仮想スクロールロジックを実装
      console.log('仮想スクロール最適化を有効化')
    }
  },
  
  // 画像遅延ロード
  enableImageLazyLoading: () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          observer.unobserve(img)
        }
      })
    })
    
    // フォーム内の画像を監視
    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => observer.observe(img))
  }
}
```

## モバイル適応テスト

### 1. レスポンシブテスト

```typescript
