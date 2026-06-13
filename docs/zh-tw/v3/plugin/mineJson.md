# mine.json 說明及示例

一個應用配置檔案的完整示例以及說明

---

## 屬性列表說明

| 引數                   | 說明                                    | 示例                    |
|----------------------|---------------------------------------|-----------------------|
| name                 | 由 **使用者名稱稱空間/應用識別符號** 組成                 | mine-admin/apps-store | 
| description          | 應用介紹                                  | MineAdmin應用市場視覺化外掛    |
| version              | 應用當前版本號                               | 1.0.0                 |
| type                 | 應用型別：mixed（完整應用）、backend（後端）、frontend（前端）      | mixed                |                                  | 1.0.0                 |
| author               | 應用作者資訊                                | -                     |
| package.dependencies | 應用前端依賴配置資訊，可指定前端需要安裝的依賴包及版本，在應用安裝時會安裝 | -                     |
| composer             | 後端composer配置，可檢視下面詳細表格                | -                     |

## composer配置說明
| 引數       | 說明                    | 示例                                             |
|----------|-----------------------|------------------------------------------------|
| require  | 設定後端依賴及版本，在應用安裝時會執行安裝 | "hyperf/async_queue": "3.1.*"  **指定非同步佇列依賴和版本** | 
| psr-4    | 設定外掛程式碼目錄的名稱空間         | "Plugin\\MineAdmin\\AppStore\\": "src"         |
| script   | 執行的指令碼命令               | 例如下面例檔案，執行了釋出非同步佇列的配置檔案                         |
| config | hyperf配置檔案服務提供器       | -                                              |

## mine.json 檔案內容

以下是一個示例

```json  [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdmin應用市場視覺化外掛",
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