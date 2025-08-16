# Plugin Example Code

This document provides complete MineAdmin plugin development examples, including practical code samples and best practices for different types of plugins.

## Official Plugin Examples

### App-Store Plugin (Mixed Type)

**Repository**: [mineadmin/appstore](https://github.com/mineadmin/appstore)

App-Store is MineAdmin's only official default plugin, providing application market management functionality, showcasing a complete implementation of a mixed-type plugin.

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
│   └── api/                 # API interfaces
└── Database/                # Database
```

#### mine.json Configuration Example
```json
{
  "name": "mine-admin/app-store",
  "description": "MineAdmin Application Market Visualization Plugin",
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

Below is a complete user management plugin example demonstrating how to develop a mixed-type plugin with both frontend and backend.

#### mine.json Configuration
```json
{
  "name": "mycompany/user-manager",
  "description": "User Management Plugin",
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

### 2. Backend Plugin Example - API Service Plugin

Below is an example of a pure backend API service plugin.

#### Plugin Configuration (mine.json)

```json
{
  "name": "mycompany/api-service",
  "description": "API Service Plugin",
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
                    'description' => 'API Service configuration file',
                    'source' => __DIR__ . '/../publish/api_service.php',
                    'destination' => BASE_PATH . '/config/autoload/api_service.php',
                ],
            ],
        ];
    }
}
```

### 3. Frontend Plugin Example - Data Visualization Plugin

Below is an example of a pure frontend data visualization plugin.

#### mine.json Configuration
```json
{
  "name": "mycompany/data-visualization",
  "description": "Data Visualization Plugin",
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
├── mine.json                 # Plugin configuration
├── src/                      # PHP backend code
│   ├── ConfigProvider.php    # Configuration provider
│   ├── Controller/           # Controllers
│   ├── Service/             # Service layer
│   ├── Model/               # Models
│   ├── Command/             # Commands
│   ├── Listener/            # Event listeners
│   └── Middleware/          # Middleware
├── web/                     # Frontend code
│   ├── views/               # Vue components
│   ├── api/                 # API wrappers
│   ├── components/          # Shared components
│   └── locales/             # Localization
├── Database/                # Database
│   ├── Migrations/          # Migration files
│   └── Seeders/             # Seeders
└── publish/                 # Published files
    └── config.php           # Configuration files
```

### 2. Naming Conventions

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

#### 5. Repository (src/Repository/UserRepository.php)

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
                $q->where('id', $params['