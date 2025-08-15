# トラブルシューティング

## よくある問題の診断

### 1. 権限ポリシーが有効にならない

**問題現象**: ユーザーがデータ権限ポリシーを設定したが、クエリ結果にはすべてのデータが表示される

**調査手順**:

#### 1.1 ユーザーがスーパー管理者かどうかを確認

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php:37-39
$user = User::find($userId);

// スーパー管理者はすべてのデータ権限チェックを自動的にスキップ
if ($user->isSuperAdmin()) {
    echo "ユーザーはスーパー管理者であり、すべてのデータ権限チェックをバイパスします";
}
```

#### 1.2 ユーザーポリシー設定を確認

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Model/Permission/User.php:160-179
$user = User::find($userId);

// ユーザーの直接ポリシーを確認
$userPolicy = $user->policy()->first();
if ($userPolicy) {
    echo "ユーザーポリシーが存在します:";
    var_dump([
        'policy_type' => $userPolicy->policy_type,
        'value' => $userPolicy->value,
        'is_default' => $userPolicy->is_default
    ]);
} else {
    echo "ユーザーに直接ポリシーがありません、役職ポリシーを確認します:";
    
    // 役職ポリシーを確認
    $user->load('position');
    foreach ($user->position as $position) {
        $positionPolicy = $position->policy()->first();
        if ($positionPolicy) {
            echo "役職ポリシーが見つかりました:";
            var_dump([
                'position_id' => $position->id,
                'position_name' => $position->name,
                'policy_type' => $positionPolicy->policy_type,
                'value' => $positionPolicy->value
            ]);
            break;
        }
    }
}
```

#### 1.3 DataScopeアノテーション設定を検証

メソッドに正しいDataScopeアノテーションがあることを確認:

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Service/Permission/UserService.php:94-98
use App\Library\DataPermission\Attribute\DataScope;
use App\Library\DataPermission\ScopeType;

class UserService
{
    #[DataScope(
        scopeType: ScopeType::CREATED_BY,
        onlyTables: ['user'],
        createdByColumn: 'id'
    )]
    public function page(array $params, int $page = 1, int $pageSize = 10): array
    {
        return parent::page($params, $page, $pageSize);
    }
}
```

#### 1.4 データ権限コンテキストを確認

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use App\Library\DataPermission\Context;

// 現在のコンテキスト設定を確認
$context = [
    'dept_column' => Context::getDeptColumn(),
    'created_by_column' => Context::getCreatedByColumn(),
    'scope_type' => Context::getScopeType(),
    'only_tables' => Context::getOnlyTables()
];

var_dump($context);
```

### 2. コルーチンコンテキストの喪失

**問題現象**: コルーチン内でデータ権限設定が失われる

**解決策**:

新しいコルーチンでコンテキストを再設定:

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Context.php
use Hyperf\Utils\Coroutine;
use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;

// 正しいコルーチンコンテキスト処理
Coroutine::create(function () use ($userId) {
    // 新しいコルーチンでデータ権限コンテキストを再設定
    Context::setDeptColumn('dept_id');
    Context::setCreatedByColumn('created_by');
    Context::setScopeType(ScopeType::DEPT_CREATED_BY);
    Context::setOnlyTables(['user']);
    
    // ビジネスロジックを実行
    $result = UserService::page($params);
});
```

### 3. クエリパフォーマンスの問題

**問題現象**: データ権限を有効にするとクエリ速度が明らかに低下する

#### 3.1 必要なデータベースインデックスを追加

```sql
-- 基本インデックス（実際のテーブル構造に応じて調整）
CREATE INDEX idx_user_dept_id ON user(dept_id);
CREATE INDEX idx_user_created_by ON user(created_by);
CREATE INDEX idx_dept_parent_id ON department(parent_id);

-- データ権限ポリシー関連のインデックス
CREATE INDEX idx_policy_user_id ON data_permission_policy(user_id);
CREATE INDEX idx_policy_position_id ON data_permission_policy(position_id);
CREATE INDEX idx_policy_type ON data_permission_policy(policy_type);

-- 複合クエリを最適化する複合インデックス
CREATE INDEX idx_user_dept_created ON user(dept_id, created_by);
```

#### 3.2 SQLクエリログを有効にして分析

```php
// デバッグ環境でクエリログを有効化
use Hyperf\Database\Model\Events\QueryExecuted;
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;

#[Listener]
class QueryListener implements ListenerInterface
{
    public function listen(): array
    {
        return [QueryExecuted::class];
    }

    public function process(object $event)
    {
        if ($event instanceof QueryExecuted) {
            // スロークエリを記録（100ms以上）
            if ($event->time > 100) {
                Logger::warning('スロークエリ検出', [
                    'sql' => $event->sql,
                    'bindings' => $event->bindings,
                    'time' => $event->time . 'ms'
                ]);
            }
        }
    }
}
```

#### 3.3 部門ツリークエリの最適化

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Model/Permission/Department.php の getFlatChildren メソッドを最適化
use Hyperf\Database\Model\Collection;
use Hyperf\DbConnection\Db;

class Department extends Model
{
    // 再帰CTEを使用して部門ツリークエリを最適化
    public function getFlatChildrenOptimized(): Collection
    {
        $sql = "
            WITH RECURSIVE dept_tree AS (
                SELECT id, parent_id, name, 0 as level
                FROM department 
                WHERE id = ?
                
                UNION ALL
                
                SELECT d.id, d.parent_id, d.name, dt.level + 1
                FROM department d
                INNER JOIN dept_tree dt ON d.parent_id = dt.id
                WHERE dt.level < 10  -- 無限再帰を防止
            )
            SELECT * FROM dept_tree ORDER BY level, id
        ";
        
        $results = Db::select($sql, [$this->id]);
        return new Collection($results);
    }
}
```

### 4. データ不整合問題

**問題現象**: 同じユーザーが異なる時間にクエリしたデータが一致しない

#### 4.1 関連キャッシュをクリア

```php
// キャッシュを使用している場合、適時にクリアする必要がある
use Hyperf\Cache\Cache;

function clearDataPermissionCache(int $userId): void
{
    $cache = ApplicationContext::getContainer()->get(Cache::class);
    
    // ユーザーポリシーキャッシュをクリア
    $cache->delete("user_policy_{$userId}");
    
    // 部門ツリーキャッシュをクリア
    $user = User::find($userId);
    if ($user && $user->department) {
        foreach ($user->department as $dept) {
            $cache->delete("dept_tree_{$dept->id}");
        }
    }
}
```

#### 4.2 データベースから強制的に再読み込み

```php
// データベースからユーザーと関連データを強制的に再読み込み
$user = User::find($userId);
$user->refresh(); // ユーザーデータをリフレッシュ
$user->load(['policy', 'position.policy', 'department']); // 関連データを再読み込み

// 最新のポリシーを取得
$policy = $user->getPolicy();
```

### 5. AOPアスペクトが有効にならない

**問題現象**: DataScopeアノテーションが機能しない

#### 5.1 AOP設定を確認

```php
// config/autoload/annotations.php でAOPが正しく設定されているか確認
return [
    'scan' => [
        'paths' => [
            BASE_PATH . '/app',
        ],
        'ignore_annotations' => [
            'mixin',
        ],
        'class_map' => [],
    ],
];
```

#### 5.2 アスペクトクラスの存在を確認

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Aspects/DataScopeAspect.php ファイルが存在することを確認
use App\Library\DataPermission\Aspects\DataScopeAspect;

// アスペクトが正しく登録されているか確認
if (class_exists(DataScopeAspect::class)) {
    echo "DataScopeAspect クラスが存在します";
} else {
    echo "DataScopeAspect クラスが存在しません、ファイルパスを確認してください";
}
```

### 6. デバッグ方法

#### 6.1 デバッグモードを有効化

```php
// デバッグが必要な場所にログを追加
use Hyperf\Logger\LoggerFactory;
use Hyperf\Utils\ApplicationContext;

$logger = ApplicationContext::getContainer()->get(LoggerFactory::class)->get('data_permission');

// 現在のユーザー情報を記録
$logger->debug('データ権限デバッグ', [
    'user_id' => $userId,
    'is_super_admin' => $user->isSuperAdmin(),
    'user_policy' => $user->policy ? $user->policy->toArray() : null,
    'position_policies' => $user->position->map(function ($pos) {
        return $pos->policy ? $pos->policy->toArray() : null;
    })->filter()->toArray()
]);
```

#### 6.2 手動で権限フィルタリングを確認

```php
// 出典: /Users/zhuzhu/project/mineadmin/app/Library/DataPermission/Factory.php
use App\Library\DataPermission\Factory;
use App\Model\Permission\User;
use Hyperf\Database\Query\Builder;

function testDataPermission(int $userId): void
{
    $user = User::find($userId);
    $query = User::query();
    $builder = $query->getQuery();
    
    // 手動でデータ権限フィルタリングを適用
    $factory = new Factory();
    $factory->build($builder, $user);
    
    // 生成されたSQLを出力
    echo "生成された SQL: " . $builder->toSql() . PHP_EOL;
    echo "バインドパラメータ: " . json_encode($builder->getBindings()) . PHP_EOL;
    
    // クエリを実行して結果を確認
    $results = $query->get();
    echo "クエリ結果数: " . $results->count() . PHP_EOL;
}
```

### 7. よく使うチェックコマンド

簡単なチェックスクリプトを作成:

```php
// ファイル作成: check_data_permission.php
<?php

use App\Model\Permission\User;
use App\Model\DataPermission\Policy;
use App\Library\DataPermission\Context;

function checkDataPermissionStatus(int $userId): array
{
    $user = User::find($userId);
    if (!$user) {
        return ['error' => 'ユーザーが存在しません'];
    }
    
    $result = [
        'user_id' => $userId,
        'is_super_admin' => $user->isSuperAdmin(),
        'user_policy' => null,
        'position_policies' => [],
        'context' => [
            'dept_column' => Context::getDeptColumn(),
            'created_by_column' => Context::getCreatedByColumn(),
            'scope_type' => Context::getScopeType()?->value,
            'only_tables' => Context::getOnlyTables()
        ]
    ];
    
    // ユーザーポリシーを確認
    $userPolicy = $user->policy()->first();
    if ($userPolicy) {
        $result['user_policy'] = $userPolicy->toArray();
    }
    
    // 役職ポリシーを確認
    $user->load('position');
    foreach ($user->position as $position) {
        $positionPolicy = $position->policy()->first();
        if ($positionPolicy) {
            $result['position_policies'][] = [
                'position' => $position->toArray(),
                'policy' => $positionPolicy->toArray()
            ];
        }
    }
    
    return $result;
}

// 使用例
// $status = checkDataPermissionStatus(1);
// var_dump($status);
```

## まとめ

MineAdminのデータ権限問題を調査する際は、以下の順序で行うことを推奨します:

1. **スーパー管理者状態を確認** - スーパー管理者はすべての権限チェックをバイパス
2. **ポリシー設定を検証** - ユーザーまたは役職に正しい権限ポリシーがあることを確認  
3. **アノテーション設定を確認** - メソッド上のDataScopeアノテーションが正しいことを確認
4. **AOPが有効か検証** - アスペクトが正常にメソッド呼び出しをインターセプトできることを確認
5. **コルーチンコンテキストを確認** - 新しいコルーチンで権限コンテキストを再設定
6. **クエリパフォーマンスを分析** - 必要なデータベースインデックスを追加
7. **キャッシュをクリア** - データ変更後に適時に関連キャッシュをクリア

これらの実際のコードに基づく診断方法は、ほとんどのデータ権限関連の問題を効果的に解決できます。