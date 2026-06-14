# ConfigProvider Description

How to configure ConfigProvider and publish your own application configuration files

---

## Mechanism Description

**This mechanism is derived from Hyperf's ConfigProvider mechanism**

The `ConfigProvider` mechanism is a crucial part of componentization in `Hyperf`. It enables `decoupling between components`, `component independence`, and `component reusability`.

Simply put, each component provides a `ConfigProvider`, typically a class located in the component's root directory. `ConfigProvider` supplies all configuration information for the corresponding component. This information is loaded by the `Hyperf` framework at startup and merged into the implementation class corresponding to `Hyperf\Contract\ConfigInterface`, thereby initializing the configuration for each component when used within the `Hyperf` framework.

`ConfigProvider` has no dependencies, does not inherit any abstract classes, and does not require implementing any interfaces. It only needs to provide a `__invoke` method that returns an array with the corresponding configuration structure.

## Publishing Your Own Configuration Files

Simply define the `publish` item in the array structure and set the following parameters. When installing a `MineAdmin` application, these configuration files will be automatically published to the `config/autoload` directory. Refer to the example code below for details.
- id
- description
- source
- destination

::: tip

Merging into configuration files is not a physical merge. Instead, Hyperf merges the configurations in memory when the system starts. You can understand this by using the configuration file retrieval function to print the configuration.

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
            // Merge into config/autoload/annotations.php file
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            // Merge into config/autoload/dependencies.php file
            'dependencies' => [],
             // Default Command definitions, corresponds to config/autoload/commands.php
            'commands' => [],
            // Similar to commands
            'listeners' => [],
            
            // Default component configuration files. After executing the command, the file specified by source will be copied to the location specified by destination.
            'publish' => [
                [
                    'id' => 'config',
                    'description' => 'description of this config file.', // Description
                    // It is recommended to place default configurations in the publish folder, with the file named after the component.
                    'source' => __DIR__ . '/../publish/appstore.php',  // Path to the corresponding configuration file
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // Copy to this path
                ],
            ],
        ];
    }
}

```