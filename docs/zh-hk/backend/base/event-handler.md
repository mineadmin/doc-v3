# 事件處理器

MineAdmin 的事件系統基於 [hyperf/event](https://github.com/hyperf/event) 構建，提供了強大的事件驅動機制。事件系統允許你在應用程序的不同部分之間進行松耦合的通信，提高代碼的可維護性和擴展性。

## 概述

事件系統採用觀察者模式，包含以下核心概念：

- **事件（Event）**：表示系統中發生的某個動作或狀態變化
- **監聽器（Listener）**：響應特定事件的處理邏輯
- **事件調度器（Dispatcher）**：負責事件的分發和監聽器的調用

## 系統內置監聽器

MineAdmin 提供了多個內置監聽器來處理系統核心功能：

| 監聽器                             | 功能描述                                                      | 狀態 | 配置文件位置 |
|---------------------------------|------------------------------------------------------------|------|------------|
| ErrorExceptionHandler           | 錯誤異常處理器，將符合條件的錯誤轉換為異常拋出                                   | 默認啓用 | `config/autoload/exceptions.php` |
| UploadSubscriber                | 文件上傳事件訂閲器，處理文件上傳相關的業務邏輯                                   | 默認啓用 | `config/autoload/listeners.php` |
| BootApplicationSubscriber       | 應用啓動訂閲器，在程序啓動時註冊數據庫遷移和種子文件目錄                           | 默認啓用 | `config/autoload/listeners.php` |
| DbQueryExecutedSubscriber       | 數據庫查詢監聽器，根據環境配置記錄和輸出 SQL 執行信息                            | 可配置 | `config/autoload/listeners.php` |
| FailToHandleSubscriber          | 命令執行失敗監聽器，當控制枱命令執行失敗時記錄錯誤信息                             | 默認啓用 | `config/autoload/listeners.php` |
| ResumeExitCoordinatorSubscriber | 進程退出協調器，處理 Worker 進程的優雅退出                                | 默認啓用 | `config/autoload/listeners.php` |
| QueueHandleSubscriber           | 隊列處理監聽器，監聽隊列任務的執行狀態並記錄相關信息                             | 默認啓用 | `config/autoload/listeners.php` |
| RegisterBlueprintListener       | 藍圖註冊監聽器，用於註冊新的 API 藍圖方法                                 | 默認啓用 | `config/autoload/listeners.php` |

## 創建自定義事件

### 1. 定義事件類

創建事件類文件 `app/Event/UserRegisteredEvent.php`：

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

### 2. 創建事件監聽器

創建監聽器文件 `app/Listener/UserRegisteredListener.php`：

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
            // 發送歡迎郵件
            $this->sendWelcomeEmail($event->email, $event->username);
            
            // 記錄用户註冊日誌
            $this->logUserRegistration($event->userId, $event->username);
            
            // 初始化用户默認設置
            $this->initializeUserSettings($event->userId);
        }
    }

    private function sendWelcomeEmail(string $email, string $username): void
    {
        // 郵件發送邏輯
    }

    private function logUserRegistration(int $userId, string $username): void
    {
        // 日誌記錄邏輯
    }

    private function initializeUserSettings(int $userId): void
    {
        // 用户設置初始化邏輯
    }
}
```

### 3. 觸發事件

在業務代碼中觸發事件：

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
        // 用户註冊邏輯
        $userId = $this->createUser($userData);
        
        // 觸發用户註冊事件
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
        // 實際的用户創建邏輯
        return 123; // 示例返回值
    }

    private function getClientIp(): string
    {
        // 獲取客户端 IP 地址
        return '192.168.1.1'; // 示例返回值
    }
}
```

## 異步事件處理

對於耗時的事件處理，可以使用隊列進行異步處理：

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
            // 異步處理耗時任務
            $this->handleAsync($event->userId, $event->email);
        }
    }

    #[AsyncQueueMessage]
    public function handleAsync(int $userId, string $email): void
    {
        // 這裏的代碼將在隊列中異步執行
        // 例如：發送複雜的歡迎郵件、生成報告等
        sleep(5); // 模擬耗時操作
        echo "異步處理用户 {$userId} 的註冊後續任務完成\n";
    }
}
```

## 事件監聽器優先級

可以通過設置優先級來控制監聽器的執行順序：

```php
<?php

#[Listener(priority: 100)] // 數值越大，優先級越高
class HighPriorityListener implements ListenerInterface
{
    // ...
}

#[Listener(priority: 1)] // 優先級較低
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

### 事件調試

在開發環境中啓用事件調試，在 `.env` 文件中設置：

```env
# 啓用事件調試日誌
EVENT_DEBUG=true

# 數據庫查詢日誌
DB_QUERY_LOG=true
```

## 最佳實踐

### 1. 事件命名規範
- 事件類使用過去式命名：`UserRegisteredEvent`、`OrderCreatedEvent`
- 監聽器使用現在式命名：`SendWelcomeEmailListener`、`UpdateUserStatusListener`

### 2. 事件數據結構
- 保持事件數據的不可變性
- 只包含必要的數據，避免傳遞大對象
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

### 4. 性能優化
- 對於非關鍵業務使用異步隊列處理
- 避免在監聽器中執行過重的數據庫操作
- 合理使用事件優先級避免依賴關係複雜化

## 調試和測試

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

## 相關文檔

- [Hyperf 事件文檔](https://hyperf.wiki/3.1/#/zh-cn/event)
- [異步隊列文檔](https://hyperf.wiki/3.1/#/zh-cn/async-queue)





