# Event Handler

MineAdmin's event system is built on [hyperf/event](https://github.com/hyperf/event), providing a powerful event-driven mechanism. The event system allows loose coupling communication between different parts of the application, improving code maintainability and extensibility.

## Overview

The event system adopts the observer pattern and includes the following core concepts:

- **Event**: Represents an action or state change occurring in the system
- **Listener**: Processing logic that responds to specific events
- **Dispatcher**: Responsible for dispatching events and invoking listeners

## System Built-in Listeners

MineAdmin provides multiple built-in listeners to handle core system functions:

| Listener                          | Function Description                                              | Status | Configuration File Location |
|-----------------------------------|------------------------------------------------------------------|--------|------------------------------|
| ErrorExceptionHandler             | Error exception handler, converts eligible errors to thrown exceptions | Enabled by default | `config/autoload/exceptions.php` |
| UploadSubscriber                  | File upload event subscriber, handles file upload related business logic | Enabled by default | `config/autoload/listeners.php` |
| BootApplicationSubscriber         | Application startup subscriber, registers database migration and seed file directories during program startup | Enabled by default | `config/autoload/listeners.php` |
| DbQueryExecutedSubscriber         | Database query listener, records and outputs SQL execution information based on environment configuration | Configurable | `config/autoload/listeners.php` |
| FailToHandleSubscriber            | Command execution failure listener, logs error information when console commands fail | Enabled by default | `config/autoload/listeners.php` |
| ResumeExitCoordinatorSubscriber   | Process exit coordinator, handles graceful exit of Worker processes | Enabled by default | `config/autoload/listeners.php` |
| QueueHandleSubscriber             | Queue processing listener, monitors queue task execution status and records related information | Enabled by default | `config/autoload/listeners.php` |
| RegisterBlueprintListener         | Blueprint registration listener, used to register new API blueprint methods | Enabled by default | `config/autoload/listeners.php` |

## Creating Custom Events

### 1. Define Event Class

Create the event class file `app/Event/UserRegisteredEvent.php`:

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

### 2. Create Event Listener

Create the listener file `app/Listener/UserRegisteredListener.php`:

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
            // Send welcome email
            $this->sendWelcomeEmail($event->email, $event->username);
            
            // Log user registration
            $this->logUserRegistration($event->userId, $event->username);
            
            // Initialize user default settings
            $this->initializeUserSettings($event->userId);
        }
    }

    private function sendWelcomeEmail(string $email, string $username): void
    {
        // Email sending logic
    }

    private function logUserRegistration(int $userId, string $username): void
    {
        // Logging logic
    }

    private function initializeUserSettings(int $userId): void
    {
        // User settings initialization logic
    }
}
```

### 3. Trigger Event

Trigger the event in business code:

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
        // User registration logic
        $userId = $this->createUser($userData);
        
        // Trigger user registration event
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
        // Actual user creation logic
        return 123; // Example return value
    }

    private function getClientIp(): string
    {
        // Get client IP address
        return '192.168.1.1'; // Example return value
    }
}
```

## Asynchronous Event Processing

For time-consuming event processing, use queues for asynchronous handling:

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
            // Asynchronous processing of time-consuming tasks
            $this->handleAsync($event->userId, $event->email);
        }
    }

    #[AsyncQueueMessage]
    public function handleAsync(int $userId, string $email): void
    {
        // Code here will execute asynchronously in the queue
        // For example: sending complex welcome emails, generating reports, etc.
        sleep(5); // Simulate time-consuming operation
        echo "Asynchronous processing of subsequent tasks for user {$userId} registration completed\n";
    }
}
```

## Event Listener Priority

Priority can be set to control the execution order of listeners:

```php
<?php

#[Listener(priority: 100)] // Higher value = higher priority
class HighPriorityListener implements ListenerInterface
{
    // ...
}

#[Listener(priority: 1)] // Lower priority
class LowPriorityListener implements ListenerInterface
{
    // ...
}
```

## Configuration Management

### Listener Configuration

Configure listeners in `config/autoload/listeners.php`:

```php
<?php

return [
    // Manual listener registration (when not using annotations)
    \App\Listener\UserRegisteredListener::class,
    
    // Conditional listener registration
    env('ENABLE_USER_TRACKING', false) ? \App\Listener\UserTrackingListener::class : null,
];
```

### Event Debugging

Enable event debugging in development environment, set in `.env` file:

```env
# Enable event debug logging
EVENT_DEBUG=true

# Database query logging
DB_QUERY_LOG=true
```

## Best Practices

### 1. Event Naming Conventions
- Event classes use past tense: `UserRegisteredEvent`, `OrderCreatedEvent`
- Listeners use present tense: `SendWelcomeEmailListener`, `UpdateUserStatusListener`

### 2. Event Data Structure
- Keep event data immutable
- Only include necessary data, avoid passing large objects
- Use read-only properties or constructor injection

### 3. Error Handling
```php
public function process(object $event): void
{
    try {
        // Event handling logic
        $this->handleEvent($event);
    } catch (\Throwable $e) {
        // Log error but don't block other listeners
        logger()->error('Event handling failed', [
            'event' => get_class($event),
            'listener' => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
```

### 4. Performance Optimization
- Use asynchronous queue processing for non-critical business
- Avoid heavy database operations in listeners
- Use event priorities wisely to avoid complex dependency relationships

## Debugging and Testing

### Event Test Example

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
        
        // Simulate listener processing
        $listener->process($event);
        
        // Assert processing result
        $this->assertTrue(true); // Write assertions based on actual business logic
    }
}
```

## Related Documentation

- [Hyperf Event Documentation](https://hyperf.wiki/3.1/#/zh-cn/event)
- [Async Queue Documentation](https://hyperf.wiki/3.1/#/zh-cn/async-queue)