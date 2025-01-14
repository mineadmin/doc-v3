# 部署

本文將講述如何在生產環境部署 MineAdmin 的前後端應用程序

## 後端

### 服務部署

一般來説，在新一代服務端應用程序。基本上都是由 docker 進行服務部署。
MineAdmin 也提供了開箱即用的 [Dockerfile](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile) 以便你能夠進行快速的服務部署
在某些情況可能需要面臨裸裝部署在服務器中。以下介紹兩種部署方式。以便快速上手

#### 直接部署在服務器中

如果你需要將 MineAdmin 直接部署在服務器中。那麼首先服務器要滿足以下系統條件

::: tip
php 與擴展安裝請自行搜索相關教程，本處不另行説明
:::

* PHP >= 8.1
* cURL PHP 擴展
* Fileinfo PHP 擴展
* OpenSSL PHP 擴展
* PDO 擴展
* Redis 擴展
* Json 擴展
* PDO_MYSQL 擴展 (可選)
* PDO_PGSQL 擴展 (可選)
* Swoole >= 5.1 擴展 (可選)
* Swow >= 1.5 or develop (可選)


進入項目目錄執行

```shell
php bin/hyperf.php start
```

即可啓動成功

默認的程序不提供常駐進程選項，我們推薦使用第三方應用例如 [supervisord](http://www.supervisord.org/)來進行項目的進程持久化運行
如何使用請參考 [Hyperf文檔](https://hyperf.wiki)

#### 以容器形式部署 (推薦)

如果你想要以容器服務形式向外提供應用服務。可以使用項目下的 Dockerfile,用法很簡單。

首先要保證服務器已經安裝完成 [docker](https://www.docker.com/)

然後進入你的項目目錄

```shell
cd yourProject
```

執行 `docker build . -t mineadmin` 來打包鏡像

```shell
# -t 參數具體請自行百度，此處不另行説明
docker build . -t mineadmin
```

接下來執行 `docker run` 來啓動一個容器

```shell
docker run -d --name mineadmin mineadmin
```

即可完成項目服務端的部署

---

::: tip
以上兩種部署方式的前提是已經配置好 <el-tag type="danger">.env</el-tag> 文件
:::

### 反向代理

<el-alert type="warning">無論何時都不建議將應用程序直接暴露在公網環境，最好是再套一層代理轉發</el-alert>

本文將列舉幾個反向代理示例

#### Nginx

如果你將程序部署在運行 nginx 的服務器上。你可以參考以下反向代理配置文件來作為站點的起點。

```nginx

#PROXY-START/server

location ^~ /
{
    # 應用程序端口
    proxy_pass http://127.0.0.1:9501/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_http_version 1.1;
    # proxy_hide_header Upgrade;

    add_header X-Cache $upstream_cache_status;
    #Set Nginx Cache

    set $static_fileyqrHU0ll 0;
    if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
    {
        set $static_fileyqrHU0ll 1;
        expires 1m;
    }
    if ( $static_fileyqrHU0ll = 0 )
    {
        add_header Cache-Control no-cache;
    }
}
#PROXY-END/

```

#### K8s Ingress

如果你將程序部署在 k8s 集羣中，你可以參考以下配置説明

##### 創建服務

```yaml
# Kubernetes API 的版本
apiVersion: v1
# 資源對象類型是服務（Service）
kind: Service
# 服務的元數據信息
metadata:
  # 為這個服務指定一個名稱
  name: mineadmin-service
# 服務的規範部分
spec:
  # 用於選擇與該服務關聯的 Pod
  selector:
    app: mineadmin-server
  # 服務暴露的端口
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9501
```

##### 創建 Ingress 資源

```yaml
apiVersion: networking.k8s.io/v1
# 定義的資源對象類型是 Ingress
kind: Ingress
metadata:
  # 為這個 Ingress 資源指定一個名稱
  name: mineadmin-ingress
  annotations:
    # 重寫的目標路徑
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  # Ingress 的路由規則列表
  rules:
      # 適用於主機名為 www.mineadmin.com 的請求
    - host: www.mineadmin.com
      # 處理 HTTP 請求
      http:
        paths:
          # 匹配的路徑為根路徑
          - path: /
            # 指定路徑的匹配類型為前綴匹配
            pathType: Prefix
            # 定義了請求被路由到的後端服務
            backend:
              # 指定後端服務為一個 Kubernetes 服務
              service:
                # 指定後端服務的名稱為 “mineadmin-service”，即前面定義的服務。
                name: mineadmin-service
                # 後端服務的端口號為 80。當請求被路由到後端服務時，將被轉發到這個端口上。
                port:
                  number: 80
```


### 調試模式

在 `config/config.php` 配置文件中，調試選項決定了有多少錯誤信息實際上會展示給用户，默認情況下，該選項
設置遵守環境變量 `APP_DEBUG` 的值.該值存儲在你的項目 `.env` 文件中.

::: warning
在生產環境中，該值應該永遠為 `false`.如果在生產環境中設置為 `true` 將有可能把敏感信息返回給用户的風險
:::

## 前端

### 服務部署

#### 直接部署在服務器中

如果你想要將 MineAdmin 前端服務部署在服務器中，以經典的 Nginx 服務為例。

首先生成 靜態資源,在你的項目 `web` 目錄下執行 `pnpm build` 生成 PS: 可以在服務器進行生成，
也可以在本地預先生成好

將你的靜態資源扔到站點目錄。即可完成安裝

#### 以容器服務形式部署（推薦）

與後端一致，我們提供了前端打包的 `Dockerfile`，
進入你的 `應用程序/web` 目錄下，執行 

```shell
docker build . -t frontend
```

即可打包成 nginx 鏡像

根據該鏡像即可啓動一個容器服務

```shell
docker run -d --name frontend frontend
```

配置站點反向代理到`[容器IP:80]` 端口即完成部署
