# Plugin Example Code

This document provides complete MineAdmin plugin development examples, including actual code cases and best practices for different types of plugins.

## Official Plugin Examples

### App-Store Plugin (Mixed Type)

**Repository**: [mineadmin/appstore](https://github.com/mineadmin/appstore)

App-Store is the only official default plugin for MineAdmin, providing app marketplace management functionality, demonstrating a complete implementation of a mixed-type plugin.

#### Core File Structure
```
plugin/mine-admin/app-store/
├── mine.json                 # Plugin configuration
├── src/                      # Backend code
│   ├── ConfigProvider.php    # Configuration provider
│   ├── Controller/           # Controllers
│   ├── Service/             # Service layer
│   └── Command/             # Commands
├── web/                     # Frontend code
│   ├── views/               # Page components
│   └── api/                 # API endpoints
└── Database/                # Database
```

#### mine.json Configuration Example
```json
{
  "name": "mine-admin/app-store",
  "description": "MineAdmin App Store visualization plugin",
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

#### ConfigProvider Implementation
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
                // Dependency injection configuration
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

## Complete Plugin Development Examples

### 1. User Management Plugin (Mixed Type)

The following is a complete user management plugin example, demonstrating how to develop a mixed-type plugin with both frontend and backend.

#### mine.json Configuration
```json
{
  "name": "mycompany/user-manager",
  "description": "User management plugin",
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

#### Core Controller Implementation
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
        return $this->success($user, 'User created successfully');
    }

    #[PutMapping('/user/{id}')]
    public function update(int $id): array
    {
        $data = $this->request->all();
        $this->service->update($id, $data);
        return $this->success(null, 'Update successful');
    }

    #[DeleteMapping('/user/{id}')]
    public function delete(int $id): array
    {
        $this->service->delete($id);
        return $this->success(null, 'Delete successful');
    }
}
```

#### Service Layer Implementation
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

### 2. Backend-Type Plugin Example - API Service Plugin

The following is an example of a pure backend API service plugin.

#### Plugin Configuration (mine.json)

```json
{
  "name": "mycompany/api-service",
  "description": "API service plugin",
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

#### ConfigProvider Implementation

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
                    'description' => 'API service configuration file',
                    'source' => __DIR__ . '/../publish/api_service.php',
                    'destination' => BASE_PATH . '/config/autoload/api_service.php',
                ],
            ],
        ];
    }
}
```

### 3. Frontend-Type Plugin Example - Data Visualization Plugin

The following is an example of a pure frontend data visualization plugin.

#### mine.json Configuration
```json
{
  "name": "mycompany/data-visualization",
  "description": "Data visualization plugin",
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

## Complete Plugin Development Best Practices

### 1. Directory Structure Standards

```
plugin/vendor-name/plugin-name/
├── mine.json                 # Plugin configuration file
├── src/                      # PHP backend code
│   ├── ConfigProvider.php    # Configuration provider
│   ├── Controller/           # Controllers
│   ├── Service/             # Service layer
│   ├── Model/               # Models
│   ├── Command/             # Commands
│   ├── Listener/            # Event listeners
│   └── Middleware/          # Middleware
├── web/                     # Frontend code
│   ├── views/               # Vue page components
│   ├── api/                 # API endpoint wrappers
│   ├── components/          # Shared components
│   └── locales/             # Internationalization
├── Database/                # Database
│   ├── Migrations/          # Migration files
│   └── Seeders/             # Data seeders
└── publish/                 # Published files
    └── config.php           # Configuration file
```

### 2. Naming Standards

- **Plugin Name**: Use `vendor/plugin-name` format
- **Namespace**: `Plugin\VendorName\PluginName`
- **Class Names**: Use PascalCase
- **Method Names**: Use camelCase

### 3. Core Component Examples

#### Controller Example

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
        return $this->success($result, 'Created successfully');
    }
        $user = $this->userService->find($id);
        
        if (!$user) {
            return $this->error('User not found', 404);
        }
        
        return $this->success($user);
    }

    /**
     * Update user
     */
    #[PutMapping('/users/{id:\d+}')]
    public function update(int $id): array
    {
        $data = $this->request->all();
        
        $user = $this->userService->update($id, $data);
        
        return $this->success($user, 'User updated successfully');
    }

    /**
     * Delete user
     */
    #[DeleteMapping('/users/{id:\d+}')]
    public function destroy(int $id): array
    {
        $this->userService->delete($id);
        
        return $this->success([], 'User deleted successfully');
    }

    /**
     * Batch import users
     */
    #[PostMapping('/users/import')]
    public function import(): array
    {
        $file = $this->request->file('file');
        
        if (!$file || !$file->isValid()) {
            return $this->error('Please upload a valid file');
        }
        
        $result = $this->userService->importFromFile($file);
        
        return $this->success($result, 'Import completed');
    }

    /**
     * Export user data
     */
    #[GetMapping('/users/export')]
    public function export(): array
    {
        $params = $this->request->all();
        $filePath = $this->userService->exportToFile($params);
        
        return $this->success(['file_path' => $filePath], 'Export successful');
    }
}
```

#### 4. Service Layer (src/Service/UserService.php)

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
     * Get user list
     */
    public function getList(array $params = []): array
    {
        return $this->repository->getList($params);
    }

    /**
     * Create user
     */
    public function create(array $data): array
    {
        // Password encryption
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        // Generate user avatar
        if (!isset($data['avatar'])) {
            $data['avatar'] = $this->generateAvatar($data['username']);
        }

        $user = $this->repository->create($data);

        // Trigger user creation event
        event(new UserCreatedEvent($user));

        return $user->toArray();
    }

    /**
     * Update user
     */
    public function update(int $id, array $data): array
    {
        // Password update handling
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            unset($data['password']);
        }

        $user = $this->repository->update($id, $data);

        // Trigger user update event
        event(new UserUpdatedEvent($user));

        return $user->toArray();
    }

    /**
     * Import users from file
     */
    public function importFromFile($file): array
    {
        $filePath = $file->getPath() . '/' . $file->getFilename();
        
        // Read Excel file
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
                $errors[] = "Row {$index}: " . $e->getMessage();
            }
        }

        return [
            'success_count' => $successCount,
            'error_count' => $errorCount,
            'errors' => $errors
        ];
    }

    /**
     * Export users to file
     */
    public function exportToFile(array $params = []): string
    {
        $users = $this->repository->getAllForExport($params);
        
        // Generate Excel file
        $filePath = $this->generateExcelFile($users);
        
        return $filePath;
    }

    /**
     * Generate user avatar
     */
    private function generateAvatar(string $username): string
    {
        // Use third-party library to generate avatar
        $avatar = new \Intervention\Image\ImageManager();
        // ... Avatar generation logic
        
        return '/uploads/avatars/' . $username . '.png';
    }

    /**
     * Parse Excel file
     */
    private function parseExcelFile(string $filePath): array
    {
        // Excel parsing logic
        return [];
    }

    /**
     * Generate Excel file
     */
    private function generateExcelFile(array $users): string
    {
        // Excel generation logic
        return '/tmp/users_export_' . date('YmdHis') . '.xlsx';
    }

    protected function getRepository(): string
    {
        return UserRepository::class;
    }
}
```

#### 5. Data Repository (src/Repository/UserRepository.php)

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
     * Get user list
     */
    public function getList(array $params = []): array
    {
        $query = $this->getModel()::query();

        // Keyword search
        if (!empty($params['keyword'])) {
            $query->where(function ($q) use ($params) {
                $q->where('username', 'like', "%{$params['keyword']}%")
                  ->orWhere('email', 'like', "%{$params['keyword']}%")
                  ->orWhere('phone', 'like', "%{$params['keyword']}%");
            });
        }

        // Status filter
        if (isset($params['status'])) {
            $query->where('status', $params['status']);
        }

        // Role filter
        if (!empty($params['role_id'])) {
            $query->whereHas('roles', function ($q) use ($params) {
                $q->where('id', $params['role_id']);
            });
        }

        // Time range filter
        if (!empty($params['created_at'])) {
            $dates = explode(' - ', $params['created_at']);
            if (count($dates) === 2) {
                $query->whereBetween('created_at', [
                    $dates[0] . ' 00:00:00',
                    $dates[1] . ' 23:59:59'
                ]);
            }
        }

        // Sorting
        $query->orderBy($params['sort'] ?? 'id', $params['order'] ?? 'desc');

        return $query->paginate($params['pageSize'] ?? 15)->toArray();
    }

    /**
     * Get export data
     */
    public function getAllForExport(array $params = []): array
    {
        $query = $this->getModel()::query();

        // Apply same filter conditions
        // ... Filter logic

        return $query->select([
            'id', 'username', 'email', 'phone', 
            'status', 'created_at', 'updated_at'
        ])->get()->toArray();
    }
}
```

#### 6. Model (src/Model/User.php)

```php
<?php

namespace Plugin\Example\UserManager\Model;

use Mine\MineModel;

/**
 * User model
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
     * Status constants
     */
    const STATUS_DISABLED = 0;
    const STATUS_ENABLED = 1;

    /**
     * Associate roles
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * Get status text
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            self::STATUS_ENABLED => 'Enabled',
            self::STATUS_DISABLED => 'Disabled',
            default => 'Unknown'
        };
    }

    /**
     * Get avatar URL
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

#### 7. Frontend Page (web/views/UserList.vue)

```vue
<template>
  <div class="user-manager">
    <!-- Search form -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="Keyword">
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="Username/Email/Phone"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="searchForm.status" style="width: 120px">
            <el-option label="All" :value="undefined" />
            <el-option label="Enabled" :value="1" />
            <el-option label="Disabled" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="Created At">
          <el-date-picker
            v-model="searchForm.created_at"
            type="daterange"
            range-separator="To"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <ma-icon name="search" />
            Search
          </el-button>
          <el-button @click="handleReset">
            <ma-icon name="refresh" />
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Action toolbar -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="table-header-left">
          <el-button type="primary" @click="handleAdd">
            <ma-icon name="plus" />
            Add User
          </el-button>
          <el-button @click="handleImport">
            <ma-icon name="upload" />
            Batch Import
          </el-button>
          <el-button @click="handleExport" :disabled="!hasSelection">
            <ma-icon name="download" />
            Export Data
          </el-button>
        </div>
        <div class="table-header-right">
          <el-button circle size="small" @click="handleRefresh">
            <ma-icon name="refresh" />
          </el-button>
        </div>
      </div>

      <!-- Data table -->
      <el-table 
        :data="tableData" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="avatar" label="Avatar" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar_url" :size="40">
              {{ row.username.charAt(0).toUpperCase() }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="Username" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status_text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_at" label="Last Login" width="160" />
        <el-table-column prop="created_at" label="Created At" width="160" />
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">
              Edit
            </el-button>
            <el-button 
              size="small" 
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? 'Disable' : 'Enable' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
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

    <!-- User form dialog -->
    <UserForm 
      v-model:visible="formVisible"
      :data="formData"
      @success="handleFormSuccess"
    />

    <!-- Import dialog -->
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

// Reactive data
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const formVisible = ref(false)
const importVisible = ref(false)
const formData = ref(null)

// Search form
const searchForm = reactive({
  keyword: '',
  status: undefined,
  created_at: null
})

// Pagination data
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// Computed properties
const hasSelection = computed(() => selectedRows.value.length > 0)

// Lifecycle
onMounted(() => {
  fetchData()
})

// Method definitions
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
    ElMessage.error('Failed to fetch data')
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
      `Are you sure you want to delete user "${row.username}"?`,
      'Confirm Deletion',
      { type: 'warning' }
    )
    
    await UserApi.delete(row.id)
    ElMessage.success('Deleted successfully')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Deletion failed')
    }
  }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? 'Enable' : 'Disable'
  
  try {
    await UserApi.update(row.id, { status: newStatus })
    ElMessage.success(`${action}d successfully`)
    row.status = newStatus
    row.status_text = newStatus === 1 ? 'Enabled' : 'Disabled'
  } catch (error) {
    ElMessage.error(`${action} failed`)
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
    ElMessage.success('Export successful, file is downloading...')
    
    // Download file
    window.open(response.data.file_path)
  } catch (error) {
    ElMessage.error('Export failed')
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

#### 8. API Endpoint (web/api/user.js)

```javascript
// web/api/user.js
import { request } from '@/utils/request'

const API_BASE = '/user-manager'

export default {
  // Get user list
  getList(params) {
    return request({
      url: `${API_BASE}/users`,
      method: 'get',
      params
    })
  },

  // Create user
  create(data) {
    return request({
      url: `${API_BASE}/users`,
      method: 'post',
      data
    })
  },

  // Get user details
  get(id) {
    return request({
      url: `${API_BASE}/users/${id}`,
      method: 'get'
    })
  },

  // Update user
  update(id, data) {
    return request({
      url: `${API_BASE}/users/${id}`,
      method: 'put',
      data
    })
  },

  // Delete user
  delete(id) {
    return request({
      url: `${API_BASE}/users/${id}`,
      method: 'delete'
    })
  },

  // Batch import
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

  // Export data
  export(params) {
    return request({
      url: `${API_BASE}/users/export`,
      method: 'get',
      params
    })
  }
}
```

#### 9. Database Migration (Database/Migrations/create_users_table.php)

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
            $table->string('username', 50)->unique()->comment('Username');
            $table->string('email')->unique()->comment('Email');
            $table->string('phone', 20)->nullable()->comment('Phone number');
            $table->string('password')->comment('Password');
            $table->string('avatar')->nullable()->comment('Avatar');
            $table->tinyInteger('status')->default(1)->comment('Status: 0=Disabled, 1=Enabled');
            $table->timestamp('last_login_at')->nullable()->comment('Last login time');
            $table->timestamps();
            
            $table->index(['username']);
            $table->index(['email']);
            $table->index(['phone']);
            $table->index(['status']);
            $table->index(['created_at']);
            
            $table->comment('User Management Plugin - Users Table');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plugin_user_manager_users');
    }
}
```

#### 10. Installation Script (src/InstallScript.php)

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
            // 1. Run database migrations
            $this->runMigrations();
            
            // 2. Initialize data
            $this->seedData();
            
            // 3. Create necessary directories
            $this->createDirectories();
            
            // 4. Initialize configuration
            $this->initConfig();
            
            echo "User Management Plugin installed successfully!\n";
            return true;
        } catch (\Exception $e) {
            echo "Installation failed: " . $e->getMessage() . "\n";
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
                echo "Running migration: " . basename($file) . "\n";
            }
        }
    }
    
    private function seedData(): void
    {
        // Insert default admin user
        Db::table('plugin_user_manager_users')->insertOrIgnore([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => password_hash('123456', PASSWORD_DEFAULT),
            'status' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        
        echo "Default data initialized\n";
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
                echo "Creating directory: {$dir}\n";
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
            echo "