# Performance Optimization Demo

Demonstrates MaForm's performance optimization strategies for large forms and complex scenarios, including virtual scrolling, lazy loading, caching mechanisms, and other high-performance features.

<DemoPreview dir="demos/ma-form/performance-demo" />

## Features

- **Large Form Optimization**: Performance optimizations for handling hundreds of form items
- **Virtual Scrolling**: Implementation of virtual scrolling for long lists of form items
- **Lazy Loading**: On-demand loading of form items and data
- **Caching Strategy**: Intelligent caching to improve response speed
- **Rendering Optimization**: Reduced unnecessary re-rendering
- **Memory Management**: Effective control of memory usage

## Large Form Performance Optimization

### 1. Pagination Loading Strategy

```typescript
interface FormPageConfig {
  pageSize: number        // Number of form items per page
  currentPage: number     // Current page number
  totalItems: number      // Total number of form items
  preloadPages: number    // Number of pages to preload
}

const largeFormManager = {
  pageConfig: ref<FormPageConfig>({
    pageSize: 50,
    currentPage: 1,
    totalItems: 0,
    preloadPages: 1
  }),
  
  allFormItems: [] as MaFormItem[],
  loadedPages: new Set<number>(),
  
  // Initialize large form
  async initLargeForm(totalItems: number) {
    this.pageConfig.value.totalItems = totalItems
    this.allFormItems = await this.generateLargeFormItems(totalItems)
    
    // Load first page
    await this.loadPage(1)
  },
  
  // Generate large number of form items
  async generateLargeFormItems(count: number): Promise<MaFormItem[]> {
    const items: MaFormItem[] = []
    
    for (let i = 1; i <= count; i++) {
      items.push({
        label: `Field ${i}`,
        prop: `field_${i}`,
        render: this.getRandomRenderType(),
        renderProps: {
          placeholder: `Enter field ${i}`,
          clearable: true
        },
        cols: { xs: 24, sm: 12, md: 8, lg: 6 },
        
        // Add field priority for lazy loading
        priority: i <= 20 ? 'high' : i <= 100 ? 'medium' : 'low'
      })
    }
    
    return items
  },
  
  // Randomly select render type
  getRandomRenderType(): string {
    const types = ['input', 'select', 'datePicker', 'inputNumber', 'textarea', 'switch']
    return types[Math.floor(Math.random() * types.length)]
  },
  
  // Load specified page
  async loadPage(page: number) {
    if (this.loadedPages.has(page)) return
    
    const { pageSize } = this.pageConfig.value
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, this.allFormItems.length)
    
    const pageItems = this.allFormItems.slice(startIndex, endIndex)
    
    // Batch add to form
    pageItems.forEach(item => {
      formRef.value?.appendItem(item)
    })
    
    this.loadedPages.add(page)
    console.log(`Loaded page ${page} with ${pageItems.length} form items`)
  },
  
  // Load more on scroll
  async loadMore() {
    const { currentPage, totalItems, pageSize } = this.pageConfig.value
    const totalPages = Math.ceil(totalItems / pageSize)
    
    if (currentPage < totalPages) {
      this.pageConfig.value.currentPage++
      await this.loadPage(this.pageConfig.value.currentPage)
    }
  },
  
  // Preload next page
  async preloadNext() {
    const { currentPage, preloadPages } = this.pageConfig.value
    for (let i = 1; i <= preloadPages; i++) {
      await this.loadPage(currentPage + i)
    }
  }
}

// Implement infinite loading with scroll listener
const setupInfiniteLoading = () => {
  const scrollContainer = document.querySelector('.ma-form-container')
  if (!scrollContainer) return
  
  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // Load more when scrolled to 85%
    if (scrollPercentage > 0.85) {
      largeFormManager.loadMore()
    }
    
    // Preload when scrolled to 70%
    if (scrollPercentage > 0.7) {
      largeFormManager.preloadNext()
    }
  }, 300)
  
  scrollContainer.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    scrollContainer.removeEventListener('scroll', handleScroll)
  })
}
```

### 2. Virtual Scrolling Implementation

```typescript
interface VirtualScrollConfig {
  itemHeight: number      // Height of each item
  visibleCount: number    // Number of visible items
  bufferSize: number      // Buffer size
  scrollTop: number       // Scroll position
}

const virtualScrollManager = {
  config: ref<VirtualScrollConfig>({
    itemHeight: 60,
    visibleCount: 20,
    bufferSize: 5,
    scrollTop: 0
  }),
  
  // Calculate visible range
  getVisibleRange() {
    const { itemHeight, visibleCount, bufferSize, scrollTop } = this.config.value
    
    const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize
    const endIndex = startIndex + visibleCount + bufferSize * 2
    
    return {
      startIndex: Math.max(0, startIndex),
      endIndex: Math.min(largeFormManager.allFormItems.length, endIndex)
    }
  },
  
  // Update visible items
  updateVisibleItems() {
    const { startIndex, endIndex } = this.getVisibleRange()
    const visibleItems = largeFormManager.allFormItems.slice(startIndex, endIndex)
    
    // Add virtual scroll offset styles
    const offsetStyle = {
      paddingTop: `${startIndex * this.config.value.itemHeight}px`,
      paddingBottom: `${(largeFormManager.allFormItems.length - endIndex) * this.config.value.itemHeight}px`
    }
    
    // Update form items
    formRef.value?.setItems(visibleItems.map(item => ({
      ...item,
      itemProps: {
        ...item.itemProps,
        style: offsetStyle
      }
    })))
  },
  
  // Handle scroll event
  handleScroll(event: Event) {
    const target = event.target as HTMLElement
    this.config.value.scrollTop = target.scrollTop
    
    // Optimize scroll performance with requestAnimationFrame
    requestAnimationFrame(() => {
      this.updateVisibleItems()
    })
  },
  
  // Enable virtual scrolling
  enableVirtualScroll() {
    const formContainer = document.querySelector('.ma-form')
    if (formContainer) {
      formContainer.addEventListener('scroll', this.handleScroll.bind(this))
      this.updateVisibleItems()
    }
  }
}
```

## Lazy Loading Optimization

### 1. Field Lazy Loading

```typescript
const lazyLoadManager = {
  // Lazy loading configuration
  lazyConfig: new Map<string, {
    loader: () => Promise<any>
    loading: boolean
    loaded: boolean
    data: any
  }>(),
  
  // Register lazy loading field
  registerLazyField(fieldProp: string, loader: () => Promise<any>) {
    this.lazyConfig.set(fieldProp, {
      loader,
      loading: false,
      loaded: false,
      data: null
    })
  },
  
  // Trigger field lazy loading
  async triggerLazyLoad(fieldProp: string) {
    const config = this.lazyConfig.get(fieldProp)
    if (!config || config.loading || config.loaded) return
    
    config.loading = true
    
    // Show loading state
    formRef.value?.updateItem(fieldProp, {
      renderProps: { loading: true }
    })
    
    try {
      const data = await config.loader()
      config.data = data
      config.loaded = true
      
      // Update field configuration with lazy data
      this.updateFieldWithLazyData(fieldProp, data)
      
    } catch (error) {
      console.error(`Lazy loading failed for field ${fieldProp}:`, error)
    } finally {
      config.loading = false
      formRef.value?.updateItem(fieldProp, {
        renderProps: { loading: false }
      })
    }
  },
  
  // Update field with lazy loaded data
  updateFieldWithLazyData(fieldProp: string, data: any) {
    const item = formRef.value?.getItemByProp(fieldProp)
    if (!item) return
    
    // Update field based on data type
    if (Array.isArray(data)) {
      // Options data
      const slots = () => data.map(option => 
        h('el-option', {
          key: option.value,
          label: option.label,
          value: option.value
        })
      )
      
      formRef.value?.updateItem(fieldProp, {
        renderSlots: { default: slots }
      })
    } else if (typeof data === 'object') {
      // Field configuration data
      formRef.value?.updateItem(fieldProp, data)
    }
  }
}

// Example of lazy loading fields
const createLazyLoadFields = (): MaFormItem[] => [
  {
    label: 'City Selection',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: 'Select city',
      loading: false
    },
    renderSlots: {
      default: () => [h('el-option', { label: 'Click to load...', value: '', disabled: true })]
    },
    // Lazy load on field focus
    onFocus: () => {
      lazyLoadManager.triggerLazyLoad('city')
    }
  },
  {
    label: 'Department Selection',
    prop: 'department',
    render: 'cascader',
    renderProps: {
      placeholder: 'Select department',
      options: []
    },
    // Lazy load on field mount
    onMounted: () => {
      lazyLoadManager.triggerLazyLoad('department')
    }
  }
]

// Register lazy loaders
const setupLazyLoaders = () => {
  // City data lazy loading
  lazyLoadManager.registerLazyField('city', async () => {
    const response = await fetch('/api/cities')
    return await response.json()
  })
  
  // Department data lazy loading
  lazyLoadManager.registerLazyField('department', async () => {
    const response = await fetch('/api/departments')
    const data = await response.json()
    return { renderProps: { options: data } }
  })
}
```

### 2. Image Lazy Loading

```typescript
const imageLazyLoader = {
  observer: null as IntersectionObserver | null,
  
  // Initialize image lazy loading
  initImageLazyLoading() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target as HTMLImageElement)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )
  },
  
  // Load image
  loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    if (src) {
      img.src = src
      img.classList.remove('lazy')
      img.classList.add('loaded')
      this.observer?.unobserve(img)
    }
  },
  
  // Observe image elements
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => {
      this.observer?.observe(img)
    })
  },
  
  // Destroy observer
  destroy() {
    this.observer?.disconnect()
    this.observer = null
  }
}

// Initialize on component mount
onMounted(() => {
  imageLazyLoader.initImageLazyLoading()
  imageLazyLoader.observeImages()
})

onUnmounted(() => {
  imageLazyLoader.destroy()
})
```

## Caching Optimization Strategy

### 1. Multi-Level Cache System

```typescript
interface CacheItem<T = any> {
  data: T
  timestamp: number
  ttl: number           // Time to live (milliseconds)
  hitCount: number      // Hit count
}

class MultiLevelCache {
  private l1Cache = new Map<string, CacheItem>()  // Memory cache (fast)
  private l2Cache: LocalStorage                   // Local storage cache (persistent)
  private maxL1Size = 100                         // Maximum L1 cache entries
  private defaultTTL = 5 * 60 * 1000             // Default 5 minutes TTL
  
  constructor() {
    this.l2Cache = {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key)
    }
  }
  
  // Get cached data
  async get<T>(key: string): Promise<T | null> {
    // First check L1 cache
    const l1Item = this.l1Cache.get(key)
    if (l1Item && !this.isExpired(l1Item)) {
      l1Item.hitCount++
      return l1Item.data
    }
    
    // Then check L2 cache
    const l2Data = this.l2Cache.getItem(key)
    if (l2Data) {
      try {
        const l2Item: CacheItem<T> = JSON.parse(l2Data)
        if (!this.isExpired(l2Item)) {
          // Promote hot data to L1 cache
          this.setL1Cache(key, l2Item.data, l2Item.ttl)
          return l2Item.data
        }
      } catch (error) {
        console.warn(`Failed to parse L2 cache: ${key}`, error)
      }
    }
    
    return null
  }
  
  // Set cached data
  async set<T>(key: string, data: T, ttl = this.defaultTTL) {
    // Set L1 cache
    this.setL1Cache(key, data, ttl)
    
    // Set L2 cache
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hitCount: 0
    }
    
    try {
      this.l2Cache.setItem(key, JSON.stringify(cacheItem))
    } catch (error) {
      console.warn(`Failed to set L2 cache: ${key}`, error)
    }
  }
  
  // Set L1 cache
  private setL1Cache<T>(key: string, data: T, ttl: number) {
    // Check L1 cache size limit
    if (this.l1Cache.size >= this.maxL1Size) {
      this.evictL1Cache()
    }
    
    this.l1Cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hitCount: 0
    })
  }
  
  // L1 cache eviction strategy (LFU - Least Frequently Used)
  private evictL1Cache() {
    let minHitCount = Infinity
    let evictKey = ''
    
    for (const [key, item] of this.l1Cache) {
      if (item.hitCount < minHitCount) {
        minHitCount = item.hitCount
        evictKey = key
      }
    }
    
    if (evictKey) {
      this.l1Cache.delete(evictKey)
    }
  }
  
  // Check if expired
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl
  }
  
  // Clear expired cache
  clearExpired() {
    const now = Date.now()
    
    // Clear expired L1 cache
    for (const [key, item] of this.l1Cache) {
      if (this.isExpired(item)) {
        this.l1Cache.delete(key)
      }
    }
    
    // Clear expired L2 cache
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          if (item.timestamp && this.isExpired(item)) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // Ignore parsing errors
        }
      }
    }
  }
  
  // Get cache statistics
  getStats() {
    return {
      l1Size: this.l1Cache.size,
      l1Items: Array.from(this.l1Cache.entries()).map(([key, item]) => ({
        key,
        hitCount: item.hitCount,
        age: Date.now() - item.timestamp
      }))
    }
  }
}

// Global cache instance
const formCache = new MultiLevelCache()
```

### 2. Intelligent Pre-Caching

```typescript
const smartPreCache = {
  // Pre-caching configuration
  preCacheRules: new Map<string, {
    condition: (context: any) => boolean
    loader: () => Promise<any>
    priority: number
  }>(),
  
  // Register pre-caching rule
  registerPreCacheRule(key: string, rule: {
    condition: (context: any) => boolean
    loader: () => Promise<any>
    priority: number
  }) {
    this.preCacheRules.set(key, rule)
  },
  
  // Execute intelligent pre-caching
  async executeSmartPreCache(context: any) {
    // Sort rules by priority
    const sortedRules = Array.from(this.preCacheRules.entries())
      .filter(([_, rule]) => rule.condition(context))
      .sort(([_, a], [__, b]) => b.priority - a.priority)
    
    // Concurrently execute high priority pre-caching
    const highPriorityTasks = sortedRules
      .filter(([_, rule]) => rule.priority >= 80)
      .map(async ([key, rule]) => {
        try {
          const data = await rule.loader()
          await formCache.set(key, data, 10 * 60 * 1000) // 10 minutes cache
        } catch (error) {
          console.warn(`Pre-caching failed: ${key}`, error)
        }
      })
    
    await Promise.all(highPriorityTasks)
    
   