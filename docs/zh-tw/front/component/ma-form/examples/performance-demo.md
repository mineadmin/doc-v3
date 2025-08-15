# 效能最佳化演示

展示 MaForm 在大型表單和複雜場景下的效能最佳化策略，包括虛擬滾動、懶載入、快取機制等高效能特性。

<DemoPreview dir="demos/ma-form/performance-demo" />

## 功能特性

- **大表單最佳化**：處理數百個表單項的效能最佳化
- **虛擬滾動**：長列表表單的虛擬滾動實現
- **懶載入機制**：按需載入表單項和資料
- **快取策略**：智慧快取提升響應速度
- **渲染最佳化**：減少不必要的重渲染
- **記憶體管理**：有效控制記憶體使用

## 大表單效能最佳化

### 1. 分頁載入策略

```typescript
interface FormPageConfig {
  pageSize: number        // 每頁表單項數量
  currentPage: number     // 當前頁碼
  totalItems: number      // 總表單項數量
  preloadPages: number    // 預載入頁數
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
  
  // 初始化大表單
  async initLargeForm(totalItems: number) {
    this.pageConfig.value.totalItems = totalItems
    this.allFormItems = await this.generateLargeFormItems(totalItems)
    
    // 載入第一頁
    await this.loadPage(1)
  },
  
  // 生成大量表單項
  async generateLargeFormItems(count: number): Promise<MaFormItem[]> {
    const items: MaFormItem[] = []
    
    for (let i = 1; i <= count; i++) {
      items.push({
        label: `欄位 ${i}`,
        prop: `field_${i}`,
        render: this.getRandomRenderType(),
        renderProps: {
          placeholder: `請填寫欄位 ${i}`,
          clearable: true
        },
        cols: { xs: 24, sm: 12, md: 8, lg: 6 },
        
        // 新增欄位優先順序用於懶載入
        priority: i <= 20 ? 'high' : i <= 100 ? 'medium' : 'low'
      })
    }
    
    return items
  },
  
  // 隨機選擇渲染型別
  getRandomRenderType(): string {
    const types = ['input', 'select', 'datePicker', 'inputNumber', 'textarea', 'switch']
    return types[Math.floor(Math.random() * types.length)]
  },
  
  // 載入指定頁
  async loadPage(page: number) {
    if (this.loadedPages.has(page)) return
    
    const { pageSize } = this.pageConfig.value
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, this.allFormItems.length)
    
    const pageItems = this.allFormItems.slice(startIndex, endIndex)
    
    // 批次新增到表單
    pageItems.forEach(item => {
      formRef.value?.appendItem(item)
    })
    
    this.loadedPages.add(page)
    console.log(`已載入第 ${page} 頁，包含 ${pageItems.length} 個表單項`)
  },
  
  // 滾動載入更多
  async loadMore() {
    const { currentPage, totalItems, pageSize } = this.pageConfig.value
    const totalPages = Math.ceil(totalItems / pageSize)
    
    if (currentPage < totalPages) {
      this.pageConfig.value.currentPage++
      await this.loadPage(this.pageConfig.value.currentPage)
    }
  },
  
  // 預載入下一頁
  async preloadNext() {
    const { currentPage, preloadPages } = this.pageConfig.value
    for (let i = 1; i <= preloadPages; i++) {
      await this.loadPage(currentPage + i)
    }
  }
}

// 滾動監聽實現無限載入
const setupInfiniteLoading = () => {
  const scrollContainer = document.querySelector('.ma-form-container')
  if (!scrollContainer) return
  
  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // 滾動到85%時載入更多
    if (scrollPercentage > 0.85) {
      largeFormManager.loadMore()
    }
    
    // 滾動到70%時預載入
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

### 2. 虛擬滾動實現

```typescript
interface VirtualScrollConfig {
  itemHeight: number      // 每項高度
  visibleCount: number    // 可見項數量
  bufferSize: number      // 緩衝區大小
  scrollTop: number       // 滾動位置
}

const virtualScrollManager = {
  config: ref<VirtualScrollConfig>({
    itemHeight: 60,
    visibleCount: 20,
    bufferSize: 5,
    scrollTop: 0
  }),
  
  // 計算可見範圍
  getVisibleRange() {
    const { itemHeight, visibleCount, bufferSize, scrollTop } = this.config.value
    
    const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize
    const endIndex = startIndex + visibleCount + bufferSize * 2
    
    return {
      startIndex: Math.max(0, startIndex),
      endIndex: Math.min(largeFormManager.allFormItems.length, endIndex)
    }
  },
  
  // 更新可見項
  updateVisibleItems() {
    const { startIndex, endIndex } = this.getVisibleRange()
    const visibleItems = largeFormManager.allFormItems.slice(startIndex, endIndex)
    
    // 新增虛擬滾動的偏移樣式
    const offsetStyle = {
      paddingTop: `${startIndex * this.config.value.itemHeight}px`,
      paddingBottom: `${(largeFormManager.allFormItems.length - endIndex) * this.config.value.itemHeight}px`
    }
    
    // 更新表單項
    formRef.value?.setItems(visibleItems.map(item => ({
      ...item,
      itemProps: {
        ...item.itemProps,
        style: offsetStyle
      }
    })))
  },
  
  // 處理滾動事件
  handleScroll(event: Event) {
    const target = event.target as HTMLElement
    this.config.value.scrollTop = target.scrollTop
    
    // 使用 requestAnimationFrame 最佳化滾動效能
    requestAnimationFrame(() => {
      this.updateVisibleItems()
    })
  },
  
  // 啟用虛擬滾動
  enableVirtualScroll() {
    const formContainer = document.querySelector('.ma-form')
    if (formContainer) {
      formContainer.addEventListener('scroll', this.handleScroll.bind(this))
      this.updateVisibleItems()
    }
  }
}
```

## 懶載入最佳化

### 1. 欄位懶載入

```typescript
const lazyLoadManager = {
  // 懶載入配置
  lazyConfig: new Map<string, {
    loader: () => Promise<any>
    loading: boolean
    loaded: boolean
    data: any
  }>(),
  
  // 註冊懶載入欄位
  registerLazyField(fieldProp: string, loader: () => Promise<any>) {
    this.lazyConfig.set(fieldProp, {
      loader,
      loading: false,
      loaded: false,
      data: null
    })
  },
  
  // 觸發欄位懶載入
  async triggerLazyLoad(fieldProp: string) {
    const config = this.lazyConfig.get(fieldProp)
    if (!config || config.loading || config.loaded) return
    
    config.loading = true
    
    // 顯示載入狀態
    formRef.value?.updateItem(fieldProp, {
      renderProps: { loading: true }
    })
    
    try {
      const data = await config.loader()
      config.data = data
      config.loaded = true
      
      // 更新欄位配置
      this.updateFieldWithLazyData(fieldProp, data)
      
    } catch (error) {
      console.error(`欄位 ${fieldProp} 懶載入失敗:`, error)
    } finally {
      config.loading = false
      formRef.value?.updateItem(fieldProp, {
        renderProps: { loading: false }
      })
    }
  },
  
  // 使用懶載入資料更新欄位
  updateFieldWithLazyData(fieldProp: string, data: any) {
    const item = formRef.value?.getItemByProp(fieldProp)
    if (!item) return
    
    // 根據資料型別更新欄位
    if (Array.isArray(data)) {
      // 選項資料
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
      // 欄位配置資料
      formRef.value?.updateItem(fieldProp, data)
    }
  }
}

// 懶載入欄位示例
const createLazyLoadFields = (): MaFormItem[] => [
  {
    label: '城市選擇',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: '選擇城市',
      loading: false
    },
    renderSlots: {
      default: () => [h('el-option', { label: '點選載入...', value: '', disabled: true })]
    },
    // 欄位獲得焦點時懶載入
    onFocus: () => {
      lazyLoadManager.triggerLazyLoad('city')
    }
  },
  {
    label: '部門選擇',
    prop: 'department',
    render: 'cascader',
    renderProps: {
      placeholder: '選擇部門',
      options: []
    },
    // 欄位掛載時懶載入
    onMounted: () => {
      lazyLoadManager.triggerLazyLoad('department')
    }
  }
]

// 註冊懶載入器
const setupLazyLoaders = () => {
  // 城市資料懶載入
  lazyLoadManager.registerLazyField('city', async () => {
    const response = await fetch('/api/cities')
    return await response.json()
  })
  
  // 部門資料懶載入
  lazyLoadManager.registerLazyField('department', async () => {
    const response = await fetch('/api/departments')
    const data = await response.json()
    return { renderProps: { options: data } }
  })
}
```

### 2. 圖片懶載入

```typescript
const imageLazyLoader = {
  observer: null as IntersectionObserver | null,
  
  // 初始化圖片懶載入
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
  
  // 載入圖片
  loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    if (src) {
      img.src = src
      img.classList.remove('lazy')
      img.classList.add('loaded')
      this.observer?.unobserve(img)
    }
  },
  
  // 觀察圖片元素
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => {
      this.observer?.observe(img)
    })
  },
  
  // 銷燬觀察器
  destroy() {
    this.observer?.disconnect()
    this.observer = null
  }
}

// 在元件掛載時初始化
onMounted(() => {
  imageLazyLoader.initImageLazyLoading()
  imageLazyLoader.observeImages()
})

onUnmounted(() => {
  imageLazyLoader.destroy()
})
```

## 快取最佳化策略

### 1. 多級快取系統

```typescript
interface CacheItem<T = any> {
  data: T
  timestamp: number
  ttl: number           // 生存時間（毫秒）
  hitCount: number      // 命中次數
}

class MultiLevelCache {
  private l1Cache = new Map<string, CacheItem>()  // 記憶體快取（快速）
  private l2Cache: LocalStorage                   // 本地儲存快取（持久）
  private maxL1Size = 100                         // L1快取最大條目數
  private defaultTTL = 5 * 60 * 1000             // 預設5分鐘TTL
  
  constructor() {
    this.l2Cache = {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key)
    }
  }
  
  // 獲取快取資料
  async get<T>(key: string): Promise<T | null> {
    // 先查L1快取
    const l1Item = this.l1Cache.get(key)
    if (l1Item && !this.isExpired(l1Item)) {
      l1Item.hitCount++
      return l1Item.data
    }
    
    // 再查L2快取
    const l2Data = this.l2Cache.getItem(key)
    if (l2Data) {
      try {
        const l2Item: CacheItem<T> = JSON.parse(l2Data)
        if (!this.isExpired(l2Item)) {
          // 將熱資料提升到L1快取
          this.setL1Cache(key, l2Item.data, l2Item.ttl)
          return l2Item.data
        }
      } catch (error) {
        console.warn(`解析L2快取失敗: ${key}`, error)
      }
    }
    
    return null
  }
  
  // 設定快取資料
  async set<T>(key: string, data: T, ttl = this.defaultTTL) {
    // 設定L1快取
    this.setL1Cache(key, data, ttl)
    
    // 設定L2快取
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hitCount: 0
    }
    
    try {
      this.l2Cache.setItem(key, JSON.stringify(cacheItem))
    } catch (error) {
      console.warn(`設定L2快取失敗: ${key}`, error)
    }
  }
  
  // 設定L1快取
  private setL1Cache<T>(key: string, data: T, ttl: number) {
    // 檢查L1快取大小限制
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
  
  // L1快取淘汰策略（LFU - 最少使用頻率）
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
  
  // 檢查是否過期
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl
  }
  
  // 清除過期快取
  clearExpired() {
    const now = Date.now()
    
    // 清除L1過期快取
    for (const [key, item] of this.l1Cache) {
      if (this.isExpired(item)) {
        this.l1Cache.delete(key)
      }
    }
    
    // 清除L2過期快取
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          if (item.timestamp && this.isExpired(item)) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // 忽略解析錯誤
        }
      }
    }
  }
  
  // 獲取快取統計
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

// 全域性快取例項
const formCache = new MultiLevelCache()
```

### 2. 智慧預快取

```typescript
const smartPreCache = {
  // 預快取配置
  preCacheRules: new Map<string, {
    condition: (context: any) => boolean
    loader: () => Promise<any>
    priority: number
  }>(),
  
  // 註冊預快取規則
  registerPreCacheRule(key: string, rule: {
    condition: (context: any) => boolean
    loader: () => Promise<any>
    priority: number
  }) {
    this.preCacheRules.set(key, rule)
  },
  
  // 執行智慧預快取
  async executeSmartPreCache(context: any) {
    // 按優先順序排序規則
    const sortedRules = Array.from(this.preCacheRules.entries())
      .filter(([_, rule]) => rule.condition(context))
      .sort(([_, a], [__, b]) => b.priority - a.priority)
    
    // 併發執行高優先順序預快取
    const highPriorityTasks = sortedRules
      .filter(([_, rule]) => rule.priority >= 80)
      .map(async ([key, rule]) => {
        try {
          const data = await rule.loader()
          await formCache.set(key, data, 10 * 60 * 1000) // 10分鐘快取
        } catch (error) {
          console.warn(`預快取失敗: ${key}`, error)
        }
      })
    
    await Promise.all(highPriorityTasks)
    
    // 序列執行低優先順序預快取（避免資源競爭）
    for (const [key, rule] of sortedRules.filter(([_, rule]) => rule.priority < 80)) {
      try {
        const data = await rule.loader()
        await formCache.set(key, data, 5 * 60 * 1000) // 5分鐘快取
      } catch (error) {
        console.warn(`預快取失敗: ${key}`, error)
      }
    }
  }
}

// 註冊預快取規則示例
const setupPreCacheRules = () => {
  // 使用者常用城市預快取
  smartPreCache.registerPreCacheRule('user-frequent-cities', {
    condition: (context) => context.userType === 'frequent',
    loader: async () => {
      const response = await fetch('/api/user/frequent-cities')
      return response.json()
    },
    priority: 90
  })
  
  // 部門資料預快取
  smartPreCache.registerPreCacheRule('departments', {
    condition: (context) => context.hasPermission('view_departments'),
    loader: async () => {
      const response = await fetch('/api/departments')
      return response.json()
    },
    priority: 85
  })
  
  // 歷史表單資料預快取
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

## 渲染效能最佳化

### 1. 避免不必要的重渲染

```typescript
// 效能監控裝飾器
function performanceTrack(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value
  descriptor.value = function (...args: any[]) {
    const start = performance.now()
    const result = method.apply(this, args)
    const end = performance.now()
    
    if (end - start > 50) { // 超過50ms的操作需要最佳化
      console.warn(`效能警告: ${propertyName} 耗時 ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }
  return descriptor
}

const renderOptimizer = {
  // 欄位變化批處理
  pendingUpdates: new Map<string, any>(),
  updateTimer: null as number | null,
  
  // 批次更新欄位
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
  
  // 排程更新
  scheduleUpdate() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
    }
    
    this.updateTimer = setTimeout(() => {
      this.flushUpdates()
    }, 16) // 一個渲染幀的時間
  },
  
  // 重新整理更新
  @performanceTrack
  flushUpdates() {
    if (this.pendingUpdates.size === 0) return
    
    // 批次應用更新
    for (const [prop, update] of this.pendingUpdates) {
      formRef.value?.updateItem(prop, update)
    }
    
    this.pendingUpdates.clear()
    this.updateTimer = null
  },
  
  // 虛擬化長列表渲染
  @performanceTrack
  virtualizeFormItems(items: MaFormItem[], visibleRange: { start: number; end: number }) {
    const { start, end } = visibleRange
    const visibleItems = items.slice(start, end)
    
    // 新增佔位符保持滾動高度
    const beforeHeight = start * 60 // 假設每項60px高度
    const afterHeight = (items.length - end) * 60
    
    const virtualizedItems = [
      // 前置佔位符
      {
        label: '',
        prop: '__virtual_before',
        render: () => h('div', { style: { height: `${beforeHeight}px` } }),
        hide: beforeHeight === 0
      },
      // 可見項
      ...visibleItems,
      // 後置佔位符
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

### 2. 元件快取策略

```typescript
// 元件快取管理
const componentCache = {
  cache: new Map<string, any>(),
  maxSize: 50,
  
  // 獲取快取的元件
  getCachedComponent(key: string, factory: () => any) {
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    
    const component = factory()
    this.setCachedComponent(key, component)
    return component
  },
  
  // 設定快取的元件
  setCachedComponent(key: string, component: any) {
    if (this.cache.size >= this.maxSize) {
      // LRU淘汰策略
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, component)
  },
  
  // 清除元件快取
  clearCache() {
    this.cache.clear()
  }
}

// 使用快取的表單項工廠
const createCachedFormItem = (config: {
  type: string
  props: Record<string, any>
}): MaFormItem => {
  const cacheKey = `${config.type}_${JSON.stringify(config.props)}`
  
  return {
    label: config.props.label,
    prop: config.props.prop,
    render: componentCache.getCachedComponent(cacheKey, () => {
      // 建立複雜元件的工廠函式
      return createComplexComponent(config.type, config.props)
    })
  }
}
```

## 記憶體管理最佳化

### 1. 記憶體洩漏防護

```typescript
const memoryManager = {
  // 註冊的清理函式
  cleanupFunctions: new Set<() => void>(),
  
  // 註冊清理函式
  registerCleanup(fn: () => void) {
    this.cleanupFunctions.add(fn)
  },
  
  // 執行清理
  cleanup() {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('清理函式執行失敗:', error)
      }
    })
    this.cleanupFunctions.clear()
  },
  
  // 監控記憶體使用
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
      
      console.log(`記憶體使用: ${usedMB}MB / ${totalMB}MB`)
      
      // 記憶體使用過高時觸發清理
      if (usedMB > 100) { // 100MB閾值
        this.triggerGarbageCollection()
      }
    }
  },
  
  // 觸發垃圾回收（僅開發環境）
  triggerGarbageCollection() {
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc()
    }
  }
}

// 自動記憶體管理
const setupAutoMemoryManagement = () => {
  // 定期清理過期快取
  const cacheCleanupInterval = setInterval(() => {
    formCache.clearExpired()
  }, 60000) // 每分鐘清理一次
  
  // 定期監控記憶體使用
  const memoryMonitorInterval = setInterval(() => {
    memoryManager.monitorMemoryUsage()
  }, 30000) // 每30秒監控一次
  
  // 註冊清理函式
  memoryManager.registerCleanup(() => {
    clearInterval(cacheCleanupInterval)
    clearInterval(memoryMonitorInterval)
    formCache.clearExpired()
    componentCache.clearCache()
  })
  
  // 頁面解除安裝時清理
  window.addEventListener('beforeunload', () => {
    memoryManager.cleanup()
  })
}

// 元件解除安裝時清理
onUnmounted(() => {
  memoryManager.cleanup()
})
```

### 2. 大資料處理最佳化

```typescript
const bigDataProcessor = {
  // 分塊處理大資料
  async processLargeDataset<T, R>(
    data: T[], 
    processor: (chunk: T[]) => R[], 
    chunkSize = 1000
  ): Promise<R[]> {
    const results: R[] = []
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      
      // 使用 setTimeout 讓出控制權，避免阻塞UI
      await new Promise(resolve => setTimeout(resolve, 0))
      
      const chunkResults = processor(chunk)
      results.push(...chunkResults)
      
      // 報告進度
      const progress = Math.min(100, ((i + chunkSize) / data.length) * 100)
      this.reportProgress(progress)
    }
    
    return results
  },
  
  // 使用Web Worker處理計算密集型任務
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
  
  // 進度報告
  reportProgress(progress: number) {
    console.log(`處理進度: ${progress.toFixed(1)}%`)
    // 可以在此處更新UI進度條
  }
}
```

## 效能監控和分析

### 1. 效能指標收集

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
  
  // 測量渲染時間
  measureRenderTime<T>(fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    this.metrics.value.renderTime = end - start
    return result
  },
  
  // 收集效能指標
  collectMetrics() {
    // 記憶體使用
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024
    }
    
    // 快取命中率
    const cacheStats = formCache.getStats()
    const totalRequests = cacheStats.l1Items.reduce((sum, item) => sum + item.hitCount, 0)
    this.metrics.value.cacheHitRate = totalRequests > 0 
      ? (cacheStats.l1Items.length / totalRequests) * 100 
      : 0
  },
  
  // 生成效能報告
  generateReport(): string {
    const metrics = this.metrics.value
    return `
效能報告:
- 渲染時間: ${metrics.renderTime.toFixed(2)}ms
- 更新時間: ${metrics.updateTime.toFixed(2)}ms  
- 驗證時間: ${metrics.validationTime.toFixed(2)}ms
- 記憶體使用: ${metrics.memoryUsage.toFixed(2)}MB
- 快取命中率: ${metrics.cacheHitRate.toFixed(2)}%
    `.trim()
  }
}

// 自動效能監控
const startPerformanceMonitoring = () => {
  setInterval(() => {
    performanceMonitor.collectMetrics()
    
    // 效能異常告警
    const metrics = performanceMonitor.metrics.value
    if (metrics.renderTime > 100) {
      console.warn('渲染效能異常:', performanceMonitor.generateReport())
    }
  }, 5000) // 每5秒收集一次指標
}
```

## 相關連結

- [大表單最佳化策略](/zh-tw/front/component/ma-form#效能最佳化)
- [快取系統設計](/zh-tw/front/component/ma-form/examples/advanced-scenarios#快取最佳化策略)
- [記憶體管理最佳實踐](/zh-tw/front/component/ma-form#最佳實踐)