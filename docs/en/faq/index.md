# Frequently Asked Questions

---

## Error `DNS Lookup resolve failed` after successful installation

Check if the `mysql` and `redis` configurations in the `.env` file are correct and if they can connect properly.

---

## Purchased plugin not working

For paid plugins, please contact the administrator in the QQ or WeChat group. Provide your order number, and the administrator will add you to the corresponding plugin support group.

---

## How to switch from Swoole to Swow

::: warning

For Swow installation, please refer to the [Swow official documentation](https://docs.toast.run/swow-blog/chs/init.html#%E6%94%AF%E6%8C%81%E7%9A%84%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F).

:::

1. Copy `server.php` from the `.github/ci` directory in the project and overwrite `config/autoload/server.php`.
2. Copy `hyperf.php` from the `.github/ci` directory in the project and overwrite `bin/hyperf.php`.

Restart the service afterward.

---

## After installing a plugin, pushing to Git, and deploying the code online (or when others pull the code), accessing the plugin's backend API returns "Not Found"

1. The `install.lock` file in the plugin directory under `plugin/mine-admin` must be committed; otherwise, the plugin's routes will not be recognized.
2. Remove the `*.lock` line from `.gitignore`.

---

## "Not Found" error when accessing uploaded images or files

1. **Production Environment**: It is recommended to use Nginx as a proxy.

   Below is a sample Nginx configuration (note the `.env` settings and upload directory permissions). Adjust the paths according to your actual deployment environment.  
   Example resource URL: `https://example.com/uploads/**/****.png`

```nginx
# Proxy for image resources in the uploads directory
location /uploads/ {
    alias /mineadmin/storage/uploads/; # Example path, adjust based on your deployment
    expires 7d;
    add_header Cache-Control "public";  # Allows all users and intermediate cache servers (e.g., CDNs) to cache this resource, improving efficiency
    add_header Access-Control-Allow-Origin https://example.com;  # Only allows cross-origin requests from https://example.com, enhancing security
}
```

2. **Development Environment**: In `/config/autoload/server.php`, configure the following:

```php
'settings' => [
  // Enable external access
  Constant::OPTION_ENABLE_STATIC_HANDLER => env('APP_DEBUG', false),
  Constant::OPTION_DOCUMENT_ROOT => BASE_PATH . '/storage',
  //...
],
```

In the `.env` file, set `APP_DEBUG` to `true`. After configuration, restart the service.