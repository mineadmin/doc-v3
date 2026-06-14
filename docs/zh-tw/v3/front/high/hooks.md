# Hooks

MineAdmin 提供了一系列強大的自定義 Hooks，這些 Hooks 封裝了常用的功能和邏輯，讓開發者能夠輕鬆地在 Vue 3 元件中複用程式碼。本文件將詳細介紹每個 Hook 的用法、引數、返回值以及實際應用場景。

## useCache()

用於瀏覽器快取操作的 Hook，支援 localStorage 和 sessionStorage，並提供了過期時間設定功能。

**原始碼路徑：** `/web/src/hooks/useCache.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts)

### 型別定義

```typescript
export type CacheType = 'localStorage' | 'sessionStorage'

export interface CacheOptions {
  /**
   * 超時時間，秒。
   * 預設無限大。
   */
  exp?: number

  /**
   * 為true時：當超過最大容量導致無法繼續插入資料操作時，先清空快取中已超時的內容後再嘗試插入資料操作。
   * 預設為true。
   */
  force?: boolean
}
```

### 引數

| 引數 | 型別 | 預設值 | 描述 |
|------|------|--------|------|
| type | CacheType | 'localStorage' | 快取型別，可選 localStorage 或 sessionStorage |

### 返回值

| 屬性 | 型別 | 描述 |
|------|------|------|
| cache | WebStorageCache | 底層的 WebStorageCache 例項 |
| prefix | string | 快取鍵名字首 |
| set | Function | 設定快取 |
| get | Function | 獲取快取 |
| remove | Function | 刪除快取 |
| removeAllExpires | Function | 刪除所有過期快取 |
| touch | Function | 更新快取過期時間 |

### 使用示例

```typescript
import useCache from '@/hooks/useCache'

// 使用 localStorage（預設）
const { set, get, remove, removeAllExpires, touch } = useCache()

// 使用 sessionStorage
const sessionCache = useCache('sessionStorage')

// 設定快取（不過期）
set('userInfo', { name: 'MineAdmin', role: 'admin' })

// 設定快取（30秒後過期）
set('tempData', 'temporary value', { exp: 30 })

// 獲取快取
const userInfo = get('userInfo', null)

// 刪除特定快取
remove('tempData')

// 刪除所有過期快取
removeAllExpires()

// 更新快取過期時間（延長60秒）
touch('userInfo', 60)
```

### 實際應用場景

```typescript
// 在使用者登入元件中使用
const { set, get } = useCache()

// 儲存使用者登入資訊
const saveUserInfo = (userInfo: any) => {
  set('userInfo', userInfo, { exp: 24 * 60 * 60 }) // 24小時後過期
}

// 獲取使用者資訊
const getUserInfo = () => {
  return get('userInfo', null)
}
```

## useDialog()

用於建立對話方塊的 Hook，提供了完整的對話方塊生命週期管理，支援自定義標題、屬性和事件回撥。

**原始碼路徑：** `/web/src/hooks/useDialog.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useDialog.ts)

### 型別定義

```typescript
export interface UseDialogExpose {
  on: {
    ok?: (...args: any[]) => void
    cancel?: (...args: any[]) => void
  }
  Dialog: Component
  open: (...args: any[]) => void
  close: () => void
  setTitle: (title: string) => void
  setAttr: (attr: Record<string, any>) => void
}
```

### 引數

| 引數 | 型別 | 預設值 | 描述 |
|------|------|--------|------|
| dialogProps | Record<string, any> \| null | null | 對話方塊初始屬性配置 |

### 返回值

| 屬性 | 型別 | 描述 |
|------|------|------|
| on | Object | 事件回撥配置 |
| Dialog | Component | 對話方塊元件 |
| open | Function | 開啟對話方塊 |
| close | Function | 關閉對話方塊 |
| setTitle | Function | 設定對話方塊標題 |
| setAttr | Function | 設定對話方塊屬性 |

### 使用示例

```typescript
import useDialog from '@/hooks/useDialog'

export default defineComponent({
  setup() {
    // 建立對話方塊例項
    const { Dialog, open, close, setTitle, on } = useDialog({
      width: '500px',
      draggable: true
    })

    // 配置事件回撥
    on.ok = () => {
      console.log('使用者點選了確定')
      close()
    }

    on.cancel = () => {
      console.log('使用者點選了取消')
      return true // 返回 true 允許關閉
    }

    // 開啟對話方塊
    const openDialog = () => {
      setTitle('編輯使用者資訊')
      open({ userId: 123 })
    }

    return {
      Dialog,
      openDialog
    }
  },

  render() {
    return (
      <div>
        <el-button onClick={this.openDialog}>開啟對話方塊</el-button>
        <Dialog title="預設標題">
          <div>這裡是對話方塊內容</div>
        </Dialog>
      </div>
    )
  }
})
```

### 實際應用場景

```vue
<template>
  <div>
    <el-button @click="editUser">編輯使用者</el-button>
    <Dialog>
      <div>編輯使用者表單內容</div>
    </Dialog>
  </div>
</template>

<script setup>
import useDialog from '@/hooks/useDialog'

const { Dialog, open, close, setTitle, on } = useDialog({
  width: '600px',
  destroyOnClose: true
})

const currentUserId = ref(null)

// 編輯使用者
const editUser = () => {
  currentUserId.value = 123
  setTitle('編輯使用者資訊')
  open()
}

// 處理表單提交
const handleSubmit = async (formData) => {
  try {
    console.log('提交使用者資料:', formData)
    close()
    // 這裡處理表單提交邏輯
  } catch (error) {
    console.error('提交失敗:', error)
  }
}

// 配置事件
on.ok = () => {
  // 這裡可以觸發表單提交
  return false // 阻止預設關閉行為
}
</script>
```

## useEcharts()

用於整合 ECharts 圖表庫的 Hook，提供了主題切換和圖表初始化功能。

**原始碼路徑：** `/web/src/hooks/useEcharts.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useEcharts.ts)

### 匯出函式

| 函式 | 型別 | 描述 |
|------|------|------|
| useEcharts | Function | 來自 @mineadmin/echarts 的 useEcharts 函式 |
| themeMode | Function | 獲取當前主題模式 |

### 使用示例

```typescript
import { useEcharts, themeMode } from '@/hooks/useEcharts'

export default defineComponent({
  setup() {
    const chartRef = ref()
    
    onMounted(async () => {
      // 初始化圖表
      const chart = await useEcharts(chartRef.value)
      
      // 配置圖表選項
      const option = {
        title: { text: '銷售資料' },
        theme: themeMode(), // 使用當前主題
        xAxis: {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月']
        },
        yAxis: { type: 'value' },
        series: [{
          data: [820, 932, 901, 934, 1290],
          type: 'bar'
        }]
      }
      
      chart.setOption(option)
    })

    return { chartRef }
  },

  render() {
    return <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  }
})
```

### 實際應用場景

```vue
<template>
  <div class="dashboard">
    <div ref="salesChartRef" class="chart-container"></div>
    <div ref="trafficChartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { useEcharts, themeMode } from '@/hooks/useEcharts'
import { ref, onMounted } from 'vue'

const salesChartRef = ref()
const trafficChartRef = ref()

onMounted(async () => {
  // 初始化銷售圖表
  const salesChart = await useEcharts(salesChartRef.value)
  salesChart.setOption({
    title: { text: '銷售趨勢' },
    theme: themeMode(),
    // ... 其他配置
  })

  // 初始化流量圖表
  const trafficChart = await useEcharts(trafficChartRef.value)
  trafficChart.setOption({
    title: { text: '訪問量統計' },
    theme: themeMode(),
    // ... 其他配置
  })
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
</style>
```

## useForm()

用於表單操作的 Hook，提供了表單例項的獲取和操作功能。

**原始碼路徑：** `/web/src/hooks/useForm.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useForm.ts)

### 引數

| 引數 | 型別 | 描述 |
|------|------|------|
| refName | string | 表單引用名稱 |

### 返回值

返回一個 Promise，解析為 `MaFormExpose` 型別的表單例項。

### 使用示例

```typescript
import useForm from '@/hooks/useForm'

export default defineComponent({
  setup() {
    const formRef = ref()
    
    // 獲取表單例項
    const getFormInstance = async () => {
      try {
        const formInstance = await useForm('userForm')
        
        // 使用表單例項進行操作
        await formInstance.validate()
        const formData = formInstance.getFieldsValue()
        
        console.log('表單資料：', formData)
      } catch (error) {
        console.error('表單驗證失敗：', error)
      }
    }

    return {
      formRef,
      getFormInstance
    }
  }
})
```

### 實際應用場景

```vue
<template>
  <div>表單內容</div>
  <el-button @click="handleSubmit">提交</el-button>
</template>

<script setup>
import useForm from '@/hooks/useForm'
import { ref } from 'vue'

const userFormRef = ref()

const formColumns = [
  {
    title: '使用者名稱',
    dataIndex: 'username',
    formType: 'input',
    rules: [{ required: true, message: '請輸入使用者名稱' }]
  },
  {
    title: '郵箱',
    dataIndex: 'email',
    formType: 'input',
    rules: [{ required: true, type: 'email', message: '請輸入正確的郵箱' }]
  }
]

const handleSubmit = async () => {
  try {
    const formInstance = await useForm('userForm')
    
    // 表單提交邏輯
    console.log('表單提交')
  } catch (error) {
    console.error('提交失敗:', error)
  }
}
</script>
```

## useTable()

用於表格操作的 Hook，提供了表格例項的獲取和操作功能。

**原始碼路徑：** `/web/src/hooks/useTable.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTable.ts)

### 引數

| 引數 | 型別 | 描述 |
|------|------|------|
| refName | string | 表格引用名稱 |

### 返回值

返回一個 Promise，解析為 `MaTableExpose` 型別的表格例項。

### 使用示例

```typescript
import useTable from '@/hooks/useTable'

export default defineComponent({
  setup() {
    // 獲取表格例項
    const getTableInstance = async () => {
      try {
        const tableInstance = await useTable('userTable')
        
        // 重新整理表格資料
        await tableInstance.refresh()
        
        // 獲取選中的行
        const selectedRows = tableInstance.getSelectedRows()
        console.log('選中的行：', selectedRows)
        
        // 清空選擇
        tableInstance.clearSelection()
      } catch (error) {
        console.error('獲取表格例項失敗：', error)
      }
    }

    return { getTableInstance }
  }
})
```

### 實際應用場景

```vue
<template>
  <div>
    <el-button @click="refreshTable">重新整理</el-button>
    <el-button @click="deleteSelected">刪除選中</el-button>
    <div>表格內容</div>
  </div>
</template>

<script setup>
import useTable from '@/hooks/useTable'

const userTableRef = ref()

const tableColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '使用者名稱', dataIndex: 'username' },
  { title: '郵箱', dataIndex: 'email' },
  { title: '狀態', dataIndex: 'status' }
]

// 重新整理表格
const refreshTable = async () => {
  const tableInstance = await useTable('userTable')
  await tableInstance.refresh()
  ElMessage.success('重新整理成功')
}

// 刪除選中的使用者
const deleteSelected = async () => {
  try {
    const tableInstance = await useTable('userTable')
    const selectedRows = tableInstance.getSelectedRows()
    
    if (selectedRows.length === 0) {
      ElMessage.warning('請選擇要刪除的使用者')
      return
    }
    
    await ElMessageBox.confirm('確定要刪除選中的使用者嗎？')
    
    const ids = selectedRows.map(row => row.id)
    await deleteUsers(ids)
    
    // 重新整理表格並清空選擇
    await tableInstance.refresh()
    tableInstance.clearSelection()
    
    ElMessage.success('刪除成功')
  } catch (error) {
    ElMessage.error('刪除失敗')
  }
}
</script>
```

## useLocalTrans()

用於本地化翻譯的 Hook，提供了基於 vue-i18n 的翻譯功能。

**原始碼路徑：** `/web/src/hooks/useLocalTrans.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useLocalTrans.ts)

### 引數

| 引數 | 型別 | 預設值 | 描述 |
|------|------|--------|------|
| key | any \| null | null | 翻譯鍵名，為 null 時返回翻譯函式 |

### 返回值

- 當 `key` 為 null 時，返回翻譯函式 `ComposerTranslation`
- 當 `key` 有值時，返回翻譯後的字串

### 使用示例

```typescript
import { useLocalTrans } from '@/hooks/useLocalTrans'

export default defineComponent({
  setup() {
    // 獲取翻譯函式
    const t = useLocalTrans()
    
    // 直接翻譯
    const title = useLocalTrans('user.title')
    const message = useLocalTrans('user.welcome', { name: 'MineAdmin' })
    
    return {
      t,
      title,
      message
    }
  },

  render() {
    return (
      <div>
        <h1>{this.title}</h1>
        <p>{this.message}</p>
        <p>{this.t("user.description")}</p>
      </div>
    )
  }
})
```

### 實際應用場景

```vue
<template>
  <div class="user-panel">
    <h2>{{ pageTitle }}</h2>
    <el-button @click="showWelcome">{{ t('user.showWelcome') }}</el-button>
    <p>{{ welcomeMessage }}</p>
  </div>
</template>

<script setup>
import { useLocalTrans } from '@/hooks/useLocalTrans'

// 獲取翻譯函式
const t = useLocalTrans()

// 直接獲取翻譯文字
const pageTitle = useLocalTrans('user.management')

const userName = ref('管理員')
const welcomeMessage = computed(() => 
  t('user.welcomeMessage', { name: userName.value })
)

const showWelcome = () => {
  ElMessage.success(t('user.welcomeBack'))
}
</script>
```

## useMessage()

用於訊息提示的 Hook，封裝了 Element Plus 的訊息元件，提供統一的訊息提示介面。

**原始碼路徑：** `/web/src/hooks/useMessage.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useMessage.ts)

### 返回值

| 方法 | 引數 | 描述 |
|------|------|------|
| info | (content: string) | 顯示資訊訊息 |
| error | (content: string) | 顯示錯誤訊息 |
| success | (content: string) | 顯示成功訊息 |
| warning | (content: string) | 顯示警告訊息 |
| alert | (content: string) | 顯示提示框 |
| alertError | (content: string) | 顯示錯誤提示框 |
| alertSuccess | (content: string) | 顯示成功提示框 |
| alertWarning | (content: string) | 顯示警告提示框 |
| notify | (content: string, args?: Record<string, any>) | 顯示通知 |
| notifyError | (content: string) | 顯示錯誤通知 |
| notifySuccess | (content: string) | 顯示成功通知 |
| notifyWarning | (content: string) | 顯示警告通知 |
| confirm | (content: string, tip?: string) | 顯示確認框 |
| delConfirm | (content?: string, tip?: string) | 顯示刪除確認框 |
| exportConfirm | (content?: string, tip?: string) | 顯示匯出確認框 |
| prompt | (content: string, defaultValue?: string, tip?: string, inputValidator?: MessageBoxInputValidator) | 顯示輸入框 |

### 使用示例

```typescript
import { useMessage } from '@/hooks/useMessage'

export default defineComponent({
  setup() {
    const message = useMessage()

    const handleSuccess = () => {
      message.success('操作成功！')
    }

    const handleError = () => {
      message.error('操作失敗，請重試')
    }

    const handleConfirm = async () => {
      try {
        await message.confirm('確定要執行此操作嗎？')
        console.log('使用者確認了操作')
      } catch {
        console.log('使用者取消了操作')
      }
    }

    const handleDelete = async () => {
      try {
        await message.delConfirm()
        console.log('執行刪除操作')
      } catch {
        console.log('取消刪除')
      }
    }

    return {
      handleSuccess,
      handleError,
      handleConfirm,
      handleDelete
    }
  }
})
```

### 實際應用場景

```vue
<template>
  <div>
    <el-button @click="saveData">儲存資料</el-button>
    <el-button @click="deleteItem" type="danger">刪除</el-button>
    <el-button @click="exportData">匯出資料</el-button>
  </div>
</template>

<script setup>
import { useMessage } from '@/hooks/useMessage'
import { saveUserData, deleteUserById, exportUserData } from '@/api/user'

const message = useMessage()

// 儲存資料
const saveData = async () => {
  try {
    await saveUserData({ name: 'test', email: 'test@example.com' })
    message.success('資料儲存成功')
  } catch (error) {
    message.error('儲存失敗：' + error.message)
  }
}

// 刪除專案
const deleteItem = async () => {
  try {
    await message.delConfirm('確定要刪除這個使用者嗎？')
    await deleteUserById(123)
    message.success('刪除成功')
  } catch (error) {
    if (error !== 'cancel') {
      message.error('刪除失敗')
    }
  }
}

// 匯出資料
const exportData = async () => {
  try {
    await message.exportConfirm()
    const data = await exportUserData()
    message.notifySuccess('資料匯出完成')
  } catch (error) {
    if (error !== 'cancel') {
      message.notifyError('匯出失敗')
    }
  }
}

// 顯示自定義通知
const showCustomNotify = () => {
  message.notify('這是一個自定義通知', {
    type: 'info',
    duration: 5000,
    position: 'top-right'
  })
}
</script>
```

## useTabCollection()

用於標籤頁收藏的 Hook，允許使用者收藏和管理常用的標籤頁。

**原始碼路徑：** `/web/src/hooks/useTabCollection.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTabCollection.ts)

### 返回值

| 屬性 | 型別 | 描述 |
|------|------|------|
| tabCollection | Ref<MineTabbar[]> | 收藏的標籤頁列表 |
| addToCollection | Function | 新增標籤頁到收藏 |
| removeCollection | Function | 從收藏中移除標籤頁 |

### 使用示例

```typescript
import useTabCollection from '@/hooks/useTabCollection'

export default defineComponent({
  setup() {
    const { tabCollection, addToCollection, removeCollection } = useTabCollection()

    // 添加當前標籤頁到收藏
    const addCurrentTab = () => {
      addToCollection() // 不傳引數會自動獲取當前標籤頁
    }

    // 新增指定標籤頁到收藏
    const addSpecificTab = () => {
      const tab = {
        name: 'userList',
        title: '使用者列表',
        path: '/user/list',
        fullPath: '/user/list?status=active',
        icon: 'user'
      }
      addToCollection(tab)
    }

    // 移除收藏
    const removeTab = (tab) => {
      removeCollection(tab)
    }

    return {
      tabCollection,
      addCurrentTab,
      addSpecificTab,
      removeTab
    }
  }
})
```

### 實際應用場景

```vue
<template>
  <div class="tab-collection">
    <div class="collection-header">
      <h3>我的收藏</h3>
      <el-button @click="addCurrentTab" size="small">
        <el-icon><Star /></el-icon>
        收藏當前頁面
      </el-button>
    </div>
    
    <div class="collection-list">
      <div 
        v-for="tab in tabCollection" 
        :key="tab.fullPath"
        class="collection-item"
      >
        <el-icon v-if="tab.icon">
          <component :is="tab.icon" />
        </el-icon>
        <span class="tab-title" @click="goToTab(tab)">
          {{ tab.title }}
        </span>
        <el-button 
          @click="removeTab(tab)" 
          type="text" 
          size="small"
          class="remove-btn"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useTabCollection from '@/hooks/useTabCollection'
import { Star, Close } from '@element-plus/icons-vue'

const router = useRouter()
const { tabCollection, addToCollection, removeCollection } = useTabCollection()

// 添加當前標籤頁到收藏
const addCurrentTab = () => {
  addToCollection()
}

// 跳轉到指定標籤頁
const goToTab = (tab) => {
  router.push(tab.fullPath)
}

// 移除收藏
const removeTab = (tab) => {
  removeCollection(tab)
}
</script>

<style scoped>
.collection-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-title {
  flex: 1;
  margin-left: 8px;
  cursor: pointer;
}

.tab-title:hover {
  color: var(--el-color-primary);
}

.remove-btn {
  margin-left: auto;
}
</style>
```

## useImageViewer()

用於圖片預覽的 Hook，基於 Element Plus 的 ImageViewer 元件，支援多圖片瀏覽。

**原始碼路徑：** `/web/src/hooks/useImageViewer.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useImageViewer.ts)

### 型別定義

```typescript
type Options = Partial<Omit<ImageViewerProps, 'urlList'>>
```

### 引數

| 引數 | 型別 | 描述 |
|------|------|------|
| images | string[] | 圖片地址陣列 |
| options | Options | 圖片檢視器配置選項 |

### 使用示例

```typescript
import { useImageViewer } from '@/hooks/useImageViewer'

export default defineComponent({
  setup() {
    const previewImages = () => {
      const images = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ]

      useImageViewer(images, {
        initialIndex: 0, // 初始顯示第一張圖片
        zIndex: 3000,    // 設定 z-index
        hideOnClickModal: true // 點選遮罩層關閉
      })
    }

    return { previewImages }
  }
})
```

### 實際應用場景

```vue
<template>
  <div class="image-gallery">
    <div 
      v-for="(image, index) in imageList" 
      :key="index"
      class="image-item"
      @click="previewImage(index)"
    >
      <img :src="image" alt="圖片" />
      <div class="image-overlay">
        <el-icon><ZoomIn /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImageViewer } from '@/hooks/useImageViewer'
import { ZoomIn } from '@element-plus/icons-vue'

const imageList = ref([
  'https://example.com/gallery/img1.jpg',
  'https://example.com/gallery/img2.jpg',
  'https://example.com/gallery/img3.jpg',
  'https://example.com/gallery/img4.jpg'
])

// 預覽圖片
const previewImage = (index) => {
  useImageViewer(imageList.value, {
    initialIndex: index, // 從點選的圖片開始顯示
    zIndex: 2500,
    hideOnClickModal: true,
    // 自定義關閉回撥
    onClose: () => {
      console.log('圖片預覽已關閉')
    }
  })
}

// 預覽單張圖片
const previewSingleImage = (imageUrl) => {
  useImageViewer([imageUrl], {
    zIndex: 2500,
    hideOnClickModal: true
  })
}
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-item:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-overlay .el-icon {
  color: white;
  font-size: 24px;
}
</style>
```

## useResourcePicker()

用於資源選擇的 Hook，提供了檔案、圖片等資源的選擇功能。

**原始碼路徑：** `/web/src/hooks/useResourcePicker.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useResourcePicker.ts)

### 型別定義

```typescript
export type WithOnEventListeners<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: T[K];
}

type Options = Partial<ResourcePickerProps & WithOnEventListeners<ResourcePickerEmits>>
```

### 引數

| 引數 | 型別 | 描述 |
|------|------|------|
| options | Options | 資源選擇器配置選項 |

### 使用示例

```typescript
import { useResourcePicker } from '@/hooks/useResourcePicker'

export default defineComponent({
  setup() {
    const selectSingleFile = () => {
      useResourcePicker({
        multiple: false,
        defaultFileType: 'image',
        onConfirm: (resources) => {
          console.log('選擇的資源：', resources)
          // 處理選中的資源
          if (resources.length > 0) {
            const selectedFile = resources[0]
            console.log('檔名：', selectedFile.origin_name)
            console.log('檔案URL：', selectedFile.url)
          }
        },
        onCancel: () => {
          console.log('使用者取消了選擇')
        }
      })
    }

    const selectMultipleImages = () => {
      useResourcePicker({
        multiple: true,
        limit: 5, // 最多選擇5個檔案
        defaultFileType: 'image',
        onConfirm: (resources) => {
          console.log('選擇的圖片：', resources)
          // 批次處理圖片
          resources.forEach(image => {
            console.log(`圖片: ${image.origin_name}, URL: ${image.url}`)
          })
        }
      })
    }

    return {
      selectSingleFile,
      selectMultipleImages
    }
  }
})
```

### 實際應用場景

```vue
<template>
  <div class="resource-demo">
    <div class="upload-area">
      <el-button @click="selectAvatar">選擇頭像</el-button>
      <div v-if="avatarUrl" class="avatar-preview">
        <img :src="avatarUrl" alt="頭像預覽" />
      </div>
    </div>

    <div class="gallery-area">
      <el-button @click="selectGalleryImages">選擇圖片</el-button>
      <div class="gallery-preview">
        <div 
          v-for="(image, index) in galleryImages" 
          :key="index"
          class="gallery-item"
        >
          <img :src="image.url" :alt="image.origin_name" />
          <p>{{ image.origin_name }}</p>
        </div>
      </div>
    </div>

    <div class="file-area">
      <el-button @click="selectDocuments">選擇文件</el-button>
      <ul class="file-list">
        <li v-for="(file, index) in documentFiles" :key="index">
          <span>{{ file.origin_name }}</span>
          <span>{{ file.size_info }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useResourcePicker } from '@/hooks/useResourcePicker'

const avatarUrl = ref('')
const galleryImages = ref([])
const documentFiles = ref([])

// 選擇頭像
const selectAvatar = () => {
  useResourcePicker({
    multiple: false,
    defaultFileType: 'image',
    fileTypes: [
      { value: 'image', label: '圖片', suffix: 'jpg,jpeg,png,gif' }
    ],
    onConfirm: (resources) => {
      if (resources.length > 0) {
        avatarUrl.value = resources[0].url
        ElMessage.success('頭像選擇成功')
      }
    }
  })
}

// 選擇圖片庫圖片
const selectGalleryImages = () => {
  useResourcePicker({
    multiple: true,
    limit: 10,
    defaultFileType: 'image',
    onConfirm: (resources) => {
      galleryImages.value = resources
      ElMessage.success(`選擇了 ${resources.length} 張圖片`)
    }
  })
}

// 選擇文件
const selectDocuments = () => {
  useResourcePicker({
    multiple: true,
    limit: 20,
    defaultFileType: 'document',
    fileTypes: [
      { value: 'document', label: '文件', suffix: 'pdf,doc,docx,xls,xlsx,ppt,pptx' },
      { value: 'text', label: '文字', suffix: 'txt,md' }
    ],
    onConfirm: (resources) => {
      documentFiles.value = resources
      ElMessage.success(`選擇了 ${resources.length} 個文件`)
    }
  })
}
</script>

<style scoped>
.resource-demo {
  padding: 20px;
}

.upload-area, .gallery-area, .file-area {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
}

.gallery-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.gallery-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.file-list {
  list-style: none;
  padding: 0;
  margin-top: 16px;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
```

## useWatermark()

用於新增水印的 Hook，支援文字水印的新增和清除，自動適配深色和淺色主題。

**原始碼路徑：** `/web/src/hooks/useWatermark.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useWatermark.ts)

### 引數

| 引數 | 型別 | 預設值 | 描述 |
|------|------|--------|------|
| appendEl | HTMLElement \| null | document.body | 水印新增到的目標元素 |

### 返回值

| 方法 | 引數 | 描述 |
|------|------|------|
| setWatermark | (str: string \| string[]) | 設定水印文字 |
| clear | () | 清除水印 |

### 使用示例

```typescript
import useWatermark from '@/hooks/useWatermark'

export default defineComponent({
  setup() {
    // 預設新增到 document.body
    const { setWatermark, clear } = useWatermark()

    // 新增到指定元素
    const containerRef = ref()
    const { setWatermark: setContainerWatermark, clear: clearContainer } = 
      useWatermark(containerRef.value)

    onMounted(() => {
      // 設定單行水印
      setWatermark('MineAdmin 內部系統')

      // 設定多行水印
      setWatermark(['MineAdmin', '管理系統', '2024'])
    })

    onUnmounted(() => {
      // 元件解除安裝時清除水印
      clear()
    })

    return {
      containerRef,
      setWatermark,
      clear
    }
  }
})
```

### 實際應用場景

```vue
<template>
  <div class="watermark-demo">
    <div class="control-panel">
      <el-input 
        v-model="watermarkText" 
        placeholder="請輸入水印文字"
        style="width: 200px; margin-right: 16px;"
      />
      <el-button @click="addWatermark">新增水印</el-button>
      <el-button @click="removeWatermark">清除水印</el-button>
    </div>

    <div class="watermark-modes">
      <el-button @click="setSystemWatermark">系統水印</el-button>
      <el-button @click="setUserWatermark">使用者水印</el-button>
      <el-button @click="setMultiLineWatermark">多行水印</el-button>
    </div>

    <div 
      ref="previewArea" 
      class="preview-area"
      style="position: relative; height: 400px; border: 1px solid #ccc;"
    >
      <h3>預覽區域</h3>
      <p>這裡是內容區域，水印會覆蓋在此區域上方</p>
      <el-button @click="addAreaWatermark">為此區域新增水印</el-button>
      <el-button @click="clearAreaWatermark">清除區域水印</el-button>
    </div>
  </div>
</template>

<script setup>
import useWatermark from '@/hooks/useWatermark'
import { useUserStore } from '@/store/modules/useUserStore'

const userStore = useUserStore()
const previewArea = ref()

// 全域性水印
const { setWatermark: setGlobalWatermark, clear: clearGlobal } = useWatermark()

// 區域水印
const { setWatermark: setAreaWatermark, clear: clearArea } = useWatermark()

const watermarkText = ref('MineAdmin')

// 新增水印
const addWatermark = () => {
  if (watermarkText.value.trim()) {
    setGlobalWatermark(watermarkText.value)
    ElMessage.success('水印新增成功')
  } else {
    ElMessage.warning('請輸入水印文字')
  }
}

// 清除水印
const removeWatermark = () => {
  clearGlobal()
  ElMessage.success('水印已清除')
}

// 系統水印
const setSystemWatermark = () => {
  setGlobalWatermark(['MineAdmin', '管理系統', new Date().getFullYear().toString()])
}

// 使用者水印
const setUserWatermark = () => {
  const userInfo = userStore.getUserInfo()
  setGlobalWatermark([
    userInfo.username || '使用者',
    userInfo.email || '',
    new Date().toLocaleDateString()
  ])
}

// 多行水印
const setMultiLineWatermark = () => {
  setGlobalWatermark([
    'MineAdmin',
    '內部系統',
    '機密文件',
    '請勿外傳'
  ])
}

// 為預覽區域新增水印
const addAreaWatermark = () => {
  if (previewArea.value) {
    const areaWatermark = useWatermark(previewArea.value)
    areaWatermark.setWatermark('區域水印')
  }
}

// 清除區域水印
const clearAreaWatermark = () => {
  clearArea()
}

// 頁面離開時清除水印
onUnmounted(() => {
  clearGlobal()
  clearArea()
})
</script>

<style scoped>
.watermark-demo {
  padding: 20px;
}

.control-panel,
.watermark-modes {
  margin-bottom: 20px;
}

.preview-area {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
```

## useThemeColor()

用於主題顏色管理的 Hook，提供了顏色設定、轉換和主題初始化功能。

**原始碼路徑：** `/web/src/hooks/useThemeColor.ts`  
**GitHub 連結：** [檢視原始碼](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useThemeColor.ts)

### 返回值

| 方法 | 引數 | 描述 |
|------|------|------|
| initThemeColor | () | 初始化主題顏色 |
| setThemeColor | (color: string) | 設定主題顏色 |
| hexToRgb | (str: string) | 將十六進位制顏色轉換為RGB |
| rgbToHex | (a: number, b: number, c: number) | 將RGB顏色轉換為十六進位制 |
| darken | (color: string, level: number) | 使顏色變暗 |
| lighten | (color: string, level: number) | 使顏色變亮 |

### 使用示例

```typescript
import useThemeColor from '@/hooks/useThemeColor'

export default defineComponent({
  setup() {
    const { 
      initThemeColor, 
      setThemeColor, 
      hexToRgb, 
      rgbToHex, 
      darken, 
      lighten 
    } = useThemeColor()

    onMounted(() => {
      // 初始化主題顏色
      initThemeColor()
    })

    const changeThemeColor = (color: string) => {
      setThemeColor(color)
    }

    const colorConversion = () => {
      // 顏色轉換示例
      const hex = '#409eff'
      const rgb = hexToRgb(hex) // [64, 158, 255]
      const hexBack = rgbToHex(rgb[0], rgb[1], rgb[2]) // '#409eff'
      
      // 顏色調節
      const darkerColor = darken(hex, 0.2) // 變暗20%
      const lighterColor = lighten(hex, 0.2) // 變亮20%
      
      console.log({ hex, rgb, hexBack, darkerColor, lighterColor })
    }

    return {
      changeThemeColor,
      colorConversion
    }
  }
})
```

### 實際應用場景

```vue
<template>
  <div class="theme-settings">
    <div class="color-section">
      <h3>主題顏色設定</h3>
      <div class="preset-colors">
        <div 
          v-for="color in presetColors" 
          :key="color.name"
          :style="{ backgroundColor: color.value }"
          :class="['color-item', { active: currentColor === color.value }]"
          @click="changeColor(color.value)"
        >
          <span>{{ color.name }}</span>
        </div>
      </div>
      
      <div class="custom-color">
        <el-color-picker 
          v-model="customColor" 
          @change="changeColor"
          show-alpha
        />
        <span>自定義顏色</span>
      </div>
    </div>

    <div class="preview-section">
      <h3>顏色預覽</h3>
      <div class="color-palette">
        <div 
          v-for="(shade, index) in colorShades" 
          :key="index"
          :style="{ backgroundColor: shade }"
          class="shade-item"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>元件預覽</h3>
      <el-button type="primary">主要按鈕</el-button>
      <el-button type="primary" plain>樸素按鈕</el-button>
      <el-switch v-model="switchValue" />
      <el-slider v-model="sliderValue" style="width: 200px; margin-left: 20px;" />
    </div>
  </div>
</template>

<script setup>
import useThemeColor from '@/hooks/useThemeColor'
import { useSettingStore } from '@/store/modules/useSettingStore'

const settingStore = useSettingStore()
const { setThemeColor, initThemeColor, darken, lighten, hexToRgb } = useThemeColor()

const currentColor = ref('#409eff')
const customColor = ref('#409eff')
const switchValue = ref(true)
const sliderValue = ref(50)

// 預設顏色
const presetColors = [
  { name: '預設藍', value: '#409eff' },
  { name: '成功綠', value: '#67c23a' },
  { name: '警告橙', value: '#e6a23c' },
  { name: '危險紅', value: '#f56c6c' },
  { name: '資訊灰', value: '#909399' },
  { name: '紫色', value: '#9c27b0' },
  { name: '青色', value: '#00bcd4' },
  { name: '粉色', value: '#e91e63' }
]

// 計算顏色階梯
const colorShades = computed(() => {
  const shades = []
  for (let i = 1; i <= 9; i++) {
    shades.push(lighten(currentColor.value, i / 10))
  }
  return shades
})

// 改變主題顏色
const changeColor = (color) => {
  if (color) {
    currentColor.value = color
    customColor.value = color
    setThemeColor(color)
    
    // 儲存到設定中
    settingStore.updateSettings('app', { primaryColor: color })
    ElMessage.success('主題顏色已更新')
  }
}

// 重置為預設顏色
const resetColor = () => {
  const defaultColor = '#409eff'
  changeColor(defaultColor)
}

// 生成隨機顏色
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  changeColor(color)
}

onMounted(() => {
  // 初始化主題
  initThemeColor()
  currentColor.value = settingStore.getSettings('app').primaryColor || '#409eff'
  customColor.value = currentColor.value
})
</script>

<style scoped>
.theme-settings {
  padding: 20px;
}

.color-section, .preview-section, .demo-section {
  margin-bottom: 30px;
}

.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.color-item {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.color-item:hover {
  transform: scale(1.05);
}

.color-item.active {
  border-color: #333;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.custom-color {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-palette {
  display: flex;
  gap: 8px;
}

.shade-item {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.demo-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
```

## 總結


1. **資料管理**：`useCache()` 用於快取管理
2. **UI 互動**：`useDialog()`、`useMessage()`、`useImageViewer()` 等用於使用者介面互動
3. **業務功能**：`useForm()`、`useTable()` 用於表單和表格操作
4. **主題定製**：`useThemeColor()`、`useWatermark()` 用於主題和視覺效果
5. **資源管理**：`useResourcePicker()` 用於檔案資源選擇
6. **本地化**：`useLocalTrans()` 用於多語言翻譯
7. **使用者體驗**：`useTabCollection()` 用於標籤頁收藏管理

這些 Hooks 都遵循 Vue 3 Composition API 的設計模式，提供了良好的型別支援和開發體驗。開發者可以根據專案需求選擇合適的 Hooks，也可以組合使用多個 Hooks 來實現複雜的業務邏輯。

所有 Hooks 的原始碼都託管在 [GitHub](https://github.com/mineadmin/mineadmin) 上，開發者可以檢視詳細的實現程式碼和參與貢獻。