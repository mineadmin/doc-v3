# Deployment

This article will explain how to deploy the frontend and backend applications of MineAdmin in a production environment.

## Backend

### Service Deployment

Generally, in modern server-side applications, deployment is usually done using Docker. MineAdmin also provides an out-of-the-box [Dockerfile](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile) to allow for quick service deployment. In some cases, you may need to deploy directly on a server. Below are two deployment methods to get you started quickly.

#### Direct Deployment on a Server

If you need to deploy MineAdmin directly on a server, the server must meet the following system requirements:

::: tip
Please search for relevant tutorials on installing PHP and its extensions, as this will not be explained here.
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

This will start the application successfully.

By default, the application does not provide a daemon option. We recommend using third-party applications like [supervisord](http://www.supervisord.org/) to keep the application running persistently. For more information, refer to the [Hyperf documentation](https://hyperf.wiki).

#### Container Deployment (Recommended)

If you want to deploy the application as a container service, you can use the Dockerfile provided in the project. The process is straightforward.

First, ensure that [Docker](https://www.docker.com/) is installed on the server.

Then, navigate to your project directory:

```shell
cd yourProject
```

Execute `docker build . -t mineadmin` to build the image:

```shell
# -t parameter details can be found online, not explained here
docker build . -t mineadmin
```

Next, execute `docker run` to start a container:

```shell
docker run -d --name mineadmin mineadmin
```

This completes the deployment of the project's backend service.

---

::: tip
The above two deployment methods assume that the <el-tag type="danger">.env</el-tag> file has already been configured.
:::

### Reverse Proxy

<el-alert type="warning">It is never recommended to expose the application directly to the public network. It is best to add a layer of proxy forwarding.</el-alert>

This article will provide several reverse proxy examples.

#### Nginx

If you deploy the application on a server running Nginx, you can refer to the following reverse proxy configuration file as a starting point for your site.

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

If you deploy the application in a K8s cluster, you can refer to the following configuration instructions.

##### Create a Service

```yaml
# Kubernetes API version
apiVersion: v1
# Resource object type is Service
kind: Service
# Service metadata
metadata:
  # Name of the service
  name: mineadmin-service
# Service specification
spec:
  # Selector to associate the service with Pods
  selector:
    app: mineadmin-server
  # Ports exposed by the service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9501
```

##### Create Ingress Resource

```yaml
apiVersion: networking.k8s.io/v1
# Resource object type is Ingress
kind: Ingress
metadata:
  # Name of the Ingress resource
  name: mineadmin-ingress
  annotations:
    # Rewrite target path
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  # List of Ingress rules
  rules:
      # Applies to requests with hostname www.mineadmin.com
    - host: www.mineadmin.com
      # Handle HTTP requests
      http:
        paths:
          # Match the root path
          - path: /
            # Path matching type is Prefix
            pathType: Prefix
            # Define the backend service to which requests are routed
            backend:
              # Specify the backend service as a Kubernetes service
              service:
                # Name of the backend service is "mineadmin-service", as defined earlier
                name: mineadmin-service
                # Port number of the backend service is 80. Requests will be forwarded to this port.
                port:
                  number: 80
```

### Debug Mode

In the `config/config.php` configuration file, the debug option determines how much error information is actually displayed to the user. By default, this option is set according to the environment variable `APP_DEBUG`, which is stored in your project's `.env` file.

::: warning
In a production environment, this value should always be `false`. Setting it to `true` in a production environment may risk exposing sensitive information to users.
:::

## Frontend

### Service Deployment

#### Direct Deployment on a Server

If you want to deploy the MineAdmin frontend service directly on a server, using the classic Nginx service as an example:

First, generate static resources by executing `pnpm build` in your project's `web` directory. Note: This can be done on the server or locally in advance.

Then, place your static resources in the site directory to complete the installation.

#### Container Deployment (Recommended)

Similar to the backend, we provide a `Dockerfile` for frontend packaging. Navigate to your application's `web` directory and execute:

```shell
docker build . -t frontend
```

This will package the application into an Nginx image.

You can then start a container service using this image:

```shell
docker run -d --name frontend frontend
```

Configure the site's reverse proxy to `[container IP:80]` to complete the deployment.