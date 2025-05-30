# Requests and Interceptors

MineAdmin is based on [axios](https://github.com/axios/axios) as the request library and provides request interceptors to facilitate developers in handling requests uniformly.

## Requests

### Description

The system encapsulates two types of request handling:
- One is specifically for the `MineAdmin` backend, suitable only for the **backend** of `MineAdmin`.
- The other is a more general encapsulation that can be used to request external networks or other backend interfaces.

### Usage

You can use `useHttp()` anywhere globally in the frontend without explicitly loading it. Note that this method is only effective for the `MineAdmin` backend.

```ts
// Get the request instance
const http = useHttp()

// GET request
http.get('/xxxx?id=1')
// POST request
http.post('/xxxx', { username: 'test' })
// PUT request
http.put('/xxxx/1', { other: 'update' })
// DELETE request
http.delete('/xxxx/2')
```

The system will automatically handle `token`, `error`, etc., so developers don't need to worry about these. If you need to pass other configurations, such as `header`, `timeout`, etc., you can simply add them as parameters.

### Token Refresh

`useHttp()` internally encapsulates the automatic token renewal functionality. For specific principles, please refer to the [Backend Documentation](/en/backend/security/passport.md), which will not be repeated here.

### Requesting External Networks

The above explanations are for requests to the `MineAdmin` backend. For external network requests, the method is as follows:

```ts
import request from '@/utils/http'

const { createHttp } = request

// Set baseurl and other parameters
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

## Interceptors

`MineAdmin` has already encapsulated interceptors, but it should be noted that they are only adapted for the `MineAdmin` backend interfaces. If adjustments or modifications are needed, open the `src/utils/http.ts` file and locate the following code:

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
              Message.error('Login status has expired, please log in again', { zIndex: 9999 })
              await useUserStore().logout()
            },
            3000,
            { maxWait: 5000 },
          )
          // Check if the token needs to be refreshed
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
          Message.error('Server resource does not exist', { zIndex: 9999 })
          break
        case ResultCode.FORBIDDEN:
          Message.error('No permission to access this interface', { zIndex: 9999 })
          break
        case ResultCode.METHOD_NOT_ALLOWED:
          Message.error('Request method not allowed', { zIndex: 9999 })
          break
        case ResultCode.FAIL:
          Message.error('Internal server error', { zIndex: 9999 })
          break
        default:
          Message.error(response?.data?.message ?? 'Unknown error', { zIndex: 9999 })
          break
      }

      return Promise.reject(response.data ? response.data : null)
    }
  },
  async (error: any) => {
    isLoading.value = false
    const serverError = useDebounceFn(async () => {
      if (error && error.response && error.response.status === 500) {
        Message.error(error.message ?? 'Internal server error', { zIndex: 9999 })
      }
    }, 3000, { maxWait: 5000 })
    await serverError()
    return Promise.reject(error)
  },
)
```