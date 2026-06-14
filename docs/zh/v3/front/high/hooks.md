# Hooks

MineAdmin 提供了一系列强大的自定义 Hooks，这些 Hooks 封装了常用的功能和逻辑，让开发者能够轻松地在 Vue 3 组件中复用代码。本文档将详细介绍每个 Hook 的用法、参数、返回值以及实际应用场景。

## useCache()

用于浏览器缓存操作的 Hook，支持 localStorage 和 sessionStorage，并提供了过期时间设置功能。

**源码路径：** `/web/src/hooks/useCache.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useCache.ts)

### 类型定义

```typescript
export type CacheType = 'localStorage' | 'sessionStorage'

export interface CacheOptions {
  /**
   * 超时时间，秒。
   * 默认无限大。
   */
  exp?: number

  /**
   * 为true时：当超过最大容量导致无法继续插入数据操作时，先清空缓存中已超时的内容后再尝试插入数据操作。
   * 默认为true。
   */
  force?: boolean
}
```

### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| type | CacheType | 'localStorage' | 缓存类型，可选 localStorage 或 sessionStorage |

### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| cache | WebStorageCache | 底层的 WebStorageCache 实例 |
| prefix | string | 缓存键名前缀 |
| set | Function | 设置缓存 |
| get | Function | 获取缓存 |
| remove | Function | 删除缓存 |
| removeAllExpires | Function | 删除所有过期缓存 |
| touch | Function | 更新缓存过期时间 |

### 使用示例

```typescript
import useCache from '@/hooks/useCache'

// 使用 localStorage（默认）
const { set, get, remove, removeAllExpires, touch } = useCache()

// 使用 sessionStorage
const sessionCache = useCache('sessionStorage')

// 设置缓存（不过期）
set('userInfo', { name: 'MineAdmin', role: 'admin' })

// 设置缓存（30秒后过期）
set('tempData', 'temporary value', { exp: 30 })

// 获取缓存
const userInfo = get('userInfo', null)

// 删除特定缓存
remove('tempData')

// 删除所有过期缓存
removeAllExpires()

// 更新缓存过期时间（延长60秒）
touch('userInfo', 60)
```

### 实际应用场景

```typescript
// 在用户登录组件中使用
const { set, get } = useCache()

// 保存用户登录信息
const saveUserInfo = (userInfo: any) => {
  set('userInfo', userInfo, { exp: 24 * 60 * 60 }) // 24小时后过期
}

// 获取用户信息
const getUserInfo = () => {
  return get('userInfo', null)
}
```

## useDialog()

用于创建对话框的 Hook，提供了完整的对话框生命周期管理，支持自定义标题、属性和事件回调。

**源码路径：** `/web/src/hooks/useDialog.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useDialog.ts)

### 类型定义

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

### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| dialogProps | Record<string, any> \| null | null | 对话框初始属性配置 |

### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| on | Object | 事件回调配置 |
| Dialog | Component | 对话框组件 |
| open | Function | 打开对话框 |
| close | Function | 关闭对话框 |
| setTitle | Function | 设置对话框标题 |
| setAttr | Function | 设置对话框属性 |

### 使用示例

```typescript
import useDialog from '@/hooks/useDialog'

export default defineComponent({
  setup() {
    // 创建对话框实例
    const { Dialog, open, close, setTitle, on } = useDialog({
      width: '500px',
      draggable: true
    })

    // 配置事件回调
    on.ok = () => {
      console.log('用户点击了确定')
      close()
    }

    on.cancel = () => {
      console.log('用户点击了取消')
      return true // 返回 true 允许关闭
    }

    // 打开对话框
    const openDialog = () => {
      setTitle('编辑用户信息')
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
        <el-button onClick={this.openDialog}>打开对话框</el-button>
        <Dialog title="默认标题">
          <div>这里是对话框内容</div>
        </Dialog>
      </div>
    )
  }
})
```

### 实际应用场景

```vue
<template>
  <div>
    <el-button @click="editUser">编辑用户</el-button>
    <Dialog>
      <div>编辑用户表单内容</div>
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

// 编辑用户
const editUser = () => {
  currentUserId.value = 123
  setTitle('编辑用户信息')
  open()
}

// 处理表单提交
const handleSubmit = async (formData) => {
  try {
    console.log('提交用户数据:', formData)
    close()
    // 这里处理表单提交逻辑
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 配置事件
on.ok = () => {
  // 这里可以触发表单提交
  return false // 阻止默认关闭行为
}
</script>
```

## useEcharts()

用于集成 ECharts 图表库的 Hook，提供了主题切换和图表初始化功能。

**源码路径：** `/web/src/hooks/useEcharts.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useEcharts.ts)

### 导出函数

| 函数 | 类型 | 描述 |
|------|------|------|
| useEcharts | Function | 来自 @mineadmin/echarts 的 useEcharts 函数 |
| themeMode | Function | 获取当前主题模式 |

### 使用示例

```typescript
import { useEcharts, themeMode } from '@/hooks/useEcharts'

export default defineComponent({
  setup() {
    const chartRef = ref()
    
    onMounted(async () => {
      // 初始化图表
      const chart = await useEcharts(chartRef.value)
      
      // 配置图表选项
      const option = {
        title: { text: '销售数据' },
        theme: themeMode(), // 使用当前主题
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

### 实际应用场景

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
  // 初始化销售图表
  const salesChart = await useEcharts(salesChartRef.value)
  salesChart.setOption({
    title: { text: '销售趋势' },
    theme: themeMode(),
    // ... 其他配置
  })

  // 初始化流量图表
  const trafficChart = await useEcharts(trafficChartRef.value)
  trafficChart.setOption({
    title: { text: '访问量统计' },
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

用于表单操作的 Hook，提供了表单实例的获取和操作功能。

**源码路径：** `/web/src/hooks/useForm.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useForm.ts)

### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| refName | string | 表单引用名称 |

### 返回值

返回一个 Promise，解析为 `MaFormExpose` 类型的表单实例。

### 使用示例

```typescript
import useForm from '@/hooks/useForm'

export default defineComponent({
  setup() {
    const formRef = ref()
    
    // 获取表单实例
    const getFormInstance = async () => {
      try {
        const formInstance = await useForm('userForm')
        
        // 使用表单实例进行操作
        await formInstance.validate()
        const formData = formInstance.getFieldsValue()
        
        console.log('表单数据：', formData)
      } catch (error) {
        console.error('表单验证失败：', error)
      }
    }

    return {
      formRef,
      getFormInstance
    }
  }
})
```

### 实际应用场景

```vue
<template>
  <div>表单内容</div>
  <el-button @click="handleSubmit">提交</el-button>
</template>

<script setup>
import useForm from '@/hooks/useForm'
import { ref } from 'vue'

const userFormRef = ref()

const formColumns = [
  {
    title: '用户名',
    dataIndex: 'username',
    formType: 'input',
    rules: [{ required: true, message: '请输入用户名' }]
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    formType: 'input',
    rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }]
  }
]

const handleSubmit = async () => {
  try {
    const formInstance = await useForm('userForm')
    
    // 表单提交逻辑
    console.log('表单提交')
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>
```

## useTable()

用于表格操作的 Hook，提供了表格实例的获取和操作功能。

**源码路径：** `/web/src/hooks/useTable.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTable.ts)

### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| refName | string | 表格引用名称 |

### 返回值

返回一个 Promise，解析为 `MaTableExpose` 类型的表格实例。

### 使用示例

```typescript
import useTable from '@/hooks/useTable'

export default defineComponent({
  setup() {
    // 获取表格实例
    const getTableInstance = async () => {
      try {
        const tableInstance = await useTable('userTable')
        
        // 刷新表格数据
        await tableInstance.refresh()
        
        // 获取选中的行
        const selectedRows = tableInstance.getSelectedRows()
        console.log('选中的行：', selectedRows)
        
        // 清空选择
        tableInstance.clearSelection()
      } catch (error) {
        console.error('获取表格实例失败：', error)
      }
    }

    return { getTableInstance }
  }
})
```

### 实际应用场景

```vue
<template>
  <div>
    <el-button @click="refreshTable">刷新</el-button>
    <el-button @click="deleteSelected">删除选中</el-button>
    <div>表格内容</div>
  </div>
</template>

<script setup>
import useTable from '@/hooks/useTable'

const userTableRef = ref()

const tableColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '状态', dataIndex: 'status' }
]

// 刷新表格
const refreshTable = async () => {
  const tableInstance = await useTable('userTable')
  await tableInstance.refresh()
  ElMessage.success('刷新成功')
}

// 删除选中的用户
const deleteSelected = async () => {
  try {
    const tableInstance = await useTable('userTable')
    const selectedRows = tableInstance.getSelectedRows()
    
    if (selectedRows.length === 0) {
      ElMessage.warning('请选择要删除的用户')
      return
    }
    
    await ElMessageBox.confirm('确定要删除选中的用户吗？')
    
    const ids = selectedRows.map(row => row.id)
    await deleteUsers(ids)
    
    // 刷新表格并清空选择
    await tableInstance.refresh()
    tableInstance.clearSelection()
    
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
</script>
```

## useLocalTrans()

用于本地化翻译的 Hook，提供了基于 vue-i18n 的翻译功能。

**源码路径：** `/web/src/hooks/useLocalTrans.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useLocalTrans.ts)

### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| key | any \| null | null | 翻译键名，为 null 时返回翻译函数 |

### 返回值

- 当 `key` 为 null 时，返回翻译函数 `ComposerTranslation`
- 当 `key` 有值时，返回翻译后的字符串

### 使用示例

```typescript
import { useLocalTrans } from '@/hooks/useLocalTrans'

export default defineComponent({
  setup() {
    // 获取翻译函数
    const t = useLocalTrans()
    
    // 直接翻译
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

### 实际应用场景

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

// 获取翻译函数
const t = useLocalTrans()

// 直接获取翻译文本
const pageTitle = useLocalTrans('user.management')

const userName = ref('管理员')
const welcomeMessage = computed(() => 
  t('user.welcomeMessage', { name: userName.value })
)

const showWelcome = () => {
  ElMessage.success(t('user.welcomeBack'))
}
</script>
```

## useMessage()

用于消息提示的 Hook，封装了 Element Plus 的消息组件，提供统一的消息提示接口。

**源码路径：** `/web/src/hooks/useMessage.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useMessage.ts)

### 返回值

| 方法 | 参数 | 描述 |
|------|------|------|
| info | (content: string) | 显示信息消息 |
| error | (content: string) | 显示错误消息 |
| success | (content: string) | 显示成功消息 |
| warning | (content: string) | 显示警告消息 |
| alert | (content: string) | 显示提示框 |
| alertError | (content: string) | 显示错误提示框 |
| alertSuccess | (content: string) | 显示成功提示框 |
| alertWarning | (content: string) | 显示警告提示框 |
| notify | (content: string, args?: Record<string, any>) | 显示通知 |
| notifyError | (content: string) | 显示错误通知 |
| notifySuccess | (content: string) | 显示成功通知 |
| notifyWarning | (content: string) | 显示警告通知 |
| confirm | (content: string, tip?: string) | 显示确认框 |
| delConfirm | (content?: string, tip?: string) | 显示删除确认框 |
| exportConfirm | (content?: string, tip?: string) | 显示导出确认框 |
| prompt | (content: string, defaultValue?: string, tip?: string, inputValidator?: MessageBoxInputValidator) | 显示输入框 |

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
      message.error('操作失败，请重试')
    }

    const handleConfirm = async () => {
      try {
        await message.confirm('确定要执行此操作吗？')
        console.log('用户确认了操作')
      } catch {
        console.log('用户取消了操作')
      }
    }

    const handleDelete = async () => {
      try {
        await message.delConfirm()
        console.log('执行删除操作')
      } catch {
        console.log('取消删除')
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

### 实际应用场景

```vue
<template>
  <div>
    <el-button @click="saveData">保存数据</el-button>
    <el-button @click="deleteItem" type="danger">删除</el-button>
    <el-button @click="exportData">导出数据</el-button>
  </div>
</template>

<script setup>
import { useMessage } from '@/hooks/useMessage'
import { saveUserData, deleteUserById, exportUserData } from '@/api/user'

const message = useMessage()

// 保存数据
const saveData = async () => {
  try {
    await saveUserData({ name: 'test', email: 'test@example.com' })
    message.success('数据保存成功')
  } catch (error) {
    message.error('保存失败：' + error.message)
  }
}

// 删除项目
const deleteItem = async () => {
  try {
    await message.delConfirm('确定要删除这个用户吗？')
    await deleteUserById(123)
    message.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      message.error('删除失败')
    }
  }
}

// 导出数据
const exportData = async () => {
  try {
    await message.exportConfirm()
    const data = await exportUserData()
    message.notifySuccess('数据导出完成')
  } catch (error) {
    if (error !== 'cancel') {
      message.notifyError('导出失败')
    }
  }
}

// 显示自定义通知
const showCustomNotify = () => {
  message.notify('这是一个自定义通知', {
    type: 'info',
    duration: 5000,
    position: 'top-right'
  })
}
</script>
```

## useTabCollection()

用于标签页收藏的 Hook，允许用户收藏和管理常用的标签页。

**源码路径：** `/web/src/hooks/useTabCollection.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useTabCollection.ts)

### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| tabCollection | Ref<MineTabbar[]> | 收藏的标签页列表 |
| addToCollection | Function | 添加标签页到收藏 |
| removeCollection | Function | 从收藏中移除标签页 |

### 使用示例

```typescript
import useTabCollection from '@/hooks/useTabCollection'

export default defineComponent({
  setup() {
    const { tabCollection, addToCollection, removeCollection } = useTabCollection()

    // 添加当前标签页到收藏
    const addCurrentTab = () => {
      addToCollection() // 不传参数会自动获取当前标签页
    }

    // 添加指定标签页到收藏
    const addSpecificTab = () => {
      const tab = {
        name: 'userList',
        title: '用户列表',
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

### 实际应用场景

```vue
<template>
  <div class="tab-collection">
    <div class="collection-header">
      <h3>我的收藏</h3>
      <el-button @click="addCurrentTab" size="small">
        <el-icon><Star /></el-icon>
        收藏当前页面
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

// 添加当前标签页到收藏
const addCurrentTab = () => {
  addToCollection()
}

// 跳转到指定标签页
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

用于图片预览的 Hook，基于 Element Plus 的 ImageViewer 组件，支持多图片浏览。

**源码路径：** `/web/src/hooks/useImageViewer.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useImageViewer.ts)

### 类型定义

```typescript
type Options = Partial<Omit<ImageViewerProps, 'urlList'>>
```

### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| images | string[] | 图片地址数组 |
| options | Options | 图片查看器配置选项 |

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
        initialIndex: 0, // 初始显示第一张图片
        zIndex: 3000,    // 设置 z-index
        hideOnClickModal: true // 点击遮罩层关闭
      })
    }

    return { previewImages }
  }
})
```

### 实际应用场景

```vue
<template>
  <div class="image-gallery">
    <div 
      v-for="(image, index) in imageList" 
      :key="index"
      class="image-item"
      @click="previewImage(index)"
    >
      <img :src="image" alt="图片" />
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

// 预览图片
const previewImage = (index) => {
  useImageViewer(imageList.value, {
    initialIndex: index, // 从点击的图片开始显示
    zIndex: 2500,
    hideOnClickModal: true,
    // 自定义关闭回调
    onClose: () => {
      console.log('图片预览已关闭')
    }
  })
}

// 预览单张图片
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

用于资源选择的 Hook，提供了文件、图片等资源的选择功能。

**源码路径：** `/web/src/hooks/useResourcePicker.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useResourcePicker.ts)

### 类型定义

```typescript
export type WithOnEventListeners<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: T[K];
}

type Options = Partial<ResourcePickerProps & WithOnEventListeners<ResourcePickerEmits>>
```

### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| options | Options | 资源选择器配置选项 |

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
          console.log('选择的资源：', resources)
          // 处理选中的资源
          if (resources.length > 0) {
            const selectedFile = resources[0]
            console.log('文件名：', selectedFile.origin_name)
            console.log('文件URL：', selectedFile.url)
          }
        },
        onCancel: () => {
          console.log('用户取消了选择')
        }
      })
    }

    const selectMultipleImages = () => {
      useResourcePicker({
        multiple: true,
        limit: 5, // 最多选择5个文件
        defaultFileType: 'image',
        onConfirm: (resources) => {
          console.log('选择的图片：', resources)
          // 批量处理图片
          resources.forEach(image => {
            console.log(`图片: ${image.origin_name}, URL: ${image.url}`)
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

### 实际应用场景

```vue
<template>
  <div class="resource-demo">
    <div class="upload-area">
      <el-button @click="selectAvatar">选择头像</el-button>
      <div v-if="avatarUrl" class="avatar-preview">
        <img :src="avatarUrl" alt="头像预览" />
      </div>
    </div>

    <div class="gallery-area">
      <el-button @click="selectGalleryImages">选择图片</el-button>
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
      <el-button @click="selectDocuments">选择文档</el-button>
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

// 选择头像
const selectAvatar = () => {
  useResourcePicker({
    multiple: false,
    defaultFileType: 'image',
    fileTypes: [
      { value: 'image', label: '图片', suffix: 'jpg,jpeg,png,gif' }
    ],
    onConfirm: (resources) => {
      if (resources.length > 0) {
        avatarUrl.value = resources[0].url
        ElMessage.success('头像选择成功')
      }
    }
  })
}

// 选择图片库图片
const selectGalleryImages = () => {
  useResourcePicker({
    multiple: true,
    limit: 10,
    defaultFileType: 'image',
    onConfirm: (resources) => {
      galleryImages.value = resources
      ElMessage.success(`选择了 ${resources.length} 张图片`)
    }
  })
}

// 选择文档
const selectDocuments = () => {
  useResourcePicker({
    multiple: true,
    limit: 20,
    defaultFileType: 'document',
    fileTypes: [
      { value: 'document', label: '文档', suffix: 'pdf,doc,docx,xls,xlsx,ppt,pptx' },
      { value: 'text', label: '文本', suffix: 'txt,md' }
    ],
    onConfirm: (resources) => {
      documentFiles.value = resources
      ElMessage.success(`选择了 ${resources.length} 个文档`)
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

用于添加水印的 Hook，支持文字水印的添加和清除，自动适配深色和浅色主题。

**源码路径：** `/web/src/hooks/useWatermark.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useWatermark.ts)

### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| appendEl | HTMLElement \| null | document.body | 水印添加到的目标元素 |

### 返回值

| 方法 | 参数 | 描述 |
|------|------|------|
| setWatermark | (str: string \| string[]) | 设置水印文字 |
| clear | () | 清除水印 |

### 使用示例

```typescript
import useWatermark from '@/hooks/useWatermark'

export default defineComponent({
  setup() {
    // 默认添加到 document.body
    const { setWatermark, clear } = useWatermark()

    // 添加到指定元素
    const containerRef = ref()
    const { setWatermark: setContainerWatermark, clear: clearContainer } = 
      useWatermark(containerRef.value)

    onMounted(() => {
      // 设置单行水印
      setWatermark('MineAdmin 内部系统')

      // 设置多行水印
      setWatermark(['MineAdmin', '管理系统', '2024'])
    })

    onUnmounted(() => {
      // 组件卸载时清除水印
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

### 实际应用场景

```vue
<template>
  <div class="watermark-demo">
    <div class="control-panel">
      <el-input 
        v-model="watermarkText" 
        placeholder="请输入水印文字"
        style="width: 200px; margin-right: 16px;"
      />
      <el-button @click="addWatermark">添加水印</el-button>
      <el-button @click="removeWatermark">清除水印</el-button>
    </div>

    <div class="watermark-modes">
      <el-button @click="setSystemWatermark">系统水印</el-button>
      <el-button @click="setUserWatermark">用户水印</el-button>
      <el-button @click="setMultiLineWatermark">多行水印</el-button>
    </div>

    <div 
      ref="previewArea" 
      class="preview-area"
      style="position: relative; height: 400px; border: 1px solid #ccc;"
    >
      <h3>预览区域</h3>
      <p>这里是内容区域，水印会覆盖在此区域上方</p>
      <el-button @click="addAreaWatermark">为此区域添加水印</el-button>
      <el-button @click="clearAreaWatermark">清除区域水印</el-button>
    </div>
  </div>
</template>

<script setup>
import useWatermark from '@/hooks/useWatermark'
import { useUserStore } from '@/store/modules/useUserStore'

const userStore = useUserStore()
const previewArea = ref()

// 全局水印
const { setWatermark: setGlobalWatermark, clear: clearGlobal } = useWatermark()

// 区域水印
const { setWatermark: setAreaWatermark, clear: clearArea } = useWatermark()

const watermarkText = ref('MineAdmin')

// 添加水印
const addWatermark = () => {
  if (watermarkText.value.trim()) {
    setGlobalWatermark(watermarkText.value)
    ElMessage.success('水印添加成功')
  } else {
    ElMessage.warning('请输入水印文字')
  }
}

// 清除水印
const removeWatermark = () => {
  clearGlobal()
  ElMessage.success('水印已清除')
}

// 系统水印
const setSystemWatermark = () => {
  setGlobalWatermark(['MineAdmin', '管理系统', new Date().getFullYear().toString()])
}

// 用户水印
const setUserWatermark = () => {
  const userInfo = userStore.getUserInfo()
  setGlobalWatermark([
    userInfo.username || '用户',
    userInfo.email || '',
    new Date().toLocaleDateString()
  ])
}

// 多行水印
const setMultiLineWatermark = () => {
  setGlobalWatermark([
    'MineAdmin',
    '内部系统',
    '机密文档',
    '请勿外传'
  ])
}

// 为预览区域添加水印
const addAreaWatermark = () => {
  if (previewArea.value) {
    const areaWatermark = useWatermark(previewArea.value)
    areaWatermark.setWatermark('区域水印')
  }
}

// 清除区域水印
const clearAreaWatermark = () => {
  clearArea()
}

// 页面离开时清除水印
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

用于主题颜色管理的 Hook，提供了颜色设置、转换和主题初始化功能。

**源码路径：** `/web/src/hooks/useThemeColor.ts`  
**GitHub 链接：** [查看源码](https://github.com/mineadmin/mineadmin/blob/master/web/src/hooks/useThemeColor.ts)

### 返回值

| 方法 | 参数 | 描述 |
|------|------|------|
| initThemeColor | () | 初始化主题颜色 |
| setThemeColor | (color: string) | 设置主题颜色 |
| hexToRgb | (str: string) | 将十六进制颜色转换为RGB |
| rgbToHex | (a: number, b: number, c: number) | 将RGB颜色转换为十六进制 |
| darken | (color: string, level: number) | 使颜色变暗 |
| lighten | (color: string, level: number) | 使颜色变亮 |

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
      // 初始化主题颜色
      initThemeColor()
    })

    const changeThemeColor = (color: string) => {
      setThemeColor(color)
    }

    const colorConversion = () => {
      // 颜色转换示例
      const hex = '#409eff'
      const rgb = hexToRgb(hex) // [64, 158, 255]
      const hexBack = rgbToHex(rgb[0], rgb[1], rgb[2]) // '#409eff'
      
      // 颜色调节
      const darkerColor = darken(hex, 0.2) // 变暗20%
      const lighterColor = lighten(hex, 0.2) // 变亮20%
      
      console.log({ hex, rgb, hexBack, darkerColor, lighterColor })
    }

    return {
      changeThemeColor,
      colorConversion
    }
  }
})
```

### 实际应用场景

```vue
<template>
  <div class="theme-settings">
    <div class="color-section">
      <h3>主题颜色设置</h3>
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
        <span>自定义颜色</span>
      </div>
    </div>

    <div class="preview-section">
      <h3>颜色预览</h3>
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
      <h3>组件预览</h3>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="primary" plain>朴素按钮</el-button>
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

// 预设颜色
const presetColors = [
  { name: '默认蓝', value: '#409eff' },
  { name: '成功绿', value: '#67c23a' },
  { name: '警告橙', value: '#e6a23c' },
  { name: '危险红', value: '#f56c6c' },
  { name: '信息灰', value: '#909399' },
  { name: '紫色', value: '#9c27b0' },
  { name: '青色', value: '#00bcd4' },
  { name: '粉色', value: '#e91e63' }
]

// 计算颜色阶梯
const colorShades = computed(() => {
  const shades = []
  for (let i = 1; i <= 9; i++) {
    shades.push(lighten(currentColor.value, i / 10))
  }
  return shades
})

// 改变主题颜色
const changeColor = (color) => {
  if (color) {
    currentColor.value = color
    customColor.value = color
    setThemeColor(color)
    
    // 保存到设置中
    settingStore.updateSettings('app', { primaryColor: color })
    ElMessage.success('主题颜色已更新')
  }
}

// 重置为默认颜色
const resetColor = () => {
  const defaultColor = '#409eff'
  changeColor(defaultColor)
}

// 生成随机颜色
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  changeColor(color)
}

onMounted(() => {
  // 初始化主题
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

## 总结


1. **数据管理**：`useCache()` 用于缓存管理
2. **UI 交互**：`useDialog()`、`useMessage()`、`useImageViewer()` 等用于用户界面交互
3. **业务功能**：`useForm()`、`useTable()` 用于表单和表格操作
4. **主题定制**：`useThemeColor()`、`useWatermark()` 用于主题和视觉效果
5. **资源管理**：`useResourcePicker()` 用于文件资源选择
6. **本地化**：`useLocalTrans()` 用于多语言翻译
7. **用户体验**：`useTabCollection()` 用于标签页收藏管理

这些 Hooks 都遵循 Vue 3 Composition API 的设计模式，提供了良好的类型支持和开发体验。开发者可以根据项目需求选择合适的 Hooks，也可以组合使用多个 Hooks 来实现复杂的业务逻辑。

所有 Hooks 的源码都托管在 [GitHub](https://github.com/mineadmin/mineadmin) 上，开发者可以查看详细的实现代码和参与贡献。