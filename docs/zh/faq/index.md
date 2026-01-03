# 常见问题

---

## 安装成功后报错 `DNS Lookup resolve failed`

检查 `.env` 文件中的 `mysql` `redis` 是否正确,能否正常连接

---

## 购买的插件无法使用

如果是付费插件请在QQ群或微信群联系管理员，提供订单号，管理员会拉你进对应的插件售后群

---



## 如何从 Swoole 切换到 Swow

::: warning

Swow 安装请参考 [Swow 官方文档](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F) 

:::

1. copy 项目目录下的 `.github/ci/server.php` 覆盖 `config/autoload/server.php`
2. copy 项目目录下的 `.github/ci/hyperf.php` 覆盖 `bin/hyperf.php`

重新启动即可

---


## 安装了插件后，提交到git后，线上部署拉取代码(或者其他人拉取代码)，前端访问插件的后端接口报not fund

1. plugin/mine-admin下面的插件中install.lock 必须提交，否则插件的路由无法识别
2. gitignore中有*.lock，去掉这行


---


## 上传图片或文件，访问Not Found 问题

1. 生产环境下，建议使用nginx代理。

  使用Nginx 代理可以借鉴以下配置 （注意 env 配置 和上传目录权限）。请注意，以下路径仅为示例，需根据实际部署环境调整。
  假设资源url 为 https://example.com/uploads/**/****.png
```nginx
# 代理 uploads 中的图片资源
location /uploads/ {
    alias /www/wwwroot/MineAdmin/storage/uploads/;
    expires 30d;
    add_header Cache-Control "public";
    add_header Access-Control-Allow-Origin *;
    
    # 只允许图片文件
    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|bmp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 防止访问其他文件类型
    location ~* \.(php|html|htm|js|css)$ {
        deny all;
    }
}
```
::: warning

如果确认所有配置均正确，但仍无法访问并且出现 403 Forbidden，请检查 `uploads` 目录的权限是否设置为 755，并确保所属用户为 `www`。

:::

2. 开发环境下，在/config/autoload/server.php，配置如下：
```php
'settings' => [
  // 开启外部可以访问
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```
.env文件，APP_DEBUG改为true，配置后重启服务。

---

## Windows下使用Docker启动为什么这么慢

### 原因分析

在Windows系统下使用Docker时，启动速度慢主要是由于Docker的文件系统特性导致的。Docker在Windows上运行时，底层使用的是虚拟化技术（如WSL2或Hyper-V），当使用bind mount（绑定挂载）方式将Windows宿主机的目录挂载到容器内时，会产生跨文件系统的访问开销。

特别是当挂载包含大量小文件的目录（如`vendor`目录包含成千上万个依赖包文件，`runtime`目录包含日志和缓存文件）时，每次文件读写都需要经过：
1. 容器内的文件系统
2. Docker虚拟化层
3. Windows主机文件系统

这种跨文件系统的频繁I/O操作会显著降低性能，导致应用启动缓慢。

### 解决方案

通过使用Docker的命名卷（named volumes）来管理不需要频繁修改的目录，让这些目录完全在Docker内部的文件系统中管理，避免跨文件系统访问。同时只挂载必要的源代码目录，实现性能和开发便利性的平衡。

在`docker-compose.yml`中配置如下：

```yaml
services:
  hyperf:
    volumes:
      # 使用命名卷存储vendor和runtime，避免跨文件系统访问
      - vendor_data:/www/vendor
      - runtime_data:/www/runtime
      # 只挂载必要的源代码目录
      - ./app:/www/app
      - ./config:/www/config
      - ./bin:/www/bin
      - ./plugin:/www/plugin
      - ./databases:/www/databases
      - ./storage:/www/storage
      - ./web:/www/web
      - ./composer.json:/www/composer.json
      - ./composer.lock:/www/composer.lock
      - ./.env:/www/.env

# 定义命名卷
volumes:
  vendor_data:
  runtime_data:
```

**配置说明：**
- `vendor_data` 和 `runtime_data` 是Docker命名卷，数据存储在Docker管理的空间中，I/O性能接近原生
- 源代码目录（如`app`、`config`等）仍然挂载到宿主机，方便实时编辑和调试
- `composer.json`、`composer.lock`和`.env`单独挂载，确保依赖配置和环境变量可以实时同步

采用这种配置后，应用启动速度可以显著提升。
