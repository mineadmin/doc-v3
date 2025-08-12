# Mobile Responsiveness

Demonstrates MaForm's responsive features on mobile devices, including breakpoint adaptation, mobile optimization, touch interaction, and device-specific configurations.

<DemoPreview dir="demos/ma-form/mobile-responsive" />

## Features

- **Breakpoint Responsiveness**: Automatically adapts layout based on screen size
- **Mobile Optimization**: Special optimizations for mobile devices
- **Touch-Friendly**: Interaction design optimized for touch operations
- **Device Detection**: Automatically identifies mobile devices and applies corresponding configurations
- **Flexible Configuration**: Supports mobile-specific field configurations

## Responsive Breakpoint System

### 1. Built-in Breakpoint Definitions

```typescript
const responsiveBreakpoints = {
  xs: 576,    // Extra small screens < 576px
  sm: 768,    // Small screens ≥ 768px  
  md: 992,    // Medium screens ≥ 992px
  lg: 1200,   // Large screens ≥ 1200px
  xl: 1920    // Extra large screens ≥ 1920px
}

// Mobile breakpoint configuration
const mobileFormOptions = {
  mobileBreakpoint: 768,  // Mobile breakpoint
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,      // Single-column layout on mobile
    mobileHideLabels: false,       // Whether to hide labels
    breakpoints: responsiveBreakpoints
  }
}
```

### 2. Adaptive Grid Configuration

```typescript
const responsiveFormItems = [
  {
    label: 'Username',
    prop: 'username',
    render: 'input',
    cols: {
      // Basic grid configuration
      span: 12,
      
      // Responsive configuration
      xs: 24,    // Extra small screens: full width
      sm: 24,    // Small screens: full width
      md: 12,    // Medium screens: half width
      lg: 8,     // Large screens: one-third width
      xl: 6      // Extra large screens: one-quarter width
    }
  },
  {
    label: 'Email',
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
    label: 'Phone',
    prop: 'phone',
    render: 'input',
    cols: {
      xs: 24,
      sm: 24, 
      md: 12,
      lg: 8,
      xl: 6
    },
    // Mobile-specific configuration
    mobileProps: {
      type: 'tel',           // Use telephone keyboard on mobile
      inputmode: 'numeric'   // Numeric input mode
    }
  }
]
```

## Mobile-Specific Configuration

### 1. mobileProps Configuration

```typescript
const mobileOptimizedFields = [
  {
    label: 'Mobile',
    prop: 'mobile',
    render: 'input',
    renderProps: {
      placeholder: 'Enter mobile number'
    },
    // Mobile-specific properties
    mobileProps: {
      type: 'tel',
      inputmode: 'numeric',
      pattern: '[0-9]*',
      autocomplete: 'tel',
      size: 'large'          // Use large size on mobile
    }
  },
  {
    label: 'Email',
    prop: 'email',
    render: 'input',
    renderProps: {
      type: 'email',
      placeholder: 'Enter email address'
    },
    mobileProps: {
      inputmode: 'email',
      autocomplete: 'email',
      autocapitalize: 'none',  // Disable auto-capitalization
      spellcheck: false,       // Disable spell check
      size: 'large'
    }
  },
  {
    label: 'Website',
    prop: 'website',
    render: 'input',
    renderProps: {
      placeholder: 'Enter website URL'
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
    label: 'Password',
    prop: 'password',
    render: 'input',
    renderProps: {
      type: 'password',
      placeholder: 'Enter password'
    },
    mobileProps: {
      autocomplete: 'new-password',
      size: 'large'
    }
  }
]
```

### 2. Mobile Visibility Configuration

```typescript
const adaptiveVisibilityFields = [
  {
    label: 'Description',
    prop: 'description',
    render: 'textarea',
    renderProps: {
      rows: 4,
      placeholder: 'Enter detailed description'
    },
    // Hide this field on mobile
    mobileHide: true
  },
  {
    label: 'Remarks',
    prop: 'remark',
    render: 'input',
    renderProps: {
      placeholder: 'Optional'
    },
    // Conditionally hide on mobile
    mobileHide: (model) => !model.showAdvanced
  },
  {
    label: 'Advanced Options',
    prop: 'advanced',
    render: 'switch',
    // Show simplified version on mobile
    show: (model, item) => {
      const isMobile = window.innerWidth < 768
      return !isMobile || model.showAdvancedOnMobile
    }
  }
]
```

## Mobile Layout Optimization

### 1. Single-Column Layout Configuration

```typescript
const mobileLayoutConfig = {
  // Enable single-column layout on mobile
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    mobileHideLabels: false,
    
    // Mobile-specific breakpoints
    breakpoints: {
      xs: 480,   // Phone portrait
      sm: 768,   // Phone landscape/tablet portrait
      md: 992,   // Tablet landscape
      lg: 1200,  // Small desktop
      xl: 1920   // Large desktop
    }
  }
}

// Manually control mobile layout
const isMobileLayout = computed(() => {
  return formRef.value?.isMobileState() || false
})

// Adjust form configuration based on mobile state
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

### 2. Mobile Form Component Sizing

```typescript
const mobileSizedFields = [
  {
    label: 'Username',
    prop: 'username',
    render: 'input',
    renderProps: {
      size: 'default'  // Default size on desktop
    },
    mobileProps: {
      size: 'large'    // Larger size on mobile for better touch
    }
  },
  {
    label: 'Selector',
    prop: 'selector',
    render: 'select',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',
      teleported: false  // Disable teleport on mobile to avoid overlay issues
    }
  },
  {
    label: 'Date Picker',
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

## Touch Interaction Optimization

### 1. Touch-Friendly Component Configuration

```typescript
const touchFriendlyFields = [
  {
    label: 'Slider',
    prop: 'slider',
    render: 'slider',
    renderProps: {
      min: 0,
      max: 100,
      step: 5,
      showInput: false  // Hide input on mobile
    },
    mobileProps: {
      showInput: false,
      height: 6,        // Increase slider height for better touch
      showTooltip: true,
      tooltipClass: 'mobile-slider-tooltip'
    }
  },
  {
    label: 'Rating',
    prop: 'rating',
    render: 'rate',
    renderProps: {
      max: 5,
      allowHalf: false  // Disable half stars on mobile
    },
    mobileProps: {
      allowHalf: false,
      size: 'large',    // Increase star size
      textColor: '#ff9900'
    }
  },
  {
    label: 'Switch',
    prop: 'switch',
    render: 'switch',
    renderProps: {
      size: 'default'
    },
    mobileProps: {
      size: 'large',    // Increase switch size for better tapping
      width: 60
    }
  }
]
```

### 2. Mobile Upload Component

```typescript
const mobileUploadField = {
  label: 'File Upload',
  prop: 'files',
  render: 'upload',
  renderProps: {
    action: '/api/upload',
    listType: 'picture-card',
    multiple: true
  },
  mobileProps: {
    listType: 'picture',     // Use list style on mobile
    drag: false,             // Disable drag
    showFileList: true,
    accept: 'image/*',       // Access camera/photo library
    capture: 'environment'   // Specify camera type
  },
  renderSlots: {
    trigger: () => {
      const isMobile = window.innerWidth < 768
      return h('el-button', {
        type: 'primary',
        size: isMobile ? 'large' : 'default',
        icon: isMobile ? 'Camera' : 'Upload'
      }, isMobile ? 'Take Photo/Select Image' : 'Select File')
    }
  }
}
```

## Device Detection and Adaptation

### 1. Device Type Detection

```typescript
const deviceDetection = {
  // Detect device type
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },
  
  // Detect touch device
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },
  
  // Detect screen orientation
  getOrientation: () => {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  },
  
  // Get device pixel ratio
  getPixelRatio: () => {
    return window.devicePixelRatio || 1
  }
}

// Adjust form based on device characteristics
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

### 2. Screen Orientation Change Handling

```typescript
// Listen for orientation changes
const handleOrientationChange = () => {
  const isPortrait = window.innerHeight > window.innerWidth
  
  // Adjust layout based on orientation
  if (formRef.value) {
    formRef.value.updateOptions(options => ({
      ...options,
      responsiveConfig: {
        ...options.responsiveConfig,
        mobileHideLabels: isPortrait,  // Hide labels in portrait
        mobileSingleColumn: true
      }
    }))
    
    // Manually update responsive state
    formRef.value.updateResponsiveState()
  }
}

// Add event listeners
onMounted(() => {
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', debounce(handleOrientationChange, 300))
})

onUnmounted(() => {
  window.removeEventListener('orientationchange', handleOrientationChange)
  window.removeEventListener('resize', handleOrientationChange)
})
```

## PWA and Mobile Optimization

### 1. PWA Form Configuration

```typescript
const pwaFormConfig = {
  // Form configuration in PWA environment
  responsiveConfig: {
    enabled: true,
    mobileSingleColumn: true,
    breakpoints: {
      xs: 320,   // Smallest phone screen
      sm: 768,   // Tablet portrait
      md: 1024,  // Tablet landscape
      lg: 1440,  // Desktop
      xl: 1920   // Large desktop
    }
  },
  
  // PWA-specific loading configuration
  loadingConfig: {
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
    fullscreen: true,  // Use fullscreen loading in PWA
    lock: true
  }
}

// Offline form handling
const handleOfflineForm = () => {
  if (!navigator.onLine) {
    // Disable async validation when offline
    const items = formRef.value?.getItems() || []
    items.forEach(item => {
      if (item.asyncValidator) {
        formRef.value?.updateItem(item.prop, {
          asyncValidator: undefined,
          itemProps: {
            ...item.itemProps,
            rules: [
              ...(item.itemProps?.rules || []),
              { required: true, message: 'This field is required in offline mode', trigger: 'blur' }
            ]
          }
        })
      }
    })
    
    ElMessage.warning('You are currently offline, some features are limited')
  }
}
```

### 2. Mobile Performance Optimization

```typescript
const mobilePerformanceOptimization = {
  // Lazy load non-critical fields
  lazyLoadFields: (fields: MaFormItem[]) => {
    const criticalFields = fields.filter(field => field.priority === 'high')
    const nonCriticalFields = fields.filter(field => field.priority !== 'high')
    
    // Load critical fields first
    formRef.value?.setItems(criticalFields)
    
    // Lazy load non-critical fields
    setTimeout(() => {
      nonCriticalFields.forEach(field => {
        formRef.value?.appendItem(field)
      })
    }, 100)
  },
  
  // Virtual scrolling for long forms
  enableVirtualScrolling: (threshold = 20) => {
    const items = formRef.value?.getItems() || []
    if (items.length > threshold) {
      // Implement virtual scrolling logic
      console.log('Enabling virtual scrolling optimization')
    }
  },
  
  // Image lazy loading
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
    
    // Observe images in form
    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => observer.observe(img))
  }
}
```

## Testing Mobile Adaptation

### 1. Responsive Testing

```typescript
const responsiveTestUtils = {
  // Simulate different screen sizes
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
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'))
  },
  
  // Test different breakpoints
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

## Related Links

- [Layout System - Responsive Configuration](/en/front/component/ma-form/examples/layout-systems#responsive-system)
- [ResponsiveConfig Settings](/en/front/component/ma-form#responsiveconfig-settings)
- [Mobile Configuration Options](/en/front/component/ma-form#mobile-configuration)