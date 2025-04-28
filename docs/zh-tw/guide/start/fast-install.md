# 快速開始

## 下載程式碼

### git

使用 Git 工具進行本專案的安裝。需要保證本地具有 [Git](https://git-scm.com/) 工具

首先需要先把程式碼下載到本地，執行以下命令。`YourProject` 是要新建的應用名稱目錄。如果不傳則預設為 mineadmin

## 分支介紹

- `master` 分支，預設主分支，最常用的分支
- `master-department` 部門分支，包含部門管理、職位管理、資料權限設定等附加功能。

請根據需要選擇不同的分支開發，以減少後續不必要的麻煩！！！

```sh [下載程式碼]
git clone https://github.com/mineadmin/MineAdmin.git
```

下載成功後複製專案目錄下的 `.env.example` 檔案為 `.env` 檔案，並配置好資料庫和 redis 的配置項

## 後端環境安裝

### Composer

如果是使用的本地環境。那麼配置好 `.env` 檔案後即可開始執行[後端安裝](#後端安裝)

### Docker

如果選擇用 docker 開發，那麼還需要幾步進行環境的進一步搭建

#### Docker-compose (推薦)

MineAdmin 已經準備好了完善的 `docker-compose.yml` 檔案，
只需要在專案目錄中執行以下命令即可完成環境的搭建


```shell
docker-compose up -d
```

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