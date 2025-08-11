# リクエストとインターセプター
MineAdminは[axios](https://github.com/axios/axios)をリクエストライブラリとして使用しており、同時にリクエストインターセプターを提供し、開発者がリクエストを統一処理するのを便利にしています。

## リクエスト

### 説明

システム内では2種類のリクエスト処理がカプセル化されています：
- MineAdminバックエンド専用のリクエストカプセル化で、MineAdminの**バックエンド**のみに適しています。
- 外部ネットワークや他のバックエンドインターフェースへのリクエストが可能なカプセル化です。

### 使用方法
フロントエンドのグローバルな任意の場所で、明示的なロードなしに`useHttp()`を使用できます。この方法はMineAdminバックエンドにのみ有効です。

```ts
// リクエストインスタンスを取得
const http = useHttp()

// getリクエスト
http.get('/xxxx?id=1')
// postリクエスト
http.post('/xxxx', { username: 'test' })
// putリクエスト
http.put('/xxxx/1', { other: 'update' })
// deleteリクエスト
http.delete('/xxxx/2')
```

上記のリクエストでは、システムが自動的に`token`や`error`などを処理するため、開発者が気にする必要はありません。
`header`や`timeout`などの他の設定を渡す必要がある場合は、後ろに引数を追加して渡すだけです。

### tokenの更新
`useHttp()`内部には自動的な`token`更新機能が組み込まれており、具体的な原理は[バックエンドドキュメント](/ja/backend/security/passport.md)で確認できます。ここでは詳しく説明しません。

### 外部ネットワークへのリクエスト
上記はすべてMineAdminバックエンドリクエストに関する説明です。外部ネットワークへのリクエスト方法は以下の通りです：
```ts
import request from '@/utils/http'

const { createHttp } = request

// baseurlと他のパラメータを設定
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

## インターセプター

MineAdminにはすでにインターセプターがカプセル化されていますが、MineAdminのバックエンドインターフェースにのみ適応していることに注意してください。調整や変更が必要な場合は、`src/utils/http.ts`ファイルを開き、以下のコードを見つけてください：
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
              Message.error('ログイン状態が期限切れです。再ログインが必要です', { zIndex: 9999 })
              await useUserStore().logout()
            },
            3000,
            { maxWait: 5000 },
          )
          // tokenの更新が必要か確認
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
          Message.error('サーバーリソースが存在しません', { zIndex: 9999 })
          break
        case ResultCode.FORBIDDEN:
          Message.error('このインターフェースへのアクセス権限がありません', { zIndex: 9999 })
          break
        case ResultCode.METHOD_NOT_ALLOWED:
          Message.error('リクエストメソッドが許可されていません', { zIndex: 9999 })
          break
        case ResultCode.FAIL:
          Message.error('サーバー内部エラー', { zIndex: 9999 })
          break
        default:
          Message.error(response?.data?.message ?? '未知のエラー', { zIndex: 9999 })
          break
      }

      return Promise.reject(response.data ? response.data : null)
    }
  },
  async (error: any) => {
    isLoading.value = false
    const serverError = useDebounceFn(async () => {
      if (error && error.response && error.response.status === 500) {
        Message.error(error.message ?? 'サーバー内部エラー', { zIndex: 9999 })
      }
    }, 3000, { maxWait: 5000 })
    await serverError()
    return Promise.reject(error)
  },
)
```