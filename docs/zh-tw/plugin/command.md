# 外掛命令

## 外掛擴充套件初始化命令

---

::: danger

 MineAdmin 2.0 版本已經預設存在外掛擴充套件以及初始化動作，無需重複執行初始化

:::


> 此命令會發布 app-store 的配置檔案、語言檔案

```shell
php bin/hyperf.php mine-extension:initial
```

---

## 查詢遠端外掛列表(從 MineAdmin 官方擴充套件源)

```shell
php bin/hyperf.php mine-extension:list
```

### 引數

| 引數      | 型別      | 預設值  | 備註 |
|---------|---------|------| ---|
| --type  | string  | all  | 篩選擴充套件型別 | 
| --name | string | 無 | 篩選副檔名稱 |

---

## 查詢本地所有外掛(包括未安裝的)

```shell
php bin/hyperf.php mine-extension:local-list
```

## 下載遠端外掛到本地

```shell
php bin/hyperf.php mine-extension:download
```

### 引數

| 引數      | 型別      | 預設值 | 備註 |
|---------|---------|-----| ---|
| --name | string | 無   | 必選 |

## 安裝指定外掛

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### 引數

| 引數      | 型別      | 預設值 | 備註        |
|---------|---------|-----|-----------|
| path | string | 無 | 必填,外掛所處目錄 |
| --yes | bool | false | 是否關閉安裝詢問  |


## 解除安裝指定外掛

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### 引數

| 引數      | 型別      | 預設值 | 備註        |
|---------|---------|-----|-----------|
| path | string | 無 | 必填,外掛所處目錄 |
| --yes | bool | false | 是否關閉安裝詢問  |


## 建立一個外掛

```shell
php bin/hyperf.php mine-extension:create
```

### 引數

| 引數            | 型別      | 預設值     | 備註                                 |
|---------------|---------|---------|------------------------------------|
| path          | string | 無,必填    | 建立路徑,例如 zds/app-store              | 
| --name        | string | example | 外掛名稱                               |                        
| --type        | string | mixed     | 外掛型別 可選型別: mixed,frontend,backend     |
| --author      | string| 無,可選    | 作者名稱，此值會填充到 minejson.author 中      |
| --description | string| 無,可選    | 外掛介紹，此值會填充到 minejson.description 中 |
