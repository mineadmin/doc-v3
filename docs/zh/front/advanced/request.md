# 请求与拦截器
MineAdmin基于 [axios](https://github.com/axios/axios) 作为请求库，同时提供了请求拦截器，方便开发者对请求进行统一处理。

## 说明

系统内封装了两种请求处理：
- 一种仅对 `MineAdmin` 后端的请求封装，只适合 `MineAdmin` 的**后端**。
- 一种是可请求外部网络或者其他后端接口的封装。

## 使用
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

## token刷新
`useHttp()` 内部已经封装了自动续期 `token` 功能，具体原理可查看 [后端文档](/zh/backend/security/passport.md) 这里不再赘述。

## 请求外部网络
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