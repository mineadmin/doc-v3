# 插件示例代码

本文档提供完整的 MineAdmin 插件开发示例，包括不同类型插件的实际代码案例和最佳实践。

## 官方插件示例

### App-Store 插件 (混合型)

**仓库地址**: [mineadmin/appstore](https://github.com/mineadmin/appstore)

App-Store 是 MineAdmin 唯一的官方默认插件，提供应用市场管理功能，展示了混合型插件的完整实现。

#### 核心文件结构
```
plugin/mine-admin/app-store/
├── mine.json                 # 插件配置
├── src/                      # 后端代码
│   ├── ConfigProvider.php    # 配置提供者
│   ├── Controller/           # 控制器
│   ├── Service/             # 服务层
│   └── Command/             # 命令行
├── web/                     # 前端代码
│   ├── views/               # 页面组件
│   └── api/                 # API 接口
└── Database/                # 数据库
```

#### mine.json 配置示例
```json
{
  "name": "mine-admin/app-store",
  "description": "MineAdmin应用市场可视化插件",
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

#### ConfigProvider 实现
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
                // 依赖注入配置
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

## 完整插件开发示例

### 1. 用户管理插件 (混合型)

以下是一个完整的用户管理插件示例，展示如何开发一个包含前后端的混合型插件。

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

#### 核心控制器实现
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
        return $this->success($user, '用户创建成功');
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
        return $this->success(null, '删除成功');
    }
}
```

#### 服务层实现
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

### 2. 后端型插件示例 - API 服务插件

以下是一个纯后端 API 服务插件的示例。

#### 插件配置 (mine.json)

```json
{
  "name": "mycompany/api-service",
  "description": "API 服务插件",
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

#### ConfigProvider 实现

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
                    'description' => 'API 服务配置文件',
                    'source' => __DIR__ . '/../publish/api_service.php',
                    'destination' => BASE_PATH . '/config/autoload/api_service.php',
                ],
            ],
        ];
    }
}
```

### 3. 前端型插件示例 - 数据可视化插件

以下是一个纯前端的数据可视化插件示例。

#### mine.json 配置
```json
{
  "name": "mycompany/data-visualization",
  "description": "数据可视化插件",
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

## 完整插件开发最佳实践

### 1. 目录结构规范

```
plugin/vendor-name/plugin-name/
├── mine.json                 # 插件配置文件
├── src/                      # PHP 后端代码
│   ├── ConfigProvider.php    # 配置提供者
│   ├── Controller/           # 控制器
│   ├── Service/             # 服务层
│   ├── Model/               # 模型
│   ├── Command/             # 命令行
│   ├── Listener/            # 事件监听器
│   └── Middleware/          # 中间件
├── web/                     # 前端代码
│   ├── views/               # Vue 页面组件
│   ├── api/                 # API 接口封装
│   ├── components/          # 公共组件
│   └── locales/             # 国际化
├── Database/                # 数据库
│   ├── Migrations/          # 迁移文件
│   └── Seeders/             # 数据填充
└── publish/                 # 发布文件
    └── config.php           # 配置文件
```

### 2. 命名规范

- **插件名称**: 使用 `vendor/plugin-name` 格式
- **命名空间**: `Plugin\VendorName\PluginName`
- **类名**: 使用大驼峰命名法
- **方法名**: 使用小驼峰命名法

### 3. 核心组件示例

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
        return $this->success($result, '创建成功');
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
     * 删除用户
     */
    #[DeleteMapping('/users/{id:\d+}')]
    public function destroy(int $id): array
    {
        $this->userService->delete($id);
        
        return $this->success([], '用户删除成功');
    }

    /**
     * 批量导入用户
     */
    #[PostMapping('/users/import')]
    public function import(): array
    {
        $file = $this->request->file('file');
        
        if (!$file || !$file->isValid()) {
            return $this->error('请上传有效的文件');
        }
        
        $result = $this->userService->importFromFile($file);
        
        return $this->success($result, '导入完成');
    }

    /**
     * 导出用户数据
     */
    #[GetMapping('/users/export')]
    public function export(): array
    {
        $params = $this->request->all();
        $filePath = $this->userService->exportToFile($params);
        
        return $this->success(['file_path' => $filePath], '导出成功');
    }
}
```

#### 4. 服务层 (src/Service/UserService.php)

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
     * 获取用户列表
     */
    public function getList(array $params = []): array
    {
        return $this->repository->getList($params);
    }

    /**
     * 创建用户
     */
    public function create(array $data): array
    {
        // 密码加密
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        // 生成用户头像
        if (!isset($data['avatar'])) {
            $data['avatar'] = $this->generateAvatar($data['username']);
        }

        $user = $this->repository->create($data);

        // 触发用户创建事件
        event(new UserCreatedEvent($user));

        return $user->toArray();
    }

    /**
     * 更新用户
     */
    public function update(int $id, array $data): array
    {
        // 密码更新处理
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            unset($data['password']);
        }

        $user = $this->repository->update($id, $data);

        // 触发用户更新事件
        event(new UserUpdatedEvent($user));

        return $user->toArray();
    }

    /**
     * 从文件导入用户
     */
    public function importFromFile($file): array
    {
        $filePath = $file->getPath() . '/' . $file->getFilename();
        
        // 读取 Excel 文件
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
     * 导出用户到文件
     */
    public function exportToFile(array $params = []): string
    {
        $users = $this->repository->getAllForExport($params);
        
        // 生成 Excel 文件
        $filePath = $this->generateExcelFile($users);
        
        return $filePath;
    }

    /**
     * 生成用户头像
     */
    private function generateAvatar(string $username): string
    {
        // 使用第三方库生成头像
        $avatar = new \Intervention\Image\ImageManager();
        // ... 头像生成逻辑
        
        return '/uploads/avatars/' . $username . '.png';
    }

    /**
     * 解析 Excel 文件
     */
    private function parseExcelFile(string $filePath): array
    {
        // Excel 解析逻辑
        return [];
    }

    /**
     * 生成 Excel 文件
     */
    private function generateExcelFile(array $users): string
    {
        // Excel 生成逻辑
        return '/tmp/users_export_' . date('YmdHis') . '.xlsx';
    }

    protected function getRepository(): string
    {
        return UserRepository::class;
    }
}
```

#### 5. 数据仓库 (src/Repository/UserRepository.php)

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
     * 获取用户列表
     */
    public function getList(array $params = []): array
    {
        $query = $this->getModel()::query();

        // 关键词搜索
        if (!empty($params['keyword'])) {
            $query->where(function ($q) use ($params) {
                $q->where('username', 'like', "%{$params['keyword']}%")
                  ->orWhere('email', 'like', "%{$params['keyword']}%")
                  ->orWhere('phone', 'like', "%{$params['keyword']}%");
            });
        }

        // 状态筛选
        if (isset($params['status'])) {
            $query->where('status', $params['status']);
        }

        // 角色筛选
        if (!empty($params['role_id'])) {
            $query->whereHas('roles', function ($q) use ($params) {
                $q->where('id', $params['role_id']);
            });
        }

        // 时间范围筛选
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
     * 获取导出数据
     */
    public function getAllForExport(array $params = []): array
    {
        $query = $this->getModel()::query();

        // 应用相同的筛选条件
        // ... 筛选逻辑

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
     * 状态常量
     */
    const STATUS_DISABLED = 0;
    const STATUS_ENABLED = 1;

    /**
     * 关联角色
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * 获取状态文本
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            self::STATUS_ENABLED => '启用',
            self::STATUS_DISABLED => '禁用',
            default => '未知'
        };
    }

    /**
     * 获取头像 URL
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

#### 7. 前端页面 (web/views/UserList.vue)

```vue
<template>
  <div class="user-manager">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="用户名/邮箱/手机号"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" style="width: 120px">
            <el-option label="全部" :value="undefined" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.created_at"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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

    <!-- 操作工具栏 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="table-header-left">
          <el-button type="primary" @click="handleAdd">
            <ma-icon name="plus" />
            新增用户
          </el-button>
          <el-button @click="handleImport">
            <ma-icon name="upload" />
            批量导入
          </el-button>
          <el-button @click="handleExport" :disabled="!hasSelection">
            <ma-icon name="download" />
            导出数据
          </el-button>
        </div>
        <div class="table-header-right">
          <el-button circle size="small" @click="handleRefresh">
            <ma-icon name="refresh" />
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table 
        :data="tableData" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar_url" :size="40">
              {{ row.username.charAt(0).toUpperCase() }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status_text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_at" label="最后登录" width="160" />
        <el-table-column prop="created_at" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button 
              size="small" 
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 用户表单弹窗 -->
    <UserForm 
      v-model:visible="formVisible"
      :data="formData"
      @success="handleFormSuccess"
    />

    <!-- 导入弹窗 -->
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

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const formVisible = ref(false)
const importVisible = ref(false)
const formData = ref(null)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: undefined,
  created_at: null
})

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 计算属性
const hasSelection = computed(() => selectedRows.value.length > 0)

// 生命周期
onMounted(() => {
  fetchData()
})

// 方法定义
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
    ElMessage.error('获取数据失败')
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
      `确定要删除用户 "${row.username}" 吗？`,
      '确认删除',
      { type: 'warning' }
    )
    
    await UserApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'
  
  try {
    await UserApi.update(row.id, { status: newStatus })
    ElMessage.success(`${action}成功`)
    row.status = newStatus
    row.status_text = newStatus === 1 ? '启用' : '禁用'
  } catch (error) {
    ElMessage.error(`${action}失败`)
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
    ElMessage.success('导出成功，文件正在下载...')
    
    // 下载文件
    window.open(response.data.file_path)
  } catch (error) {
    ElMessage.error('导出失败')
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
  // 获取用户列表
  getList(params) {
    return request({
      url: `${API_BASE}/users`,
      method: 'get',
      params
    })
  },

  // 创建用户
  create(data) {
    return request({
      url: `${API_BASE}/users`,
      method: 'post',
      data
    })
  },

  // 获取用户详情
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

  // 删除用户
  delete(id) {
    return request({
      url: `${API_BASE}/users/${id}`,
      method: 'delete'
    })
  },

  // 批量导入
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

  // 导出数据
  export(params) {
    return request({
      url: `${API_BASE}/users/export`,
      method: 'get',
      params
    })
  }
}
```

#### 9. 数据库迁移 (Database/Migrations/create_users_table.php)

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
            $table->string('email')->unique()->comment('邮箱');
            $table->string('phone', 20)->nullable()->comment('手机号');
            $table->string('password')->comment('密码');
            $table->string('avatar')->nullable()->comment('头像');
            $table->tinyInteger('status')->default(1)->comment('状态:0禁用,1启用');
            $table->timestamp('last_login_at')->nullable()->comment('最后登录时间');
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

#### 10. 安装脚本 (src/InstallScript.php)

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
            // 1. 执行数据库迁移
            $this->runMigrations();
            
            // 2. 初始化数据
            $this->seedData();
            
            // 3. 创建必要目录
            $this->createDirectories();
            
            // 4. 初始化配置
            $this->initConfig();
            
            echo "用户管理插件安装成功！\n";
            return true;
        } catch (\Exception $e) {
            echo "安装失败: " . $e->getMessage() . "\n";
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
                echo "执行迁移: " . basename($file) . "\n";
            }
        }
    }
    
    private function seedData(): void
    {
        // 插入默认管理员用户
        Db::table('plugin_user_manager_users')->insertOrIgnore([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => password_hash('123456', PASSWORD_DEFAULT),
            'status' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        
        echo "初始化默认数据完成\n";
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
                echo "创建目录: {$dir}\n";
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
            echo "创建配置文件: {$configPath}\n";
        }
    }
    
    private function getMigrationClassName(string $file): string
    {
        $filename = basename($file, '.php');
        
        // 移除时间戳前缀
        $className = preg_replace('/^\d{4}_\d{2}_\d{2}_\d{6}_/', '', $filename);
        
        // 转换为类名格式
        return str_replace(' ', '', ucwords(str_replace('_', ' ', $className)));
    }
}
```

## 最佳实践总结

### 1. 代码组织

- **分层架构**: 控制器 → 服务层 → 仓库层 → 模型
- **命名规范**: 遵循 PSR-4 自动加载标准
- **职责分离**: 每个类专注于单一职责

### 2. 安全考虑

- **输入验证**: 所有用户输入都要验证
- **权限控制**: 使用中间件进行权限检查
- **SQL 注入防护**: 使用 ORM 查询构建器
- **密码处理**: 使用安全的哈希算法

### 3. 性能优化

- **数据库索引**: 为常用查询字段添加索引
- **分页查询**: 避免一次性加载大量数据
- **缓存策略**: 合理使用缓存减少数据库查询
- **异步处理**: 耗时操作使用队列异步处理

### 4. 用户体验

- **响应式设计**: 支持不同设备屏幕
- **加载状态**: 为异步操作提供加载提示
- **错误处理**: 友好的错误信息提示
- **操作反馈**: 及时的成功/失败反馈

## 相关文档

- [插件开发指南](./develop.md) - 详细开发流程
- [插件结构说明](./structure.md) - 目录结构规范
- [生命周期管理](./lifecycle.md) - 安装卸载流程
- [API 参考文档](./api.md) - 接口文档