# Frequently Asked Questions

---

## Error `DNS Lookup resolve failed` after successful installation

Check whether `mysql` and `redis` in the `.env` file are correct and can be connected normally.

---

## Purchased plugin cannot be used

If it is a paid plugin, please contact the administrator via QQ group or WeChat group, providing the order number. The administrator will add you to the corresponding plugin after-sales group.

---

## How to switch from Swoole to Swow

::: warning

For Swow installation, please refer to the [Swow Official Documentation](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F)

:::

1. Copy `.github/ci/server.php` from the project directory to overwrite `config/autoload/server.php`
2. Copy `.github/ci/hyperf.php` from the project directory to overwrite `bin/hyperf.php`

Restart the service to apply the changes.

---

## After installing a plugin, committing to git, deploying online by pulling the code (or others pulling the code), accessing the backend interface of the plugin via the frontend returns a `not found` error

1. The `install.lock` file within the plugin directory under `plugin/mine-admin` must be committed; otherwise, the plugin's routes cannot be recognized.
2. Remove the `*.lock` line from the `.gitignore` file.

---

## Image or File Upload Results in `Not Found` Error

1. In a production environment, it is recommended to use Nginx as a proxy.

   When using Nginx as a proxy, refer to the following configuration (note the `.env` configuration and the permissions of the upload directory). Please note that the paths below are only examples and need to be adjusted according to the actual deployment environment.
   Assume the resource URL is `https://example.com/uploads/**/****.png`.
```nginx
# Proxy image resources in uploads
location /uploads/ {
    alias /www/wwwroot/MineAdmin/storage/uploads/;
    expires 30d;
    add_header Cache-Control "public";
    add_header Access-Control-Allow-Origin *;
    
    # Allow only image files
    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|bmp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Block access to other file types
    location ~* \.(php|html|htm|js|css)$ {
        deny all;
    }
}
```
::: warning

If all configurations are confirmed to be correct, but access still fails with a 403 Forbidden error, please check that the permissions for the `uploads` directory are set to 755 and that the owner is `www`.

:::

2. In a development environment, configure `/config/autoload/server.php` as follows:
```php
'settings' => [
  // Enable external access
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```
In the `.env` file, set `APP_DEBUG` to `true`, then restart the service.

---

## Why is starting with Docker on Windows so slow?

### Cause Analysis

When using Docker on the Windows system, the slow startup speed is primarily due to the characteristics of Docker's file system. When Docker runs on Windows, it uses virtualization technology (such as WSL2 or Hyper-V) at the底层. When using bind mount to mount a directory from the Windows host into the container, overhead occurs when accessing files across different file systems.

This is especially true when the mounted directory contains a large number of small files (e.g., the `vendor` directory with thousands of dependency packages, the `runtime` directory with log and cache files). Every file read/write operation needs to go through:
1. The file system inside the container
2. The Docker virtualization layer
3. The Windows host file system

This frequent cross-filesystem I/O significantly degrades performance, causing slow application startup.

### Solution

Use Docker named volumes to manage directories that do not require frequent modifications, allowing these directories to be managed entirely within Docker's internal file system, thus avoiding cross-filesystem access. Only mount the necessary source code directories to achieve a balance between performance and development convenience.

Configure in `docker-compose.yml` as follows:

```yaml
services:
  hyperf:
    volumes:
      # Use named volumes for vendor and runtime to avoid cross-filesystem access
      - vendor_data:/www/vendor
      - runtime_data:/www/runtime
      # Mount only necessary source code directories
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

# Define named volumes
volumes:
  vendor_data:
  runtime_data:
```

**Configuration Explanation:**
- `vendor_data` and `runtime_data` are Docker named volumes. Data is stored in space managed by Docker, providing near-native I/O performance.
- Source code directories (like `app`, `config`, etc.) are still mounted to the host machine for convenient real-time editing and debugging.
- `composer.json`, `composer.lock`, and `.env` are mounted separately to ensure dependency configurations and environment variables can be synchronized in real-time.

With this configuration, application startup speed can be significantly improved.

---

## Scheduled Task - Command Type, Only Successful on First Run, All Subsequent Runs Fail.

For the target invocation, you need to add the `--disable-event-dispatcher: true` configuration.
That is, the `value` field in the crontab table should be:
```json
{"command":"mine:xxx","--disable-event-dispatcher":true}
```

Detailed documentation: https://hyperf.wiki/3.1/#/zh-cn/crontab