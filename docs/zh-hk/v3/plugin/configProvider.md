# ConfigProvider 説明

如何配置ConfigProvider，發佈應用自己的配置文件

---

## 機制説明

**本套機制衍生於Hyperf的ConfigProvier機制**

`ConfigProvider` 機制對於 `Hyperf` 組件化來説是個非常重要的機制，`組件間的解耦` 和 `組件的獨立性` 以及 `組件的可重用性` 都是基於這個機制才得以實現。

簡單來説，就是每個組件都會提供一個 `ConfigProvider`，通常是在組件的根目錄提供一個 `ConfigProvider` 的類，`ConfigProvider`
會提供對應組件的所有配置信息，這些信息都會被 `Hyperf` 框架在啓動時加載，最終 `ConfigProvider` 內的配置信息會被合併到
`Hyperf\Contract\ConfigInterface` 對應的實現類去，從而實現各個組件在 `Hyperf` 框架下使用時要進行的配置初始化。

`ConfigProvider` 本身不具備任何依賴，不繼承任何的抽象類和不要求實現任何的接口，只需提供一個 `__invoke` 方法並返回一個對應配置結構的數組即可。

## 發佈自己的配置文件

只需要在數組結構中定義了 `publish` 項，設置好以下幾個參數即可，再安裝`MineAdmin`應用時，這些配置文件會自動發佈到`config/autoload`目錄裏去
具體的可查看後面的示例代碼
- id
- description
- source
- destination

::: tip

合併到配置文件並不是物理合併，而是在系統啓動時，hyperf把配置在內存中合併了，可通過獲取配置文件的函數打印就明白了。

:::

## ConfigProvider 示例

以下是一個示例

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
            // 合併到  config/autoload/annotations.php 文件
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            // 合併到  config/autoload/dependencies.php 文件
            'dependencies' => [],
             // 默認 Command 的定義，換個方式理解也就是與 config/autoload/commands.php 對應
            'commands' => [],
            // 與 commands 類似
            'listeners' => [],
            
            // 組件默認配置文件，即執行命令後會把 source 的對應的文件複製為 destination 對應的的文件
            'publish' => [
                [
                    'id' => 'config',
                    'description' => 'description of this config file.', // 描述
                    // 建議默認配置放在 publish 文件夾中，文件命名和組件名稱相同
                    'source' => __DIR__ . '/../publish/appstore.php',  // 對應的配置文件路徑
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // 複製為這個路徑下的該文件
                ],
            ],
        ];
    }
}

```