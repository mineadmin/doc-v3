# Deployment

This article explains how to deploy MineAdmin's frontend and backend applications in a production environment.

## Backend

### Service Deployment

Generally, for modern server-side applications, Docker is the preferred method for service deployment.  
MineAdmin provides an out-of-the-box [Dockerfile](https://github.com/mineadmin/MineAdmin/blob/master/Dockerfile) to facilitate quick service deployment.  
In some cases, bare-metal server deployment may be necessary. Below, we introduce two deployment methods for a smooth setup.

#### Direct Deployment on a Server

If you need to deploy MineAdmin directly on a server, ensure the server meets the following system requirements:

::: tip  
For PHP and extension installation, please refer to relevant tutorials as they are not covered here.  
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

This will start the service successfully.  

By default, the application does not support daemon processes. We recommend using third-party tools like [supervisord](http://www.supervisord.org/) for persistent process management.  
For usage details, refer to the [Hyperf Documentation](https://hyperf.wiki).  

#### Containerized Deployment (Recommended)  

If you prefer deploying as a containerized service, use the provided Dockerfile in the project.  

First, ensure Docker is installed on your server.  

Then, navigate to your project directory:  

```shell  
cd yourProject  
```  

Execute `docker build . -t mineadmin` to build the image:  

```shell  
# For -t parameter details, refer to Docker documentation.  
docker build . -t mineadmin  
```  

Next, start a container with `docker run`:  

```shell  
docker run -d --name mineadmin mineadmin  
```  

This completes the backend service deployment.  

---  

::: tip  
Both deployment methods assume the <el-tag type="danger">.env</el-tag> file is properly configured.  
:::  

### Reverse Proxy  

<el-alert type="warning">Never expose the application directly to the public network. Always use a reverse proxy.</el-alert>  

Below are reverse proxy configuration examples.  

#### Nginx  

If deploying on an Nginx server, use the following configuration as a starting point:  

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

If deploying in a Kubernetes cluster, refer to the following configurations.  

##### Create a Service  

```yaml  
# Kubernetes API version  
apiVersion: v1  
# Resource type: Service  
kind: Service  
# Service metadata  
metadata:  
  # Service name  
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
# Resource type: Ingress  
kind: Ingress  
metadata:  
  # Ingress name  
  name: mineadmin-ingress  
  annotations:  
    # Rewrite target path  
    nginx.ingress.kubernetes.io/rewrite-target: /  
spec:  
  # Ingress routing rules  
  rules:  
      # For hostname www.mineadmin.com  
    - host: www.mineadmin.com  
      # HTTP request handling  
      http:  
        paths:  
          # Match root path  
          - path: /  
            # Path match type: Prefix  
            pathType: Prefix  
            # Backend service for routing  
            backend:  
              # Kubernetes service backend  
              service:  
                # Backend service name  
                name: mineadmin-service  
                # Backend service port  
                port:  
                  number: 80  
```  

### Debug Mode  

In the `config/config.php` file, the debug option determines how much error information is displayed to users. By default, this setting follows the `APP_DEBUG` environment variable stored in your `.env` file.  

::: warning  
In production, this value must always be `false`. Setting it to `true` risks exposing sensitive information to users.  
:::  

## Frontend  

### Service Deployment  

#### Direct Deployment on a Server  

To deploy the MineAdmin frontend on a server (e.g., using Nginx):  

1. Generate static resources by running `pnpm build` in the `web` directory of your project.  
   - This can be done on the server or locally in advance.  

2. Place the static resources in the site directory to complete the setup.  

#### Containerized Deployment (Recommended)  

Similar to the backend, we provide a Dockerfile for frontend deployment.  

Navigate to your `application/web` directory and execute:  

```shell  
docker build . -t frontend  
```  

This builds an Nginx image.  

Start a container service using:  

```shell  
docker run -d --name frontend frontend  
```  

Configure the site's reverse proxy to `[container IP:80]` to complete deployment.