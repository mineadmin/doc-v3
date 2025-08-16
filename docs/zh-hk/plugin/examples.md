# 插件示例代碼

本文檔提供完整的 MineAdmin 插件開發示例，包括不同類型插件的實際代碼案例和最佳實踐。

## 官方插件示例

### App-Store 插件 (混合型)

**倉庫地址**: [mineadmin/appstore](https://github.com/mineadmin/appstore)

App-Store 是 MineAdmin 唯一的官方默認插件，提供應用市場管理功能，展示了混合型插件的完整實現。

#### 核心文件結構
```
plugin/mine-admin/app-store/
├── mine.json                 # 插件配置
├── src/                      # 後端代碼
│   ├── ConfigProvider.php    # 配置提供者
│   ├── Controller/           # 控制器
│   ├── Service/             # 服務層
│   └── Command/             # 命令行
├── web/                     # 前端代碼
│   ├── views/               # 頁面組件
│   └── api/                 # API 接口
└── Database/                # 數據庫
```

#### mine.json 配置示例
```json
{
  "name": "mine-admin/app-store",
  "description": "MineAdmin應用市場可視化插件",
  "version": "1.0.0",
  "type": "mixed",
  "author": [
    {
      "name": "MineAdmin Team",
      "role": "developer"
    }
  ],
  "keywords": ["mineadmin", "app-store", "plugin-management"],
  "homepage": "https://github.com/mineadmin/appstore",
  "license": "MIT",
  "composer": {
    "require": {
      "hyperf/async-queue": "^3.0"
    },
    "psr-4": {
      "Plugin\\MineAdmin\\AppStore\\": "src"
    },
    "config": "Plugin\\MineAdmin\\AppStore\\ConfigProvider"
  }
}
```

#### ConfigProvider 實現
```php
<?php
// src/ConfigProvider.php

namespace Plugin\MineAdmin\AppStore;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => [
                // 依賴注入配置
            ],
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            'commands' => [
                Command\AppStoreCommand::class,
            ],
            'listeners' => [
                Listener\PluginEventListener::class,
            ],
            'publish' => [
                [
                    'id' => 'appstore-config',
                    'description' => 'App Store configuration file',
                    'source' => __DIR__ . '/../publish/appstore.php',
                    'destination' => BASE_PATH . '/config/autoload/appstore.php',
                ],
            ],
        ];
    }
}
```

## 完整插件開發示例

### 1. 用户管理插件 (混合型)

以下是一個完整的用户管理插件示例，展示如何開發一個包含前後端的混合型插件。

#### mine.json 配置
```json
{
  "name": "mycompany/user-manager",
  "description": "用户管理插件",
  "version": "1.0.0",
  "type": "mixed",
  "author": [
    {
      "name": "Your Name",
      "email": "email@example.com"
    }
  ],
  "composer": {
    "require": {
      "hyperf/database": "^3.0",
      "hyperf/validation": "^3.0"
    },
    "psr-4": {
      "Plugin\\MyCompany\\UserManager\\": "src"
    },
    "config": "Plugin\\MyCompany\\UserManager\\ConfigProvider"
  },
  "package": {
    "dependencies": {
      "element-plus": "^2.4.0"
    }
  }
}
```

#### 核心控制器實現
```php
<?php
// src/Controller/UserController.php

namespace Plugin\MyCompany\UserManager\Controller;

use Hyperf\HttpServer\Annotation\Controller;
use Hyperf\HttpServer\Annotation\PostMapping;
use Hyperf\HttpServer\Annotation\GetMapping;
use Hyperf\HttpServer\Annotation\PutMapping;
use Hyperf\HttpServer\Annotation\DeleteMapping;
use Mine\MineController;

#[Controller(prefix: '/plugin/user-manager')]
class UserController extends MineController
{
    public function __construct(
        private UserService $service
    ) {}

    #[GetMapping('/users')]
    public function index(): array
    {
        $params = $this->request->all();
        $result = $this->service->getPageList($params);
        return $this->success($result);
    }

    #[PostMapping('/user')]
    public function create(): array
    {
        $data = $this->request->all();
        $user = $this->service->create($data);
        return $this->success($user, '用户創建成功');
    }

    #[PutMapping('/user/{id}')]
    public function update(int $id): array
    {
        $data = $this->request->all();
        $this->service->update($id, $data);
        return $this->success(null, '更新成功');
    }

    #[DeleteMapping('/user/{id}')]
    public function delete(int $id): array
    {
        $this->service->delete($id);
        return $this->success(null, '刪除成功');
    }
}
```

#### 服務層實現
```php
<?php
// src/Service/UserService.php

namespace Plugin\MyCompany\UserManager\Service;

use Plugin\MyCompany\UserManager\Model\User;

class UserService
{
    public function getPageList(array $params): array
    {
        $query = User::query();
        
        if (!empty($params['keyword'])) {
            $query->where(function($q) use ($params) {
                $q->where('username', 'like', "%{$params['keyword']}%")
                  ->orWhere('email', 'like', "%{$params['keyword']}%");
            });
        }
        
        $paginator = $query->paginate(
            $params['pageSize'] ?? 15,
            ['*'],
            'page',
            $params['page'] ?? 1
        );
        
        return [
            'items' => $paginator->items(),
            'pageInfo' => [
                'total' => $paginator->total(),
                'currentPage' => $paginator->currentPage(),
                'totalPage' => $paginator->lastPage()
            ]
        ];
    }
    
    public function create(array $data): User
    {
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        return User::create($data);
    }
    
    public function update(int $id, array $data): bool
    {
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        return User::query()->where('id', $id)->update($data) > 0;
    }
    
    public function delete(int $id): bool
    {
        return User::destroy($id) > 0;
    }
}
```

### 2. 後端型插件示例 - API 服務插件

以下是一個純後端 API 服務插件的示例。

#### 插件配置 (mine.json)

```json
{
  "name": "mycompany/api-service",
  "description": "API 服務插件",
  "version": "1.0.0",
  "type": "backend",
  "author": [
    {
      "name": "Your Name",
      "email": "email@example.com"
    }
  ],
  "keywords": ["api", "service"],
  "license": "MIT",
  "composer": {
    "require": {
      "guzzlehttp/guzzle": "^7.0"
    },
    "psr-4": {
      "Plugin\\MyCompany\\ApiService\\": "src"
    },
    "config": "Plugin\\MyCompany\\ApiService\\ConfigProvider"
  }
}
```

#### ConfigProvider 實現

```php
<?php

namespace Plugin\MyCompany\ApiService;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => [
                Contract\ApiClientInterface::class => Service\ApiClient::class,
            ],
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            'commands' => [
                Command\ApiSyncCommand::class,
            ],
            'publish' => [
                [
                    'id' => 'api-service-config',
                    'description' => 'API 服務配置文件',
                    'source' => __DIR__ . '/../publish/api_service.php',
                    'destination' => BASE_PATH . '/config/autoload/api_service.php',
                ],
            ],
        ];
    }
}
```

### 3. 前端型插件示例 - 數據可視化插件

以下是一個純前端的數據可視化插件示例。

#### mine.json 配置
```json
{
  "name": "mycompany/data-visualization",
  "description": "數據可視化插件",
  "version": "1.0.0",
  "type": "frontend",
  "author": [
    {
      "name": "Your Name",
      "email": "email@example.com"
    }
  ],
  "package": {
    "dependencies": {
      "echarts": "^5.4.0",
      "vue-echarts": "^6.5.0"
    }
  }
}
```

## 完整插件開發最佳實踐

### 1. 目錄結構規範

```
plugin/vendor-name/plugin-name/
├── mine.json                 # 插件配置文件
├── src/                      # PHP 後端代碼
│   ├── ConfigProvider.php    # 配置提供者
│   ├── Controller/           # 控制器
│   ├── Service/             # 服務層
│   ├── Model/               # 模型
│   ├── Command/             # 命令行
│   ├── Listener/            # 事件監聽器
│   └── Middleware/          # 中間件
├── web/                     # 前端代碼
│   ├── views/               # Vue 頁面組件
│   ├── api/                 # API 接口封裝
│   ├── components/          # 公共組件
│   └── locales/             # 國際化
├── Database/                # 數據庫
│   ├── Migrations/          # 遷移文件
│   └── Seeders/             # 數據填充
└── publish/                 # 發佈文件
    └── config.php           # 配置文件
```

### 2. 命名規範

- **插件名稱**: 使用 `vendor/plugin-name` 格式
- **命名空間**: `Plugin\VendorName\PluginName`
- **類名**: 使用大駝峯命名法
- **方法名**: 使用小駝峯命名法

### 3. 核心組件示例

#### 控制器示例

```php
<?php

namespace Plugin\MyCompany\Example\Controller;

use Hyperf\HttpServer\Annotation\Controller;
use Hyperf\HttpServer\Annotation\GetMapping;
use Hyperf\HttpServer\Annotation\PostMapping;
use Mine\MineController;

#[Controller(prefix: '/plugin/example')]
class ExampleController extends MineController
{
    public function __construct(
        private ExampleService $service
    ) {}

    #[GetMapping('/list')]
    public function index(): array
    {
        $params = $this->request->all();
        $result = $this->service->getList($params);
        return $this->success($result);
    }

    #[PostMapping('/create')]
    public function create(): array
    {
        $data = $this->request->all();
        $result = $this->service->create($data);
        return $this->success($result, '創建成功');
    }
        $user = $this->userService->find($id);
        
        if (!$user) {
            return $this->error('用户不存在', 404);
        }
        
        return $this->success($user);
    }

    /**
     * 更新用户
     */
    #[PutMapping('/users/{id:\d+}')]
    public function update(int $id): array
    {
        $data = $this->request->all();
        
        $user = $this->userService->update($id, $data);
        
        return $this->success($user, '用户更新成功');
    }

    /**
     * 刪除用户
     */
    #[DeleteMapping('/users/{id:\d+}')]
    public function destroy(int $id): array
    {
        $this->userService->delete($id);
        
        return $this->success([], '用户刪除成功');
    }

    /**
     * 批量導入用户
     */
    #[PostMapping('/users/import')]
    public function import(): array
    {
        $file = $this->request->file('file');
        
        if (!$file || !$file->isValid()) {
            return $this->error('請上傳有效的文件');
        }
        
        $result = $this->userService->importFromFile($file);
        
        return $this->success($result, '導入完成');
    }

    /**
     * 導出用户數據
     */
    #[GetMapping('/users/export')]
    public function export(): array
    {
        $params = $this->request->all();
        $filePath = $this->userService->exportToFile($params);
        
        return $this->success(['file_path' => $filePath], '導出成功');
    }
}
```

#### 4. 服務層 (src/Service/UserService.php)

```php
<?php

namespace Plugin\Example\UserManager\Service;

use Mine\Abstracts\AbstractService;
use Plugin\Example\UserManager\Repository\UserRepository;
use Plugin\Example\UserManager\Contract\UserServiceInterface;

class UserService extends AbstractService implements UserServiceInterface
{
    public function __construct(
        private UserRepository $repository
    ) {}

    /**
     * 獲取用户列表
     */
    public function getList(array $params = []): array
    {
        return $this->repository->getList($params);
    }

    /**
     * 創建用户
     */
    public function create(array $data): array
    {
        // 密碼加密
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        // 生成用户頭像
        if (!isset($data['avatar'])) {
            $data['avatar'] = $this->generateAvatar($data['username']);
        }

        $user = $this->repository->create($data);

        // 觸發用户創建事件
        event(new UserCreatedEvent($user));

        return $user->toArray();
    }

    /**
     * 更新用户
     */
    public function update(int $id, array $data): array
    {
        // 密碼更新處理
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            unset($data['password']);
        }

        $user = $this->repository->update($id, $data);

        // 觸發用户更新事件
        event(new UserUpdatedEvent($user));

        return $user->toArray();
    }

    /**
     * 從文件導入用户
     */
    public function importFromFile($file): array
    {
        $filePath = $file->getPath() . '/' . $file->getFilename();
        
        // 讀取 Excel 文件
        $data = $this->parseExcelFile($filePath);
        
        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($data as $index => $row) {
            try {
                $this->create([
                    'username' => $row['username'],
                    'email' => $row['email'],
                    'phone' => $row['phone'] ?? null,
                    'password' => $row['password'] ?? '123456',
                ]);
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errors[] = "第{$index}行: " . $e->getMessage();
            }
        }

        return [
            'success_count' => $successCount,
            'error_count' => $errorCount,
            'errors' => $errors
        ];
    }

    /**
     * 導出用户到文件
     */
    public function exportToFile(array $params = []): string
    {
        $users = $this->repository->getAllForExport($params);
        
        // 生成 Excel 文件
        $filePath = $this->generateExcelFile($users);
        
        return $filePath;
    }

    /**
     * 生成用户頭像
     */
    private function generateAvatar(string $username): string
    {
        // 使用第三方庫生成頭像
        $avatar = new \Intervention\Image\ImageManager();
        // ... 頭像生成邏輯
        
        return '/uploads/avatars/' . $username . '.png';
    }

    /**
     * 解析 Excel 文件
     */
    private function parseExcelFile(string $filePath): array
    {
        // Excel 解析邏輯
        return [];
    }

    /**
     * 生成 Excel 文件
     */
    private function generateExcelFile(array $users): string
    {
        // Excel 生成邏輯
        return '/tmp/users_export_' . date('YmdHis') . '.xlsx';
    }

    protected function getRepository(): string
    {
        return UserRepository::class;
    }
}
```

#### 5. 數據倉庫 (src/Repository/UserRepository.php)

```php
<?php

namespace Plugin\Example\UserManager\Repository;

use Mine\Abstracts\AbstractRepository;
use Plugin\Example\UserManager\Model\User;

class UserRepository extends AbstractRepository
{
    protected function getModel(): string
    {
        return User::class;
    }

    /**
     * 獲取用户列表
     */
    public function getList(array $params = []): array
    {
        $query = $this->getModel()::query();

        // 關鍵詞搜索
        if (!empty($params['keyword'])) {
            $query->where(function ($q) use ($params) {
                $q->where('username', 'like', "%{$params['keyword']}%")
                  ->orWhere('email', 'like', "%{$params['keyword']}%")
                  ->orWhere('phone', 'like', "%{$params['keyword']}%");
            });
        }

        // 狀態篩選
        if (isset($params['status'])) {
            $query->where('status', $params['status']);
        }

        // 角色篩選
        if (!empty($params['role_id'])) {
            $query->whereHas('roles', function ($q) use ($params) {
                $q->where('id', $params['role_id']);
            });
        }

        // 時間範圍篩選
        if (!empty($params['created_at'])) {
            $dates = explode(' - ', $params['created_at']);
            if (count($dates) === 2) {
                $query->whereBetween('created_at', [
                    $dates[0] . ' 00:00:00',
                    $dates[1] . ' 23:59:59'
                ]);
            }
        }

        // 排序
        $query->orderBy($params['sort'] ?? 'id', $params['order'] ?? 'desc');

        return $query->paginate($params['pageSize'] ?? 15)->toArray();
    }

    /**
     * 獲取導出數據
     */
    public function getAllForExport(array $params = []): array
    {
        $query = $this->getModel()::query();

        // 應用相同的篩選條件
        // ... 篩選邏輯

        return $query->select([
            'id', 'username', 'email', 'phone', 
            'status', 'created_at', 'updated_at'
        ])->get()->toArray();
    }
}
```

#### 6. 模型 (src/Model/User.php)

```php
<?php

namespace Plugin\Example\UserManager\Model;

use Mine\MineModel;

/**
 * 用户模型
 */
class User extends MineModel
{
    protected $table = 'users';
    
    protected $fillable = [
        'username', 'email', 'phone', 'password',
        'avatar', 'status', 'last_login_at'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'status' => 'integer',
        'last_login_at' => 'datetime:Y-m-d H:i:s',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * 狀態常量
     */
    const STATUS_DISABLED = 0;
    const STATUS_ENABLED = 1;

    /**
     * 關聯角色
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * 獲取狀態文本
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            self::STATUS_ENABLED => '啓用',
            self::STATUS_DISABLED => '禁用',
            default => '未知'
        };
    }

    /**
     * 獲取頭像 URL
     */
    public function getAvatarUrlAttribute(): string
    {
        if (empty($this->avatar)) {
            return '/default-avatar.png';
        }

        return str_starts_with($this->avatar, 'http') 
            ? $this->avatar 
            : config('app.url') . $this->avatar;
    }
}
```

#### 7. 前端頁面 (web/views/UserList.vue)

```vue
<template>
  <div class="user-manager">
    <!-- 搜索表單 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="關鍵詞">
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="用户名/郵箱/手機號"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="狀態">
          <el-select v-model="searchForm.status" style="width: 120px">
            <el-option label="全部" :value="undefined" />
            <el-option label="啓用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="創建時間">
          <el-date-picker
            v-model="searchForm.created_at"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <ma-icon name="search" />
            搜索
          </el-button>
          <el-button @click="handleReset">
            <ma-icon name="refresh" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作工具欄 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="table-header-left">
          <el-button type="primary" @click="handleAdd">
            <ma-icon name="plus" />
            新增用户
          </el-button>
          <el-button @click="handleImport">
            <ma-icon name="upload" />
            批量導入
          </el-button>
          <el-button @click="handleExport" :disabled="!hasSelection">
            <ma-icon name="download" />
            導出數據
          </el-button>
        </div>
        <div class="table-header-right">
          <el-button circle size="small" @click="handleRefresh">
            <ma-icon name="refresh" />
          </el-button>
        </div>
      </div>

      <!-- 數據表格 -->
      <el-table 
        :data="tableData" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="avatar" label="頭像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar_url" :size="40">
              {{ row.username.charAt(0).toUpperCase() }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="郵箱" />
        <el-table-column prop="phone" label="手機號" />
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status_text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_at" label="最後登錄" width="160" />
        <el-table-column prop="created_at" label="創建時間" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">
              編輯
            </el-button>
            <el-button 
              size="small" 
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '啓用' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
            >
              刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户表單彈窗 -->
    <UserForm 
      v-model:visible="formVisible"
      :data="formData"
      @success="handleFormSuccess"
    />

    <!-- 導入彈窗 -->
    <ImportDialog
      v-model:visible="importVisible"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserApi from '@/api/plugin/example/user-manager/user'
import UserForm from './components/UserForm.vue'
import ImportDialog from './components/ImportDialog.vue'

// 響應式數據
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const formVisible = ref(false)
const importVisible = ref(false)
const formData = ref(null)

// 搜索表單
const searchForm = reactive({
  keyword: '',
  status: undefined,
  created_at: null
})

// 分頁數據
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 計算屬性
const hasSelection = computed(() => selectedRows.value.length > 0)

// 生命週期
onMounted(() => {
  fetchData()
})

// 方法定義
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    const response = await UserApi.getList(params)
    tableData.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('獲取數據失敗')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: undefined,
    created_at: null
  })
  handleSearch()
}

const handleAdd = () => {
  formData.value = null
  formVisible.value = true
}

const handleEdit = (row) => {
  formData.value = { ...row }
  formVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除用户 "${row.username}" 嗎？`,
      '確認刪除',
      { type: 'warning' }
    )
    
    await UserApi.delete(row.id)
    ElMessage.success('刪除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('刪除失敗')
    }
  }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '啓用' : '禁用'
  
  try {
    await UserApi.update(row.id, { status: newStatus })
    ElMessage.success(`${action}成功`)
    row.status = newStatus
    row.status_text = newStatus === 1 ? '啓用' : '禁用'
  } catch (error) {
    ElMessage.error(`${action}失敗`)
  }
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleImport = () => {
  importVisible.value = true
}

const handleExport = async () => {
  try {
    const params = {
      ...searchForm,
      ids: selectedRows.value.map(row => row.id)
    }
    
    const response = await UserApi.export(params)
    ElMessage.success('導出成功，文件正在下載...')
    
    // 下載文件
    window.open(response.data.file_path)
  } catch (error) {
    ElMessage.error('導出失敗')
  }
}

const handleRefresh = () => {
  fetchData()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchData()
}

const handleFormSuccess = () => {
  formVisible.value = false
  fetchData()
}

const handleImportSuccess = () => {
  importVisible.value = false
  fetchData()
}
</script>

<style scoped>
.user-manager {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .pagination-wrapper {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
```

#### 8. API 接口 (web/api/user.js)

```javascript
// web/api/user.js
import { request } from '@/utils/request'

const API_BASE = '/user-manager'

export default {
  // 獲取用户列表
  getList(params) {
    return request({
      url: `${API_BASE}/users`,
      method: 'get',
      params
    })
  },

  // 創建用户
  create(data) {
    return request({
      url: `${API_BASE}/users`,
      method: 'post',
      data
    })
  },

  // 獲取用户詳情
  get(id) {
    return request({
      url: `${API_BASE}/users/${id}`,
      method: 'get'
    })
  },

  // 更新用户
  update(id, data) {
    return request({
      url: `${API_BASE}/users/${id}`,
      method: 'put',
      data
    })
  },

  // 刪除用户
  delete(id) {
    return request({
      url: `${API_BASE}/users/${id}`,
      method: 'delete'
    })
  },

  // 批量導入
  import(file) {
    const formData = new FormData()
    formData.append('file', file)

    return request({
      url: `${API_BASE}/users/import`,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 導出數據
  export(params) {
    return request({
      url: `${API_BASE}/users/export`,
      method: 'get',
      params
    })
  }
}
```

#### 9. 數據庫遷移 (Database/Migrations/create_users_table.php)

```php
<?php

use Hyperf\Database\Schema\Schema;
use Hyperf\Database\Schema\Blueprint;
use Hyperf\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        Schema::create('plugin_user_manager_users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 50)->unique()->comment('用户名');
            $table->string('email')->unique()->comment('郵箱');
            $table->string('phone', 20)->nullable()->comment('手機號');
            $table->string('password')->comment('密碼');
            $table->string('avatar')->nullable()->comment('頭像');
            $table->tinyInteger('status')->default(1)->comment('狀態:0禁用,1啓用');
            $table->timestamp('last_login_at')->nullable()->comment('最後登錄時間');
            $table->timestamps();
            
            $table->index(['username']);
            $table->index(['email']);
            $table->index(['phone']);
            $table->index(['status']);
            $table->index(['created_at']);
            
            $table->comment('用户管理插件-用户表');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plugin_user_manager_users');
    }
}
```

#### 10. 安裝腳本 (src/InstallScript.php)

```php
<?php

namespace Plugin\Example\UserManager;

use Hyperf\DbConnection\Db;
use Hyperf\Database\Migrations\Migrator;

class InstallScript
{
    public function handle(): bool
    {
        try {
            // 1. 執行數據庫遷移
            $this->runMigrations();
            
            // 2. 初始化數據
            $this->seedData();
            
            // 3. 創建必要目錄
            $this->createDirectories();
            
            // 4. 初始化配置
            $this->initConfig();
            
            echo "用户管理插件安裝成功！\n";
            return true;
        } catch (\Exception $e) {
            echo "安裝失敗: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    private function runMigrations(): void
    {
        $migrationPath = __DIR__ . '/../Database/Migrations';
        
        if (!is_dir($migrationPath)) {
            return;
        }
        
        $files = glob($migrationPath . '/*.php');
        sort($files);
        
        foreach ($files as $file) {
            require_once $file;
            
            $className = $this->getMigrationClassName($file);
            $migration = new $className();
            
            if (method_exists($migration, 'up')) {
                $migration->up();
                echo "執行遷移: " . basename($file) . "\n";
            }
        }
    }
    
    private function seedData(): void
    {
        // 插入默認管理員用户
        Db::table('plugin_user_manager_users')->insertOrIgnore([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => password_hash('123456', PASSWORD_DEFAULT),
            'status' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        
        echo "初始化默認數據完成\n";
    }
    
    private function createDirectories(): void
    {
        $directories = [
            BASE_PATH . '/public/uploads/avatars',
            BASE_PATH . '/storage/user-manager',
        ];
        
        foreach ($directories as $dir) {
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
                echo "創建目錄: {$dir}\n";
            }
        }
    }
    
    private function initConfig(): void
    {
        $configPath = BASE_PATH . '/config/autoload/user_manager.php';
        
        if (!file_exists($configPath)) {
            $defaultConfig = [
                'avatar_upload_path' => '/uploads/avatars',
                'default_password' => '123456',
                'password_reset_expire' => 3600,
                'max_login_attempts' => 5,
            ];
            
            file_put_contents($configPath, "<?php\n\nreturn " . var_export($defaultConfig, true) . ";\n");
            echo "創建配置文件: {$configPath}\n";
        }
    }
    
    private function getMigrationClassName(string $file): string
    {
        $filename = basename($file, '.php');
        
        // 移除時間戳前綴
        $className = preg_replace('/^\d{4}_\d{2}_\d{2}_\d{6}_/', '', $filename);
        
        // 轉換為類名格式
        return str_replace(' ', '', ucwords(str_replace('_', ' ', $className)));
    }
}
```

## 最佳實踐總結

### 1. 代碼組織

- **分層架構**: 控制器 → 服務層 → 倉庫層 → 模型
- **命名規範**: 遵循 PSR-4 自動加載標準
- **職責分離**: 每個類專注於單一職責

### 2. 安全考慮

- **輸入驗證**: 所有用户輸入都要驗證
- **權限控制**: 使用中間件進行權限檢查
- **SQL 注入防護**: 使用 ORM 查詢構建器
- **密碼處理**: 使用安全的哈希算法

### 3. 性能優化

- **數據庫索引**: 為常用查詢字段添加索引
- **分頁查詢**: 避免一次性加載大量數據
- **緩存策略**: 合理使用緩存減少數據庫查詢
- **異步處理**: 耗時操作使用隊列異步處理

### 4. 用户體驗

- **響應式設計**: 支持不同設備屏幕
- **加載狀態**: 為異步操作提供加載提示
- **錯誤處理**: 友好的錯誤信息提示
- **操作反饋**: 及時的成功/失敗反饋

## 相關文檔

- [插件開發指南](./develop.md) - 詳細開發流程
- [插件結構説明](./structure.md) - 目錄結構規範
- [生命週期管理](./lifecycle.md) - 安裝卸載流程
- [API 參考文檔](./api.md) - 接口文檔