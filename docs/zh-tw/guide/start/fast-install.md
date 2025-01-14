# 快速開始

自 `3.0` 版本起，前後端都放在了一個倉庫，所以我們推薦先安裝後端。前端原始碼將隨著後端
的 `web` 目錄一起下載到本地

## 下載程式碼

### git

使用 Git 工具進行本專案的安裝。需要保證本地具有 [Git](https://git-scm.com/) 工具

首先需要先把程式碼下載到本地，執行以下命令。`YourProject` 是要新建的應用名稱目錄。如果不傳則預設為 mineadmin

```sh [下載程式碼]
git clone https://github.com/mineadmin/MineAdmin.git
```

## 安裝系統並啟動

在上面章節我們進行了專案的程式碼下載以及環境搭建的一些說明，接下來講述一下如何配置系統，並且啟動系統

::: warning

不管是哪種方式下載的系統程式碼，都需要 copy 根目錄一份 `.env.example` 成 `.env`
並且配置好 env 中關於資料庫和 redis 的配置項。才能繼續進入下一步操作

:::

## 後端安裝

### Composer

如果是使用的本地環境。那麼配置好 `.env` 檔案後即可開始執行[後端安裝](#後端安裝)

### Docker

如果選擇用 docker 開發，那麼還需要幾步進行環境的進一步搭建

```shell
docker-compose up -d
```

#### Docker-compose (推薦)

MineAdmin 已經準備好了完善的 `docker-compose.yml` 檔案，
只需要在專案目錄中執行以下命令即可完成環境的搭建

#### Docker Build

如果你想自建容器映象。那麼我們也為你準備好了一個 Dockerfile 檔案。您只需要在專案目錄執行`打包映象` `執行容器` 以下命令即可完成環境的搭建

```shell
# 打包映象
docker build . -t mineadmin

# 啟動一個容器
docker run -d --name mineadmin -p 9501:9501 -v .:/opt/www mineadmin 
```

### 後端系統安裝

執行以下命令

::: code-group

```shell[重新安裝 Vendor]
composer install -vvv
```

```shell [資料表遷移]
php bin/hyperf.php migrate
```

```shell [資料填充]
php bin/hyperf.php db:seed
```

:::


## 前端安裝

推薦使用 [nvm](https://github.com/nvm-sh/nvm) 來進行本地的 Node 多版本管理

進入 `你的專案路徑/web` 目錄下，執行

```shell
# 前端依賴庫的安裝
pnpm i 
# 啟動本地開發服務
pnpm dev
```