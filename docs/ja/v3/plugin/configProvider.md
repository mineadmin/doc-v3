# ConfigProvider 説明

ConfigProvider の設定方法と、アプリケーション独自の設定ファイルの公開方法

---

## 仕組みの説明

**本仕組みは Hyperf の ConfigProvider メカニズムに由来しています**

`ConfigProvider` メカニズムは `Hyperf` のコンポーネント化において非常に重要な仕組みであり、`コンポーネント間の疎結合`、`コンポーネントの独立性`、および `コンポーネントの再利用性` は、このメカニズムに基づいて実現されています。

簡単に言えば、各コンポーネントは `ConfigProvider` を提供します。通常はコンポーネントのルートディレクトリに `ConfigProvider` クラスを配置し、`ConfigProvider` が対応するコンポーネントの全ての設定情報を提供します。これらの情報は `Hyperf` フレームワークの起動時に読み込まれ、最終的に `ConfigProvider` 内の設定情報は `Hyperf\Contract\ConfigInterface` に対応する実装クラスにマージされ、各コンポーネントが `Hyperf` フレームワークで使用される際の設定初期化が行われます。

`ConfigProvider` 自体は依存関係を持たず、抽象クラスを継承したり、インターフェースを実装する必要もなく、`__invoke` メソッドを提供し、対応する設定構造の配列を返すだけで十分です。

## 独自の設定ファイルの公開

配列構造内で `publish` 項目を定義し、以下のパラメータを設定するだけで、`MineAdmin` アプリケーションをインストールする際に、これらの設定ファイルは自動的に `config/autoload` ディレクトリに公開されます。詳細は以下のサンプルコードを参照してください。
- id
- description
- source
- destination

::: tip

設定ファイルへのマージは物理的なマージではなく、システム起動時に hyperf がメモリ上で設定をマージします。設定ファイルを取得する関数を使用して出力すると理解できます。

:::

## ConfigProvider のサンプル

以下はサンプルです

```php [ConfigProvider.php]
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
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
             // デフォルトの Command 定義、別の言い方をすれば config/autoload/commands.php に対応
            'commands' => [],
            // commands と同様
            'listeners' => [],
            
            // コンポーネントのデフォルト設定ファイル、コマンド実行後に source の対応ファイルを destination の対応ファイルにコピー
            'publish' => [
                [
                    'id' => 'config',
                    'description' => 'この設定ファイルの説明。', // 説明
                    // デフォルト設定は publish フォルダに配置し、ファイル名はコンポーネント名と同じにすることを推奨
                    'source' => __DIR__ . '/../publish/appstore.php',  // 対応する設定ファイルのパス
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // このパスのファイルにコピー
                ],
            ],
        ];
    }
}

```