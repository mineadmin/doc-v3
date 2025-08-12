# 分頁表格

展示完整的分頁功能，包括分頁配置、事件處理、動態更新等。

## 分頁演示

<DemoPreview dir="demos/ma-table/pagination" />

## 功能特性

### 分頁組件
- **頁碼導航**: 支持頁碼切換和跳轉
- **頁面大小**: 可選擇每頁顯示的條數
- **總數顯示**: 顯示數據總條數
- **快速跳轉**: 支持輸入頁碼快速跳轉

### 分頁配置
- **佈局配置**: 自定義分頁組件的顯示元素
- **樣式配置**: 支持背景色、尺寸等樣式配置
- **事件處理**: 監聽頁碼和頁面大小變化事件
- **動態更新**: 運行時修改分頁配置

## 配置示例

### 基礎分頁配置
```javascript
const options = {
  showPagination: true,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100],
    background: true
  }
}
```

### 分頁事件處理
```javascript
const options = {
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    onChange: (currentPage, pageSize) => {
      console.log('分頁變化:', currentPage, pageSize)
      // 重新加載數據
      loadData(currentPage, pageSize)
    },
    onSizeChange: (pageSize) => {
      console.log('頁面大小變化:', pageSize)
    },
    onCurrentChange: (currentPage) => {
      console.log('當前頁變化:', currentPage)
    }
  }
}
```

### 自定義分頁佈局
```javascript
const options = {
  pagination: {
    layout: 'prev, pager, next, jumper, ->, total, sizes',
    pageSizes: [5, 10, 20, 50],
    // 隱藏單頁時的分頁
    hideOnSinglePage: true
  }
}
```

### 分頁樣式配置
```javascript
const options = {
  pagination: {
    size: 'small',        // 分頁尺寸
    background: true,     // 頁碼背景
    disabled: false,      // 是否禁用
    prevText: '上一頁',    // 上一頁按鈕文字
    nextText: '下一頁'     // 下一頁按鈕文字
  }
}
```

### 使用 Expose 方法更新分頁
```vue
<template>
  <ma-table 
    ref="tableRef"
    :columns="columns" 
    :data="data" 
    :options="options" 
  />
</template>

<script setup>
const tableRef = ref()

// 更新分頁配置
const updatePagination = () => {
  const newPagination = {
    currentPage: 1,
    pageSize: 20,
    total: 200
  }
  tableRef.value?.setPagination(newPagination)
}

// 獲取當前配置
const getCurrentOptions = () => {
  const options = tableRef.value?.getOptions()
  console.log('當前分頁配置:', options.pagination)
}
</script>
```

## 分頁參數

### 基礎參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `currentPage` | 當前頁數 | `number` | `1` |
| `pageSize` | 每頁顯示條目個數 | `number` | `10` |
| `total` | 總條目數 | `number` | `0` |
| `pageSizes` | 每頁顯示個數選擇器的選項 | `number[]` | `[10, 20, 50, 100]` |

### 樣式參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `size` | 分頁組件大小 | `'large' \| 'default' \| 'small'` | `'default'` |
| `background` | 是否為頁碼按鈕添加背景色 | `boolean` | `false` |
| `layout` | 組件佈局，子組件名用逗號分隔 | `string` | `'prev, pager, next, jumper, ->, total'` |
| `pagerCount` | 頁碼按鈕的數量 | `number` | `7` |

### 控制參數

| 參數 | 説明 | 類型 | 默認值 |
|-----|------|-----|--------|
| `disabled` | 是否禁用分頁 | `boolean` | `false` |
| `hideOnSinglePage` | 只有一頁時是否隱藏 | `boolean` | `false` |
| `prevText` | 替代圖標顯示的上一頁文字 | `string` | - |
| `nextText` | 替代圖標顯示的下一頁文字 | `string` | - |

## 分頁事件

| 事件名 | 説明 | 參數 |
|-------|------|------|
| `onChange` | 頁碼或頁面大小改變時觸發 | `(currentPage, pageSize)` |
| `onSizeChange` | 每頁條數改變時觸發 | `(pageSize)` |
| `onCurrentChange` | 當前頁改變時觸發 | `(currentPage)` |
| `onPrevClick` | 用户點擊上一頁按鈕改變當前頁後觸發 | `(currentPage)` |
| `onNextClick` | 用户點擊下一頁按鈕改變當前頁後觸發 | `(currentPage)` |

## 佈局選項

`layout` 屬性可以配置以下組件：

- `prev`: 上一頁按鈕
- `pager`: 頁碼列表
- `next`: 下一頁按鈕
- `jumper`: 跳轉輸入框
- `total`: 總條目數
- `sizes`: 每頁顯示個數選擇器
- `->`: 分隔符，表示後面的組件靠右顯示

示例佈局：
- `'total, sizes, prev, pager, next, jumper'`
- `'prev, pager, next, jumper, ->, total, sizes'`

## 最佳實踐

1. **數據分頁**: 建議在服務端進行數據分頁，避免一次性加載大量數據
2. **狀態同步**: 確保分頁狀態與實際數據保持同步
3. **用户體驗**: 提供合適的頁面大小選項，通常包含 10、20、50 等
4. **加載狀態**: 在數據加載時顯示 loading 狀態
5. **錯誤處理**: 處理分頁數據加載失敗的情況

## 服務端分頁示例

```vue
<template>
  <ma-table 
    :columns="columns" 
    :data="currentPageData" 
    :options="tableOptions" 
  />
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentPageData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const tableOptions = {
  loading: false,
  pagination: {
    ...pagination,
    onChange: async (currentPage, pageSize) => {
      pagination.currentPage = currentPage
      pagination.pageSize = pageSize
      await loadData()
    }
  }
}

const loadData = async () => {
  try {
    tableOptions.loading = true
    const response = await api.getTableData({
      page: pagination.currentPage,
      size: pagination.pageSize
    })
    
    currentPageData.value = response.data
    pagination.total = response.total
  } catch (error) {
    console.error('加載數據失敗:', error)
  } finally {
    tableOptions.loading = false
  }
}

// 初始加載
loadData()
</script>
```