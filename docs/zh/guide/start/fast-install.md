# 快速开始

## 下载代码

### git

使用 Git 工具进行本项目的安装。需要保证本地具有 [Git](https://git-scm.com/) 工具

首先需要先把代码下载到本地，执行以下命令。`YourProject` 是要新建的应用名称目录。如果不传则默认为 mineadmin

```sh [下载代码]
git clone https://github.com/mineadmin/MineAdmin.git
```

下载成功后复制项目目录下的 `.env.example` 文件为 `.env` 文件，并配置好数据库和 redis 的配置项

## 后端环境安装

### Composer

如果是使用的本地环境。那么配置好 `.env` 文件后即可开始执行[后端安装](#后端安装)

### Docker

如果选择用 docker 开发，那么还需要几步进行环境的进一步搭建

#### Docker-compose (推荐)

MineAdmin 已经准备好了完善的 `docker-compose.yml` 文件，
只需要在项目目录中执行以下命令即可完成环境的搭建


```shell
docker-compose up -d
```

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

```shell[重新安装 Vendor]
composer install -vvv
```

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