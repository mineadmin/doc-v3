# ConfigProvider 说明

如何配置ConfigProvider，发布应用自己的配置文件

---

## 机制说明

**本套机制衍生于Hyperf的ConfigProvier机制**

`ConfigProvider` 机制对于 `Hyperf` 组件化来说是个非常重要的机制，`组件间的解耦` 和 `组件的独立性` 以及 `组件的可重用性` 都是基于这个机制才得以实现。

简单来说，就是每个组件都会提供一个 `ConfigProvider`，通常是在组件的根目录提供一个 `ConfigProvider` 的类，`ConfigProvider`
会提供对应组件的所有配置信息，这些信息都会被 `Hyperf` 框架在启动时加载，最终 `ConfigProvider` 内的配置信息会被合并到
`Hyperf\Contract\ConfigInterface` 对应的实现类去，从而实现各个组件在 `Hyperf` 框架下使用时要进行的配置初始化。

`ConfigProvider` 本身不具备任何依赖，不继承任何的抽象类和不要求实现任何的接口，只需提供一个 `__invoke` 方法并返回一个对应配置结构的数组即可。

## 发布自己的配置文件

只需要在数组结构中定义了 `publish` 项，设置好以下几个参数即可，再安装`MineAdmin`应用时，这些配置文件会自动发布到`config/autoload`目录里去
具体的可查看后面的示例代码
- id
- description
- source
- destination

::: tip

合并到配置文件并不是物理合并，而是在系统启动时，hyperf把配置在内存中合并了，可通过获取配置文件的函数打印就明白了。

:::

## ConfigProvider 示例

以下是一个示例

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
            // 合并到  config/autoload/annotations.php 文件
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            // 合并到  config/autoload/dependencies.php 文件
            'dependencies' => [],
             // 默认 Command 的定义，换个方式理解也就是与 config/autoload/commands.php 对应
            'commands' => [],
            // 与 commands 类似
            'listeners' => [],
            
            // 组件默认配置文件，即执行命令后会把 source 的对应的文件复制为 destination 对应的的文件
            'publish' => [
                [
                    'id' => 'config',
                    'description' => 'description of this config file.', // 描述
                    // 建议默认配置放在 publish 文件夹中，文件命名和组件名称相同
                    'source' => __DIR__ . '/../publish/appstore.php',  // 对应的配置文件路径
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // 复制为这个路径下的该文件
                ],
            ],
        ];
    }
}

```