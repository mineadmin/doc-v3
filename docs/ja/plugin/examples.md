# プラグインサンプルコード

このドキュメントでは、MineAdminプラグイン開発の完全なサンプルを提供します。さまざまなタイプのプラグインの実際のコード例とベストプラクティスが含まれています。

## 公式プラグインサンプル

### App-Store プラグイン (ハイブリッド型)

**リポジトリURL**: [mineadmin/appstore](https://github.com/mineadmin/appstore)

App-StoreはMineAdminで唯一の公式デフォルトプラグインで、アプリケーションマーケット管理機能を提供し、ハイブリッド型プラグインの完全な実装を示しています。

#### コアファイル構造
```
plugin/mine-admin/app-store/
├── mine.json                 # プラグイン設定
├── src/                      # バックエンドコード
│   ├── ConfigProvider.php    # 設定プロバイダ
│   ├── Controller/           # コントローラ
│   ├── Service/             # サービス層
│   └── Command/             # コマンドライン
├── web/                     # フロントエンドコード
│   ├── views/               # ページコンポーネント
│   └── api/                 # APIインターフェース
└── Database/                # データベース
```

#### mine.json 設定例
```json
{
  "name": "mine-admin/app-store",
  "description": "MineAdminアプリケーションマーケット可視化プラグイン",
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

#### ConfigProvider 実装
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
                // 依存性注入設定
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
                    'description' => 'App Store設定ファイル',
                    'source' => __DIR__ . '/../publish/appstore.php',
                    'destination' => BASE_PATH . '/config/autoload/appstore.php',
                ],
            ],
        ];
    }
}
```

## 完全なプラグイン開発サンプル

### 1. ユーザー管理プラグイン (ハイブリッド型)

以下は完全なユーザー管理プラグインのサンプルで、フロントエンドとバックエンドを含むハイブリッド型プラグインの開発方法を示しています。

#### mine.json 設定
```json
{
  "name": "mycompany/user-manager",
  "description": "ユーザー管理プラグイン",
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

#### コアコントローラ実装
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
        return $this->success($user, 'ユーザー作成成功');
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
        return $this->success(null, '削除成功');
    }
}
```

#### サービス層実装
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

### 2. バックエンド型プラグインサンプル - APIサービスプラグイン

以下は純粋なバックエンドAPIサービスプラグインのサンプルです。

#### プラグイン設定 (mine.json)

```json
{
  "name": "mycompany/api-service",
  "description": "APIサービスプラグイン",
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

#### ConfigProvider 実装

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
                    'description' => 'APIサービス設定ファイル',
                    'source' => __DIR__ . '/../publish/api_service.php',
                    'destination' => BASE_PATH . '/config/autoload/api_service.php',
                ],
            ],
        ];
    }
}
```

### 3. フロントエンド型プラグインサンプル - データ可視化プラグイン

以下は純粋なフロントエンドのデータ可視化プラグインのサンプルです。

#### mine.json 設定
```json
{
  "name": "mycompany/data-visualization",
  "description": "データ可視化プラグイン",
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

## 完全なプラグイン開発ベストプラクティス

### 1. ディレクトリ構造規範

```
plugin/vendor-name/plugin-name/
├── mine.json                 # プラグイン設定ファイル
├── src/                      # PHPバックエンドコード
│   ├── ConfigProvider.php    # 設定プロバイダ
│   ├── Controller/           # コントローラ
│   ├── Service/             # サービス層
│   ├── Model/               # モデル
│   ├── Command/             # コマンドライン
│   ├── Listener/            # イベントリスナー
│   └── Middleware/          # ミドルウェア
├── web/                     # フロントエンドコード
│   ├── views/               # Vueページコンポーネント
│   ├── api/                 # APIインターフェースカプセル化
│   ├── components/          # 共通コンポーネント
│   └── locales/             # 国際化
├── Database/                # データベース
│   ├── Migrations/          # マイグレーションファイル
│   └── Seeders/             # データシード
└── publish/                 # 公開ファイル
    └── config.php           # 設定ファイル
```

### 2. 命名規範

- **プラグイン名**: `vendor/plugin-name` 形式を使用
- **名前空間**: `Plugin\VendorName\PluginName`
- **クラス名**: 大文字キャメルケースを使用
- **メソッド名**: 小文字キャメルケースを使用

### 3. コアコンポーネントサンプル

#### コントローラサンプル

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
        return $this->success($result, '作成成功');
    }
        $user = $this->userService->find($id);
        
        if (!$user) {
            return $this->error('ユーザーが存在しません', 404);
        }
        
        return $this->success($user);
    }

    /**
     * ユーザー更新
     */
    #[PutMapping('/users/{id:\d+}')]
    public function update(int $id): array
    {
        $data = $this->request->all();
        
        $user = $this->userService->update($id, $data);
        
        return $this->success($user, 'ユーザー更新成功');
    }

    /**
     * ユーザー削除
     */
    #[DeleteMapping('/users/{id:\d+}')]
    public function destroy(int $id): array
    {
        $this->userService->delete($id);
        
        return $this->success([], 'ユーザー削除成功');
    }

    /**
     * ユーザー一括インポート
     */
    #[PostMapping('/users/import')]
    public function import(): array
    {
        $file = $this->request->file('file');
        
        if (!$file || !$file->isValid()) {
            return $this->error('有効なファイルをアップロードしてください');
        }
        
        $result = $this->userService->importFromFile($file);
        
        return $this->success($result, 'インポート完了');
    }

    /**
     * ユーザーデータエクスポート
     */
    #[GetMapping('/users/export')]
    public function export(): array
    {
        $params = $this->request->all();
        $filePath = $this->userService->exportToFile($params);
        
        return $this->success(['file_path' => $filePath], 'エクスポート成功');
    }
}
```

#### 4. サービス層 (src/Service/UserService.php)

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
     * ユーザーリスト取得
     */
    public function getList(array $params = []): array
    {
        return $this->repository->getList($params);
    }

    /**
     * ユーザー作成
     */
    public function create(array $data): array
    {
        // パスワード暗号化
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        // ユーザーアバター生成
        if (!isset($data['avatar'])) {
            $data['avatar'] = $this->generateAvatar($data['username']);
        }

        $user = $this->repository->create($data);

        // ユーザー作成イベントトリガー
        event(new UserCreatedEvent($user));

        return $user->toArray();
    }

    /**
     * ユーザー更新
     */
    public function update(int $id, array $data): array
    {
        // パスワード更新処理
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            unset($data['password']);
        }

        $user = $this->repository->update($id, $data);

        // ユーザー更新イベントトリガー
        event(new UserUpdatedEvent($user));

        return $user->toArray();
    }

    /**
     * ファイルからユーザーインポート
     */
    public function importFromFile($file): array
    {
        $filePath = $file->getPath() . '/' . $file->getFilename();
        
        // Excelファイル読み取り
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
                $errors[] = "{$index}行目: " . $e->getMessage();
            }
        }

        return [
            'success_count' => $successCount,
            'error_count' => $errorCount,
            'errors' => $errors
        ];
    }

    /**
     * ユーザーをファイルにエクスポート
     */
    public function exportToFile(array $params = []): string
    {
        $users = $this->repository->getAllForExport($params);
        
        // Excelファイル生成
        $filePath = $this->generateExcelFile($users);
        
        return $filePath;
    }

    /**
     * ユーザーアバター生成
     */
    private function generateAvatar(string $username