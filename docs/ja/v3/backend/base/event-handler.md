# イベントハンドラ

MineAdmin のイベントシステムは [hyperf/event](https://github.com/hyperf/event) をベースに構築されており、強力なイベント駆動メカニズムを提供します。イベントシステムを使用すると、アプリケーションの異なる部分間で疎結合な通信が可能になり、コードの保守性と拡張性が向上します。

## 概要

イベントシステムはオブザーバーパターンを採用しており、以下のコアコンセプトを含みます：

- **イベント（Event）**：システム内で発生した特定のアクションや状態変化を表します
- **リスナー（Listener）**：特定のイベントに応答する処理ロジック
- **イベントディスパッチャー（Dispatcher）**：イベントの配信とリスナーの呼び出しを担当します

## システム組み込みリスナー

MineAdmin はシステムのコア機能を処理するための複数の組み込みリスナーを提供しています：

| リスナー | 機能説明 | 状態 | 設定ファイルの場所 |
|---|---|---|---|
| ErrorExceptionHandler | エラー例外ハンドラ。条件を満たすエラーを例外に変換してスロー | デフォルトで有効 | `config/autoload/exceptions.php` |
| UploadSubscriber | ファイルアップロードイベントサブスクライバ。ファイルアップロードに関するビジネスロジックを処理 | デフォルトで有効 | `config/autoload/listeners.php` |
| BootApplicationSubscriber | アプリケーション起動サブスクライバ。プログラム起動時にデータベースマイグレーションとシードファイルのディレクトリを登録 | デフォルトで有効 | `config/autoload/listeners.php` |
| DbQueryExecutedSubscriber | データベースクエリリスナー。環境設定に応じて SQL 実行情報を記録・出力 | 設定可能 | `config/autoload/listeners.php` |
| FailToHandleSubscriber | コマンド実行失敗リスナー。コンソールコマンドの実行に失敗した際にエラー情報を記録 | デフォルトで有効 | `config/autoload/listeners.php` |
| ResumeExitCoordinatorSubscriber | プロセス終了コーディネーター。Worker プロセスの正常終了を処理 | デフォルトで有効 | `config/autoload/listeners.php` |
| QueueHandleSubscriber | キュー処理リスナー。キュータスクの実行状態を監視し、関連情報を記録 | デフォルトで有効 | `config/autoload/listeners.php` |
| RegisterBlueprintListener | ブループリント登録リスナー。新しい API ブループリントメソッドを登録 | デフォルトで有効 | `config/autoload/listeners.php` |

## カスタムイベントの作成

### 1. イベントクラスの定義

イベントクラスファイル `app/Event/UserRegisteredEvent.php` を作成します：

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

リスナーファイル `app/Listener/UserRegisteredListener.php` を作成します：

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
            // ウェルカムメールの送信
            $this->sendWelcomeEmail($event->email, $event->username);
            
            // ユーザー登録ログの記録
            $this->logUserRegistration($event->userId, $event->username);
            
            // ユーザーのデフォルト設定の初期化
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
        // ユーザー設定の初期化ロジック
    }
}
```

### 3. イベントのトリガー

ビジネスコード内でイベントをトリガーします：

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
        
        // ユーザー登録イベントをトリガー
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
        // クライアント IP アドレスの取得
        return '192.168.1.1'; // サンプル戻り値
    }
}
```

## 非同期イベント処理

時間のかかるイベント処理には、キューを使用した非同期処理が可能です：

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
            // 時間のかかるタスクを非同期処理
            $this->handleAsync($event->userId, $event->email);
        }
    }

    #[AsyncQueueMessage]
    public function handleAsync(int $userId, string $email): void
    {
        // ここのコードはキュー内で非同期に実行されます
        // 例：複雑なウェルカムメールの送信、レポートの生成など
        sleep(5); // 時間のかかる操作をシミュレート
        echo "ユーザー {$userId} の登録後タスクの非同期処理が完了しました\n";
    }
}
```

## イベントリスナーの優先順位

優先順位を設定することで、リスナーの実行順序を制御できます：

```php
<?php

#[Listener(priority: 100)] // 値が大きいほど優先順位が高い
class HighPriorityListener implements ListenerInterface
{
    // ...
}

#[Listener(priority: 1)] // 優先順位が低い
class LowPriorityListener implements ListenerInterface
{
    // ...
}
```

## 設定管理

### リスナーの設定

`config/autoload/listeners.php` でリスナーを設定します：

```php
<?php

return [
    // リスナーの手動登録（アノテーションを使用しない場合）
    \App\Listener\UserRegisteredListener::class,
    
    // 条件付きリスナー登録
    env('ENABLE_USER_TRACKING', false) ? \App\Listener\UserTrackingListener::class : null,
];
```

### イベントデバッグ

開発環境でイベントデバッグを有効にするには、`.env` ファイルで設定します：

```env
# イベントデバッグログの有効化
EVENT_DEBUG=true

# データベースクエリログ
DB_QUERY_LOG=true
```

## ベストプラクティス

### 1. イベント命名規則
- イベントクラスは過去形を使用：`UserRegisteredEvent`、`OrderCreatedEvent`
- リスナーは現在形を使用：`SendWelcomeEmailListener`、`UpdateUserStatusListener`

### 2. イベントデータ構造
- イベントデータの不変性を維持する
- 必要なデータのみを含め、大きなオブジェクトの受け渡しを避ける
- 読み取り専用プロパティまたはコンストラクター注入を使用する

### 3. エラー処理
```php
public function process(object $event): void
{
    try {
        // イベント処理ロジック
        $this->handleEvent($event);
    } catch (\Throwable $e) {
        // エラーログを記録するが、他のリスナーをブロックしない
        logger()->error('イベント処理に失敗しました', [
            'event' => get_class($event),
            'listener' => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
```

### 4. パフォーマンス最適化
- 重要でないビジネスには非同期キュー処理を使用する
- リスナー内で過度に重いデータベース操作を実行しない
- 依存関係の複雑化を避けるため、イベントの優先順位を適切に使用する

## デバッグとテスト

### イベントテストの例

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
        
        // リスナー処理をシミュレート
        $listener->process($event);
        
        // 処理結果をアサート
        $this->assertTrue(true); // 実際のビジネスロジックに基づいてアサーションを記述
    }
}
```

## 関連ドキュメント

- [Hyperf イベントドキュメント](https://hyperf.wiki/3.1/#/zh-cn/event)
- [非同期キュードキュメント](https://hyperf.wiki/3.1/#/zh-cn/async-queue)