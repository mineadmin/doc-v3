# mine.json 説明及示例

一個應用配置文件的完整示例以及説明

---

## 屬性列表説明

| 參數                   | 説明                                    | 示例                    |
|----------------------|---------------------------------------|-----------------------|
| name                 | 由 **用户名稱空間/應用標識符** 組成                 | mine-admin/apps-store | 
| description          | 應用介紹                                  | MineAdmin應用市場可視化插件    |
| version              | 應用當前版本號                               | 1.0.0                 |
| type                 | 應用類型：mixed（完整應用）、backend（後端）、frontend（前端）      | mixed                |                                  | 1.0.0                 |
| author               | 應用作者信息                                | -                     |
| package.dependencies | 應用前端依賴配置信息，可指定前端需要安裝的依賴包及版本，在應用安裝時會安裝 | -                     |
| composer             | 後端composer配置，可查看下面詳細表格                | -                     |

## composer配置説明
| 參數       | 説明                    | 示例                                             |
|----------|-----------------------|------------------------------------------------|
| require  | 設置後端依賴及版本，在應用安裝時會執行安裝 | "hyperf/async_queue": "3.1.*"  **指定異步隊列依賴和版本** | 
| psr-4    | 設置插件代碼目錄的命名空間         | "Plugin\\MineAdmin\\AppStore\\": "src"         |
| script   | 執行的腳本命令               | 例如下面例文件，執行了發佈異步隊列的配置文件                         |
| config | hyperf配置文件服務提供器       | -                                              |

## mine.json 文件內容

以下是一個示例

```json  [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdmin應用市場可視化插件",
  "version": "1.0.0",
  "type": "mixed",
  "author": [
    {
      "name": "zds",
      "role": "developer"
    }
  ],
  "package": {
    "dependencies": {

    }
  },
  "composer": {
    "require": {
    },
    "psr-4": {
      "Plugin\\MineAdmin\\AppStore\\": "src"
    },
    "script": {
      "publishAsyncQueue": "php bin/hyperf.php vendor:publish hyperf/async-queue"
    },
    "config": "Plugin\\MineAdmin\\AppStore\\ConfigProvider"
  }
}
```