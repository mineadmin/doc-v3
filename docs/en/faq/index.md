# Frequently Asked Questions

---

## Error `DNS Lookup resolve failed` after successful installation

Check whether the `mysql` and `redis` configurations in the `.env` file are correct and whether they can connect normally.

---

## Purchased plugins are not working

For paid plugins, please contact the administrator in the QQ or WeChat group, provide the order number, and the administrator will add you to the corresponding plugin after-sales group.

---

## How to switch from Swoole to Swow

::: warning

For Swow installation, please refer to the [Swow Official Documentation](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F)

:::

1. Copy `server.php` from the `.github/ci/` directory in the project and overwrite `config/autoload/server.php`.
2. Copy `hyperf.php` from the `.github/ci/` directory in the project and overwrite `bin/hyperf.php`.

Restart the service afterward.

---

## After installing a plugin, submitting to Git, and deploying the code online (or when others pull the code), accessing the plugin's backend API returns "not found"

1. The `install.lock` file in the plugin directory under `plugin/mine-admin/` must be committed; otherwise, the plugin's routes will not be recognized.
2. Remove the `*.lock` line from `.gitignore`.

---

## "Not Found" error when accessing uploaded images or files

1. In a production environment, it is recommended to use Nginx as a proxy.

   The following Nginx configuration can be used as a reference (note the `.env` configuration and upload directory permissions). Please adjust the paths according to your actual deployment environment.
   Assuming the resource URL is `https://example.com/uploads/**/****.png`:
```nginx
# Proxy for image resources in the uploads directory
location /uploads/ {
    alias /mineadmin/storage/uploads/; # Example path, adjust according to your deployment environment
    expires 7d;
    add_header Cache-Control "public";  # Allow all users and intermediate caching servers (e.g., CDNs) to cache this resource for improved efficiency
    add_header Access-Control-Allow-Origin https://example.com;  # Only allow cross-origin requests from https://example.com for enhanced security
}
```

::: warning

If all configurations are confirmed to be correct but you still cannot access the site and encounter a 403 Forbidden error, please check whether the `uploads` directory permissions are set to 755 and ensure that the owner is `www`.

:::

2. In a development environment, configure the following in `/config/autoload/server.php`:
```php
'settings' => [
  // Enable external access
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```
In the `.env` file, set `APP_DEBUG` to `true`. After configuration, restart the service.

---

## Why is Docker startup so slow on Windows?

### Root Cause

When using Docker on Windows systems, slow startup speeds are primarily caused by Docker's file system characteristics. Docker on Windows runs on virtualization technology (such as WSL2 or Hyper-V). When using bind mounts to mount Windows host directories into containers, cross-filesystem access overhead occurs.

This is especially noticeable when mounting directories with a large number of small files (such as the `vendor` directory containing thousands of dependency files, and the `runtime` directory containing logs and cache files). Each file read/write operation must go through:
1. Container's file system
2. Docker virtualization layer
3. Windows host file system

This frequent cross-filesystem I/O significantly reduces performance, causing slow application startup.

### Solution

Use Docker named volumes to manage directories that don't need frequent modification, allowing these directories to be fully managed within Docker's internal file system, avoiding cross-filesystem access. Meanwhile, only mount necessary source code directories to balance performance and development convenience.

Configure in `docker-compose.yml` as follows:

```yaml
services:
  hyperf:
    volumes:
      # Use named volumes for vendor and runtime to avoid cross-filesystem access
      - vendor_data:/www/vendor
      - runtime_data:/www/runtime
      # Only mount necessary source code directories
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
- `vendor_data` and `runtime_data` are Docker named volumes, with data stored in Docker-managed space for near-native I/O performance
- Source code directories (such as `app`, `config`, etc.) are still mounted to the host for real-time editing and debugging
- `composer.json`, `composer.lock`, and `.env` are mounted separately to ensure dependency configurations and environment variables can be synchronized in real-time

With this configuration, application startup speed can be significantly improved.