# 性能优化演示

展示 MaForm 在大型表单和复杂场景下的性能优化策略，包括虚拟滚动、懒加载、缓存机制等高性能特性。

<DemoPreview dir="demos/ma-form/performance-demo" />

## 功能特性

- **大表单优化**：处理数百个表单项的性能优化
- **虚拟滚动**：长列表表单的虚拟滚动实现
- **懒加载机制**：按需加载表单项和数据
- **缓存策略**：智能缓存提升响应速度
- **渲染优化**：减少不必要的重渲染
- **内存管理**：有效控制内存使用

## 大表单性能优化

### 1. 分页加载策略

```typescript
interface FormPageConfig {
  pageSize: number        // 每页表单项数量
  currentPage: number     // 当前页码
  totalItems: number      // 总表单项数量
  preloadPages: number    // 预加载页数
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
  
  // 初始化大表单
  async initLargeForm(totalItems: number) {
    this.pageConfig.value.totalItems = totalItems
    this.allFormItems = await this.generateLargeFormItems(totalItems)
    
    // 加载第一页
    await this.loadPage(1)
  },
  
  // 生成大量表单项
  async generateLargeFormItems(count: number): Promise<MaFormItem[]> {
    const items: MaFormItem[] = []
    
    for (let i = 1; i <= count; i++) {
      items.push({
        label: `字段 ${i}`,
        prop: `field_${i}`,
        render: this.getRandomRenderType(),
        renderProps: {
          placeholder: `请填写字段 ${i}`,
          clearable: true
        },
        cols: { xs: 24, sm: 12, md: 8, lg: 6 },
        
        // 添加字段优先级用于懒加载
        priority: i <= 20 ? 'high' : i <= 100 ? 'medium' : 'low'
      })
    }
    
    return items
  },
  
  // 随机选择渲染类型
  getRandomRenderType(): string {
    const types = ['input', 'select', 'datePicker', 'inputNumber', 'textarea', 'switch']
    return types[Math.floor(Math.random() * types.length)]
  },
  
  // 加载指定页
  async loadPage(page: number) {
    if (this.loadedPages.has(page)) return
    
    const { pageSize } = this.pageConfig.value
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, this.allFormItems.length)
    
    const pageItems = this.allFormItems.slice(startIndex, endIndex)
    
    // 批量添加到表单
    pageItems.forEach(item => {
      formRef.value?.appendItem(item)
    })
    
    this.loadedPages.add(page)
    console.log(`已加载第 ${page} 页，包含 ${pageItems.length} 个表单项`)
  },
  
  // 滚动加载更多
  async loadMore() {
    const { currentPage, totalItems, pageSize } = this.pageConfig.value
    const totalPages = Math.ceil(totalItems / pageSize)
    
    if (currentPage < totalPages) {
      this.pageConfig.value.currentPage++
      await this.loadPage(this.pageConfig.value.currentPage)
    }
  },
  
  // 预加载下一页
  async preloadNext() {
    const { currentPage, preloadPages } = this.pageConfig.value
    for (let i = 1; i <= preloadPages; i++) {
      await this.loadPage(currentPage + i)
    }
  }
}

// 滚动监听实现无限加载
const setupInfiniteLoading = () => {
  const scrollContainer = document.querySelector('.ma-form-container')
  if (!scrollContainer) return
  
  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // 滚动到85%时加载更多
    if (scrollPercentage > 0.85) {
      largeFormManager.loadMore()
    }
    
    // 滚动到70%时预加载
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

### 2. 虚拟滚动实现

```typescript
interface VirtualScrollConfig {
  itemHeight: number      // 每项高度
  visibleCount: number    // 可见项数量
  bufferSize: number      // 缓冲区大小
  scrollTop: number       // 滚动位置
}

const virtualScrollManager = {
  config: ref<VirtualScrollConfig>({
    itemHeight: 60,
    visibleCount: 20,
    bufferSize: 5,
    scrollTop: 0
  }),
  
  // 计算可见范围
  getVisibleRange() {
    const { itemHeight, visibleCount, bufferSize, scrollTop } = this.config.value
    
    const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize
    const endIndex = startIndex + visibleCount + bufferSize * 2
    
    return {
      startIndex: Math.max(0, startIndex),
      endIndex: Math.min(largeFormManager.allFormItems.length, endIndex)
    }
  },
  
  // 更新可见项
  updateVisibleItems() {
    const { startIndex, endIndex } = this.getVisibleRange()
    const visibleItems = largeFormManager.allFormItems.slice(startIndex, endIndex)
    
    // 添加虚拟滚动的偏移样式
    const offsetStyle = {
      paddingTop: `${startIndex * this.config.value.itemHeight}px`,
      paddingBottom: `${(largeFormManager.allFormItems.length - endIndex) * this.config.value.itemHeight}px`
    }
    
    // 更新表单项
    formRef.value?.setItems(visibleItems.map(item => ({
      ...item,
      itemProps: {
        ...item.itemProps,
        style: offsetStyle
      }
    })))
  },
  
  // 处理滚动事件
  handleScroll(event: Event) {
    const target = event.target as HTMLElement
    this.config.value.scrollTop = target.scrollTop
    
    // 使用 requestAnimationFrame 优化滚动性能
    requestAnimationFrame(() => {
      this.updateVisibleItems()
    })
  },
  
  // 启用虚拟滚动
  enableVirtualScroll() {
    const formContainer = document.querySelector('.ma-form')
    if (formContainer) {
      formContainer.addEventListener('scroll', this.handleScroll.bind(this))
      this.updateVisibleItems()
    }
  }
}
```

## 懒加载优化

### 1. 字段懒加载

```typescript
const lazyLoadManager = {
  // 懒加载配置
  lazyConfig: new Map<string, {
    loader: () => Promise<any>
    loading: boolean
    loaded: boolean
    data: any
  }>(),
  
  // 注册懒加载字段
  registerLazyField(fieldProp: string, loader: () => Promise<any>) {
    this.lazyConfig.set(fieldProp, {
      loader,
      loading: false,
      loaded: false,
      data: null
    })
  },
  
  // 触发字段懒加载
  async triggerLazyLoad(fieldProp: string) {
    const config = this.lazyConfig.get(fieldProp)
    if (!config || config.loading || config.loaded) return
    
    config.loading = true
    
    // 显示加载状态
    formRef.value?.updateItem(fieldProp, {
      renderProps: { loading: true }
    })
    
    try {
      const data = await config.loader()
      config.data = data
      config.loaded = true
      
      // 更新字段配置
      this.updateFieldWithLazyData(fieldProp, data)
      
    } catch (error) {
      console.error(`字段 ${fieldProp} 懒加载失败:`, error)
    } finally {
      config.loading = false
      formRef.value?.updateItem(fieldProp, {
        renderProps: { loading: false }
      })
    }
  },
  
  // 使用懒加载数据更新字段
  updateFieldWithLazyData(fieldProp: string, data: any) {
    const item = formRef.value?.getItemByProp(fieldProp)
    if (!item) return
    
    // 根据数据类型更新字段
    if (Array.isArray(data)) {
      // 选项数据
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
      // 字段配置数据
      formRef.value?.updateItem(fieldProp, data)
    }
  }
}

// 懒加载字段示例
const createLazyLoadFields = (): MaFormItem[] => [
  {
    label: '城市选择',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: '选择城市',
      loading: false
    },
    renderSlots: {
      default: () => [h('el-option', { label: '点击加载...', value: '', disabled: true })]
    },
    // 字段获得焦点时懒加载
    onFocus: () => {
      lazyLoadManager.triggerLazyLoad('city')
    }
  },
  {
    label: '部门选择',
    prop: 'department',
    render: 'cascader',
    renderProps: {
      placeholder: '选择部门',
      options: []
    },
    // 字段挂载时懒加载
    onMounted: () => {
      lazyLoadManager.triggerLazyLoad('department')
    }
  }
]

// 注册懒加载器
const setupLazyLoaders = () => {
  // 城市数据懒加载
  lazyLoadManager.registerLazyField('city', async () => {
    const response = await fetch('/api/cities')
    return await response.json()
  })
  
  // 部门数据懒加载
  lazyLoadManager.registerLazyField('department', async () => {
    const response = await fetch('/api/departments')
    const data = await response.json()
    return { renderProps: { options: data } }
  })
}
```

### 2. 图片懒加载

```typescript
const imageLazyLoader = {
  observer: null as IntersectionObserver | null,
  
  // 初始化图片懒加载
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
  
  // 加载图片
  loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    if (src) {
      img.src = src
      img.classList.remove('lazy')
      img.classList.add('loaded')
      this.observer?.unobserve(img)
    }
  },
  
  // 观察图片元素
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => {
      this.observer?.observe(img)
    })
  },
  
  // 销毁观察器
  destroy() {
    this.observer?.disconnect()
    this.observer = null
  }
}

// 在组件挂载时初始化
onMounted(() => {
  imageLazyLoader.initImageLazyLoading()
  imageLazyLoader.observeImages()
})

onUnmounted(() => {
  imageLazyLoader.destroy()
})
```

## 缓存优化策略

### 1. 多级缓存系统

```typescript
interface CacheItem<T = any> {
  data: T
  timestamp: number
  ttl: number           // 生存时间（毫秒）
  hitCount: number      // 命中次数
}

class MultiLevelCache {
  private l1Cache = new Map<string, CacheItem>()  // 内存缓存（快速）
  private l2Cache: LocalStorage                   // 本地存储缓存（持久）
  private maxL1Size = 100                         // L1缓存最大条目数
  private defaultTTL = 5 * 60 * 1000             // 默认5分钟TTL
  
  constructor() {
    this.l2Cache = {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key)
    }
  }
  
  // 获取缓存数据
  async get<T>(key: string): Promise<T | null> {
    // 先查L1缓存
    const l1Item = this.l1Cache.get(key)
    if (l1Item && !this.isExpired(l1Item)) {
      l1Item.hitCount++
      return l1Item.data
    }
    
    // 再查L2缓存
    const l2Data = this.l2Cache.getItem(key)
    if (l2Data) {
      try {
        const l2Item: CacheItem<T> = JSON.parse(l2Data)
        if (!this.isExpired(l2Item)) {
          // 将热数据提升到L1缓存
          this.setL1Cache(key, l2Item.data, l2Item.ttl)
          return l2Item.data
        }
      } catch (error) {
        console.warn(`解析L2缓存失败: ${key}`, error)
      }
    }
    
    return null
  }
  
  // 设置缓存数据
  async set<T>(key: string, data: T, ttl = this.defaultTTL) {
    // 设置L1缓存
    this.setL1Cache(key, data, ttl)
    
    // 设置L2缓存
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hitCount: 0
    }
    
    try {
      this.l2Cache.setItem(key, JSON.stringify(cacheItem))
    } catch (error) {
      console.warn(`设置L2缓存失败: ${key}`, error)
    }
  }
  
  // 设置L1缓存
  private setL1Cache<T>(key: string, data: T, ttl: number) {
    // 检查L1缓存大小限制
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
  
  // L1缓存淘汰策略（LFU - 最少使用频率）
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
  
  // 检查是否过期
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl
  }
  
  // 清除过期缓存
  clearExpired() {
    const now = Date.now()
    
    // 清除L1过期缓存
    for (const [key, item] of this.l1Cache) {
      if (this.isExpired(item)) {
        this.l1Cache.delete(key)
      }
    }
    
    // 清除L2过期缓存
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          if (item.timestamp && this.isExpired(item)) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // 忽略解析错误
        }
      }
    }
  }
  
  // 获取缓存统计
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

// 全局缓存实例
const formCache = new MultiLevelCache()
```

### 2. 智能预缓存

```typescript
const smartPreCache = {
  // 预缓存配置
  preCacheRules: new Map<string, {
    condition: (context: any) => boolean
    loader: () => Promise<any>
    priority: number
  }>(),
  
  // 注册预缓存规则
  registerPreCacheRule(key: string, rule: {
    condition: (context: any) => boolean
    loader: () => Promise<any>
    priority: number
  }) {
    this.preCacheRules.set(key, rule)
  },
  
  // 执行智能预缓存
  async executeSmartPreCache(context: any) {
    // 按优先级排序规则
    const sortedRules = Array.from(this.preCacheRules.entries())
      .filter(([_, rule]) => rule.condition(context))
      .sort(([_, a], [__, b]) => b.priority - a.priority)
    
    // 并发执行高优先级预缓存
    const highPriorityTasks = sortedRules
      .filter(([_, rule]) => rule.priority >= 80)
      .map(async ([key, rule]) => {
        try {
          const data = await rule.loader()
          await formCache.set(key, data, 10 * 60 * 1000) // 10分钟缓存
        } catch (error) {
          console.warn(`预缓存失败: ${key}`, error)
        }
      })
    
    await Promise.all(highPriorityTasks)
    
    // 串行执行低优先级预缓存（避免资源竞争）
    for (const [key, rule] of sortedRules.filter(([_, rule]) => rule.priority < 80)) {
      try {
        const data = await rule.loader()
        await formCache.set(key, data, 5 * 60 * 1000) // 5分钟缓存
      } catch (error) {
        console.warn(`预缓存失败: ${key}`, error)
      }
    }
  }
}

// 注册预缓存规则示例
const setupPreCacheRules = () => {
  // 用户常用城市预缓存
  smartPreCache.registerPreCacheRule('user-frequent-cities', {
    condition: (context) => context.userType === 'frequent',
    loader: async () => {
      const response = await fetch('/api/user/frequent-cities')
      return response.json()
    },
    priority: 90
  })
  
  // 部门数据预缓存
  smartPreCache.registerPreCacheRule('departments', {
    condition: (context) => context.hasPermission('view_departments'),
    loader: async () => {
      const response = await fetch('/api/departments')
      return response.json()
    },
    priority: 85
  })
  
  // 历史表单数据预缓存
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

## 渲染性能优化

### 1. 避免不必要的重渲染

```typescript
// 性能监控装饰器
function performanceTrack(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value
  descriptor.value = function (...args: any[]) {
    const start = performance.now()
    const result = method.apply(this, args)
    const end = performance.now()
    
    if (end - start > 50) { // 超过50ms的操作需要优化
      console.warn(`性能警告: ${propertyName} 耗时 ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }
  return descriptor
}

const renderOptimizer = {
  // 字段变化批处理
  pendingUpdates: new Map<string, any>(),
  updateTimer: null as number | null,
  
  // 批量更新字段
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
  
  // 调度更新
  scheduleUpdate() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
    }
    
    this.updateTimer = setTimeout(() => {
      this.flushUpdates()
    }, 16) // 一个渲染帧的时间
  },
  
  // 刷新更新
  @performanceTrack
  flushUpdates() {
    if (this.pendingUpdates.size === 0) return
    
    // 批量应用更新
    for (const [prop, update] of this.pendingUpdates) {
      formRef.value?.updateItem(prop, update)
    }
    
    this.pendingUpdates.clear()
    this.updateTimer = null
  },
  
  // 虚拟化长列表渲染
  @performanceTrack
  virtualizeFormItems(items: MaFormItem[], visibleRange: { start: number; end: number }) {
    const { start, end } = visibleRange
    const visibleItems = items.slice(start, end)
    
    // 添加占位符保持滚动高度
    const beforeHeight = start * 60 // 假设每项60px高度
    const afterHeight = (items.length - end) * 60
    
    const virtualizedItems = [
      // 前置占位符
      {
        label: '',
        prop: '__virtual_before',
        render: () => h('div', { style: { height: `${beforeHeight}px` } }),
        hide: beforeHeight === 0
      },
      // 可见项
      ...visibleItems,
      // 后置占位符
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

### 2. 组件缓存策略

```typescript
// 组件缓存管理
const componentCache = {
  cache: new Map<string, any>(),
  maxSize: 50,
  
  // 获取缓存的组件
  getCachedComponent(key: string, factory: () => any) {
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    
    const component = factory()
    this.setCachedComponent(key, component)
    return component
  },
  
  // 设置缓存的组件
  setCachedComponent(key: string, component: any) {
    if (this.cache.size >= this.maxSize) {
      // LRU淘汰策略
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, component)
  },
  
  // 清除组件缓存
  clearCache() {
    this.cache.clear()
  }
}

// 使用缓存的表单项工厂
const createCachedFormItem = (config: {
  type: string
  props: Record<string, any>
}): MaFormItem => {
  const cacheKey = `${config.type}_${JSON.stringify(config.props)}`
  
  return {
    label: config.props.label,
    prop: config.props.prop,
    render: componentCache.getCachedComponent(cacheKey, () => {
      // 创建复杂组件的工厂函数
      return createComplexComponent(config.type, config.props)
    })
  }
}
```

## 内存管理优化

### 1. 内存泄漏防护

```typescript
const memoryManager = {
  // 注册的清理函数
  cleanupFunctions: new Set<() => void>(),
  
  // 注册清理函数
  registerCleanup(fn: () => void) {
    this.cleanupFunctions.add(fn)
  },
  
  // 执行清理
  cleanup() {
    this.cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('清理函数执行失败:', error)
      }
    })
    this.cleanupFunctions.clear()
  },
  
  // 监控内存使用
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
      
      console.log(`内存使用: ${usedMB}MB / ${totalMB}MB`)
      
      // 内存使用过高时触发清理
      if (usedMB > 100) { // 100MB阈值
        this.triggerGarbageCollection()
      }
    }
  },
  
  // 触发垃圾回收（仅开发环境）
  triggerGarbageCollection() {
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc()
    }
  }
}

// 自动内存管理
const setupAutoMemoryManagement = () => {
  // 定期清理过期缓存
  const cacheCleanupInterval = setInterval(() => {
    formCache.clearExpired()
  }, 60000) // 每分钟清理一次
  
  // 定期监控内存使用
  const memoryMonitorInterval = setInterval(() => {
    memoryManager.monitorMemoryUsage()
  }, 30000) // 每30秒监控一次
  
  // 注册清理函数
  memoryManager.registerCleanup(() => {
    clearInterval(cacheCleanupInterval)
    clearInterval(memoryMonitorInterval)
    formCache.clearExpired()
    componentCache.clearCache()
  })
  
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    memoryManager.cleanup()
  })
}

// 组件卸载时清理
onUnmounted(() => {
  memoryManager.cleanup()
})
```

### 2. 大数据处理优化

```typescript
const bigDataProcessor = {
  // 分块处理大数据
  async processLargeDataset<T, R>(
    data: T[], 
    processor: (chunk: T[]) => R[], 
    chunkSize = 1000
  ): Promise<R[]> {
    const results: R[] = []
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      
      // 使用 setTimeout 让出控制权，避免阻塞UI
      await new Promise(resolve => setTimeout(resolve, 0))
      
      const chunkResults = processor(chunk)
      results.push(...chunkResults)
      
      // 报告进度
      const progress = Math.min(100, ((i + chunkSize) / data.length) * 100)
      this.reportProgress(progress)
    }
    
    return results
  },
  
  // 使用Web Worker处理计算密集型任务
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
  
  // 进度报告
  reportProgress(progress: number) {
    console.log(`处理进度: ${progress.toFixed(1)}%`)
    // 可以在此处更新UI进度条
  }
}
```

## 性能监控和分析

### 1. 性能指标收集

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
  
  // 测量渲染时间
  measureRenderTime<T>(fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    this.metrics.value.renderTime = end - start
    return result
  },
  
  // 收集性能指标
  collectMetrics() {
    // 内存使用
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024
    }
    
    // 缓存命中率
    const cacheStats = formCache.getStats()
    const totalRequests = cacheStats.l1Items.reduce((sum, item) => sum + item.hitCount, 0)
    this.metrics.value.cacheHitRate = totalRequests > 0 
      ? (cacheStats.l1Items.length / totalRequests) * 100 
      : 0
  },
  
  // 生成性能报告
  generateReport(): string {
    const metrics = this.metrics.value
    return `
性能报告:
- 渲染时间: ${metrics.renderTime.toFixed(2)}ms
- 更新时间: ${metrics.updateTime.toFixed(2)}ms  
- 验证时间: ${metrics.validationTime.toFixed(2)}ms
- 内存使用: ${metrics.memoryUsage.toFixed(2)}MB
- 缓存命中率: ${metrics.cacheHitRate.toFixed(2)}%
    `.trim()
  }
}

// 自动性能监控
const startPerformanceMonitoring = () => {
  setInterval(() => {
    performanceMonitor.collectMetrics()
    
    // 性能异常告警
    const metrics = performanceMonitor.metrics.value
    if (metrics.renderTime > 100) {
      console.warn('渲染性能异常:', performanceMonitor.generateReport())
    }
  }, 5000) // 每5秒收集一次指标
}
```

## 相关链接

- [大表单优化策略](/zh/front/component/ma-form#性能优化)
- [缓存系统设计](/zh/front/component/ma-form/examples/advanced-scenarios#缓存优化策略)
- [内存管理最佳实践](/zh/front/component/ma-form#最佳实践)