# 移動端響應式

展示 MaForm 在移動端的響應式特性，包括斷點適配、移動端最佳化、觸控互動和裝置特定配置。

<DemoPreview dir="demos/ma-form/mobile-responsive" />

## 功能特性

- **斷點響應式**：基於螢幕尺寸自動適配佈局
- **移動端最佳化**：針對移動裝置的專門最佳化
- **觸控友好**：適配觸控操作的互動設計
- **裝置識別**：自動識別移動裝置並應用相應配置
- **靈活配置**：支援移動端專用的欄位配置

## 響應式斷點系統

### 1. 內建斷點定義

```typescript
const responsiveBreakpoints = {
  xs: 576,    // 超小螢幕 < 576px
  sm: 768,    // 小螢幕 ≥ 768px  
  md: 992,    // 中等螢幕 ≥ 992px
  lg: 1200,   // 大螢幕 ≥ 1200px
  xl: 1920    // 超大螢幕 ≥ 1920px
}

// 移動端斷點配置
const mobileFormOptions = {
  mobileBreakpoint: 768,  // 移動端斷點
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // 移動端單列布局
    mobileHideLabels: false,       // 是否隱藏標籤
    breakpoints: responsiveBreakpoints
  }
}
```

### 2. 自適應柵格配置

```typescript
const responsiveFormItems = [
  {
    label: '使用者名稱',
    prop: 'username',
    render: 'input',
    cols: {
      // 基礎柵格配置
      span: 12,
      
      // 響應式配置
      xs: 24,    // 超小屏：佔滿整行
      sm: 24,    // 小屏：佔滿整行
      md: 12,    // 中屏：佔一半
      lg: 8,     // 大屏：佔三分之一
      xl: 6      // 超大屏：佔四分之一
    }
  },
  {
    label: '郵箱地址',
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
    label: '手機號碼',
    prop: 'phone',
    render: 'input',
    cols: {
      xs: 24,
      sm: 24, 
      md: 12,
      lg: 8,
      xl: 6
    },
    // 移動端專用配置
    mobileProps: {
      type: 'tel',           // 移動端使用電話鍵盤
      inputmode: 'numeric'   // 數字輸入模式
    }
  }
]
```

## 移動端專用配置

### 1. mobileProps 配置

```typescript
const mobileOptimizedFields = [
  {
    label: '手機號',
    prop: 'mobile',
    render: 'input',
    renderProps: {
      placeholder: '請輸入手機號'
    },
    // 移動端專用屬性
    mobileProps: {
      type: 'tel',
      inputmode: 'numeric',
      pattern: '[0-9]*',
      autocomplete: 'tel',
      size: 'large'          // 移動端使用大尺寸
    }
  },
  {
    label: '郵箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: '請輸入郵箱地址'
    },
    mobileProps: {
      inputmode: 'email',
      autocomplete: 'email',
      autocapitalize: 'none',  // 停用自動首字母大寫
      spellcheck: false,       // 停用拼寫檢查
      size: 'large'
    }
  },
  {
    label: '網址',
    prop: 'website',
    render: 'input',
    renderProps: {
      placeholder: '請輸入網站地址'
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
    label: '密碼',
    prop: 'password',
    render: 'input',
    renderProps: {
      type: 'password',
      placeholder: '請輸入密碼'
    },
    mobileProps: {
      autocomplete: 'new-password',
      size: 'large'
    }
  }
]
```

### 2. 移動端隱藏配置

```typescript
const adaptiveVisibilityFields = [
  {
    label: '詳細描述',
    prop: 'description',
    render: 'textarea',
    renderProps: {
      rows: 4,
      placeholder: '請輸入詳細描述'
    },
    // 移動端隱藏該欄位
    mobileHide: true
  },
  {
    label: '備註資訊',
    prop: 'remark',
    render: 'input',
    renderProps: {
      placeholder: '選填'
    },
    // 根據條件在移動端隱藏
    mobileHide: (model) => !model.showAdvanced
  },
  {
    label: '高階選項',
    prop: 'advanced',
    render: 'switch',
    // 移動端顯示簡化版本
    show: (model, item) => {
      const isMobile = window.innerWidth < 768
      return !isMobile || model.showAdvancedOnMobile
    }
  }
]
```

## 移動端佈局最佳化

### 1. 單列布局配置

```typescript
const mobileLayoutConfig = {
  // 啟用移動端單列布局
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    mobileHideLabels: false,
    
    // 移動端專用斷點
    breakpoints: {
      xs: 480,   // 手機豎屏
      sm: 768,   // 手機橫屏/平板豎屏
      md: 992,   // 平板橫屏
      lg: 1200,  // 小桌面
      xl: 1920   // 大桌面
    }
  }
}

// 手動控制移動端佈局
const isMobileLayout = computed(() => {
  return formRef.value?.isMobileState() || false
})

// 根據移動端狀態調整表單配置
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

### 2. 移動端表單元件尺寸

```typescript
const mobileSizedFields = [
  {
    label: '使用者名稱',
    prop: 'username',
    render: 'input',
    renderProps: {
      size: 'default'  // 桌面端預設尺寸
    },
    mobileProps: {
      size: 'large'    // 移動端大尺寸，便於觸控
    }
  },
  {
    label: '選擇器',
    prop: 'selector',
    render: 'select',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',
      teleported: false  // 移動端不使用傳送門，避免遮罩問題
    }
  },
  {
    label: '日期選擇',
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

## 觸控互動最佳化

### 1. 觸控友好的元件配置

```typescript
const touchFriendlyFields = [
  {
    label: '滑塊控制',
    prop: 'slider',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 100,
      step: 5,
      showInput: false  // 移動端隱藏輸入框
    },
    mobileProps: {
      showInput: false,
      height: 6,        // 增加滑塊高度，便於觸控
      showTooltip: true,
      tooltipClass: 'mobile-slider-tooltip'
    }
  },
  {
    label: '評分',
    prop: 'rating',
    render: 'rate',
    renderProps: {
      max: 5,
      allowHalf: false  // 移動端停用半星
    },
    mobileProps: {
      allowHalf: false,
      size: 'large',    // 增大星星尺寸
      textColor: '#ff9900'
    }
  },
  {
    label: '開關',
    prop: 'switch',
    render: 'switch',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',    // 增大開關尺寸，便於點選
      width: 60
    }
  }
]
```

### 2. 移動端上傳元件

```typescript
const mobileUploadField = {
  label: '檔案上傳',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    listType: 'picture-card',
    multiple: true
  },
  mobileProps: {
    listType: 'picture',     // 移動端使用列表樣式
    drag: false,             // 停用拖拽
    showFileList: true,
    accept: 'image/*',       // 呼叫相機/相簿
    capture: 'environment'   // 指定相機型別
  },
  renderSlots: {
    trigger: () => {
      const isMobile = window.innerWidth < 768
      return h('el-button', {
        type: 'primary',
        size: isMobile ? 'large' : 'default',
        icon: isMobile ? 'Camera' : 'Upload'
      }, isMobile ? '拍照/選擇圖片' : '選擇檔案')
    }
  }
}
```

## 裝置檢測與適配

### 1. 裝置型別檢測

```typescript
const deviceDetection = {
  // 檢測裝置型別
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },
  
  // 檢測是否為觸控裝置
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },
  
  // 檢測螢幕方向
  getOrientation: () => {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  },
  
  // 獲取裝置畫素比
  getPixelRatio: () => {
    return window.devicePixelRatio || 1
  }
}

// 根據裝置特性調整表單
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

### 2. 螢幕方向變化處理

```typescript
// 監聽螢幕方向變化
const handleOrientationChange = () => {
  const isPortrait = window.innerHeight > window.innerWidth
  
  // 根據方向調整佈局
  if (formRef.value) {
    formRef.value.updateOptions(options => ({
      ...options,
      responsiveConfig: {
        ...options.responsiveConfig,
        mobileHideLabels: isPortrait,  // 豎屏時隱藏標籤
        mobileSingleColumn: true
      }
    }))
    
    // 手動更新響應式狀態
    formRef.value.updateResponsiveState()
  }
}

// 新增事件監聽
onMounted(() => {
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', debounce(handleOrientationChange, 300))
})

onUnmounted(() => {
  window.removeEventListener('orientationchange', handleOrientationChange)
  window.removeEventListener('resize', handleOrientationChange)
})
```

## PWA 和移動端最佳化

### 1. PWA 表單配置

```typescript
const pwaFormConfig = {
  // PWA 環境下的表單配置
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    breakpoints: {
      xs: 320,   // 最小手機螢幕
      sm: 768,   // 平板豎屏
      md: 1024,  // 平板橫屏
      lg: 1440,  // 桌面
      xl: 1920   // 大屏桌面
    }
  },
  
  // PWA 專用載入配置
  loadingConfig: {
    text: '正在處理...',
    background: 'rgba(0, 0, 0, 0.7)',
    fullscreen: true,  // PWA 中使用全屏載入
    lock: true
  }
}

// PWA 離線狀態處理
const handleOfflineForm = () => {
  if (!navigator.onLine) {
    // 離線時停用非同步驗證
    const items = formRef.value?.getItems() || []
    items.forEach(item => {
      if (item.asyncValidator) {
        formRef.value?.updateItem(item.prop, {
          asyncValidator: undefined,
          itemProps: {
            ...item.itemProps,
            rules: [
              ...(item.itemProps?.rules || []),
              { required: true, message: '離線模式下請填寫此欄位', trigger: 'blur' }
            ]
          }
        })
      }
    })
    
    ElMessage.warning('當前處於離線狀態，部分功能受限')
  }
}
```

### 2. 移動端效能最佳化

```typescript
const mobilePerformanceOptimization = {
  // 延遲載入非關鍵欄位
  lazyLoadFields: (fields: MaFormItem[]) => {
    const criticalFields = fields.filter(field => field.priority === 'high')
    const nonCriticalFields = fields.filter(field => field.priority !== 'high')
    
    // 先載入關鍵欄位
    formRef.value?.setItems(criticalFields)
    
    // 延遲載入非關鍵欄位
    setTimeout(() => {
      nonCriticalFields.forEach(field => {
        formRef.value?.appendItem(field)
      })
    }, 100)
  },
  
  // 虛擬滾動長表單
  enableVirtualScrolling: (threshold = 20) => {
    const items = formRef.value?.getItems() || []
    if (items.length > threshold) {
      // 實現虛擬滾動邏輯
      console.log('啟用虛擬滾動最佳化')
    }
  },
  
  // 圖片懶載入
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
    
    // 監聽表單中的圖片
    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => observer.observe(img))
  }
}
```

## 測試移動端適配

### 1. 響應式測試

```typescript
const responsiveTestUtils = {
  // 模擬不同螢幕尺寸
  simulateScreenSize: (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height
    })
    
    // 觸發resize事件
    window.dispatchEvent(new Event('resize'))
  },
  
  // 測試不同斷點
  testBreakpoints: () => {
    const breakpoints = [
      { name: 'Mobile Portrait', width: 375, height: 667 },
      { name: 'Mobile Landscape', width: 667, height: 375 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop', width: 1200, height: 800 }
    ]
    
    breakpoints.forEach(bp => {
      responsiveTestUtils.simulateScreenSize(bp.width, bp.height)
      console.log(`${bp.name}: isMobile=${formRef.value?.isMobileState()}`)
    })
  }
}
```

## 相關連結

- [佈局系統 - 響應式配置](/zh-tw/front/component/ma-form/examples/layout-systems#響應式系統)
- [ResponsiveConfig 配置](/zh-tw/front/component/ma-form#responsiveconfig-響應式配置)
- [移動端配置選項](/zh-tw/front/component/ma-form#移動端配置)