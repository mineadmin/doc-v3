# Performance Optimization Demo

Demonstrates MaForm's performance optimization strategies in large forms and complex scenarios, including virtual scrolling, lazy loading, caching mechanisms, and other high-performance features.

<DemoPreview dir="demos/ma-form/performance-demo" />

## Features

- **Large Form Optimization**: Performance optimization for handling hundreds of form items
- **Virtual Scrolling**: Virtual scrolling implementation for long list forms
- **Lazy Loading Mechanism**: On-demand loading of form items and data
- **Caching Strategy**: Intelligent caching to improve response speed
- **Rendering Optimization**: Reduce unnecessary re-renders
- **Memory Management**: Effective memory usage control

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
          placeholder: `Please enter field ${i}`,
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
    console.log(`Loaded page ${page}, containing ${pageItems.length} form items`)
  },
  
  // Scroll to load more
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

// Scroll listener for infinite loading
const setupInfiniteLoading = () => {
  const scrollContainer = document.querySelector('.ma-form-container')
  if (!scrollContainer) return
  
  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // Load more when scroll reaches 85%
    if (scrollPercentage > 0.85) {
      largeFormManager.loadMore()
    }
    
    // Preload when scroll reaches 70%
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

### 2. Virtual Scroll Implementation

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
    
    // Use requestAnimationFrame to optimize scroll performance
    requestAnimationFrame(() => {
      this.updateVisibleItems()
    })
  },
  
  // Enable virtual scroll
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
      
      // Update field configuration
      this.updateFieldWithLazyData(fieldProp, data)
      
    } catch (error) {
      console.error(`Field ${fieldProp} lazy loading failed:`, error)
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
      // Option data
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

// Lazy loading field example
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
    // Lazy load when field gains focus
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
    // Lazy load when field mounts
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

## Cache Optimization Strategy

### 1. Multi-level Cache System

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
    // Check L1 cache first
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
          // Ignore parse errors
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

### 2. Intelligent Pre-caching

```typescript
const smartPreCache = {
  // Pre-cache configuration
  preCacheRules: new Map<string, {
    condition: (context: any) => boolean
    loader: () => Promise<any>
    priority: number
  }>(),
  
  // Register pre-cache rule
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
    
    // Concurrently execute high-priority pre-caching
    const highPriorityTasks = sortedRules
      .filter(([_, rule]) => rule.priority >= 80)
      .map(async ([key, rule]) => {
        try {
          const data = await rule.loader()
          await formCache.set(key, data, 10 * 60 * 1000) // 10-minute cache
        } catch (error) {
          console.warn(`Pre-cache failed: ${key}`, error)
        }
      })
    
    await Promise.all(highPriorityTasks)
    
    // Serialize low-priority pre-caching (avoid resource contention)
    for (const [key, rule] of sortedRules.filter(([_, rule]) => rule.priority < 80)) {
      try {
        const data = await rule.loader()
        await formCache.set(key, data, 5 * 60 * 1000) // 5-minute cache
      } catch (error) {
        console.warn(`Pre-cache failed: ${key}`, error)
      }
    }
  }
}

// Register pre-cache rules example
const setupPreCacheRules = () => {
  // Pre-cache user frequent cities
  smartPreCache.registerPreCacheRule('user-frequent-cities', {
    condition: (context) => context.userType === 'frequent',
    loader: async () => {
      const response = await fetch('/api/user/frequent-cities')
      return response.json()
    },
    priority: 90
  })
  
  // Pre-cache department data
  smartPreCache.registerPreCacheRule('departments', {
    condition: (context) => context.hasPermission('view_departments'),
    loader: async () => {
      const response = await fetch('/api/departments')
      return response.json()
    },
    priority: 85
  })
  
  // Pre-cache form history data
  smartPreCache.registerPreCacheRule('form-history', {
    condition: (context) => context.formType === 'edit',
    loader: async () => {
      const response = await fetch(`/api/forms/${context.formId}/history`)
      return response.json()
    },
    priority: 70
  })
}
```

## Rendering Performance Optimization

### 1. Avoid Unnecessary Re-renders

```typescript
// Performance monitoring decorator
function performanceTrack(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value
  descriptor.value = function (...args: any[]) {
    const start = performance.now()
    const result = method.apply(this, args)
    const end = performance.now()
    
    if (end - start > 50) { // Operations exceeding 50ms need optimization
      console.warn(`Performance warning: ${propertyName} took ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }
  return descriptor
}

const renderOptimizer = {
  // Field change batching
  pendingUpdates: new Map<string, any>(),
  updateTimer: null as number | null,
  
  // Batch update fields
  @performanceTrack
  batchUpdateFields(updates: Record<string, Partial<MaFormItem>>) {
    Object.entries(updates).forEach(([prop, update]) => {
      this.pendingUpdates.set(prop, {
        ...this.pendingUpdates.get(prop),
        ...update
      })
    })
    
    this.scheduleUpdate()
  },
  
  // Schedule update
  scheduleUpdate() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
    }
    
    this.updateTimer = setTimeout(() => {
      this.flushUpdates()
    }, 16) // One render frame time
  },
  
  // Flush updates
  @performanceTrack
  flushUpdates() {
    if (this.pendingUpdates.size === 0) return
    
    // Batch apply updates
    for (const [prop, update] of this.pendingUpdates) {
      formRef.value?.updateItem(prop, update)
    }
    
    this.pendingUpdates.clear()
    this.updateTimer = null
  },
  
  // Virtualize long list rendering
  @performanceTrack
  virtualizeFormItems(items: MaFormItem[], visibleRange: { start: number; end: number }) {
    const { start, end } = visibleRange
    const visibleItems = items.slice(start, end)
    
    // Add placeholders to maintain scroll height
    const beforeHeight = start * 60 // Assume 60px height per item
    const afterHeight = (items.length - end) * 60
    
    const virtualizedItems = [
      // Pre-placeholder
      {
        label: '',
        prop: '__virtual_before',
        render: () => h('div', { style: { height: `${beforeHeight}px` } }),
        hide: beforeHeight === 0
      },
      // Visible items
      ...visibleItems,
      // Post-placeholder
      {
        label: '',
        prop: '__virtual_after',
        render: () => h('div', { style: { height: `${afterHeight}px` } }),
        hide: afterHeight === 0
      }
    ]
    
    return virtualizedItems
  }
}
```

### 2. Component Cache Strategy

```typescript
// Component cache management
const componentCache = {
  cache: new Map<string, any>(),
  maxSize: 50,
  
  // Get cached component
  getCachedComponent(key: string, factory: () => any) {
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    
    const component = factory()
    this.setCachedComponent(key, component)
    return component
  },
  
  // Set cached component
  setCachedComponent(key: string, component: any) {
    if (this.cache.size >= this.maxSize) {
      // LRU eviction strategy
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, component)
  },
  
  // Clear component cache
  clearCache() {
    this.cache.clear()
  }
}

// Cached form item factory
const createCachedFormItem = (config: {
  type: string
  props: Record<string, any>
}): MaFormItem => {
  const cacheKey = `${config.type}_${JSON.stringify(config.props)}`
  
  return {
    label: config.props.label,
    prop: config.props.prop,
    render: componentCache.getCachedComponent(cacheKey, () => {
      // Factory function for creating complex components
      return createComplexComponent(config.type, config.props)
    })
  }
}
```

## Memory Management Optimization

### 1. Memory Leak Prevention

```typescript
const memoryManager = {
  // Registered cleanup functions
  cleanupFunctions: new Set<() => void>(),
  
  // Register cleanup function
  registerCleanup(fn: () => void) {
    this.cleanupFunctions.add(fn)
  },
  
  // Execute cleanup
  cleanup() {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('Cleanup function execution failed:', error)
      }
    })
    this.cleanupFunctions.clear()
  },
  
  // Monitor memory usage
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
      
      console.log(`Memory usage: ${usedMB}MB / ${totalMB}MB`)
      
      // Trigger cleanup when memory usage is high
      if (usedMB > 100) { // 100MB threshold
        this.triggerGarbageCollection()
      }
    }
  },
  
  // Trigger garbage collection (development only)
  triggerGarbageCollection() {
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc()
    }
  }
}

// Auto memory management
const setupAutoMemoryManagement = () => {
  // Periodically clear expired cache
  const cacheCleanupInterval = setInterval(() => {
    formCache.clearExpired()
  }, 60000) // Clear every minute
  
  // Periodically monitor memory usage
  const memoryMonitorInterval = setInterval(() => {
    memoryManager.monitorMemoryUsage()
  }, 30000) // Monitor every 30 seconds
  
  // Register cleanup function
  memoryManager.registerCleanup(() => {
    clearInterval(cacheCleanupInterval)
    clearInterval(memoryMonitorInterval)
    formCache.clearExpired()
    componentCache.clearCache()
  })
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    memoryManager.cleanup()
  })
}

// Cleanup on component unmount
onUnmounted(() => {
  memoryManager.cleanup()
})
```

### 2. Large Data Processing Optimization

```typescript
const bigDataProcessor = {
  // Process large dataset in chunks
  async processLargeDataset<T, R>(
    data: T[], 
    processor: (chunk: T[]) => R[], 
    chunkSize = 1000
  ): Promise<R[]> {
    const results: R[] = []
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      
      // Use setTimeout to yield control, avoid blocking UI
      await new Promise(resolve => setTimeout(resolve, 0))
      
      const chunkResults = processor(chunk)
      results.push(...chunkResults)
      
      // Report progress
      const progress = Math.min(100, ((i + chunkSize) / data.length) * 100)
      this.reportProgress(progress)
    }
    
    return results
  },
  
  // Use Web Worker for compute-intensive tasks
  async processWithWorker<T, R>(data: T[], workerScript: string): Promise<R> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerScript)
      
      worker.postMessage(data)
      
      worker.onmessage = (event) => {
        resolve(event.data)
        worker.terminate()
      }
      
      worker.onerror = (error) => {
        reject(error)
        worker.terminate()
      }
    })
  },
  
  // Progress reporting
  reportProgress(progress: number) {
    console.log(`Processing progress: ${progress.toFixed(1)}%`)
    // UI progress bar can be updated here
  }
}
```

## Performance Monitoring and Analysis

### 1. Performance Metrics Collection

```typescript
interface PerformanceMetrics {
  renderTime: number
  updateTime: number
  validationTime: number
  memoryUsage: number
  cacheHitRate: number
}

const performanceMonitor = {
  metrics: ref<PerformanceMetrics>({
    renderTime: 0,
    updateTime: 0,
    validationTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0
  }),
  
  // Measure render time
  measureRenderTime<T>(fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    this.metrics.value.renderTime = end - start
    return result
  },
  
  // Collect performance metrics
  collectMetrics() {
    // Memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024
    }
    
    // Cache hit rate
    const cacheStats = formCache.getStats()
    const totalRequests = cacheStats.l1Items.reduce((sum, item) => sum + item.hitCount, 0)
    this.metrics.value.cacheHitRate = totalRequests > 0 
      ? (cacheStats.l1Items.length / totalRequests) * 100 
      : 0
  },
  
  // Generate performance report
  generateReport(): string {
    const metrics = this.metrics.value
    return `
Performance Report:
- Render Time: ${metrics.renderTime.toFixed(2)}ms
- Update Time: ${metrics.updateTime.toFixed(2)}ms  
- Validation Time: ${metrics.validationTime.toFixed(2)}ms
- Memory Usage: ${metrics.memoryUsage.toFixed(2)}MB
- Cache Hit Rate: ${metrics.cacheHitRate.toFixed(2)}%
    `.trim()
  }
}

// Auto performance monitoring
const startPerformanceMonitoring = () => {
  setInterval(() => {
    performanceMonitor.collectMetrics()
    
    // Performance anomaly alert
    const metrics = performanceMonitor.metrics.value
    if (metrics.renderTime > 100) {
      console.warn('Render performance anomaly:', performanceMonitor.generateReport())
    }
  }, 5000) // Collect metrics every 5 seconds
}
```

## Related Links

- [Large Form Optimization Strategy](/v3/front/component/ma-form#performance-optimization)
- [Cache System Design](/v3/front/component/ma-form/examples/advanced-scenarios#cache-optimization-strategy)
- [Memory Management Best Practices](/v3/front/component/ma-form#best-practices)