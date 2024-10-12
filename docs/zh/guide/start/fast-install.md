# 快速开始

自 `3.0` 版本起，前后端都放在了一个仓库，所以我们推荐先安装后端。前端源代码将随着后端
的 `web` 目录一起下载到本地

## 下载代码

### Composer

使用 [composer](https://getcomposer.org/doc/01-basic-usage.md#package-versions) 进行项目的下载。要求您的系统已经预先准备好了以下开发环境

* [Node](https://nodejs.org/) (推荐 20.0)
* [PHP](https://php.net) 同时要求安装了 [Swoole](https://swoole.com) 或 [Swow](https://github.com/swow/swow) (PHP 版本推荐 `8.1~8.3`)
* [Composer](https://getcomposer.org/doc/01-basic-usage.md#package-versions) (推荐最新版)

然后进入一个空的目录。执行以下命令。`YourProject` 是要新建的应用名称目录。如果不传则默认为 mineadmin

```shell
composer create-project mineadmin/mineadmin:3.0 YourProject
```

### git (推荐)

使用 Git 工具进行本项目的安装。需要保证本地具有 [Git](https://git-scm.com/) 工具

首先需要先把代码下载到本地，执行以下命令。`YourProject` 是要新建的应用名称目录。如果不传则默认为 mineadmin

```sh [下载代码]
git clone -b 3.0 https://github.com/mineadmin/MineAdmin.git
```

## 安装系统并启动

在上面章节我们进行了项目的代码下载以及环境搭建的一些说明，接下来讲述一下如何配置系统，并且启动系统

::: warning

不管是哪种方式下载的系统代码，都需要 copy 根目录一份 `.env.example` 成 `.env`
并且配置好 env 中关于数据库和 redis 的配置项。才能继续进入下一步操作

:::

## 后端安装

### Composer

如果是使用的本地环境。那么配置好 `.env` 文件后即可开始执行[后端安装](#后端安装)

### Docker

如果选择用 docker 开发，那么还需要几步进行环境的进一步搭建

```shell
docker-compose up -d
```

#### Docker-compose (推荐)

MineAdmin 已经准备好了完善的 `docker-compose.yml` 文件，
只需要在项目目录中执行以下命令即可完成环境的搭建

#### Docker Build

如果你想自建容器镜像。那么我们也为你准备好了一个 Dockerfile 文件。您只需要在项目目录执行`打包镜像` `运行容器` 以下命令即可完成环境的搭建

```shell
# 打包镜像
docker build . -t mineadmin

# 启动一个容器
docker run -d --name mineadmin -p 9501:9501 -v .:/opt/www mineadmin 
```

### 后端系统安装

执行以下命令

::: code-group

```shell [数据表迁移]
php bin/hyperf.php migrate
```

```shell [数据填充]
php bin/hyperf.php db:seed
```

:::


## 前端安装

推荐使用 [nvm](https://github.com/nvm-sh/nvm) 来进行本地的 Node 多版本管理

进入 `你的项目路径/web` 目录下，执行

```shell
# 前端依赖库的安装
pnpm i 
# 启动本地开发服务
pnpm dev
```