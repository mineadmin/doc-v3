# ConfigProvider Explanation  

How to configure ConfigProvider and publish your own configuration files  

---  

## Mechanism Overview  

**This mechanism is derived from Hyperf's ConfigProvider mechanism.**  

The `ConfigProvider` mechanism is crucial for the componentization of `Hyperf`. Features such as `decoupling between components`, `component independence`, and `component reusability` are all achieved through this mechanism.  

In simple terms, each component provides a `ConfigProvider`, typically as a class located in the component's root directory. The `ConfigProvider` supplies all the configuration information for the corresponding component. This information is loaded by the `Hyperf` framework during startup, and the configurations from `ConfigProvider` are eventually merged into the implementation class of `Hyperf\Contract\ConfigInterface`. This ensures that each component's configurations are initialized when used within the `Hyperf` framework.  

The `ConfigProvider` itself has no dependencies, does not inherit any abstract classes, and does not require the implementation of any interfaces. It only needs to provide an `__invoke` method that returns an array with the corresponding configuration structure.  

## Publishing Your Own Configuration Files  

To publish your own configuration files, simply define a `publish` item in the array structure and set the following parameters. When installing the `MineAdmin` application, these configuration files will automatically be published to the `config/autoload` directory. Refer to the example code below for specifics:  
- `id`  
- `description`  
- `source`  
- `destination`  

::: tip  

The merging of configuration files is not physical but occurs in memory when the system starts. Hyperf merges the configurations during runtime. You can verify this by printing the results of configuration retrieval functions.  

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
            // Default Command definitions, analogous to config/autoload/commands.php  
            'commands' => [],  
            // Similar to commands  
            'listeners' => [],  
            
            // Default component configuration files. When the command is executed, the file specified in 'source' will be copied to the 'destination' path.  
            'publish' => [  
                [  
                    'id' => 'config',  
                    'description' => 'description of this config file.', // Description  
                    // It is recommended to place default configurations in the publish folder, with filenames matching the component name.  
                    'source' => __DIR__ . '/../publish/appstore.php',  // Path to the corresponding config file  
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // Copy to this path  
                ],  
            ],  
        ];  
    }  
}  
```