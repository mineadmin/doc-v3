# mine.json 说明及示例

一个应用配置文件的完整示例以及说明

---

## 属性列表说明

| 参数                   | 说明                                    | 示例                    |
|----------------------|---------------------------------------|-----------------------|
| name                 | 由 **用户名称空间/应用标识符** 组成                 | mine-admin/apps-store | 
| description          | 应用介绍                                  | MineAdmin应用市场可视化插件    |
| version              | 应用当前版本号                               | 1.0.0                 |
| type                 | 应用类型：mixed（完整应用）、backend（后端）、frontend（前端）      | mixed                |                                  | 1.0.0                 |
| author               | 应用作者信息                                | -                     |
| package.dependencies | 应用前端依赖配置信息，可指定前端需要安装的依赖包及版本，在应用安装时会安装 | -                     |
| composer             | 后端composer配置，可查看下面详细表格                | -                     |

## composer配置说明
| 参数       | 说明                    | 示例                                             |
|----------|-----------------------|------------------------------------------------|
| require  | 设置后端依赖及版本，在应用安装时会执行安装 | "hyperf/async_queue": "3.1.*"  **指定异步队列依赖和版本** | 
| psr-4    | 设置插件代码目录的命名空间         | "Plugin\\MineAdmin\\AppStore\\": "src"         |
| script   | 执行的脚本命令               | 例如下面例文件，执行了发布异步队列的配置文件                         |
| config | hyperf配置文件服务提供器       | -                                              |

## mine.json 文件内容

以下是一个示例

```json  [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdmin应用市场可视化插件",
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