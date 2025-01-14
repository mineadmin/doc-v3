# Build and Preview

## Build (Packaging)
After the project development is completed, to deploy it on the server, the front-end project needs to be built and packaged.

Execute the `pnpm run build` command to perform the build. Upon successful packaging, a `dist` folder will be generated in the `./web` directory, containing the packaged static files.

::: info Tip
If the access address is not the root node of the domain, such as `https://www.example.com/app`, you need to modify the `VITE_APP_ROOT_BASE` option in the `environment variable file` to `/app`; otherwise, resource reference errors may occur.
:::

## Preview
To ensure that the built and packaged project runs correctly, it is generally necessary to test it locally.

At this point, you can execute the `pnpm run serve` command to preview the packaged project and access the backend server under real conditions.

## Compression
Set `VITE_BUILD_COMPRESS` in the `environment variable file` to generate `.gz` or `.br` files during the build and packaging process. However, both require the installation of specific modules in `nginx` and must be enabled to take effect.
```yaml
# Enable gzip alone
VITE_BUILD_COMPRESS = gzip

# Enable brotli alone, which is an algorithm with a higher compression rate than gzip
VITE_BUILD_COMPRESS = brotli

# Or you can enable both, as they can coexist
VITE_BUILD_COMPRESS = gzip,brotli
```