# 插件命令

## 插件扩展初始化命令

---

::: danger

 MineAdmin 2.0 版本已经默认存在插件扩展以及初始化动作，无需重复执行初始化

:::


> 此命令会发布 app-store 的配置文件、语言文件

```shell
php bin/hyperf.php mine-extension:initial
```

---

## 查询远程插件列表(从 MineAdmin 官方扩展源)

```shell
php bin/hyperf.php mine-extension:list
```

### 参数

| 参数      | 类型      | 默认值  | 备注 |
|---------|---------|------| ---|
| --type  | string  | all  | 筛选扩展类型 | 
| --name | string | 无 | 筛选扩展名称 |

---

## 查询本地所有插件(包括未安装的)

```shell
php bin/hyperf.php mine-extension:local-list
```

## 下载远程插件到本地

```shell
php bin/hyperf.php mine-extension:download
```

### 参数

| 参数      | 类型      | 默认值 | 备注 |
|---------|---------|-----| ---|
| --name | string | 无   | 必选 |

## 安装指定插件

```shell
php bin/hyperf.php mine-extension:install {path} --yes
```

### 参数

| 参数      | 类型      | 默认值 | 备注        |
|---------|---------|-----|-----------|
| path | string | 无 | 必填,插件所处目录 |
| --yes | bool | false | 是否关闭安装询问  |


## 卸载指定插件

```shell
php bin/hyperf.php mine-extension:uninstall {path} --yes
```

### 参数

| 参数      | 类型      | 默认值 | 备注        |
|---------|---------|-----|-----------|
| path | string | 无 | 必填,插件所处目录 |
| --yes | bool | false | 是否关闭安装询问  |


## 创建一个插件

```shell
php bin/hyperf.php mine-extension:create
```

### 参数

| 参数            | 类型      | 默认值     | 备注                                 |
|---------------|---------|---------|------------------------------------|
| path          | string | 无,必填    | 创建路径,例如 zds/app-store              | 
| --name        | string | example | 插件名称                               |                        
| --type        | string | mixed     | 插件类型 可选类型: mixed,frond,backend     |
| --author      | string| 无,可选    | 作者名称，此值会填充到 minejson.author 中      |
| --description | string| 无,可选    | 插件介绍，此值会填充到 minejson.description 中 |
