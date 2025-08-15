# 移动端响应式

展示 MaForm 在移动端的响应式特性，包括断点适配、移动端优化、触摸交互和设备特定配置。

<DemoPreview dir="demos/ma-form/mobile-responsive" />

## 功能特性

- **断点响应式**：基于屏幕尺寸自动适配布局
- **移动端优化**：针对移动设备的专门优化
- **触摸友好**：适配触摸操作的交互设计
- **设备识别**：自动识别移动设备并应用相应配置
- **灵活配置**：支持移动端专用的字段配置

## 响应式断点系统

### 1. 内置断点定义

```typescript
const responsiveBreakpoints = {
  xs: 576,    // 超小屏幕 < 576px
  sm: 768,    // 小屏幕 ≥ 768px  
  md: 992,    // 中等屏幕 ≥ 992px
  lg: 1200,   // 大屏幕 ≥ 1200px
  xl: 1920    // 超大屏幕 ≥ 1920px
}

// 移动端断点配置
const mobileFormOptions = {
  mobileBreakpoint: 768,  // 移动端断点
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // 移动端单列布局
    mobileHideLabels: false,       // 是否隐藏标签
    breakpoints: responsiveBreakpoints
  }
}
```

### 2. 自适应栅格配置

```typescript
const responsiveFormItems = [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    cols: {
      // 基础栅格配置
      span: 12,
      
      // 响应式配置
      xs: 24,    // 超小屏：占满整行
      sm: 24,    // 小屏：占满整行
      md: 12,    // 中屏：占一半
      lg: 8,     // 大屏：占三分之一
      xl: 6      // 超大屏：占四分之一
    }
  },
  {
    label: '邮箱地址',
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
    label: '手机号码',
    prop: 'phone',
    render: 'input',
    cols: {
      xs: 24,
      sm: 24, 
      md: 12,
      lg: 8,
      xl: 6
    },
    // 移动端专用配置
    mobileProps: {
      type: 'tel',           // 移动端使用电话键盘
      inputmode: 'numeric'   // 数字输入模式
    }
  }
]
```

## 移动端专用配置

### 1. mobileProps 配置

```typescript
const mobileOptimizedFields = [
  {
    label: '手机号',
    prop: 'mobile',
    render: 'input',
    renderProps: {
      placeholder: '请输入手机号'
    },
    // 移动端专用属性
    mobileProps: {
      type: 'tel',
      inputmode: 'numeric',
      pattern: '[0-9]*',
      autocomplete: 'tel',
      size: 'large'          // 移动端使用大尺寸
    }
  },
  {
    label: '邮箱',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: '请输入邮箱地址'
    },
    mobileProps: {
      inputmode: 'email',
      autocomplete: 'email',
      autocapitalize: 'none',  // 禁用自动首字母大写
      spellcheck: false,       // 禁用拼写检查
      size: 'large'
    }
  },
  {
    label: '网址',
    prop: 'website',
    render: 'input',
    renderProps: {
      placeholder: '请输入网站地址'
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
    label: '密码',
    prop: 'password',
    render: 'input',
    renderProps: {
      type: 'password',
      placeholder: '请输入密码'
    },
    mobileProps: {
      autocomplete: 'new-password',
      size: 'large'
    }
  }
]
```

### 2. 移动端隐藏配置

```typescript
const adaptiveVisibilityFields = [
  {
    label: '详细描述',
    prop: 'description',
    render: 'textarea',
    renderProps: {
      rows: 4,
      placeholder: '请输入详细描述'
    },
    // 移动端隐藏该字段
    mobileHide: true
  },
  {
    label: '备注信息',
    prop: 'remark',
    render: 'input',
    renderProps: {
      placeholder: '选填'
    },
    // 根据条件在移动端隐藏
    mobileHide: (model) => !model.showAdvanced
  },
  {
    label: '高级选项',
    prop: 'advanced',
    render: 'switch',
    // 移动端显示简化版本
    show: (model, item) => {
      const isMobile = window.innerWidth < 768
      return !isMobile || model.showAdvancedOnMobile
    }
  }
]
```

## 移动端布局优化

### 1. 单列布局配置

```typescript
const mobileLayoutConfig = {
  // 启用移动端单列布局
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    mobileHideLabels: false,
    
    // 移动端专用断点
    breakpoints: {
      xs: 480,   // 手机竖屏
      sm: 768,   // 手机横屏/平板竖屏
      md: 992,   // 平板横屏
      lg: 1200,  // 小桌面
      xl: 1920   // 大桌面
    }
  }
}

// 手动控制移动端布局
const isMobileLayout = computed(() => {
  return formRef.value?.isMobileState() || false
})

// 根据移动端状态调整表单配置
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

### 2. 移动端表单组件尺寸

```typescript
const mobileSizedFields = [
  {
    label: '用户名',
    prop: 'username',
    render: 'input',
    renderProps: {
      size: 'default'  // 桌面端默认尺寸
    },
    mobileProps: {
      size: 'large'    // 移动端大尺寸，便于触摸
    }
  },
  {
    label: '选择器',
    prop: 'selector',
    render: 'select',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',
      teleported: false  // 移动端不使用传送门，避免遮罩问题
    }
  },
  {
    label: '日期选择',
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

## 触摸交互优化

### 1. 触摸友好的组件配置

```typescript
const touchFriendlyFields = [
  {
    label: '滑块控制',
    prop: 'slider',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 100,
      step: 5,
      showInput: false  // 移动端隐藏输入框
    },
    mobileProps: {
      showInput: false,
      height: 6,        // 增加滑块高度，便于触摸
      showTooltip: true,
      tooltipClass: 'mobile-slider-tooltip'
    }
  },
  {
    label: '评分',
    prop: 'rating',
    render: 'rate',
    renderProps: {
      max: 5,
      allowHalf: false  // 移动端禁用半星
    },
    mobileProps: {
      allowHalf: false,
      size: 'large',    // 增大星星尺寸
      textColor: '#ff9900'
    }
  },
  {
    label: '开关',
    prop: 'switch',
    render: 'switch',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',    // 增大开关尺寸，便于点击
      width: 60
    }
  }
]
```

### 2. 移动端上传组件

```typescript
const mobileUploadField = {
  label: '文件上传',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    listType: 'picture-card',
    multiple: true
  },
  mobileProps: {
    listType: 'picture',     // 移动端使用列表样式
    drag: false,             // 禁用拖拽
    showFileList: true,
    accept: 'image/*',       // 调用相机/相册
    capture: 'environment'   // 指定相机类型
  },
  renderSlots: {
    trigger: () => {
      const isMobile = window.innerWidth < 768
      return h('el-button', {
        type: 'primary',
        size: isMobile ? 'large' : 'default',
        icon: isMobile ? 'Camera' : 'Upload'
      }, isMobile ? '拍照/选择图片' : '选择文件')
    }
  }
}
```

## 设备检测与适配

### 1. 设备类型检测

```typescript
const deviceDetection = {
  // 检测设备类型
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },
  
  // 检测是否为触摸设备
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },
  
  // 检测屏幕方向
  getOrientation: () => {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  },
  
  // 获取设备像素比
  getPixelRatio: () => {
    return window.devicePixelRatio || 1
  }
}

// 根据设备特性调整表单
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

### 2. 屏幕方向变化处理

```typescript
// 监听屏幕方向变化
const handleOrientationChange = () => {
  const isPortrait = window.innerHeight > window.innerWidth
  
  // 根据方向调整布局
  if (formRef.value) {
    formRef.value.updateOptions(options => ({
      ...options,
      responsiveConfig: {
        ...options.responsiveConfig,
        mobileHideLabels: isPortrait,  // 竖屏时隐藏标签
        mobileSingleColumn: true
      }
    }))
    
    // 手动更新响应式状态
    formRef.value.updateResponsiveState()
  }
}

// 添加事件监听
onMounted(() => {
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', debounce(handleOrientationChange, 300))
})

onUnmounted(() => {
  window.removeEventListener('orientationchange', handleOrientationChange)
  window.removeEventListener('resize', handleOrientationChange)
})
```

## PWA 和移动端优化

### 1. PWA 表单配置

```typescript
const pwaFormConfig = {
  // PWA 环境下的表单配置
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    breakpoints: {
      xs: 320,   // 最小手机屏幕
      sm: 768,   // 平板竖屏
      md: 1024,  // 平板横屏
      lg: 1440,  // 桌面
      xl: 1920   // 大屏桌面
    }
  },
  
  // PWA 专用加载配置
  loadingConfig: {
    text: '正在处理...',
    background: 'rgba(0, 0, 0, 0.7)',
    fullscreen: true,  // PWA 中使用全屏加载
    lock: true
  }
}

// PWA 离线状态处理
const handleOfflineForm = () => {
  if (!navigator.onLine) {
    // 离线时禁用异步验证
    const items = formRef.value?.getItems() || []
    items.forEach(item => {
      if (item.asyncValidator) {
        formRef.value?.updateItem(item.prop, {
          asyncValidator: undefined,
          itemProps: {
            ...item.itemProps,
            rules: [
              ...(item.itemProps?.rules || []),
              { required: true, message: '离线模式下请填写此字段', trigger: 'blur' }
            ]
          }
        })
      }
    })
    
    ElMessage.warning('当前处于离线状态，部分功能受限')
  }
}
```

### 2. 移动端性能优化

```typescript
const mobilePerformanceOptimization = {
  // 延迟加载非关键字段
  lazyLoadFields: (fields: MaFormItem[]) => {
    const criticalFields = fields.filter(field => field.priority === 'high')
    const nonCriticalFields = fields.filter(field => field.priority !== 'high')
    
    // 先加载关键字段
    formRef.value?.setItems(criticalFields)
    
    // 延迟加载非关键字段
    setTimeout(() => {
      nonCriticalFields.forEach(field => {
        formRef.value?.appendItem(field)
      })
    }, 100)
  },
  
  // 虚拟滚动长表单
  enableVirtualScrolling: (threshold = 20) => {
    const items = formRef.value?.getItems() || []
    if (items.length > threshold) {
      // 实现虚拟滚动逻辑
      console.log('启用虚拟滚动优化')
    }
  },
  
  // 图片懒加载
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
    
    // 监听表单中的图片
    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => observer.observe(img))
  }
}
```

## 测试移动端适配

### 1. 响应式测试

```typescript
const responsiveTestUtils = {
  // 模拟不同屏幕尺寸
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
    
    // 触发resize事件
    window.dispatchEvent(new Event('resize'))
  },
  
  // 测试不同断点
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

## 相关链接

- [布局系统 - 响应式配置](/front/component/ma-form/examples/layout-systems#响应式系统)
- [ResponsiveConfig 配置](/front/component/ma-form#responsiveconfig-响应式配置)
- [移动端配置选项](/front/component/ma-form#移动端配置)