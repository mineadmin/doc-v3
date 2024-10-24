# 请求与拦截器
MineAdmin基于 [axios](https://github.com/axios/axios) 作为请求库，同时提供了请求拦截器，方便开发者对请求进行统一处理。

## 请求

### 说明

系统内封装了两种请求处理：
- 一种仅对 `MineAdmin` 后端的请求封装，只适合 `MineAdmin` 的**后端**。
- 一种是可请求外部网络或者其他后端接口的封装。

### 使用
在前端全局任何位置，且无需显性加载，即可使用 `useHttp()`，注意，这个方式仅对 `MineAdmin` 后端有效

```ts
// 获取请求实例
const http = useHttp()

// get 请求
http.get('/xxxx?id=1')
// post 请求
http.post('/xxxx', { username: 'test' })
// put 请求
http.put('/xxxx/1', { other: 'update' })
// delete 请求
http.delete('/xxxx/2')


```

以上请求，系统会自动处理 `token`、`error` 等，开发者无需关心，
如果需要传入其他配置，例如: `header`，`timeout` 等参数，只需要在后面加参数传入即可。

### token刷新
`useHttp()` 内部已经封装了自动续期 `token` 功能，具体原理可查看 [后端文档](/zh/backend/security/passport.md) 这里不再赘述。

### 请求外部网络
以上都是针对 `MineAdmin` 后端请求的说明，外部网络请求方式如下：
```ts
import request from '@/utils/http'

const { createHttp } = request

// 设置baseurl 和 其他参数
const http = createHttp('https://www.baidu.com', {
  header: {
    'user-agent': 'Windows NT',
  }
})

const requestHome = async () => {
  return await http.get('/')
}

console.log(requestHome())
```

## 拦截器

`MineAdmin` 已经封装了拦截器，但需要说明只适配 `MineAdmin` 的后端接口，如果需要调整、修改，打开 `src/utils/http.ts` 文件
找到下面这段代码：
```ts:line-numbers
http.interceptors.response.use(
  async (response: AxiosResponse): Promise<any> => {
    isLoading.value = false
    const userStore = useUserStore()
    await usePluginStore().callHooks('networkResponse', response)
    const config = response.config
    if ((response.request.responseType === 'blob'
        || response.request.responseType === 'arraybuffer')
      && !/^application\/json/.test(response.headers['content-type'])
      && response.status === ResultCode.SUCCESS
    ) {
      return Promise.resolve(response.data)
    }

    if (response?.data?.code === ResultCode.SUCCESS) {
      return Promise.resolve(response.data)
    }
    else {
      switch (response?.data?.code) {
        case ResultCode.UNAUTHORIZED: {
          const logout = useDebounceFn(
            async () => {
              Message.error('登录状态已过期，需要重新登录', { zIndex: 9999 })
              await useUserStore().logout()
            },
            3000,
            { maxWait: 5000 },
          )
          // 检查token是否需要刷新
          if (userStore.isLogin && !isRefreshToken.value) {
            isRefreshToken.value = true
            if (!cache.get('refresh_token')) {
              await logout()
              break
            }

            try {
              const refreshTokenResponse = await createHttp(null, {
                headers: {
                  Authorization: `Bearer ${cache.get('refresh_token')}`,
                },
              }).post('/admin/passport/refresh')

              if (refreshTokenResponse.data.code !== 200) {
                await logout()
                break
              }
              else {
                const { data } = refreshTokenResponse.data
                userStore.token = data.access_token
                cache.set('token', data.access_token)
                cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
                cache.set('refresh_token', data.refresh_token)

                config.headers!.Authorization = `Bearer ${userStore.token}`
                requestList.value.map((cb: any) => cb())
                requestList.value = []
                return http(config)
              }
            }
              // eslint-disable-next-line unused-imports/no-unused-vars
            catch (e: any) {
              requestList.value.map((cb: any) => cb())
              await logout()
              break
            }
            finally {
              requestList.value = []
              isRefreshToken.value = false
            }
          }
          else {
            return new Promise((resolve) => {
              requestList.value.push(() => {
                config.headers!.Authorization = `Bearer ${cache.get('token')}`
                resolve(http(config))
              })
            })
          }
        }
        case ResultCode.NOT_FOUND:
          Message.error('服务器资源不存在', { zIndex: 9999 })
          break
        case ResultCode.FORBIDDEN:
          Message.error('没有权限访问此接口', { zIndex: 9999 })
          break
        case ResultCode.METHOD_NOT_ALLOWED:
          Message.error('请求方法不被允许', { zIndex: 9999 })
          break
        case ResultCode.FAIL:
          Message.error('服务器内部错误', { zIndex: 9999 })
          break
        default:
          Message.error(response?.data?.message ?? '未知错误', { zIndex: 9999 })
          break
      }

      return Promise.reject(response.data ? response.data : null)
    }
  },
  async (error: any) => {
    isLoading.value = false
    const serverError = useDebounceFn(async () => {
      if (error && error.response && error.response.status === 500) {
        Message.error(error.message ?? '服务器内部错误', { zIndex: 9999 })
      }
    }, 3000, { maxWait: 5000 })
    await serverError()
    return Promise.reject(error)
  },
)
```
