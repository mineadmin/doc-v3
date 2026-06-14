# リクエストとインターセプター

MineAdmin は [axios](https://github.com/axios/axios) をリクエストライブラリとして採用し、完全なリクエストインターセプターとレスポンス処理機構を提供しています。自動 Token リフレッシュ、エラーハンドリング、ローディング状態管理などの機能をサポートします。

## 概要

### 二重リクエストアーキテクチャ

システムは2つのリクエスト処理方法を提供し、異なるユースケースに対応します。

1. **内部リクエスト** - MineAdmin バックエンド API 専用のリクエストラッパー
   - JWT Token 認証を自動処理
   - エラーハンドリングとユーザー通知を内蔵
   - Token 自動リフレッシュ機構をサポート
   - ローディング状態管理を統合

2. **外部リクエスト** - サードパーティ API やその他のバックエンドサービス向けの汎用リクエスト
   - カスタム baseURL とリクエスト設定をサポート
   - インターセプターとエラーハンドリングを個別に設定可能
   - 柔軟なパラメーター受け渡し方式

### リクエスト処理フロー

```plantuml
@startuml
!define RECTANGLE class

participant "フロントエンドコンポーネント" as Frontend
participant "useHttp()" as UseHttp
participant "リクエストインターセプター" as RequestInterceptor
participant "レスポンスインターセプター" as ResponseInterceptor
participant "MineAdminバックエンド" as Backend
participant "Tokenリフレッシュサービス" as TokenRefresh

Frontend -> UseHttp: リクエストを送信
UseHttp -> RequestInterceptor: Authorizationヘッダーを追加
RequestInterceptor -> Backend: HTTPリクエストを送信

alt リクエスト成功
    Backend -> ResponseInterceptor: 成功レスポンスを返す
    ResponseInterceptor -> Frontend: データを返す
else Token期限切れ (401)
    Backend -> ResponseInterceptor: 401エラーを返す
    ResponseInterceptor -> TokenRefresh: Access Tokenをリフレッシュ
    alt Tokenリフレッシュ成功
        TokenRefresh -> ResponseInterceptor: 新しいTokenを返す
        ResponseInterceptor -> Backend: 元のリクエストを再送信
        Backend -> ResponseInterceptor: 成功レスポンスを返す
        ResponseInterceptor -> Frontend: データを返す
    else Tokenリフレッシュ失敗
        TokenRefresh -> ResponseInterceptor: リフレッシュ失敗
        ResponseInterceptor -> Frontend: ログインページにリダイレクト
    end
else その他のエラー
    Backend -> ResponseInterceptor: エラーレスポンスを返す
    ResponseInterceptor -> Frontend: エラーメッセージを表示
end
@enduml
```

## 内部リクエスト (useHttp)

### 基本的な使い方

プロジェクトの任意の場所で `useHttp()` 関数を直接使用でき、手動でインポートする必要はありません。

```ts
// リクエストインスタンスを取得
const http = useHttp()

// GET リクエスト - ユーザーリストを取得
const getUserList = async (params?: any) => {
  return await http.get('/admin/user/index', params)
}

// POST リクエスト - 新しいユーザーを作成
const createUser = async (userData: any) => {
  return await http.post('/admin/user/save', userData)
}

// PUT リクエスト - ユーザー情報を更新
const updateUser = async (id: number, userData: any) => {
  return await http.put(`/admin/user/update/${id}`, userData)
}

// DELETE リクエスト - ユーザーを削除
const deleteUser = async (id: number) => {
  return await http.delete(`/admin/user/destroy/${id}`)
}
```

### 高度な設定

追加の axios 設定パラメーターを渡すことができます。

```ts
const http = useHttp()

// リクエストタイムアウトを設定
const result = await http.get('/admin/user/index', {}, {
  timeout: 10000, // 10秒でタイムアウト
  headers: {
    'X-Custom-Header': 'CustomValue'
  }
})

// ファイルアップロードリクエスト
const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return await http.post('/admin/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 60000 // アップロードタイムアウトを60秒に設定
  })
}

// ファイルダウンロード
const downloadFile = async (fileId: string) => {
  return await http.get(`/admin/file/download/${fileId}`, {}, {
    responseType: 'blob' // バイナリデータ
  })
}
```

### 実際の使用例

コンポーネントでの完全な使用例

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const http = useHttp()
const users = ref([])
const loading = ref(false)

// ユーザーリストを取得
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await http.get('/admin/user/index', {
      page: 1,
      size: 20
    })
    
    users.value = response.data.items
    ElMessage.success('ユーザーリストの読み込みに成功しました')
  } catch (error) {
    ElMessage.error('ユーザーリストの読み込みに失敗しました')
    console.error('ユーザーリストの取得エラー:', error)
  } finally {
    loading.value = false
  }
}

// ユーザーを削除
const handleDeleteUser = async (userId: number) => {
  try {
    await http.delete(`/admin/user/destroy/${userId}`)
    ElMessage.success('ユーザーの削除に成功しました')
    fetchUsers() // リストを再読み込み
  } catch (error) {
    ElMessage.error('ユーザーの削除に失敗しました')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
```

## Token リフレッシュ機構

### 自動リフレッシュの原理

MineAdmin はデュアル Token ベースのシームレスなリフレッシュ機構を実装しています。

1. **Access Token** - 業務 API 認証に使用、有効期限は短め（デフォルト1時間）
2. **Refresh Token** - Access Token のリフレッシュに使用、有効期限は長め（デフォルト2時間）

```plantuml
@startuml
!define RECTANGLE class

state "通常リクエスト" as Normal
state "Token検証" as Verify
state "Token期限切れ" as Expired
state "Tokenリフレッシュ" as Refresh
state "再リクエスト" as Retry
state "ログインページ" as Login

[*] -> Normal: APIリクエストを送信
Normal -> Verify: バックエンドがTokenを検証
Verify -> Normal: Token有効
Verify -> Expired: Token期限切れ(401)
Expired -> Refresh: Refresh Tokenを使用
Refresh -> Retry: リフレッシュ成功
Refresh -> Login: リフレッシュ失敗
Retry -> Normal: 新しいTokenで再試行
Normal -> [*]: 結果を返す
Login -> [*]: ユーザーが再ログイン
@enduml
```

### 並行リクエスト処理

複数の並行リクエストがある場合、システムはインテリジェントに Token リフレッシュを処理します。

```ts
// 並行シナリオの例
const [users, roles, permissions] = await Promise.all([
  http.get('/admin/user/index'),
  http.get('/admin/role/index'), 
  http.get('/admin/permission/index')
])

// Token が期限切れの場合、リフレッシュは1回のみ実行され、他のリクエストは待機します
// リフレッシュ完了後、すべてのリクエストは新しい Token で再送信されます
```

具体的なリフレッシュ機構の詳細は[ユーザー認証ドキュメント](/v3/backend/security/passport.md)を参照してください。

## 外部リクエスト

### 基本的な使い方

サードパーティ API や非 MineAdmin バックエンドサービスへのリクエストに使用します。

```ts
import request from '@/utils/http'

const { createHttp } = request

// サードパーティAPIリクエストインスタンスを作成
const thirdPartyHttp = createHttp('https://api.example.com', {
  headers: {
    'User-Agent': 'MineAdmin/1.0',
    'X-API-Key': 'your-api-key'
  },
  timeout: 15000
})

// サードパーティAPIを使用
const getExternalData = async () => {
  try {
    const response = await thirdPartyHttp.get('/users')
    return response.data
  } catch (error) {
    console.error('サードパーティAPIリクエスト失敗:', error)
    throw error
  }
}
```

### 複数の外部サービス

異なる外部サービスごとに複数のリクエストインスタンスを作成できます。

```ts
// 地図サービスAPI
const mapHttp = createHttp('https://api.map.com', {
  headers: { 'Authorization': 'Bearer map-token' }
})

// 決済サービスAPI  
const paymentHttp = createHttp('https://api.payment.com', {
  headers: { 'Authorization': 'Bearer payment-token' }
})

// SMSサービスAPI
const smsHttp = createHttp('https://api.sms.com', {
  headers: { 'X-API-Key': 'sms-api-key' }
})

// 使用例
const sendSms = async (phone: string, message: string) => {
  return await smsHttp.post('/send', { phone, message })
}
```

## インターセプター詳細

### レスポンスインターセプターのソースコード分析

MineAdmin のレスポンスインターセプターは `src/utils/http.ts` ファイルにあり、主に以下のシナリオを処理します。

1. **成功レスポンス処理**
2. **Token 期限切れの自動リフレッシュ**  
3. **エラーステータスコード処理**
4. **ファイルダウンロードレスポンス処理**
#### コアインターセプターロジック

```ts:line-numbers
http.interceptors.response.use(
  async (response: AxiosResponse): Promise<any> => {
    isLoading.value = false
    const userStore = useUserStore()
    await usePluginStore().callHooks('networkResponse', response)
    const config = response.config
    
    // ファイルダウンロードレスポンスを処理
    if ((response.request.responseType === 'blob'
        || response.request.responseType === 'arraybuffer')
      && !/^application\/json/.test(response.headers['content-type'])
      && response.status === ResultCode.SUCCESS
    ) {
      return Promise.resolve(response.data)
    }

    // 成功レスポンスを処理
    if (response?.data?.code === ResultCode.SUCCESS) {
      return Promise.resolve(response.data)
    }
    else {
      // 異なるエラーコードに応じて処理
      switch (response?.data?.code) {
        case ResultCode.UNAUTHORIZED: {
          // Token 期限切れ処理ロジック
          const logout = useDebounceFn(
            async () => {
              Message.error('ログイン状態が期限切れです。再ログインが必要です', { zIndex: 9999 })
              await useUserStore().logout()
            },
            3000,
            { maxWait: 5000 },
          )
          
          // Token のリフレッシュが必要かチェック
          if (userStore.isLogin && !isRefreshToken.value) {
            isRefreshToken.value = true
            if (!cache.get('refresh_token')) {
              await logout()
              break
            }

            try {
              // Refresh Token を使用して Access Token をリフレッシュ
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
                // Token を更新し、リクエストを再送信
                const { data } = refreshTokenResponse.data
                userStore.token = data.access_token
                cache.set('token', data.access_token)
                cache.set('expire', useDayjs().unix() + data.expire_at, { exp: data.expire_at })
                cache.set('refresh_token', data.refresh_token)

                config.headers!.Authorization = `Bearer ${userStore.token}`
                requestList.value.map((cb: any) => cb())
                requestList.value = []
                return http(config) // 元のリクエストを再送信
              }
            }
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
            // Token リフレッシュ中の場合、リクエストをキューに追加して待機
            return new Promise((resolve) => {
              requestList.value.push(() => {
                config.headers!.Authorization = `Bearer ${cache.get('token')}`
                resolve(http(config))
              })
            })
          }
        }
        case ResultCode.NOT_FOUND:
          Message.error('サーバーリソースが見つかりません', { zIndex: 9999 })
          break
        case ResultCode.FORBIDDEN:
          Message.error('このインターフェースにアクセスする権限がありません', { zIndex: 9999 })
          break
        case ResultCode.METHOD_NOT_ALLOWED:
          Message.error('リクエストメソッドは許可されていません', { zIndex: 9999 })
          break
        case ResultCode.FAIL:
          Message.error('サーバー内部エラー', { zIndex: 9999 })
          break
        default:
          Message.error(response?.data?.message ?? '不明なエラー', { zIndex: 9999 })
          break
      }

      return Promise.reject(response.data ? response.data : null)
    }
  },
  // ネットワークエラー処理
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

### ステータスコード処理機構

システムは異なる HTTP ステータスコードと業務エラーコードを統一的に処理します。

| ステータスコード | 説明 | 処理方法 |
|--------|------|----------|
| `200` (SUCCESS) | リクエスト成功 | データを直接返す |
| `401` (UNAUTHORIZED) | Token 期限切れまたは無効 | Token を自動リフレッシュまたはログインページにリダイレクト |
| `403` (FORBIDDEN) | 権限不足 | 権限エラーメッセージを表示 |
| `404` (NOT_FOUND) | リソースが存在しない | リソース不在メッセージを表示 |
| `405` (METHOD_NOT_ALLOWED) | リクエストメソッドが許可されていない | メソッドエラーメッセージを表示 |
| `500` (INTERNAL_ERROR) | サーバー内部エラー | サーバーエラーメッセージを表示 |

### カスタムインターセプター

外部リクエスト用にカスタムインターセプターが必要な場合は、次のようにします。

```ts
import request from '@/utils/http'

const { createHttp } = request

// カスタムインターセプター付きリクエストインスタンスを作成
const customHttp = createHttp('https://api.custom.com')

// リクエストインターセプターを追加
customHttp.interceptors.request.use(
  (config) => {
    // リクエスト送信前に何らかの処理を行う
    config.headers['X-Timestamp'] = Date.now()
    console.log('リクエスト送信:', config)
    return config
  },
  (error) => {
    console.error('リクエストエラー:', error)
    return Promise.reject(error)
  }
)

// レスポンスインターセプターを追加
customHttp.interceptors.response.use(
  (response) => {
    // レスポンスデータを処理
    console.log('レスポンス受信:', response)
    if (response.data.status === 'error') {
      throw new Error(response.data.message)
    }
    return response
  },
  (error) => {
    // レスポンスエラーを処理
    console.error('レスポンスエラー:', error)
    return Promise.reject(error)
  }
)
```

## ベストプラクティス

### 1. エラーハンドリング

コンポーネント内でエラーを統一して処理することを推奨します。

```ts
// composables/useApi.ts
export const useApi = () => {
  const http = useHttp()
  
  const handleError = (error: any, defaultMessage = '操作に失敗しました') => {
    const message = error?.message || error?.data?.message || defaultMessage
    ElMessage.error(message)
    console.error('APIエラー:', error)
  }
  
  const safeRequest = async <T>(requestFn: () => Promise<T>, errorMessage?: string): Promise<T | null> => {
    try {
      return await requestFn()
    } catch (error) {
      handleError(error, errorMessage)
      return null
    }
  }
  
  return { http, handleError, safeRequest }
}
```

### 2. 型定義

API レスポンスに明確な型を定義します。

```ts
// types/api.ts
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface User {
  id: number
  username: string
  email: string
  status: number
}

// 使用例
const getUserList = async (): Promise<ApiResponse<PaginatedResponse<User>>> => {
  return await http.get('/admin/user/index')
}
```

### 3. リクエストラッピング

よく使う API リクエストを再利用可能なサービスにラップします。

```ts
// services/userService.ts
export class UserService {
  private http = useHttp()
  
  async getList(params: any) {
    return await this.http.get('/admin/user/index', params)
  }
  
  async create(user: Partial<User>) {
    return await this.http.post('/admin/user/save', user)
  }
  
  async update(id: number, user: Partial<User>) {
    return await this.http.put(`/admin/user/update/${id}`, user)
  }
  
  async delete(id: number) {
    return await this.http.delete(`/admin/user/destroy/${id}`)
  }
  
  async batchDelete(ids: number[]) {
    return await this.http.post('/admin/user/destroy', { ids })
  }
}

// サービスインスタンスを作成
export const userService = new UserService()
```

### 4. ローディング状態管理

ローディング状態を適切に使用してユーザー体験を向上させます。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const data = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const response = await http.get('/admin/data')
    data.value = response.data
  } catch (error) {
    console.error('データ読み込み失敗:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-loading="loading">
    <!-- データ表示内容 -->
  </div>
</template>
```

## よくある質問

### Q: Token リフレッシュ中の並行リクエストはどう処理されますか？

A: システムは Token を必要とするすべてのリクエストをキューに一時的に保存し、Token リフレッシュ完了後に新しい Token で一括して再送信します。

### Q: ファイルアップロードの進捗状況を処理するには？

A: axios の `onUploadProgress` 設定を使用します。

```ts
const uploadWithProgress = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return await http.post('/admin/upload', formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        onProgress(progress)
      }
    }
  })
}
```

### Q: 実行中のリクエストをキャンセルするには？

A: axios のキャンセルトークンを使用します。

```ts
import { ref, onUnmounted } from 'vue'

const controller = ref<AbortController>()

const fetchData = async () => {
  // 以前のリクエストをキャンセル
  controller.value?.abort()
  
  // 新しいコントローラーを作成
  controller.value = new AbortController()
  
  try {
    const response = await http.get('/admin/data', {}, {
      signal: controller.value.signal
    })
    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('リクエストはキャンセルされました')
    } else {
      throw error
    }
  }
}

// コンポーネントアンマウント時にリクエストをキャンセル
onUnmounted(() => {
  controller.value?.abort()
})
```