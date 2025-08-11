# mine.json Explanation and Example

A complete example and description of an application configuration file.

---

## Property List Explanation

| Parameter            | Description                                    | Example                    |
|----------------------|-----------------------------------------------|----------------------------|
| name                 | Composed of **user namespace/application identifier** | mine-admin/apps-store      | 
| description          | Application introduction                      | MineAdmin App Market Visual Plugin |
| version              | Current version of the application            | 1.0.0                      |
| type                 | Application type: mixed (full application), backend (backend), frontend (frontend) | mixed                      |                                  | 1.0.0                 |
| author               | Application author information                | -                          |
| package.dependencies | Frontend dependency configuration, specifying required packages and versions, installed during application setup | -                          |
| composer             | Backend composer configuration, see detailed table below | -                          |

## Composer Configuration Explanation
| Parameter  | Description                    | Example                                             |
|------------|-------------------------------|-----------------------------------------------------|
| require    | Sets backend dependencies and versions, installed during application setup | "hyperf/async_queue": "3.1.*"  **Specifies async queue dependency and version** | 
| psr-4      | Sets the namespace for the plugin code directory | "Plugin\\MineAdmin\\AppStore\\": "src"              |
| script     | Script commands to execute     | As shown in the example file, executes the command to publish async queue configuration files |
| config     | Hyperf configuration file service provider | -                                                   |

## mine.json File Content

Below is an example:

```json [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdmin App Market Visual Plugin",
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