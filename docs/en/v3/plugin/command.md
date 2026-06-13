## Plugin Commands

## Plugin Extension Initialization Command

---

::: danger

MineAdmin 2.0 already includes plugin extensions and initialization actions by default, so there is no need to repeat the initialization.

:::


> This command will publish the app-store configuration file and language files.

```shell
php bin/hyperf.php mine-extension:initial
```

---

## Query Remote Plugin List (From MineAdmin Official Extension Source)

```shell
php bin/hyperf.php mine-extension:list
```

### Parameters

| Parameter | Type   | Default | Description          |
|-----------|--------|---------|----------------------|
| --type    | string | all     | Filter extension type |
| --name    | string | None    | Filter extension name |

---

## Query All Local Plugins (Including Uninstalled)

```shell
php bin/hyperf.php mine-extension:local-list
```

## Download Remote Plugin to Local

```shell
php bin/hyperf.php mine-extension:download
```

### Parameters

| Parameter | Type   | Default | Description |
|-----------|--------|---------|-------------|
| --name    | string | None    | Required    |

## Install Specified Plugin

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### Parameters

| Parameter | Type   | Default | Description                      |
|-----------|--------|---------|----------------------------------|
| path      | string | None    | Required, plugin directory        |
| --yes     | bool   | false   | Whether to skip installation prompt |

## Uninstall Specified Plugin

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### Parameters

| Parameter | Type   | Default | Description                      |
|-----------|--------|---------|----------------------------------|
| path      | string | None    | Required, plugin directory        |
| --yes     | bool   | false   | Whether to skip uninstallation prompt |

## Create a Plugin

```shell
php bin/hyperf.php mine-extension:create
```

### Parameters

| Parameter    | Type   | Default | Description                                             |
|--------------|--------|---------|---------------------------------------------------------|
| path         | string | None    | Required; creation path, format: username/plugin directory name (e.g., zds/app-store) |
| --type       | string | mixed   | Plugin type, optional: mixed, frontend, backend          |
| --author     | string | None, optional | Author name, this value will be filled into minejson.author |
| --description| string | None, optional | Plugin description, this value will be filled into minejson.description |