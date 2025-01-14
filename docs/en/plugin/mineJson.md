# mine.json Explanation and Example

A complete example and explanation of an application configuration file

---

## Attribute List Explanation

| Parameter               | Description                                    | Example                    |
|-------------------------|-----------------------------------------------|----------------------------|
| name                    | Composed of **user namespace/application identifier** | mine-admin/apps-store      |
| description             | Application introduction                       | MineAdmin Application Market Visual Plugin |
| version                 | Current version of the application             | 1.0.0                      |
| type                    | Application type: mixed (full application), backend (backend), frontend (frontend) | mixed                      |
| author                  | Application author information                 | -                          |
| package.dependencies    | Frontend dependency configuration information, specifying the dependencies and versions required by the frontend, which will be installed during application installation | -                          |
| composer                | Backend composer configuration, see detailed table below | -                          |

## Composer Configuration Explanation

| Parameter       | Description                    | Example                                             |
|-----------------|-------------------------------|-----------------------------------------------------|
| require         | Set backend dependencies and versions, which will be installed during application installation | "hyperf/async_queue": "3.1.*"  **Specifies async queue dependency and version** |
| psr-4           | Set the namespace for the plugin code directory | "Plugin\\MineAdmin\\AppStore\\": "src"             |
| script          | Script commands to execute     | For example, the following file executes the command to publish the async queue configuration file |
| config          | Hyperf configuration file service provider | -                                                  |

## mine.json File Content

Below is an example

```json  [mine.json]
{
  "name": "mine-admin/apps-store",
  "description": "MineAdmin Application Market Visual Plugin",
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