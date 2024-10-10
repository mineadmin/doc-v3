# 部署

## 介绍

当你准备将 MineAdmin 后端应用程序部署到生成环境时，你可以参考本文内容来使其便捷的运行。

## 服务部署

一般来说，在新一代服务端应用程序。基本上都是由 docker 进行服务部署。
MineAdmin 也提供了开箱即用的 [Dockerfile](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile) 以便你能够进行快速的服务部署
在某些情况可能需要面临裸装部署在服务器中。以下介绍两种部署方式。以便快速上手

### 直接部署在服务器中

如果你需要将 MineAdmin 直接部署在服务器中。那么首先服务器要满足以下系统条件

::: tip
php 与扩展安装请自行搜索相关教程，本处不另行说明
:::

* PHP >= 8.1
* cURL PHP 扩展
* Fileinfo PHP 扩展
* OpenSSL PHP 扩展
* PDO 扩展 
* Redis 扩展
* Json 扩展
* PDO_MYSQL 扩展 (可选)
* PDO_PGSQL 扩展 (可选)
* Swoole >= 5.1 扩展 (可选)
* Swow >= 1.5 or develop (可选)


进入项目目录执行

```shell
php bin/hyperf.php start
```

即可启动成功

默认的程序不提供常驻进程选项，我们推荐使用第三方应用例如 [supervisord](http://www.supervisord.org/)来进行项目的进程持久化运行
如何使用请参考 [Hyperf文档](https://hyperf.wiki)

### 以容器形式部署 (推荐)

如果你想要以容器服务形式向外提供应用服务。可以使用项目下的 Dockerfile,用法很简单。

首先要保证服务器已经安装完成 [docker](https://www.docker.com/)

然后进入你的项目目录

```shell
cd yourProject
```

执行 `docker build . -t mineadmin` 来打包镜像

```shell
# -t 参数具体请自行百度，此处不另行说明
docker build . -t mineadmin
```

接下来执行 `docker run` 来启动一个容器

```shell
docker run -d --name mineadmin mineadmin
```

即可完成项目服务端的部署

---

::: tip
以上两种部署方式的前提是已经配置好 <el-tag type="danger">.env</el-tag> 文件
:::

## 反向代理

<el-alert type="warning">无论何时都不建议将应用程序直接暴露在公网环境，最好是再套一层代理转发</el-alert>

本文将列举几个反向代理示例

### Nginx

如果你将程序部署在运行 nginx 的服务器上。你可以参考以下反向代理配置文件来作为站点的起点。

```nginx

#PROXY-START/server

location ^~ /
{
    # 应用程序端口
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

### K8s Ingress

如果你将程序部署在 k8s 集群中，你可以参考以下配置说明

#### 创建服务

```yaml
# Kubernetes API 的版本
apiVersion: v1
# 资源对象类型是服务（Service）
kind: Service
# 服务的元数据信息
metadata:
  # 为这个服务指定一个名称
  name: mineadmin-service
# 服务的规范部分
spec:
  # 用于选择与该服务关联的 Pod
  selector:
    app: mineadmin-server
  # 服务暴露的端口
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9501
```

#### 创建 Ingress 资源

```yaml
apiVersion: networking.k8s.io/v1
# 定义的资源对象类型是 Ingress
kind: Ingress
metadata:
  # 为这个 Ingress 资源指定一个名称
  name: mineadmin-ingress
  annotations:
    # 重写的目标路径
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  # Ingress 的路由规则列表
  rules:
      # 适用于主机名为 www.mineadmin.com 的请求
    - host: www.mineadmin.com
      # 处理 HTTP 请求
      http:
        paths:
          # 匹配的路径为根路径
          - path: /
            # 指定路径的匹配类型为前缀匹配
            pathType: Prefix
            # 定义了请求被路由到的后端服务
            backend:
              # 指定后端服务为一个 Kubernetes 服务
              service:
                # 指定后端服务的名称为 “mineadmin-service”，即前面定义的服务。
                name: mineadmin-service
                # 后端服务的端口号为 80。当请求被路由到后端服务时，将被转发到这个端口上。
                port:
                  number: 80
```


## 调试模式

在 `config/config.php` 配置文件中，调试选项决定了有多少错误信息实际上会展示给用户，默认情况下，该选项
设置遵守环境变量 `APP_DEBUG` 的值.该值存储在你的项目 `.env` 文件中.

::: warning
在生产环境中，该值应该永远为 `false`.如果在生产环境中设置为 `true` 将有可能把敏感信息返回给用户的风险 
:::