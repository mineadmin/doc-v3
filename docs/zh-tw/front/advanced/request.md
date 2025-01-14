# 請求與攔截器
MineAdmin基於 [axios](https://github.com/axios/axios) 作為請求庫，同時提供了請求攔截器，方便開發者對請求進行統一處理。

## 請求

### 說明

系統內封裝了兩種請求處理：
- 一種僅對 `MineAdmin` 後端的請求封裝，只適合 `MineAdmin` 的**後端**。
- 一種是可請求外部網路或者其他後端介面的封裝。

### 使用
在前端全域性任何位置，且無需顯性載入，即可使用 `useHttp()`，注意，這個方式僅對 `MineAdmin` 後端有效

```ts
// 獲取請求例項
const http = useHttp()

// get 請求
http.get('/xxxx?id=1')
// post 請求
http.post('/xxxx', { username: 'test' })
// put 請求
http.put('/xxxx/1', { other: 'update' })
// delete 請求
http.delete('/xxxx/2')


```

以上請求，系統會自動處理 `token`、`error` 等，開發者無需關心，
如果需要傳入其他配置，例如: `header`，`timeout` 等引數，只需要在後面加引數傳入即可。

### token重新整理
`useHttp()` 內部已經封裝了自動續期 `token` 功能，具體原理可檢視 [後端文件](/zh-tw/backend/security/passport.md) 這裡不再贅述。

### 請求外部網路
以上都是針對 `MineAdmin` 後端請求的說明，外部網路請求方式如下：
```ts
import request from '@/utils/http'

const { createHttp } = request

// 設定baseurl 和 其他引數
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

## 攔截器

`MineAdmin` 已經封裝了攔截器，但需要說明只適配 `MineAdmin` 的後端介面，如果需要調整、修改，開啟 `src/utils/http.ts` 檔案
找到下面這段程式碼：
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
              Message.error('登入狀態已過期，需要重新登入', { zIndex: 9999 })
              await useUserStore().logout()
            },
            3000,
            { maxWait: 5000 },
          )
          // 檢查token是否需要重新整理
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
          Message.error('伺服器資源不存在', { zIndex: 9999 })
          break
        case ResultCode.FORBIDDEN:
          Message.error('沒有許可權訪問此介面', { zIndex: 9999 })
          break
        case ResultCode.METHOD_NOT_ALLOWED:
          Message.error('請求方法不被允許', { zIndex: 9999 })
          break
        case ResultCode.FAIL:
          Message.error('伺服器內部錯誤', { zIndex: 9999 })
          break
        default:
          Message.error(response?.data?.message ?? '未知錯誤', { zIndex: 9999 })
          break
      }

      return Promise.reject(response.data ? response.data : null)
    }
  },
  async (error: any) => {
    isLoading.value = false
    const serverError = useDebounceFn(async () => {
      if (error && error.response && error.response.status === 500) {
        Message.error(error.message ?? '伺服器內部錯誤', { zIndex: 9999 })
      }
    }, 3000, { maxWait: 5000 })
    await serverError()
    return Promise.reject(error)
  },
)
```
