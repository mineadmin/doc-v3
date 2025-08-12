# パフォーマンス最適化デモ

MaFormの大規模フォームや複雑なシナリオにおけるパフォーマンス最適化戦略を紹介。仮想スクロール、遅延読み込み、キャッシュメカニズムなどの高性能機能を展示。

<DemoPreview dir="demos/ma-form/performance-demo" />

## 機能特徴

- **大規模フォーム最適化**：数百のフォーム項目を処理するパフォーマンス最適化
- **仮想スクロール**：長いリストフォームの仮想スクロール実装
- **遅延読み込みメカニズム**：オンデマンドでフォーム項目とデータを読み込み
- **キャッシュ戦略**：インテリジェントキャッシュで応答速度向上
- **レンダリング最適化**：不要な再レンダリングを削減
- **メモリ管理**：メモリ使用を効果的に制御

## 大規模フォームのパフォーマンス最適化

### 1. ページング読み込み戦略

```typescript
interface FormPageConfig {
  pageSize: number        // 1ページあたりのフォーム項目数
  currentPage: number     // 現在のページ番号
  totalItems: number      // 総フォーム項目数
  preloadPages: number    // プリロードするページ数
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
  
  // 大規模フォームの初期化
  async initLargeForm(totalItems: number) {
    this.pageConfig.value.totalItems = totalItems
    this.allFormItems = await this.generateLargeFormItems(totalItems)
    
    // 最初のページを読み込み
    await this.loadPage(1)
  },
  
  // 大量のフォーム項目を生成
  async generateLargeFormItems(count: number): Promise<MaFormItem[]> {
    const items: MaFormItem[] = []
    
    for (let i = 1; i <= count; i++) {
      items.push({
        label: `フィールド ${i}`,
        prop: `field_${i}`,
        render: this.getRandomRenderType(),
        renderProps: {
          placeholder: `フィールド ${i}を入力してください`,
          clearable: true
        },
        cols: { xs: 24, sm: 12, md: 8, lg: 6 },
        
        // 遅延読み込み用に優先度を追加
        priority: i <= 20 ? 'high' : i <= 100 ? 'medium' : 'low'
      })
    }
    
    return items
  },
  
  // ランダムにレンダリングタイプを選択
  getRandomRenderType(): string {
    const types = ['input', 'select', 'datePicker', 'inputNumber', 'textarea', 'switch']
    return types[Math.floor(Math.random() * types.length)]
  },
  
  // 指定ページを読み込み
  async loadPage(page: number) {
    if (this.loadedPages.has(page)) return
    
    const { pageSize } = this.pageConfig.value
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, this.allFormItems.length)
    
    const pageItems = this.allFormItems.slice(startIndex, endIndex)
    
    // フォームに一括追加
    pageItems.forEach(item => {
      formRef.value?.appendItem(item)
    })
    
    this.loadedPages.add(page)
    console.log(`ページ ${page} を読み込みました、${pageItems.length} フォーム項目を含む`)
  },
  
  // スクロールでさらに読み込み
  async loadMore() {
    const { currentPage, totalItems, pageSize } = this.pageConfig.value
    const totalPages = Math.ceil(totalItems / pageSize)
    
    if (currentPage < totalPages) {
      this.pageConfig.value.currentPage++
      await this.loadPage(this.pageConfig.value.currentPage)
    }
  },
  
  // 次のページをプリロード
  async preloadNext() {
    const { currentPage, preloadPages } = this.pageConfig.value
    for (let i = 1; i <= preloadPages; i++) {
      await this.loadPage(currentPage + i)
    }
  }
}

// 無限読み込みのためのスクロール監視
const setupInfiniteLoading = () => {
  const scrollContainer = document.querySelector('.ma-form-container')
  if (!scrollContainer) return
  
  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // 85%スクロール時にさらに読み込み
    if (scrollPercentage > 0.85) {
      largeFormManager.loadMore()
    }
    
    // 70%スクロール時にプリロード
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

### 2. 仮想スクロール実装

```typescript
interface VirtualScrollConfig {
  itemHeight: number      // 各項目の高さ
  visibleCount: number    // 表示可能な項目数
  bufferSize: number      // バッファサイズ
  scrollTop: number       // スクロール位置
}

const virtualScrollManager = {
  config: ref<VirtualScrollConfig>({
    itemHeight: 60,
    visibleCount: 20,
    bufferSize: 5,
    scrollTop: 0
  }),
  
  // 表示範囲を計算
  getVisibleRange() {
    const { itemHeight, visibleCount, bufferSize, scrollTop } = this.config.value
    
    const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize
    const endIndex = startIndex + visibleCount + bufferSize * 2
    
    return {
      startIndex: Math.max(0, startIndex),
      endIndex: Math.min(largeFormManager.allFormItems.length, endIndex)
    }
  },
  
  // 表示項目を更新
  updateVisibleItems() {
    const { startIndex, endIndex } = this.getVisibleRange()
    const visibleItems = largeFormManager.allFormItems.slice(startIndex, endIndex)
    
    // 仮想スクロールのオフセットスタイルを追加
    const offsetStyle = {
      paddingTop: `${startIndex * this.config.value.itemHeight}px`,
      paddingBottom: `${(largeFormManager.allFormItems.length - endIndex) * this.config.value.itemHeight}px`
    }
    
    // フォーム項目を更新
    formRef.value?.setItems(visibleItems.map(item => ({
      ...item,
      itemProps: {
        ...item.itemProps,
        style: offsetStyle
      }
    })))
  },
  
  // スクロールイベントを処理
  handleScroll(event: Event) {
    const target = event.target as HTMLElement
    this.config.value.scrollTop = target.scrollTop
    
    // requestAnimationFrameでスクロールパフォーマンスを最適化
    requestAnimationFrame(() => {
      this.updateVisibleItems()
    })
  },
  
  // 仮想スクロールを有効化
  enableVirtualScroll() {
    const formContainer = document.querySelector('.ma-form')
    if (formContainer) {
      formContainer.addEventListener('scroll', this.handleScroll.bind(this))
      this.updateVisibleItems()
    }
  }
}
```

## 遅延読み込み最適化

### 1. フィールドの遅延読み込み

```typescript
const lazyLoadManager = {
  // 遅延読み込み設定
  lazyConfig: new Map<string, {
    loader: () => Promise<any>
    loading: boolean
    loaded: boolean
    data: any
  }>(),
  
  // 遅延読み込みフィールドを登録
  registerLazyField(fieldProp: string, loader: () => Promise<any>) {
    this.lazyConfig.set(fieldProp, {
      loader,
      loading: false,
      loaded: false,
      data: null
    })
  },
  
  // フィールドの遅延読み込みをトリガー
  async triggerLazyLoad(fieldProp: string) {
    const config = this.lazyConfig.get(fieldProp)
    if (!config || config.loading || config.loaded) return
    
    config.loading = true
    
    // ローディング状態を表示
    formRef.value?.updateItem(fieldProp, {
      renderProps: { loading: true }
    })
    
    try {
      const data = await config.loader()
      config.data = data
      config.loaded = true
      
      // 遅延読み込みデータでフィールドを更新
      this.updateFieldWithLazyData(fieldProp, data)
      
    } catch (error) {
      console.error(`フィールド ${fieldProp} の遅延読み込みに失敗:`, error)
    } finally {
      config.loading = false
      formRef.value?.updateItem(fieldProp, {
        renderProps: { loading: false }
      })
    }
  },
  
  // 遅延読み込みデータでフィールドを更新
  updateFieldWithLazyData(fieldProp: string, data: any) {
    const item = formRef.value?.getItemByProp(fieldProp)
    if (!item) return
    
    // データタイプに基づいてフィールドを更新
    if (Array.isArray(data)) {
      // オプションデータ
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
      // フィールド設定データ
      formRef.value?.updateItem(fieldProp, data)
    }
  }
}

// 遅延読み込みフィールドの例
const createLazyLoadFields = (): MaFormItem[] => [
  {
    label: '都市選択',
    prop: 'city',
    render: 'select',
    renderProps: {
      placeholder: '都市を選択',
      loading: false
    },
    renderSlots: {
      default: () => [h('el-option', { label: 'クリックして読み込み...', value: '', disabled: true })]
    },
    // フィールドがフォーカスされた時に遅延読み込み
    onFocus: () => {
      lazyLoadManager.triggerLazyLoad('city')
    }
  },
  {
    label: '部門選択',
    prop: 'department',
    render: 'cascader',
    renderProps: {
      placeholder: '部門を選択',
      options: []
    },
    // フィールドがマウントされた時に遅延読み込み
    onMounted: () => {
      lazyLoadManager.triggerLazyLoad('department')
    }
  }
]

// 遅延ローダーを設定
const setupLazyLoaders = () => {
  // 都市データの遅延読み込み
  lazyLoadManager.registerLazyField('city', async () => {
    const response = await fetch('/api/cities')
    return await response.json()
  })
  
  // 部門データの遅延読み込み
  lazyLoadManager.registerLazyField('department', async () => {
    const response = await fetch('/api/departments')
    const data = await response.json()
    return { renderProps: { options: data } }
  })
}
```

### 2. 画像の遅延読み込み

```typescript
const imageLazyLoader = {
  observer: null as IntersectionObserver | null,
  
  // 画像遅延読み込みを初期化
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
  
  // 画像を読み込み
  loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    if (src) {
      img.src = src
      img.classList.remove('lazy')
      img.classList.add('loaded')
      this.observer?.unobserve(img)
    }
  },
  
  // 画像要素を監視
  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => {
      this.observer?.observe(img)
    })
  },
  
  // オブザーバーを破棄
  destroy() {
    this.observer?.disconnect()
    this.observer = null
  }
}

// コンポーネントマウント時に初期化
onMounted(() => {
  imageLazyLoader.initImageLazyLoading()
  imageLazyLoader.observeImages()
})

onUnmounted(() => {
  imageLazyLoader.destroy()
})
```

## キャッシュ最適化戦略

### 1. マルチレベルキャッシュシステム

```typescript
interface CacheItem<T = any> {
  data: T
  timestamp: number
  ttl: number           // 生存時間（ミリ秒）
  hitCount: number      // ヒット回数
}

class MultiLevelCache {
  private l1Cache = new Map<string, CacheItem>()  // メモリキャッシュ（高速）
  private l2Cache: LocalStorage                   // ローカルストレージキャッシュ（永続）
  private maxL1Size = 100                         // L1キャッシュの最大エントリ数
  private defaultTTL = 5 * 60 * 1000             // デフォルト5分TTL
  
  constructor() {
    this.l2Cache = {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key)
    }
  }
  
  // キャッシュデータを取得
  async get<T>(key: string): Promise<T | null> {
    // まずL1キャッシュを確認
    const l1Item = this.l1Cache.get(key)
    if (l1Item && !this.isExpired(l1Item)) {
      l1Item.hitCount++
      return l1Item.data
    }
    
    // 次にL2キャッシュを確認
    const l2Data = this.l2Cache.getItem(key)
    if (l2Data) {
      try {
        const l2Item: CacheItem<T> = JSON.parse(l2Data)
        if (!this.isExpired(l2Item)) {
          // ホットデータをL1キャッシュに昇格
          this.setL1Cache(key, l2Item.data, l2Item.ttl)
          return l2Item.data
        }
      } catch (error) {
        console.warn(`L2キャッシュの解析に失敗: ${key}`, error)
      }
    }
    
    return null
  }
  
  // キャッシュデータを設定
  async set<T>(key: string, data: T, ttl = this.defaultTTL) {
    // L1キャッシュを設定
    this.setL1Cache(key, data, ttl)
    
    // L2キャッシュを設定
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hitCount: 0
    }
    
    try {
      this.l2Cache.setItem(key, JSON.stringify(cacheItem))
    } catch (error) {
      console.warn(`L2キャッシュの設定に失敗: ${key}`, error)
    }
  }
  
  // L1キャッシュを設定
  private setL1Cache<T>(key: string, data: T, ttl: number) {
    // L1キャッシュサイズ制限を確認
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
  
  // L1キャッシュのエビクション戦略（LFU - 最少使用頻度）
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
  
  // 有効期限を確認
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl
  }
  
  // 期限切れキャッシュをクリア
  clearExpired() {
    const now = Date.now()
    
    // L1の期限切れキャッシュをクリア
    for (const [key, item] of this.l1Cache) {
      if (this.isExpired(item)) {
        this.l1Cache.delete(key)
      }
    }
    
    // L2の期限切れキャッシュをクリア
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key) {
        try {
          const item =