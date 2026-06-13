# 事件處理器

MineAdmin 的事件系統基於 [hyperf/event](https://github.com/hyperf/event) 構建，提供了強大的事件驅動機制。事件系統允許你在應用程式的不同部分之間進行松耦合的通訊，提高程式碼的可維護性和擴充套件性。

## 概述

事件系統採用觀察者模式，包含以下核心概念：

- **事件（Event）**：表示系統中發生的某個動作或狀態變化
- **監聽器（Listener）**：響應特定事件的處理邏輯
- **事件排程器（Dispatcher）**：負責事件的分發和監聽器的呼叫

## 系統內建監聽器

MineAdmin 提供了多個內建監聽器來處理系統核心功能：

| 監聽器                             | 功能描述                                                      | 狀態 | 配置檔案位置 |
|---------------------------------|------------------------------------------------------------|------|------------|
| ErrorExceptionHandler           | 錯誤異常處理器，將符合條件的錯誤轉換為異常丟擲                                   | 預設啟用 | `config/autoload/exceptions.php` |
| UploadSubscriber                | 檔案上傳事件訂閱器，處理檔案上傳相關的業務邏輯                                   | 預設啟用 | `config/autoload/listeners.php` |
| BootApplicationSubscriber       | 應用啟動訂閱器，在程式啟動時註冊資料庫遷移和種子檔案目錄                           | 預設啟用 | `config/autoload/listeners.php` |
| DbQueryExecutedSubscriber       | 資料庫查詢監聽器，根據環境配置記錄和輸出 SQL 執行資訊                            | 可配置 | `config/autoload/listeners.php` |
| FailToHandleSubscriber          | 命令執行失敗監聽器，當控制檯命令執行失敗時記錄錯誤資訊                             | 預設啟用 | `config/autoload/listeners.php` |
| ResumeExitCoordinatorSubscriber | 程序退出協調器，處理 Worker 程序的優雅退出                                | 預設啟用 | `config/autoload/listeners.php` |
| QueueHandleSubscriber           | 佇列處理監聽器，監聽佇列任務的執行狀態並記錄相關資訊                             | 預設啟用 | `config/autoload/listeners.php` |
| RegisterBlueprintListener       | 藍圖註冊監聽器，用於註冊新的 API 藍圖方法                                 | 預設啟用 | `config/autoload/listeners.php` |

## 建立自定義事件

### 1. 定義事件類

建立事件類檔案 `app/Event/UserRegisteredEvent.php`：

```php
<?php

declare(strict_types=1);

namespace App\Event;

class UserRegisteredEvent
{
    public function __construct(
        public int $userId,
        public string $username,
        public string $email,
        public array $extra = []
    ) {
    }
}
```

### 2. 建立事件監聽器

建立監聽器檔案 `app/Listener/UserRegisteredListener.php`：

```php
<?php

declare(strict_types=1);

namespace App\Listener;

use App\Event\UserRegisteredEvent;
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;
use Psr\Container\ContainerInterface;

#[Listener]
class UserRegisteredListener implements ListenerInterface
{
    public function __construct(
        private ContainerInterface $container
    ) {
    }

    public function listen(): array
    {
        return [
            UserRegisteredEvent::class,
        ];
    }

    public function process(object $event): void
    {
        if ($event instanceof UserRegisteredEvent) {
            // 傳送歡迎郵件
            $this->sendWelcomeEmail($event->email, $event->username);
            
            // 記錄使用者註冊日誌
            $this->logUserRegistration($event->userId, $event->username);
            
            // 初始化使用者預設設定
            $this->initializeUserSettings($event->userId);
        }
    }

    private function sendWelcomeEmail(string $email, string $username): void
    {
        // 郵件傳送邏輯
    }

    private function logUserRegistration(int $userId, string $username): void
    {
        // 日誌記錄邏輯
    }

    private function initializeUserSettings(int $userId): void
    {
        // 使用者設定初始化邏輯
    }
}
```

### 3. 觸發事件

在業務程式碼中觸發事件：

```php
<?php

namespace App\Service;

use App\Event\UserRegisteredEvent;
use Psr\EventDispatcher\EventDispatcherInterface;

class UserService
{
    public function __construct(
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function register(array $userData): int
    {
        // 使用者註冊邏輯
        $userId = $this->createUser($userData);
        
        // 觸發使用者註冊事件
        $event = new UserRegisteredEvent(
            userId: $userId,
            username: $userData['username'],
            email: $userData['email'],
            extra: ['ip' => $this->getClientIp()]
        );
        
        $this->eventDispatcher->dispatch($event);
        
        return $userId;
    }

    private function createUser(array $userData): int
    {
        // 實際的使用者建立邏輯
        return 123; // 示例返回值
    }

    private function getClientIp(): string
    {
        // 獲取客戶端 IP 地址
        return '192.168.1.1'; // 示例返回值
    }
}
```

## 非同步事件處理

對於耗時的事件處理，可以使用佇列進行非同步處理：

```php
<?php

declare(strict_types=1);

namespace App\Listener;

use App\Event\UserRegisteredEvent;
use Hyperf\AsyncQueue\Annotation\AsyncQueueMessage;
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;

#[Listener]
class AsyncUserRegisteredListener implements ListenerInterface
{
    public function listen(): array
    {
        return [
            UserRegisteredEvent::class,
        ];
    }

    public function process(object $event): void
    {
        if ($event instanceof UserRegisteredEvent) {
            // 非同步處理耗時任務
            $this->handleAsync($event->userId, $event->email);
        }
    }

    #[AsyncQueueMessage]
    public function handleAsync(int $userId, string $email): void
    {
        // 這裡的程式碼將在佇列中非同步執行
        // 例如：傳送複雜的歡迎郵件、生成報告等
        sleep(5); // 模擬耗時操作
        echo "非同步處理使用者 {$userId} 的註冊後續任務完成\n";
    }
}
```

## 事件監聽器優先順序

可以透過設定優先順序來控制監聽器的執行順序：

```php
<?php

#[Listener(priority: 100)] // 數值越大，優先順序越高
class HighPriorityListener implements ListenerInterface
{
    // ...
}

#[Listener(priority: 1)] // 優先順序較低
class LowPriorityListener implements ListenerInterface
{
    // ...
}
```

## 配置管理

### 監聽器配置

在 `config/autoload/listeners.php` 中配置監聽器：

```php
<?php

return [
    // 手動註冊監聽器（不使用註解時）
    \App\Listener\UserRegisteredListener::class,
    
    // 條件性註冊監聽器
    env('ENABLE_USER_TRACKING', false) ? \App\Listener\UserTrackingListener::class : null,
];
```

### 事件除錯

在開發環境中啟用事件除錯，在 `.env` 檔案中設定：

```env
# 啟用事件除錯日誌
EVENT_DEBUG=true

# 資料庫查詢日誌
DB_QUERY_LOG=true
```

## 最佳實踐

### 1. 事件命名規範
- 事件類使用過去式命名：`UserRegisteredEvent`、`OrderCreatedEvent`
- 監聽器使用現在式命名：`SendWelcomeEmailListener`、`UpdateUserStatusListener`

### 2. 事件資料結構
- 保持事件資料的不可變性
- 只包含必要的資料，避免傳遞大物件
- 使用只讀屬性或構造器注入

### 3. 錯誤處理
```php
public function process(object $event): void
{
    try {
        // 事件處理邏輯
        $this->handleEvent($event);
    } catch (\Throwable $e) {
        // 記錄錯誤日誌，但不阻斷其他監聽器
        logger()->error('事件處理失敗', [
            'event' => get_class($event),
            'listener' => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
```

### 4. 效能最佳化
- 對於非關鍵業務使用非同步佇列處理
- 避免在監聽器中執行過重的資料庫操作
- 合理使用事件優先順序避免依賴關係複雜化

## 除錯和測試

### 事件測試示例

```php
<?php

namespace HyperfTest\Event;

use App\Event\UserRegisteredEvent;
use App\Listener\UserRegisteredListener;
use HyperfTest\TestCase;
use Mockery;

class UserRegisteredEventTest extends TestCase
{
    public function testUserRegisteredListener(): void
    {
        $event = new UserRegisteredEvent(
            userId: 1,
            username: 'testuser',
            email: 'test@example.com'
        );

        $listener = new UserRegisteredListener($this->container);
        
        // 模擬監聽器處理
        $listener->process($event);
        
        // 斷言處理結果
        $this->assertTrue(true); // 根據實際業務邏輯編寫斷言
    }
}
```

## 相關文件

- [Hyperf 事件文件](https://hyperf.wiki/3.1/#/zh-cn/event)
- [非同步佇列文件](https://hyperf.wiki/3.1/#/zh-cn/async-queue)





