# ConfigProvider Explanation

How to configure ConfigProvider and publish your own configuration files

---

## Mechanism Explanation

**This mechanism is derived from Hyperf's ConfigProvider mechanism**

The `ConfigProvider` mechanism is crucial for the componentization of `Hyperf`. The `decoupling between components`, `independence of components`, and `reusability of components` are all achieved based on this mechanism.

In simple terms, each component provides a `ConfigProvider`, usually in the form of a `ConfigProvider` class located in the root directory of the component. The `ConfigProvider` contains all the configuration information for the corresponding component. This information is loaded by the `Hyperf` framework at startup, and eventually, the configuration information within the `ConfigProvider` is merged into the implementation class of `Hyperf\Contract\ConfigInterface`. This allows each component to initialize its configuration when used within the `Hyperf` framework.

The `ConfigProvider` itself has no dependencies, does not inherit any abstract classes, and does not require the implementation of any interfaces. It only needs to provide an `__invoke` method and return an array with the corresponding configuration structure.

## Publishing Your Own Configuration Files

You only need to define the `publish` item in the array structure and set the following parameters. When installing the `MineAdmin` application, these configuration files will be automatically published to the `config/autoload` directory. Refer to the example code below for details:
- id
- description
- source
- destination

::: tip

The merging into the configuration file is not a physical merge. Instead, Hyperf merges the configurations in memory when the system starts. You can understand this by printing the configuration file using the configuration retrieval function.

:::

## ConfigProvider Example

Below is an example:

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
            // Merge into config/autoload/annotations.php
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            // Merge into config/autoload/dependencies.php
            'dependencies' => [],
            // Default Command definitions, similar to config/autoload/commands.php
            'commands' => [],
            // Similar to commands
            'listeners' => [],
            
            // Default component configuration files, which will be copied from source to destination when the command is executed
            'publish' => [
                [
                    'id' => 'config',
                    'description' => 'description of this config file.', // Description
                    // It is recommended to place default configurations in the publish folder, with the file name matching the component name
                    'source' => __DIR__ . '/../publish/appstore.php',  // Path to the corresponding configuration file
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // Copy to this path
                ],
            ],
        ];
    }
}
```