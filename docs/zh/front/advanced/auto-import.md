# 自动导入


## 说明
在之前的 `2.x` 以及更古老的版本。

在使用 `Vue API` 的时候，都需要在文件内写入 `import { ref, ... } from 'vue'` 等等语句。
现在 `vite` 经过发展，社区的插件已经非常丰富，基于此，我们可以简化代码，提高开发效率，感谢那些大神提供的插件。

::: tip 说明
现在在开发 `*.vue、*.ts、*.tsx` 时，不需要手动引入以下 `API` 或者组件：

- Vue的所有api
- VueRouter
- Pinia
- 所有的 `store` 文件：`./src/store/modules/*` 
- hooks下自动导入目录：`./src/hooks/auto-imports/*`
- 以及 `./src/components/` 下的所有组件 `（只有 *.vue 类型文件可以不显性写导入）`
:::

## 自定义自动导入