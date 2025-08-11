# Plugin Commands

## Plugin Extension Initialization Command

---

::: danger

 MineAdmin 2.0 already includes the plugin extension and initialization by default. No need to repeat the initialization process.

:::


> This command will publish the configuration and language files for app-store.

```shell
php bin/hyperf.php mine-extension:initial
```

---

## Query Remote Plugin List (from MineAdmin Official Extension Source)

```shell
php bin/hyperf.php mine-extension:list
```

### Parameters

| Parameter      | Type      | Default  | Remarks |
|---------|---------|------| ---|
| --type  | string  | all  | Filter by extension type | 
| --name | string | None | Filter by extension name |

---

## Query All Local Plugins (including uninstalled ones)

```shell
php bin/hyperf.php mine-extension:local-list
```

## Download Remote Plugin to Local

```shell
php bin/hyperf.php mine-extension:download
```

### Parameters

| Parameter      | Type      | Default | Remarks |
|---------|---------|-----| ---|
| --name | string | None   | Required |

## Install Specified Plugin

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### Parameters

| Parameter      | Type      | Default | Remarks        |
|---------|---------|-----|-----------|
| path | string | None | Required, plugin directory |
| --yes | bool | false | Disable installation confirmation  |


## Uninstall Specified Plugin

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### Parameters

| Parameter      | Type      | Default | Remarks        |
|---------|---------|-----|-----------|
| path | string | None | Required, plugin directory |
| --yes | bool | false | Disable uninstallation confirmation  |


## Create a Plugin

```shell
php bin/hyperf.php mine-extension:create
```

### Parameters

| Parameter            | Type      | Default     | Remarks                                 |
|---------------|---------|---------|------------------------------------|
| path          | string | Required    | Creation path, e.g., zds/app-store              | 
| --name        | string | example | Plugin name                               |                        
| --type        | string | mixed     | Plugin type, options: mixed, frontend, backend     |
| --author      | string| Optional    | Author name, fills into minejson.author      |
| --description | string| Optional    | Plugin description, fills into minejson.description |