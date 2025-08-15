# イベントハンドラ

MineAdmin のイベントシステムは [hyperf/event](https://github.com/hyperf/event) を基盤として構築されており、強力なイベント駆動メカニズムを提供します。イベントシステムにより、アプリケーションの異なる部分間で疎結合な通信が可能になり、コードの保守性と拡張性が向上します。

## 概要

イベントシステムはオブザーバーパターンを採用し、以下のコアコンセプトを含みます：

- **イベント（Event）**：システム内で発生したアクションや状態変化を表す
- **リスナー（Listener）**：特定のイベントに応答する処理ロジック
- **イベントディスパッチャ（Dispatcher）**：イベントの分配とリスナーの呼び出しを担当

## システム組み込みリスナー

MineAdmin はシステムコア機能を処理するための複数の組み込みリスナーを提供します：

| リスナー                             | 機能説明                                                      | 状態 | 設定ファイル位置 |
|---------------------------------|------------------------------------------------------------|------|------------|
| ErrorExceptionHandler           | エラー例外ハンドラ、条件に合致するエラーを例外に変換してスロー                         | デフォルト有効 | `config/autoload/exceptions.php` |
| UploadSubscriber                | ファイルアップロードイベントサブスクライバ、ファイルアップロード関連の業務ロジックを処理         | デフォルト有効 | `config/autoload/listeners.php` |
| BootApplicationSubscriber       | アプリケーション起動サブスクライバ、プログラム起動時にデータベースマイグレーションとシードファイルディレクトリを登録 | デフォルト有効 | `config/autoload/listeners.php` |
| DbQueryExecutedSubscriber       | データベースクエリリスナー、環境設定に基づいてSQL実行情報を記録・出力                 | 設定可能 | `config/autoload/listeners.php` |
| FailToHandleSubscriber          | コマンド実行失敗リスナー、コンソールコマンド実行失敗時にエラー情報を記録               | デフォルト有効 | `config/autoload/listeners.php` |
| ResumeExitCoordinatorSubscriber | プロセス終了コーディネータ、Workerプロセスのグレースフル終了を処理               | デフォルト有効 | `config/autoload/listeners.php` |
| QueueHandleSubscriber           | キュー処理リスナー、キュータスクの実行状態を監視し関連情報を記録                   | デフォルト有効 | `config/autoload/listeners.php` |
| RegisterBlueprintListener       | ブループリント登録リスナー、新しいAPIブループリントメソッドを登録                 | デフォルト有効 | `config/autoload/listeners.php` |

## カスタムイベントの作成

### 1. イベントクラスの定義

イベントクラスファイル `app/Event/UserRegisteredEvent.php` を作成：

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

### 2. イベントリスナーの作成

リスナーファイル `app/Listener/UserRegisteredListener.php` を作成：

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
            // ウェルカムメール送信
            $this->sendWelcomeEmail($event->email, $event->username);
            
            // ユーザー登録ログ記録
            $this->logUserRegistration($event->userId, $event->username);
            
            // ユーザー初期設定
            $this->initializeUserSettings($event->userId);
        }
    }

    private function sendWelcomeEmail(string $email, string $username): void
    {
        // メール送信ロジック
    }

    private function logUserRegistration(int $userId, string $username): void
    {
        // ログ記録ロジック
    }

    private function initializeUserSettings(int $userId): void
    {
        // ユーザー設定初期化ロジック
    }
}
```

### 3. イベントのトリガー

ビジネスコードでイベントをトリガー：

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
        // ユーザー登録ロジック
        $userId = $this->createUser($userData);
        
        // ユーザー登録イベントトリガー
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
        // 実際のユーザー作成ロジック
        return 123; // サンプル戻り値
    }

    private function getClientIp(): string
    {
        // クライアントIPアドレス取得
        return '192.168.1.1'; // サンプル戻り値
    }
}
```

## 非同期イベント処理

時間のかかるイベント処理にはキューを使用して非同期処理：

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
            // 非同期で時間のかかるタスクを処理
            $this->handleAsync($event->userId, $event->email);
        }
    }

    #[AsyncQueueMessage]
    public function handleAsync(int $userId, string $email): void
    {
        // このコードはキューで非同期実行される
        // 例：複雑なウェルカムメール送信、レポート生成など
        sleep(5); // 時間のかかる操作をシミュレート
        echo "ユーザー {$userId} の登録後続タスクが非同期で処理されました\n";
    }
}
```

## イベントリスナーの優先度

優先度を設定してリスナーの実行順序を制御：

```php
<?php

#[Listener(priority: 100)] // 数値が大きいほど優先度が高い
class HighPriorityListener implements ListenerInterface
{
    // ...
}

#[Listener(priority: 1)] // 優先度が低い
class LowPriorityListener implements ListenerInterface
{
    // ...
}
```

## 設定管理

### リスナー設定

`config/autoload/listeners.php` でリスナーを設定：

```php
<?php

return [
    // 手動リスナー登録（アノテーション不使用時）
    \App\Listener\UserRegisteredListener::class,
    
    // 条件付きリスナー登録
    env('ENABLE_USER_TRACKING', false) ? \App\Listener\UserTrackingListener::class : null,
];
```

### イベントデバッグ

開発環境でイベントデバッグを有効化、`.env` ファイルに設定：

```env
# イベントデバッグログ有効化
EVENT_DEBUG=true

# データベースクエリログ
DB_QUERY_LOG=true
```

## ベストプラクティス

### 1. イベント命名規則
- イベントクラスは過去形で命名：`UserRegisteredEvent`、`OrderCreatedEvent`
- リスナーは現在形で命名：`SendWelcomeEmailListener`、`UpdateUserStatusListener`

### 2. イベントデータ構造
- イベントデータの不変性を保持
- 必要なデータのみを含め、大きなオブジェクトを渡さない
- 読み取り専用プロパティまたはコンストラクタインジェクションを使用

### 3. エラー処理
```php
public function process(object $event): void
{
    try {
        // イベント処理ロジック
        $this->handleEvent($event);
    } catch (\Throwable $e) {
        // エラーログ記録（他のリスナーをブロックしない）
        logger()->error('イベント処理失敗', [
            'event' => get_class($event),
            'listener' => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
```

### 4. パフォーマンス最適化
- 非クリティカルな業務には非同期キュー処理を使用
- リスナー内で重いデータベース操作を実行しない
- 優先度を適切に使用して依存関係の複雑化を回避

## デバッグとテスト

### イベントテスト例

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
        
        // リスナー処理をモック
        $listener->process($event);
        
        // 処理結果をアサート
        $this->assertTrue(true); // 実際の業務ロジックに基づいてアサートを記述
    }
}
```

## 関連ドキュメント

- [Hyperf イベントドキュメント](https://hyperf.wiki/3.1/#/zh-cn/event)
- [非同期キュードキュメント](https://hyperf.wiki/3.1/#/zh-cn/async-queue)