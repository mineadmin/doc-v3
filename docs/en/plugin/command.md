# Plugin Commands

## Plugin Extension Initialization Command

---

::: danger

MineAdmin 2.0 version already includes the plugin extension and initialization actions by default, no need to repeat the initialization.

:::

> This command will publish the configuration files and language files for app-store.

```shell
php bin/hyperf.php mine-extension:initial
```

---

## Query Remote Plugin List (From MineAdmin Official Extension Source)

```shell
php bin/hyperf.php mine-extension:list
```

### Parameters

| Parameter | Type    | Default | Remarks |
|-----------|---------|---------|---------|
| --type    | string  | all     | Filter extension type |
| --name    | string  | none    | Filter extension name |

---

## Query All Local Plugins (Including Uninstalled Ones)

```shell
php bin/hyperf.php mine-extension:local-list
```

## Download Remote Plugin to Local

```shell
php bin/hyperf.php mine-extension:download
```

### Parameters

| Parameter | Type    | Default | Remarks |
|-----------|---------|---------|---------|
| --name    | string  | none    | Required |

## Install Specified Plugin

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### Parameters

| Parameter | Type    | Default | Remarks |
|-----------|---------|---------|---------|
| path      | string  | none    | Required, plugin directory |
| --yes     | bool    | false   | Whether to disable installation prompt |

## Uninstall Specified Plugin

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### Parameters

| Parameter | Type    | Default | Remarks |
|-----------|---------|---------|---------|
| path      | string  | none    | Required, plugin directory |
| --yes     | bool    | false   | Whether to disable installation prompt |

## Create a Plugin

```shell
php bin/hyperf.php mine-extension:create
```

### Parameters

| Parameter       | Type    | Default     | Remarks |
|-----------------|---------|-------------|---------|
| path            | string  | none, required | Creation path, e.g., zds/app-store |
| --name          | string  | example     | Plugin name |
| --type          | string  | mixed       | Plugin type, options: mixed, frond, backend |
| --author        | string  | none, optional | Author name, this value will be filled in minejson.author |
| --description   | string  | none, optional | Plugin description, this value will be filled in minejson.description |