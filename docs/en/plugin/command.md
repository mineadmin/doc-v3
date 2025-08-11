# Plugin Commands  

## Plugin Extension Initialization Command  

---  

::: danger  

MineAdmin 2.0 already includes plugin extensions and initialization actions by default. Do not repeat the initialization process.  

:::  

> This command will publish the configuration and language files for `app-store`.  

```shell  
php bin/hyperf.php mine-extension:initial  
```  

---  

## Query Remote Plugin List (from MineAdmin Official Extension Source)  

```shell  
php bin/hyperf.php mine-extension:list  
```  

### Parameters  

| Parameter | Type    | Default | Remarks |  
|----------|---------|---------|---------|  
| --type   | string  | all     | Filter by extension type |  
| --name   | string  | none    | Filter by extension name |  

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
|----------|---------|---------|---------|  
| --name   | string  | none    | Required |  

## Install Specified Plugin  

```shell  
php bin/hyperf.php mine-extension:install {path} --yes  
```  

### Parameters  

| Parameter | Type    | Default | Remarks |  
|----------|---------|---------|---------|  
| path     | string  | none    | Required, plugin directory |  
| --yes    | bool    | false   | Disable installation confirmation |  

## Uninstall Specified Plugin  

```shell  
php bin/hyperf.php mine-extension:uninstall {path} --yes  
```  

### Parameters  

| Parameter | Type    | Default | Remarks |  
|----------|---------|---------|---------|  
| path     | string  | none    | Required, plugin directory |  
| --yes    | bool    | false   | Disable uninstallation confirmation |  

## Create a Plugin  

```shell  
php bin/hyperf.php mine-extension:create  
```  

### Parameters  

| Parameter       | Type    | Default     | Remarks |  
|----------------|---------|-------------|---------|  
| path           | string  | Required    | Creation path, e.g., `zds/app-store` |  
| --name         | string  | example     | Plugin name |  
| --type         | string  | mixed       | Plugin type (options: `mixed`, `frontend`, `backend`) |  
| --author       | string  | Optional    | Author name (fills `minejson.author`) |  
| --description  | string  | Optional    | Plugin description (fills `minejson.description`) |