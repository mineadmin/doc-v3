# ConfigProvider 說明

如何配置ConfigProvider，釋出應用自己的配置檔案

---

## 機制說明

**本套機制衍生於Hyperf的ConfigProvier機制**

`ConfigProvider` 機制對於 `Hyperf` 元件化來說是個非常重要的機制，`元件間的解耦` 和 `元件的獨立性` 以及 `元件的可重用性` 都是基於這個機制才得以實現。

簡單來說，就是每個元件都會提供一個 `ConfigProvider`，通常是在元件的根目錄提供一個 `ConfigProvider` 的類，`ConfigProvider`
會提供對應元件的所有配置資訊，這些資訊都會被 `Hyperf` 框架在啟動時載入，最終 `ConfigProvider` 內的配置資訊會被合併到
`Hyperf\Contract\ConfigInterface` 對應的實現類去，從而實現各個元件在 `Hyperf` 框架下使用時要進行的配置初始化。

`ConfigProvider` 本身不具備任何依賴，不繼承任何的抽象類和不要求實現任何的介面，只需提供一個 `__invoke` 方法並返回一個對應配置結構的陣列即可。

## 釋出自己的配置檔案

只需要在陣列結構中定義了 `publish` 項，設定好以下幾個引數即可，再安裝`MineAdmin`應用時，這些配置檔案會自動釋出到`config/autoload`目錄裡去
具體的可檢視後面的示例程式碼
- id
- description
- source
- destination

::: tip

合併到配置檔案並不是物理合併，而是在系統啟動時，hyperf把配置在記憶體中合併了，可透過獲取配置檔案的函式列印就明白了。

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
            // 合併到  config/autoload/annotations.php 檔案
            'annotations' => [
                'scan' => [
                    'paths' => [
                        __DIR__,
                    ],
                ],
            ],
            // 合併到  config/autoload/dependencies.php 檔案
            'dependencies' => [],
             // 預設 Command 的定義，換個方式理解也就是與 config/autoload/commands.php 對應
            'commands' => [],
            // 與 commands 類似
            'listeners' => [],
            
            // 元件預設配置檔案，即執行命令後會把 source 的對應的檔案複製為 destination 對應的的檔案
            'publish' => [
                [
                    'id' => 'config',
                    'description' => 'description of this config file.', // 描述
                    // 建議預設配置放在 publish 資料夾中，檔案命名和元件名稱相同
                    'source' => __DIR__ . '/../publish/appstore.php',  // 對應的配置檔案路徑
                    'destination' => BASE_PATH . '/config/autoload/appstore.php', // 複製為這個路徑下的該檔案
                ],
            ],
        ];
    }
}

```