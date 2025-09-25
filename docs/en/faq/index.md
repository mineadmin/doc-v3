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