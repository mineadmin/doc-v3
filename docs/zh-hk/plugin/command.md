# 插件命令

## 插件擴展初始化命令

---

::: danger

 MineAdmin 2.0 版本已經默認存在插件擴展以及初始化動作，無需重複執行初始化

:::


> 此命令會發布 app-store 的配置文件、語言文件

```shell
php bin/hyperf.php mine-extension:initial
```

---

## 查詢遠程插件列表(從 MineAdmin 官方擴展源)

```shell
php bin/hyperf.php mine-extension:list
```

### 參數

| 參數      | 類型      | 默認值  | 備註 |
|---------|---------|------| ---|
| --type  | string  | all  | 篩選擴展類型 | 
| --name | string | 無 | 篩選擴展名稱 |

---

## 查詢本地所有插件(包括未安裝的)

```shell
php bin/hyperf.php mine-extension:local-list
```

## 下載遠程插件到本地

```shell
php bin/hyperf.php mine-extension:download
```

### 參數

| 參數      | 類型      | 默認值 | 備註 |
|---------|---------|-----| ---|
| --name | string | 無   | 必選 |

## 安裝指定插件

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### 參數

| 參數      | 類型      | 默認值 | 備註        |
|---------|---------|-----|-----------|
| path | string | 無 | 必填,插件所處目錄 |
| --yes | bool | false | 是否關閉安裝詢問  |


## 卸載指定插件

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### 參數

| 參數      | 類型      | 默認值 | 備註        |
|---------|---------|-----|-----------|
| path | string | 無 | 必填,插件所處目錄 |
| --yes | bool | false | 是否關閉安裝詢問  |


## 創建一個插件

```shell
php bin/hyperf.php mine-extension:create
```

### 參數

| 參數            | 類型      | 默認值     | 備註                                 |
|---------------|---------|---------|------------------------------------|
| path          | string | 無,必填    | 創建路徑,例如 zds/app-store              | 
| --name        | string | example | 插件名稱                               |                        
| --type        | string | mixed     | 插件類型 可選類型: mixed,frond,backend     |
| --author      | string| 無,可選    | 作者名稱，此值會填充到 minejson.author 中      |
| --description | string| 無,可選    | 插件介紹，此值會填充到 minejson.description 中 |
