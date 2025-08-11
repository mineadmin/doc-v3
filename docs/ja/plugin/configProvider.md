# ConfigProvider 説明

ConfigProviderを設定し、アプリケーション独自の設定ファイルを公開する方法

---

## 仕組み説明

**この仕組みはHyperfのConfigProvider仕組みから派生しています**

`ConfigProvider` の仕組みは `Hyperf` のコンポーネント化において非常に重要な仕組みです。`コンポーネント間の疎結合` と `コンポーネントの独立性`、そして `コンポーネントの再利用性` はすべてこの仕組みによって実現されています。

簡単に言えば、各コンポーネントは `ConfigProvider` を提供し、通常はコンポーネントのルートディレクトリに `ConfigProvider` クラスを配置します。`ConfigProvider` は対応するコンポーネントのすべての設定情報を提供し、これらの情報は `Hyperf` フレームワークが起動時に読み込まれ、最終的に `ConfigProvider` 内の設定情報は `Hyperf\Contract\ConfigInterface` の実装クラスにマージされます。これにより、各コンポーネントが `Hyperf` フレームワークで使用される際に必要な設定の初期化が行われます。

`ConfigProvider` 自体には依存関係がなく、抽象クラスを継承したりインターフェースを実装したりする必要はありません。`__invoke` メソッドを提供し、対応する設定構造の配列を返すだけで十分です。

## 独自の設定ファイルを公開する

配列構造に `publish` 項目を定義し、以下のパラメータを設定するだけで、`MineAdmin` アプリケーションをインストールする際に、これらの設定ファイルが自動的に `config/autoload` ディレクトリに公開されます。具体的な例は後述のサンプルコードを参照してください。
- id
- description
- source
- destination

::: tip

設定ファイルへのマージは物理的なマージではなく、システム起動時にHyperfがメモリ内で設定をマージします。設定ファイルを取得する関数を実行して確認すれば理解できるでしょう。

:::

## ConfigProvider サンプル

以下はサンプルです。

```php [ConfigProvider.php]
<?php

declare(strict_types=1);
/**
 * このファイルはMineAdminの一部です。
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

namespace Plugin\MineAdmin\AppStore;

class ConfigProvider
{
    public function __invoke()
    {
        return [
            // config/autoload/annotations.php ファイルにマージ
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            // config/autoload/dependencies.php ファイルにマージ
            'dependencies' => [],
             // デフォルトのCommand定義、つまりconfig/autoload/commands.phpに対応
            'commands' => [],
            // commandsと同様
            'listeners' => [],
            
            // コンポーネントのデフォルト設定ファイル。コマンド実行後、sourceに対応するファイルがdestinationに対応するファイルとしてコピーされます
            'publish' => [
                [
                    'id' => 'config',
                    'description' => 'この設定ファイルの説明', // 説明
                    // デフォルト設定はpublishフォルダに配置し、ファイル名はコンポーネント名と同じにすることを推奨
                    'source' => __DIR__ . '/../publish/appstore.php',  // 対応する設定ファイルのパス
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // このパスのファイルとしてコピー
                ],
            ],
        ];
    }
}
```