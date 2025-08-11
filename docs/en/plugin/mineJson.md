# mine.json Explanation and Example

A complete example and description of an application configuration file.

---

## Property List Explanation

| Parameter               | Description                                    | Example                    |
|-------------------------|-----------------------------------------------|---------------------------|
| name                    | Composed of **user namespace/application identifier** | mine-admin/apps-store      | 
| description             | Application introduction                       | MineAdmin App Marketplace Visual Plugin |
| version                 | Current version of the application            | 1.0.0                     |
| type                    | Application type: `mixed` (full application), `backend` (backend), `frontend` (frontend) | mixed                     |
| author                  | Application author information                | -                         |
| package.dependencies    | Frontend dependency configuration, specifying required packages and versions to install during setup | -                         |
| composer                | Backend composer configuration, see detailed table below | -                         |

## Composer Configuration Explanation
| Parameter   | Description                    | Example                                             |
|-------------|-------------------------------|-----------------------------------------------------|
| require     | Backend dependencies and versions, installed during setup | "hyperf/async_queue": "3.1.*"  **Specifies async queue dependency and version** | 
| psr-4       | Sets the namespace for the plugin code directory | "Plugin\\MineAdmin\\AppStore\\": "src"              |
| script      | Script commands to execute    | As shown in the example file, publishes async queue configuration files |
| config      | Hyperf configuration file service provider | -                                                  |

## mine.json File Content

Below is an example:

```json [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdmin App Marketplace Visual Plugin",
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