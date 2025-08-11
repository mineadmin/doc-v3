# Deployment

This article will explain how to deploy the frontend and backend applications of MineAdmin in a production environment.

## Backend

### Service Deployment

Generally, in modern server-side applications, deployment is typically handled using Docker. MineAdmin also provides an out-of-the-box [Dockerfile](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile) to enable quick service deployment. In some cases, bare-metal deployment on a server may be required. Below are two deployment methods for quick setup.

#### Direct Deployment on a Server

If you need to deploy MineAdmin directly on a server, the server must meet the following system requirements:

::: tip
Please refer to other tutorials for PHP and extension installations, as they are not covered here.
:::

* PHP >= 8.1
* cURL PHP Extension
* Fileinfo PHP Extension
* OpenSSL PHP Extension
* PDO Extension
* Redis Extension
* Json Extension
* PDO_MYSQL Extension (Optional)
* PDO_PGSQL Extension (Optional)
* Swoole >= 5.1 Extension (Optional)
* Swow >= 1.5 or develop (Optional)

Navigate to the project directory and execute:

```shell
php bin/hyperf.php start
```

The service will start successfully.

By default, the application does not support daemon processes. We recommend using third-party tools like [supervisord](http://www.supervisord.org/) to ensure the application runs persistently. For usage, refer to the [Hyperf Documentation](https://hyperf.wiki).

#### Containerized Deployment (Recommended)

If you prefer deploying the application as a containerized service, you can use the project's Dockerfile. The process is straightforward.

First, ensure Docker is installed on your server. Then, navigate to your project directory:

```shell
cd yourProject
```

Execute `docker build . -t mineadmin` to build the image:

```shell
# For details on the `-t` parameter, please search online as it is not explained here.
docker build . -t mineadmin
```

Next, run the container using `docker run`:

```shell
docker run -d --name mineadmin mineadmin
```

This completes the backend deployment.

---

::: tip
Both deployment methods assume the <el-tag type="danger">.env</el-tag> file has already been configured.
:::

### Reverse Proxy

<el-alert type="warning">It is never advisable to expose the application directly to the public internet. Always use a reverse proxy.</el-alert>

Below are examples of reverse proxy configurations.

#### Nginx

If the application is deployed on a server running Nginx, you can use the following configuration as a starting point:

```nginx
#PROXY-START/server

location ^~ /
{
    # Application port
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

If the application is deployed in a Kubernetes cluster, refer to the following configurations.

##### Create a Service

```yaml
# Kubernetes API version
apiVersion: v1
# Resource type is Service
kind: Service
# Service metadata
metadata:
  # Name of the service
  name: mineadmin-service
# Service specification
spec:
  # Selector for associated Pods
  selector:
    app: mineadmin-server
  # Exposed ports
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9501
```

##### Create an Ingress Resource

```yaml
apiVersion: networking.k8s.io/v1
# Resource type is Ingress
kind: Ingress
metadata:
  # Name of the Ingress resource
  name: mineadmin-ingress
  annotations:
    # Rewrite target path
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  # Ingress routing rules
  rules:
      # For requests with hostname www.mineadmin.com
    - host: www.mineadmin.com
      # Handle HTTP requests
      http:
        paths:
          # Match root path
          - path: /
            # Path matching type is Prefix
            pathType: Prefix
            # Backend service for routing
            backend:
              # Backend is a Kubernetes service
              service:
                # Name of the backend service
                name: mineadmin-service
                # Port number for the backend service
                port:
                  number: 80
```

### Debug Mode

In the `config/config.php` configuration file, the debug option determines how much error information is displayed to users. By default, this option follows the value of the environment variable `APP_DEBUG`, which is stored in your project's `.env` file.

::: warning
In production, this value should always be `false`. Setting it to `true` in production risks exposing sensitive information to users.
:::

## Frontend

### Service Deployment

#### Direct Deployment on a Server

If you want to deploy the MineAdmin frontend on a server, using Nginx as an example:

First, generate static resources by running `pnpm build` in your project's `web` directory. This can be done on the server or locally in advance.

Place the static resources in your site directory to complete the installation.

#### Containerized Deployment (Recommended)

Similar to the backend, we provide a Dockerfile for frontend deployment. Navigate to your `application/web` directory and execute:

```shell
docker build . -t frontend
```

This will build an Nginx image.

Start a container service using this image:

```shell
docker run -d --name frontend frontend
```

Configure the site's reverse proxy to `[Container IP:80]` to complete the deployment.