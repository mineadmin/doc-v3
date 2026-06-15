# 事件处理器

MineAdmin 的事件系统基于 [hyperf/event](https://github.com/hyperf/event) 构建，提供了强大的事件驱动机制。事件系统允许你在应用程序的不同部分之间进行松耦合的通信，提高代码的可维护性和扩展性。

## 概述

事件系统采用观察者模式，包含以下核心概念：

- **事件（Event）**：表示系统中发生的某个动作或状态变化
- **监听器（Listener）**：响应特定事件的处理逻辑
- **事件调度器（Dispatcher）**：负责事件的分发和监听器的调用

## 系统内置监听器

MineAdmin 提供了多个内置监听器来处理系统核心功能：

| 监听器                             | 功能描述                                                      | 状态 | 配置文件位置 |
|---------------------------------|------------------------------------------------------------|------|------------|
| ErrorExceptionHandler           | 错误异常处理器，将符合条件的错误转换为异常抛出                                   | 默认启用 | `config/autoload/exceptions.php` |
| UploadSubscriber                | 文件上传事件订阅器，处理文件上传相关的业务逻辑                                   | 默认启用 | `config/autoload/listeners.php` |
| BootApplicationSubscriber       | 应用启动订阅器，在程序启动时注册数据库迁移和种子文件目录                           | 默认启用 | `config/autoload/listeners.php` |
| DbQueryExecutedSubscriber       | 数据库查询监听器，根据环境配置记录和输出 SQL 执行信息                            | 可配置 | `config/autoload/listeners.php` |
| FailToHandleSubscriber          | 命令执行失败监听器，当控制台命令执行失败时记录错误信息                             | 默认启用 | `config/autoload/listeners.php` |
| ResumeExitCoordinatorSubscriber | 进程退出协调器，处理 Worker 进程的优雅退出                                | 默认启用 | `config/autoload/listeners.php` |
| QueueHandleSubscriber           | 队列处理监听器，监听队列任务的执行状态并记录相关信息                             | 默认启用 | `config/autoload/listeners.php` |
| RegisterBlueprintListener       | 蓝图注册监听器，用于注册新的 API 蓝图方法                                 | 默认启用 | `config/autoload/listeners.php` |

## 创建自定义事件

### 1. 定义事件类

创建事件类文件 `app/Event/UserRegisteredEvent.php`：

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

### 2. 创建事件监听器

创建监听器文件 `app/Listener/UserRegisteredListener.php`：

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
            // 发送欢迎邮件
            $this->sendWelcomeEmail($event->email, $event->username);
            
            // 记录用户注册日志
            $this->logUserRegistration($event->userId, $event->username);
            
            // 初始化用户默认设置
            $this->initializeUserSettings($event->userId);
        }
    }

    private function sendWelcomeEmail(string $email, string $username): void
    {
        // 邮件发送逻辑
    }

    private function logUserRegistration(int $userId, string $username): void
    {
        // 日志记录逻辑
    }

    private function initializeUserSettings(int $userId): void
    {
        // 用户设置初始化逻辑
    }
}
```

### 3. 触发事件

在业务代码中触发事件：

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
        // 用户注册逻辑
        $userId = $this->createUser($userData);
        
        // 触发用户注册事件
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
        // 实际的用户创建逻辑
        return 123; // 示例返回值
    }

    private function getClientIp(): string
    {
        // 获取客户端 IP 地址
        return '192.168.1.1'; // 示例返回值
    }
}
```

## 异步事件处理

对于耗时的事件处理，可以使用队列进行异步处理：

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
            // 异步处理耗时任务
            $this->handleAsync($event->userId, $event->email);
        }
    }

    #[AsyncQueueMessage]
    public function handleAsync(int $userId, string $email): void
    {
        // 这里的代码将在队列中异步执行
        // 例如：发送复杂的欢迎邮件、生成报告等
        sleep(5); // 模拟耗时操作
        echo "异步处理用户 {$userId} 的注册后续任务完成\n";
    }
}
```

## 事件监听器优先级

可以通过设置优先级来控制监听器的执行顺序：

```php
<?php

#[Listener(priority: 100)] // 数值越大，优先级越高
class HighPriorityListener implements ListenerInterface
{
    // ...
}

#[Listener(priority: 1)] // 优先级较低
class LowPriorityListener implements ListenerInterface
{
    // ...
}
```

## 配置管理

### 监听器配置

在 `config/autoload/listeners.php` 中配置监听器：

```php
<?php

return [
    // 手动注册监听器（不使用注解时）
    \App\Listener\UserRegisteredListener::class,
    
    // 条件性注册监听器
    env('ENABLE_USER_TRACKING', false) ? \App\Listener\UserTrackingListener::class : null,
];
```

### 事件调试

在开发环境中启用事件调试，在 `.env` 文件中设置：

```env
# 启用事件调试日志
EVENT_DEBUG=true

# 数据库查询日志
DB_QUERY_LOG=true
```

## 最佳实践

### 1. 事件命名规范
- 事件类使用过去式命名：`UserRegisteredEvent`、`OrderCreatedEvent`
- 监听器使用现在式命名：`SendWelcomeEmailListener`、`UpdateUserStatusListener`

### 2. 事件数据结构
- 保持事件数据的不可变性
- 只包含必要的数据，避免传递大对象
- 使用只读属性或构造器注入

### 3. 错误处理
```php
public function process(object $event): void
{
    try {
        // 事件处理逻辑
        $this->handleEvent($event);
    } catch (\Throwable $e) {
        // 记录错误日志，但不阻断其他监听器
        logger()->error('事件处理失败', [
            'event' => get_class($event),
            'listener' => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
```

### 4. 性能优化
- 对于非关键业务使用异步队列处理
- 避免在监听器中执行过重的数据库操作
- 合理使用事件优先级避免依赖关系复杂化

## 调试和测试

### 事件测试示例

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
        
        // 模拟监听器处理
        $listener->process($event);
        
        // 断言处理结果
        $this->assertTrue(true); // 根据实际业务逻辑编写断言
    }
}
```

## 相关文档

- [Hyperf 事件文档](https://hyperf.wiki/3.1/#/zh-cn/event)
- [异步队列文档](https://hyperf.wiki/3.1/#/zh-cn/async-queue)





