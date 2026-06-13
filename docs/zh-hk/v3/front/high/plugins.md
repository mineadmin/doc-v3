# 插件系統

::: tip 插件系統説明
`3.0` 前端從核心層面支持了插件系統，相比 `2.0` 在設計之初沒有考慮插件功能，
在改變系統界面或者行為、功能的時候都需要去修改源代碼，而後導致後續無法升級，跟官方代碼差別越來越大，
後面增加了應用商店功能，雖然可以強行支持插件，插件也必須修改源代碼，而且在需要初始化的地方，插件無法去擴展實現，只能去修改 `main.js`。

**現在以上問題全部都不存在了，前端插件系統提供了強有力的支持，從替換界面、增加功能、引入第三方組件或者自研組件都可以無縫融入到系統裏去，
而且還提供了多種 `hooks(鈎子）` ，甚至可以去影響和改變前端的運行**
:::

## 插件系統架構概覽

插件系統基於現代前端架構設計，提供了完整的生命週期管理和擴展能力：

```plantuml
@startuml
!theme plain

package "MineAdmin Core" {
  [Plugin Manager] as PM
  [Hook System] as HS
  [Route Manager] as RM
  [Vue App Instance] as VAI
}

package "Plugin Ecosystem" {
  [Plugin A] as PA
  [Plugin B] as PB
  [Plugin Config] as PC
}

package "Frontend Framework" {
  [Vue Router] as VR
  [Pinia Store] as PS
  [Element Plus] as EP
}

PM --> HS : 管理鈎子
PM --> RM : 註冊路由
PM --> VAI : 安裝插件

PA --> PM : 註冊
PB --> PM : 註冊
PC --> PM : 配置

HS --> VR : 路由鈎子
HS --> PS : 狀態管理鈎子
HS --> EP : 組件鈎子

note right of PM : 插件生命週期管理\n動態啓停控制\n依賴關係處理
note left of HS : 支持多種鈎子類型\n異步鈎子處理\n鈎子執行順序控制

@enduml
```

### 核心特性

- **零侵入設計**: 插件開發無需修改核心代碼
- **動態加載**: 支持插件的動態啓用和禁用
- **生命週期管理**: 完整的插件生命週期鈎子
- **類型安全**: 完整的 TypeScript 類型定義
- **性能優化**: 懶加載和按需加載支持
- **錯誤隔離**: 插件錯誤不影響主應用運行

## 插件數據類型介紹

::: info 類型定義文件
類型定義在 `types/global.d.ts` 內
:::

:::details 點擊查看完整類型定義
```ts
declare namespace Plugin {
  /**
   * 插件基礎信息
   */
  interface Info {
    /** 插件名稱，格式：作者名稱空間/插件名 */
    name: string
    /** 插件版本，遵循語義化版本 */
    version: string
    /** 插件作者 */
    author: string
    /** 插件描述 */
    description: string
    /** 插件啓動順序，數值越大越先啓動，默認為 0 */
    order?: number
    /** 插件依賴列表 */
    dependencies?: string[]
    /** 插件關鍵詞，用於搜索 */
    keywords?: string[]
    /** 插件主頁地址 */
    homepage?: string
    /** 插件許可證 */
    license?: string
    /** 最低系統版本要求 */
    minSystemVersion?: string
  }

  /**
   * 插件配置
   */
  interface Config {
    /** 插件基礎信息 */
    info: Info
    /** 是否啓用插件 */
    enable: boolean
    /** 插件開發模式，用於調試 */
    devMode?: boolean
    /** 插件自定義配置項 */
    settings?: Record<string, any>
  }

  /**
   * 插件視圖路由定義
   */
  interface Views extends Route.RouteRecordRaw {
    /** 路由元信息擴展 */
    meta?: {
      /** 頁面標題 */
      title?: string
      /** 國際化鍵值 */
      i18n?: string
      /** 頁面圖標 */
      icon?: string
      /** 是否需要權限驗證 */
      requireAuth?: boolean
      /** 所需權限列表 */
      permissions?: string[]
      /** 是否緩存頁面 */
      keepAlive?: boolean
      /** 頁面是否隱藏 */
      hidden?: boolean
      /** 菜單排序 */
      order?: number
    }
  }

  /**
   * 鈎子函數類型定義
   */
  interface HookHandlers {
    /** 插件啓動鈎子，可用於初始化驗證 */
    start?: (config: Config) => Promise<boolean | void> | boolean | void
    /** 系統初始化完成鈎子，可訪問 Vue 上下文 */
    setup?: () => Promise<void> | void
    /** 路由註冊鈎子，可修改路由配置 */
    registerRoute?: (router: Router, routesRaw: Route.RouteRecordRaw[] | Views[] | MineRoute.routeRecord[]) => Promise<void> | void
    /** 用户登錄鈎子 */
    login?: (formInfo: LoginFormData) => Promise<void> | void
    /** 用户退出登錄鈎子 */
    logout?: () => Promise<void> | void
    /** 獲取用户信息鈎子 */
    getUserInfo?: (userInfo: UserInfo) => Promise<void> | void
    /** 路由跳轉鈎子（外鏈無效） */
    routerRedirect?: (context: { from: RouteLocationNormalized, to: RouteLocationNormalized }, router: Router) => Promise<void> | void
    /** 網絡請求攔截鈎子 */
    networkRequest?: <T = any>(request: AxiosRequestConfig) => Promise<AxiosRequestConfig> | AxiosRequestConfig
    /** 網絡響應攔截鈎子 */
    networkResponse?: <T = any>(response: AxiosResponse<T>) => Promise<AxiosResponse<T>> | AxiosResponse<T>
    /** 錯誤處理鈎子 */
    error?: (error: Error, context?: string) => Promise<void> | void
    /** 頁面加載完成鈎子 */
    mounted?: () => Promise<void> | void
    /** 頁面銷燬鈎子 */
    beforeDestroy?: () => Promise<void> | void
  }

  /**
   * 插件主配置接口
   */
  interface PluginConfig {
    /** 插件安裝函數，註冊組件、指令等 */
    install: (app: App<Element>) => Promise<void> | void
    /** 插件配置信息 */
    config: Config
    /** 插件路由定義 */
    views?: Views[]
    /** 插件鈎子函數 */
    hooks?: HookHandlers
    /** 插件自定義屬性 */
    [key: string]: any
  }

  /**
   * 插件存儲狀態
   */
  interface PluginStore {
    /** 已安裝的插件列表 */
    plugins: Map<string, PluginConfig>
    /** 插件啓用狀態 */
    enabledPlugins: Set<string>
    /** 插件加載狀態 */
    loadingPlugins: Set<string>
    /** 插件錯誤信息 */
    pluginErrors: Map<string, Error>
  }

  /**
   * 插件管理器接口
   */
  interface PluginManager {
    /** 註冊插件 */
    register(name: string, plugin: PluginConfig): Promise<boolean>
    /** 卸載插件 */
    unregister(name: string): Promise<boolean>
    /** 啓用插件 */
    enable(name: string): Promise<boolean>
    /** 禁用插件 */
    disable(name: string): Promise<boolean>
    /** 獲取插件信息 */
    getPlugin(name: string): PluginConfig | null
    /** 獲取所有插件 */
    getAllPlugins(): Map<string, PluginConfig>
    /** 檢查插件依賴 */
    checkDependencies(name: string): Promise<boolean>
  }
}

/**
 * 登錄表單數據類型
 */
interface LoginFormData {
  username: string
  password: string
  captcha?: string
  remember?: boolean
}

/**
 * 用户信息類型
 */
interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  avatar: string
  roles: string[]
  permissions: string[]
  [key: string]: any
}
```
:::

## 創建插件

### 目錄結構與命名規範

所有插件都放在 `src/plugins` 目錄下，且插件有別名 `$` 指向了此目錄，插件跟後端結構相同，
由 `開發作者名稱空間/插件名稱` 組成插件目錄。斜槓左邊是**作者名稱空間**，可在 [MineAdmin官網設置](https://www.mineadmin.com)，
斜槓右邊則為**插件名稱**，在這個作者名稱空間下唯一。

#### 標準插件目錄結構

```bash
src/plugins/
├── mine-admin/          # 官方插件命名空間
│   ├── app-store/       # 應用商店插件
│   ├── basic-ui/        # 基礎UI庫插件
│   └── demo/            # 官方演示插件
├── author-name/         # 第三方開發者命名空間
│   └── plugin-name/     # 具體插件目錄
│       ├── index.ts     # 插件入口文件（必須）
│       ├── config.ts    # 插件配置文件（可選）
│       ├── package.json # 插件包信息（推薦）
│       ├── README.md    # 插件説明文檔（推薦）
│       ├── views/       # 頁面組件目錄
│       │   ├── index.vue
│       │   └── components/
│       ├── components/  # 可複用組件
│       ├── composables/ # 組合式函數
│       ├── utils/       # 工具函數
│       ├── assets/      # 靜態資源
│       ├── locales/     # 國際化文件
│       │   ├── zh.json
│       │   ├── en.json
│       │   └── ja.json
│       ├── types/       # TypeScript 類型定義
│       └── tests/       # 測試文件
```

#### 命名規範建議

- **插件名稱**: 使用小寫字母和連字符，如 `file-manager`、`data-export`
- **作者空間**: 使用小寫字母和連字符，避免特殊字符
- **文件命名**: 遵循 kebab-case 規範
- **組件名稱**: 使用 PascalCase，如 `FileUploader.vue`

::: tip 最佳實踐
- 本地開發的插件也可以被系統識別，但無法上傳到 MineAdmin 應用市場
- 建議為插件添加 `package.json` 以便管理依賴和版本
- 使用 TypeScript 開發可獲得更好的類型提示和錯誤檢查
- 遵循 Vue 3 組合式 API 最佳實踐
:::

::: warning 注意事項
- 插件名稱在同一作者空間下必須唯一
- 避免使用系統保留字作為插件名稱
- 插件目錄一旦創建，不建議隨意更改名稱
:::

### 插件生命週期

```plantuml
@startuml
!theme plain

start

:系統啓動;
:掃描插件目錄;
:加載插件配置;

if (插件已啓用?) then (yes)
  :檢查依賴關係;
  if (依賴滿足?) then (yes)
    :執行 start 鈎子;
    if (啓動成功?) then (yes)
      :執行 install 方法;
      :註冊組件和指令;
      :執行 setup 鈎子;
      :註冊路由;
      :執行 registerRoute 鈎子;
      :插件初始化完成;
    else (no)
      :標記插件啓動失敗;
      stop
    endif
  else (no)
    :顯示依賴錯誤;
    stop
  endif
else (no)
  :跳過插件加載;
  stop
endif

:插件運行中;

note right: 運行時鈎子\n- login\n- logout\n- getUserInfo\n- routerRedirect\n- networkRequest\n- networkResponse

if (插件被禁用?) then (yes)
  :執行 beforeDestroy 鈎子;
  :清理資源;
  :移除路由;
  :卸載組件;
  :插件停止;
  stop
else (no)
  :繼續運行;
endif

@enduml
```

## 插件開發指南

### 基礎插件示例

讓我們通過一個完整的文件管理插件來了解插件開發的完整流程：

#### 1. 創建插件入口文件 `index.ts`

```ts
// src/plugins/zhang-san/file-manager/index.ts
import type { App } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { Plugin } from '#/global'
import { ElMessage, ElNotification } from 'element-plus'

// 導入插件組件
import FileManagerComponent from './components/FileManager.vue'
import FileUploader from './components/FileUploader.vue'

// 導入工具函數
import { formatFileSize, validateFileType } from './utils/fileUtils'

// 插件配置
const pluginConfig: Plugin.PluginConfig = {
  // 插件安裝方法 - 在這裏註冊全局組件、指令、插件等
  async install(app: App) {
    try {
      // 註冊全局組件
      app.component('FileManager', FileManagerComponent)
      app.component('FileUploader', FileUploader)
      
      // 註冊全局指令
      app.directive('file-drop', {
        mounted(el, binding) {
          el.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
          })
          
          el.addEventListener('drop', async (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            const files = Array.from(e.dataTransfer?.files || [])
            await binding.value(files)
          })
        }
      })
      
      // 添加全局屬性
      app.config.globalProperties.$fileUtils = {
        formatSize: formatFileSize,
        validateType: validateFileType
      }
      
      console.log('文件管理插件安裝成功')
    } catch (error) {
      console.error('文件管理插件安裝失敗:', error)
      throw error
    }
  },

  // 插件基礎配置
  config: {
    enable: import.meta.env.NODE_ENV !== 'production', // 生產環境禁用
    devMode: import.meta.env.DEV,
    info: {
      name: 'zhang-san/file-manager',
      version: '2.1.0',
      author: '張三',
      description: '企業級文件管理插件，支持上傳、下載、預覽、權限控制等功能',
      keywords: ['文件管理', '文件上傳', '權限控制'],
      homepage: 'https://github.com/zhang-san/file-manager',
      license: 'MIT',
      minSystemVersion: '3.0.0',
      dependencies: ['mine-admin/basic-ui'],
      order: 10 // 較高優先級
    },
    settings: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ['image/*', 'application/pdf', '.docx', '.xlsx'],
      uploadChunkSize: 1024 * 1024, // 1MB
      enablePreview: true,
      enableVersionControl: false
    }
  },

  // 插件鈎子函數
  hooks: {
    // 插件啓動驗證
    async start(config) {
      console.log('文件管理插件啓動中...', config.info.name)
      
      // 檢查必要的權限
      const hasPermission = await checkFilePermissions()
      if (!hasPermission) {
        ElMessage.error('文件管理插件需要文件操作權限')
        return false // 阻止插件啓動
      }
      
      // 初始化插件設置
      await initializeSettings(config.settings)
      return true
    },

    // 系統初始化完成後執行
    async setup() {
      // 初始化文件存儲
      await initFileStorage()
      
      // 註冊文件類型映射
      registerFileTypes()
      
      // 監聽系統事件
      window.addEventListener('beforeunload', handleBeforeUnload)
    },

    // 路由註冊鈎子
    async registerRoute(router: Router, routesRaw) {
      // 動態添加文件管理相關路由
      const adminRoutes = routesRaw.find(route => route.path === '/admin')
      if (adminRoutes && adminRoutes.children) {
        adminRoutes.children.push({
          path: 'files',
          name: 'FileManagement',
          component: () => import('./views/FileManagement.vue'),
          meta: {
            title: '文件管理',
            icon: 'FolderOpened',
            requireAuth: true,
            permissions: ['file:read'],
            keepAlive: true
          }
        })
      }
      
      console.log('文件管理路由註冊完成')
    },

    // 用户登錄後鈎子
    async login(formInfo) {
      console.log('用户登錄，初始化文件權限')
      await refreshFilePermissions(formInfo.username)
    },

    // 用户登出鈎子
    async logout() {
      console.log('用户登出，清理文件緩存')
      await clearFileCache()
    },

    // 獲取用户信息後鈎子
    async getUserInfo(userInfo) {
      // 根據用户角色設置文件權限
      await setFilePermissions(userInfo.roles, userInfo.permissions)
    },

    // 網絡請求攔截
    async networkRequest(config) {
      // 為文件上傳請求添加特殊處理
      if (config.url?.includes('/upload')) {
        config.timeout = 300000 // 5分鐘超時
        config.headers = {
          ...config.headers,
          'X-File-Plugin': 'zhang-san/file-manager'
        }
      }
      return config
    },

    // 網絡響應攔截
    async networkResponse(response) {
      // 處理文件下載響應
      if (response.headers['content-type']?.includes('application/octet-stream')) {
        const contentDisposition = response.headers['content-disposition']
        if (contentDisposition) {
          const filename = extractFilename(contentDisposition)
          response.metadata = { filename }
        }
      }
      return response
    },

    // 錯誤處理
    async error(error, context) {
      if (context === 'file-upload') {
        ElNotification.error({
          title: '文件上傳失敗',
          message: error.message,
          duration: 5000
        })
      }
    },

    // 插件銷燬前清理
    async beforeDestroy() {
      console.log('文件管理插件即將銷燬，清理資源...')
      
      // 取消進行中的上傳任務
      await cancelAllUploads()
      
      // 清理事件監聽器
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      // 清理臨時文件
      await cleanupTempFiles()
    }
  },

  // 插件路由定義
  views: [
    {
      name: 'zhangsan:filemanager:index',
      path: '/plugins/file-manager',
      component: () => import('./views/FileManagerIndex.vue'),
      meta: {
        title: '文件管理器',
        i18n: 'plugin.fileManager.title',
        icon: 'FolderOpened',
        requireAuth: true,
        permissions: ['file:read'],
        keepAlive: true,
        hidden: false
      }
    },
    {
      name: 'zhangsan:filemanager:upload',
      path: '/plugins/file-manager/upload',
      component: () => import('./views/FileUpload.vue'),
      meta: {
        title: '文件上傳',
        i18n: 'plugin.fileManager.upload',
        icon: 'Upload',
        requireAuth: true,
        permissions: ['file:create'],
        keepAlive: false
      }
    }
  ]
}

// 輔助函數
async function checkFilePermissions(): Promise<boolean> {
  try {
    // 檢查文件API是否可用
    return 'File' in window && 'FileReader' in window && 'FileList' in window
  } catch {
    return false
  }
}

async function initializeSettings(settings: Record<string, any>) {
  // 初始化插件配置
  const userSettings = await getUserPluginSettings('zhang-san/file-manager')
  Object.assign(settings, userSettings)
}

async function initFileStorage() {
  // 初始化文件存儲配置
  console.log('初始化文件存儲系統')
}

function registerFileTypes() {
  // 註冊支持的文件類型
  console.log('註冊文件類型映射')
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  // 檢查是否有未完成的上傳任務
  if (hasOngoingUploads()) {
    event.preventDefault()
    event.returnValue = '您有文件正在上傳，確定要離開嗎？'
  }
}

// 導出插件配置
export default pluginConfig

// 導出類型定義供其他插件使用
export type { FileManagerConfig } from './types/index'
```

#### 2. 插件配置文件 `config.ts`

```ts
// src/plugins/zhang-san/file-manager/config.ts
export interface FileManagerUserConfig {
  // 上傳配置
  upload: {
    maxFileSize: number
    allowedTypes: string[]
    chunkSize: number
    concurrent: number
  }
  
  // 預覽配置
  preview: {
    enabled: boolean
    supportedTypes: string[]
    maxPreviewSize: number
  }
  
  // 存儲配置
  storage: {
    provider: 'local' | 'oss' | 's3' | 'cos'
    bucket?: string
    region?: string
    accessKey?: string
    secretKey?: string
  }
  
  // 安全配置
  security: {
    enableVirusScan: boolean
    allowExecutableFiles: boolean
    quarantineEnabled: boolean
  }
}

export const defaultConfig: FileManagerUserConfig = {
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ],
    chunkSize: 1024 * 1024, // 1MB
    concurrent: 3
  },
  
  preview: {
    enabled: true,
    supportedTypes: ['image/*', 'application/pdf', 'text/plain'],
    maxPreviewSize: 10 * 1024 * 1024 // 10MB
  },
  
  storage: {
    provider: 'local'
  },
  
  security: {
    enableVirusScan: false,
    allowExecutableFiles: false,
    quarantineEnabled: true
  }
}
```

::: info 開發完成
以上展示了一個完整的企業級插件開發示例，包含了錯誤處理、權限驗證、資源清理等最佳實踐。
:::

### Vue 組件集成示例

#### 創建插件組件

```vue
<!-- src/plugins/zhang-san/file-manager/components/FileManager.vue -->
<template>
  <div class="file-manager">
    <el-card class="manager-header">
      <el-row :gutter="16" justify="space-between">
        <el-col :span="12">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item 
              v-for="(item, index) in breadcrumbs" 
              :key="index"
              @click="navigateToPath(item.path)"
              class="cursor-pointer"
            >
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-space>
            <el-button 
              type="primary" 
              :icon="Upload" 
              @click="showUploadDialog = true"
            >
              上傳文件
            </el-button>
            <el-button 
              :icon="FolderAdd" 
              @click="createFolder"
            >
              新建文件夾
            </el-button>
          </el-space>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="manager-content">
      <el-table
        v-loading="loading"
        :data="fileList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDoubleClick"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="name" label="名稱" min-width="200">
          <template #default="{ row }">
            <el-space>
              <el-icon :size="18">
                <component :is="getFileIcon(row)" />
              </el-icon>
              <span>{{ row.name }}</span>
            </el-space>
          </template>
        </el-table-column>
        
        <el-table-column prop="size" label="大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="類型" width="120" />
        
        <el-table-column prop="modifiedAt" label="修改時間" width="180">
          <template #default="{ row }">
            {{ formatDate(row.modifiedAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-space>
              <el-button 
                size="small" 
                type="primary" 
                text 
                @click="previewFile(row)"
                :disabled="!canPreview(row)"
              >
                預覽
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                text 
                @click="downloadFile(row)"
              >
                下載
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                text 
                @click="deleteFile(row)"
              >
                刪除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 上傳對話框 -->
    <FileUploadDialog 
      v-model="showUploadDialog"
      :current-path="currentPath"
      @upload-success="refreshFileList"
    />
    
    <!-- 文件預覽對話框 -->
    <FilePreviewDialog
      v-model="showPreviewDialog"
      :file="previewFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, FolderAdd, Document, Picture, VideoPlay, Folder } from '@element-plus/icons-vue'
import { useFileManagerStore } from '../composables/useFileManager'
import FileUploadDialog from './FileUploadDialog.vue'
import FilePreviewDialog from './FilePreviewDialog.vue'
import type { FileItem } from '../types/index'

// 響應式數據
const fileManagerStore = useFileManagerStore()
const loading = ref(false)
const showUploadDialog = ref(false)
const showPreviewDialog = ref(false)
const selectedFiles = ref<FileItem[]>([])
const previewFile = ref<FileItem | null>(null)

// 計算屬性
const fileList = computed(() => fileManagerStore.currentFiles)
const currentPath = computed(() => fileManagerStore.currentPath)
const breadcrumbs = computed(() => fileManagerStore.breadcrumbs)

// 方法
const refreshFileList = async () => {
  loading.value = true
  try {
    await fileManagerStore.loadFiles(currentPath.value)
  } catch (error) {
    ElMessage.error('加載文件列表失敗')
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selection: FileItem[]) => {
  selectedFiles.value = selection
}

const handleRowDoubleClick = (row: FileItem) => {
  if (row.type === 'folder') {
    fileManagerStore.navigateToFolder(row.path)
  } else {
    previewFile(row)
  }
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') return Folder
  if (file.mimeType?.startsWith('image/')) return Picture
  if (file.mimeType?.startsWith('video/')) return VideoPlay
  return Document
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const canPreview = (file: FileItem): boolean => {
  const previewTypes = ['image/', 'text/', 'application/pdf']
  return previewTypes.some(type => file.mimeType?.startsWith(type))
}

const previewFile = (file: FileItem) => {
  if (canPreview(file)) {
    previewFile.value = file
    showPreviewDialog.value = true
  } else {
    ElMessage.warning('該文件類型不支持預覽')
  }
}

const downloadFile = async (file: FileItem) => {
  try {
    await fileManagerStore.downloadFile(file)
    ElMessage.success('文件下載已開始')
  } catch (error) {
    ElMessage.error('文件下載失敗')
  }
}

const deleteFile = async (file: FileItem) => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除文件 "${file.name}" 嗎？`,
      '刪除確認',
      { type: 'warning' }
    )
    
    await fileManagerStore.deleteFile(file)
    ElMessage.success('文件刪除成功')
    await refreshFileList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('文件刪除失敗')
    }
  }
}

const createFolder = async () => {
  try {
    const { value: folderName } = await ElMessageBox.prompt(
      '請輸入文件夾名稱',
      '新建文件夾',
      { inputPattern: /^[^\\/:*?"<>|]+$/, inputErrorMessage: '文件夾名稱不能包含特殊字符' }
    )
    
    await fileManagerStore.createFolder(currentPath.value, folderName)
    ElMessage.success('文件夾創建成功')
    await refreshFileList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('文件夾創建失敗')
    }
  }
}

const navigateToPath = (path: string) => {
  fileManagerStore.navigateToFolder(path)
}

// 生命週期
onMounted(() => {
  refreshFileList()
})
</script>

<style scoped lang="scss">
.file-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .manager-header {
    margin-bottom: 16px;
    flex-shrink: 0;
  }
  
  .manager-content {
    flex: 1;
    overflow: hidden;
    
    :deep(.el-card__body) {
      height: 100%;
      padding: 0;
    }
    
    :deep(.el-table) {
      height: 100%;
    }
  }
  
  .cursor-pointer {
    cursor: pointer;
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
```

## 組合式函數（Composables）

插件可以提供可複用的組合式函數，供其他組件使用：

```ts
// src/plugins/zhang-san/file-manager/composables/useFileManager.ts
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FileItem, FileManagerState } from '../types/index'

export function useFileManager() {
  // 狀態管理
  const state = reactive<FileManagerState>({
    currentPath: '/',
    files: [],
    selectedFiles: [],
    loading: false,
    uploadProgress: new Map()
  })

  // 計算屬性
  const currentFiles = computed(() => state.files)
  const breadcrumbs = computed(() => {
    const paths = state.currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ name: '根目錄', path: '/' }]
    
    let currentPath = ''
    for (const path of paths) {
      currentPath += `/${path}`
      breadcrumbs.push({ name: path, path: currentPath })
    }
    
    return breadcrumbs
  })

  // 文件操作方法
  const loadFiles = async (path: string = state.currentPath): Promise<void> => {
    state.loading = true
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
      if (!response.ok) throw new Error('Failed to load files')
      
      const files = await response.json()
      state.files = files
      state.currentPath = path
    } catch (error) {
      ElMessage.error('加載文件列表失敗')
      throw error
    } finally {
      state.loading = false
    }
  }

  const uploadFile = async (file: File, path: string): Promise<void> => {
    const uploadId = `${path}/${file.name}`
    state.uploadProgress.set(uploadId, 0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', path)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            state.uploadProgress.set(uploadId, percent)
          }
        }
      })

      if (!response.ok) throw new Error('Upload failed')
      
      ElMessage.success(`文件 ${file.name} 上傳成功`)
      await loadFiles(path)
    } catch (error) {
      ElMessage.error(`文件 ${file.name} 上傳失敗`)
      throw error
    } finally {
      state.uploadProgress.delete(uploadId)
    }
  }

  const deleteFile = async (file: FileItem): Promise<void> => {
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(file.path)}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Delete failed')
      ElMessage.success('文件刪除成功')
    } catch (error) {
      ElMessage.error('文件刪除失敗')
      throw error
    }
  }

  const createFolder = async (parentPath: string, folderName: string): Promise<void> => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent: parentPath, name: folderName })
      })
      
      if (!response.ok) throw new Error('Create folder failed')
      ElMessage.success('文件夾創建成功')
    } catch (error) {
      ElMessage.error('文件夾創建失敗')
      throw error
    }
  }

  const navigateToFolder = async (path: string): Promise<void> => {
    await loadFiles(path)
  }

  const downloadFile = async (file: FileItem): Promise<void> => {
    try {
      const response = await fetch(`/api/files/download?path=${encodeURIComponent(file.path)}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      ElMessage.error('文件下載失敗')
      throw error
    }
  }

  return {
    // 狀態
    ...toRefs(state),
    
    // 計算屬性
    currentFiles,
    breadcrumbs,
    
    // 方法
    loadFiles,
    uploadFile,
    deleteFile,
    createFolder,
    navigateToFolder,
    downloadFile
  }
}
```

## 高級插件模式

### 插件間通信

插件可以通過事件系統進行通信：

```ts
// 插件A：發佈事件
import { EventBus } from '@/utils/eventBus'

// 在插件鈎子中
hooks: {
  setup() {
    // 發佈文件上傳完成事件
    EventBus.emit('file:uploaded', {
      fileName: 'example.pdf',
      fileSize: 1024,
      uploadTime: new Date()
    })
  }
}

// 插件B：監聽事件
hooks: {
  setup() {
    // 監聽文件上傳完成事件
    EventBus.on('file:uploaded', (fileInfo) => {
      console.log('文件上傳完成:', fileInfo)
      // 執行相關業務邏輯
      updateFileStats(fileInfo)
    })
  },
  
  beforeDestroy() {
    // 清理事件監聽器
    EventBus.off('file:uploaded')
  }
}
```

### 插件依賴管理

```ts
// 高級插件依賴示例
const pluginConfig: Plugin.PluginConfig = {
  config: {
    info: {
      name: 'zhang-san/advanced-file-manager',
      dependencies: [
        'mine-admin/basic-ui@^2.0.0',    // 版本範圍
        'li-si/image-processor@latest',   // 最新版本
        'wang-wu/cloud-storage'           // 任意版本
      ]
    }
  },

  hooks: {
    async start(config) {
      // 檢查依賴是否滿足
      const dependencyChecker = usePluginDependencies()
      const unsatisfiedDeps = await dependencyChecker.check(config.info.dependencies)
      
      if (unsatisfiedDeps.length > 0) {
        console.error('未滿足的依賴:', unsatisfiedDeps)
        return false
      }
      
      return true
    }
  }
}
```

### 插件配置發佈與管理

```bash
# 發佈插件配置到用户可編輯目錄
pnpm plugin:publish zhang-san/file-manager

# 批量發佈所有插件配置
pnpm plugin:publish-all

# 重置插件配置到默認狀態
pnpm plugin:reset zhang-san/file-manager
```

插件配置發佈後的使用：

```ts
// 獲取用户自定義配置
import { usePluginConfig } from '@/composables/usePlugin'

const { config, updateConfig } = usePluginConfig('zhang-san/file-manager')

// 在組件中使用配置
const maxFileSize = computed(() => config.value.upload.maxFileSize)

// 更新配置
const updateUploadConfig = async (newConfig: Partial<UploadConfig>) => {
  await updateConfig({
    upload: {
      ...config.value.upload,
      ...newConfig
    }
  })
}
```

## 動態插件管理

### 插件狀態控制

```ts
// 獲取插件管理器實例
const pluginManager = usePluginManager()

// 啓用插件
const enablePlugin = async (pluginName: string) => {
  try {
    const success = await pluginManager.enable(pluginName)
    if (success) {
      ElMessage.success(`插件 ${pluginName} 已啓用`)
    } else {
      ElMessage.error('插件啓用失敗，請檢查依賴關係')
    }
  } catch (error) {
    ElMessage.error(`啓用插件時發生錯誤: ${error.message}`)
  }
}

// 禁用插件
const disablePlugin = async (pluginName: string) => {
  try {
    const success = await pluginManager.disable(pluginName)
    if (success) {
      ElMessage.success(`插件 ${pluginName} 已禁用`)
    }
  } catch (error) {
    ElMessage.error(`禁用插件時發生錯誤: ${error.message}`)
  }
}

// 傳統方式（兼容性保持）
const { disabled, enabled } = usePluginStore()

// 啓用插件
enabled('zhang-san/demo')

// 停用插件
disabled('li-si/demo')
```

### 插件熱重載（開發環境）

```ts
// 開發環境下支持插件熱重載
if (import.meta.hot) {
  import.meta.hot.accept('./index.ts', (newModule) => {
    console.log('插件熱重載中...')
    
    // 重新註冊插件
    pluginManager.unregister('zhang-san/file-manager')
    pluginManager.register('zhang-san/file-manager', newModule.default)
    
    console.log('插件熱重載完成')
  })
}
```

## 插件故障排查

### 常見問題與解決方案

#### 1. 插件加載失敗

**問題現象**: 插件在系統啓動時不被識別或加載失敗

**排查步驟**:
1. 檢查插件目錄結構是否正確
2. 確認 `index.ts` 文件存在且語法正確
3. 驗證插件配置是否完整
4. 查看瀏覽器控制枱錯誤信息

**解決方案**:
```ts
// 插件診斷工具
const diagnosePlugin = (pluginName: string) => {
  console.group(`診斷插件: ${pluginName}`)
  
  // 檢查插件是否存在
  const plugin = pluginManager.getPlugin(pluginName)
  if (!plugin) {
    console.error('❌ 插件未找到，請檢查目錄結構')
    return false
  }
  
  // 檢查必要配置
  const requiredFields = ['config', 'install']
  for (const field of requiredFields) {
    if (!(field in plugin)) {
      console.error(`❌ 缺少必要字段: ${field}`)
      return false
    }
  }
  
  console.log('✅ 插件配置檢查通過')
  console.groupEnd()
  return true
}
```

#### 2. 依賴關係錯誤

**問題現象**: 插件因依賴不滿足而無法啓動

**解決方案**:
```ts
// 檢查並安裝缺失依賴
const fixDependencies = async (pluginName: string) => {
  const plugin = pluginManager.getPlugin(pluginName)
  const dependencies = plugin.config.info.dependencies || []
  
  for (const dep of dependencies) {
    const [name, version] = dep.split('@')
    if (!pluginManager.getPlugin(name)) {
      console.warn(`缺少依賴: ${name}`)
      // 提示用户安裝依賴
      ElMessageBox.confirm(
        `插件 ${pluginName} 需要依賴 ${name}，是否現在安裝？`,
        '依賴確認',
        { type: 'warning' }
      ).then(() => {
        // 跳轉到應用商店安裝依賴
        router.push(`/plugins/app-store?search=${name}`)
      })
    }
  }
}
```

#### 3. 性能問題

**問題現象**: 插件運行緩慢或佔用資源過多

**解決方案**:
```ts
// 性能監控工具
const monitorPluginPerformance = (pluginName: string) => {
  const metrics = {
    memory: 0,
    executionTime: new Map(),
    errorCount: 0
  }
  
  // 監控內存使用
  const checkMemory = () => {
    if (performance.memory) {
      metrics.memory = performance.memory.usedJSHeapSize
    }
  }
  
  // 監控函數執行時間
  const wrapFunction = (obj: any, methodName: string) => {
    const originalMethod = obj[methodName]
    obj[methodName] = function(...args: any[]) {
      const start = performance.now()
      const result = originalMethod.apply(this, args)
      const end = performance.now()
      
      metrics.executionTime.set(methodName, end - start)
      if (end - start > 100) { // 超過100ms警告
        console.warn(`${pluginName}.${methodName} 執行時間: ${(end - start).toFixed(2)}ms`)
      }
      
      return result
    }
  }
  
  return metrics
}
```

### 調試技巧

#### 1. 啓用詳細日誌

```ts
// 在插件中添加詳細日誌
const debug = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[${pluginName}] ${message}`, data)
  }
}

hooks: {
  start(config) {
    debug('插件啓動', config)
    return true
  },
  
  setup() {
    debug('插件初始化完成')
  }
}
```

#### 2. 使用開發者工具

```ts
// 暴露調試接口到瀏覽器控制枱
if (import.meta.env.DEV) {
  window.__PLUGIN_DEBUG__ = {
    getPlugin: (name: string) => pluginManager.getPlugin(name),
    listPlugins: () => pluginManager.getAllPlugins(),
    enablePlugin: (name: string) => pluginManager.enable(name),
    disablePlugin: (name: string) => pluginManager.disable(name),
    reloadPlugin: (name: string) => {
      pluginManager.unregister(name)
      // 重新導入並註冊插件
    }
  }
}
```

## 插件生態系統

### 官方插件

在 `src/plugins/mine-admin` 下是官方插件，目前內置了：

#### `basic-ui` - 基礎UI組件庫
- **功能**: 提供系統基礎UI組件和樣式
- **版本**: 2.0.0+
- **依賴**: 無
- **説明**: 為其他插件提供統一的UI基礎

```ts
// 使用基礎UI組件
import { MButton, MCard, MTable } from 'mine-admin/basic-ui'

// 在插件中使用
install(app) {
  // basic-ui 已經全局註冊，可直接使用
  app.component('CustomButton', {
    template: `<m-button type="primary"><slot /></m-button>`
  })
}
```

#### `app-store` - 應用市場
- **功能**: 插件商店，支持插件的安裝、更新、卸載
- **版本**: 1.5.0+
- **依賴**: `mine-admin/basic-ui`
- **説明**: 連接MineAdmin應用市場，管理第三方插件

#### `demo` - 演示插件
- **功能**: 展示插件系統各種功能的示例代碼
- **版本**: 1.0.0+
- **依賴**: `mine-admin/basic-ui`
- **説明**: 開發者參考示例，包含各種鈎子使用方法

### 第三方插件生態

#### 推薦插件類別

**文件管理類**
- `file-manager/core` - 企業級文件管理
- `storage/cloud-sync` - 雲存儲同步
- `media/gallery` - 多媒體畫廊

**數據處理類**
- `data/excel-tools` - Excel處理工具
- `report/builder` - 報表構建器
- `chart/visualization` - 數據可視化

**系統增強類**
- `theme/switcher` - 主題切換
- `security/two-fa` - 雙因素認證
- `performance/optimizer` - 性能優化

### 插件開發資源

- **官方文檔**: [https://docs.mineadmin.com/plugins](https://docs.mineadmin.com/plugins)
- **插件模板**: [https://github.com/mineadmin/plugin-template](https://github.com/mineadmin/plugin-template)
- **開發工具**: [MineAdmin CLI](https://www.npmjs.com/package/@mineadmin/cli)
- **社區論壇**: [https://community.mineadmin.com](https://community.mineadmin.com)

## 總結

MineAdmin 3.0 的前端插件系統提供了企業級的擴展能力，通過本文檔的指導，您可以：

### 核心優勢
1. **零侵入設計** - 無需修改核心代碼即可擴展功能
2. **類型安全** - 完整的 TypeScript 類型定義確保開發質量
3. **生命週期管理** - 豐富的鈎子系統支持精細控制
4. **動態管理** - 支持插件的熱插拔和狀態管理
5. **性能優化** - 內置懶加載和資源管理機制

### 開發建議
1. **遵循規範** - 使用標準的目錄結構和命名規範
2. **注重測試** - 編寫充分的單元測試和集成測試
3. **考慮性能** - 採用最佳實踐避免內存泄漏和性能問題
4. **保障安全** - 實施輸入驗證和權限控制
5. **維護文檔** - 為插件提供清晰的使用文檔

### 未來展望

插件系統將持續發展，計劃支持更多特性：
- **可視化插件編輯器** - 圖形化配置插件
- **插件市場集成** - 一鍵安裝和更新
- **雲端同步** - 插件配置雲端備份
- **AI輔助開發** - 智能代碼生成和優化建議

::: tip 最佳實踐
建議開發者從簡單的插件開始，逐步掌握系統的各項功能。參考官方演示插件的實現，在實踐中不斷改進和優化。
:::

::: warning 兼容性提醒
在開發插件時，請注意 MineAdmin 版本兼容性，確保插件能在目標環境中穩定運行。建議定期關注系統更新，及時適配新版本特性。
:::
