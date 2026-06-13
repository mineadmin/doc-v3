# mine.json Description and Example

A complete example and description of an application configuration file

---

## Attribute List Description

| Parameter            | Description                                 | Example                 |
|----------------------|---------------------------------------------|-------------------------|
| name                 | Composed of **user namespace/application identifier** | mine-admin/apps-store | 
| description          | Application introduction                    | MineAdmin application marketplace visualization plugin |
| version              | Current application version                 | 1.0.0                  |
| type                 | Application type: mixed (complete application), backend, frontend      | mixed                |
| author               | Application author information              | -                      |
| package.dependencies | Frontend dependency configuration, specifies frontend packages and versions to install during application installation | -                      |
| composer             | Backend composer configuration, see detailed table below | -                      |

## Composer Configuration Description
| Parameter | Description                    | Example                                          |
|-----------|--------------------------------|--------------------------------------------------|
| require   | Set backend dependencies and versions, installed during application installation | "hyperf/async_queue": "3.1.*"  **Specifies async queue dependency and version** | 
| psr-4     | Set the namespace for plugin code directories | "Plugin\\MineAdmin\\AppStore\\": "src"         |
| script    | Script commands to execute     | For example, the file below executes publishing async queue configuration |
| config    | Hyperf configuration service provider | -                                              |

## mine.json File Content

Below is an example

```json  [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdmin application marketplace visualization plugin",
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