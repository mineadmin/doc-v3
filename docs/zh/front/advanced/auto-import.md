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

在 `./vite` 目录下，有两个文件：`auto-import.ts` 和 `components.ts` 可定义自动导入的**包、函数、组件**等。

### 自动导入包、函数

在 `./vite/auto-import.ts` 中，可以定义自动导入的包或函数，例如：`vue-router`、`pinia`、`axios` 等

```ts{3-8,10-14}
export default function createAutoImport() {
  return autoImport({
    // 这里可以自定义导入的
    imports: [
      'vue',
      'vue-router',
      'pinia',
    ],
    dts: './types/auto-imports.d.ts',
    // 这里可加入自定义导入的函数库或者其他ts文件
    dirs: [
      './src/hooks/auto-imports/**',
      './src/store/modules/**',
    ],
  })
}
```

### 自动导入自定义组件库

在 `./vite/components.ts` 中，可以定义自动导入的组件库目录，系统内 `./src/components` 目录下的组件，无需显性导入。

```ts{2}
  return components({
  dirs: ['src/components'],
  include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
  dts: './types/components.d.ts',
})
```