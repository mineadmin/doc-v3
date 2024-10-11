# 基础概念

最新的 `3.0` 版本，整个项目进行了重构，现在我们将会介绍一些基础概念，以便于你更好的理解整个文档，请务必仔先阅读这一部分。

::: tip
以下所讲全部针对源码根目录下的 `./web` 里的结构
:::

## 全局类型

由于新版采用 `Typescript` 所写，全局的类型定义都在 `./types` 目录下存放着，可在里面找到相关的数据类型结构。

## 模块

新版本进行模块化划分，目录为 `./src/modules`。目录下可以存在不同的模块，每个模块管理着的所属业务的 `api`、`types`、`ts`以及`视图文件`。

## 插件

新版前端中新增了一个 `./src/plugins` 目录，专门存放独立应用或者插件等等。

## 别名系统
在 `vite.config.ts` 文件中定义了以下别名，在引入文件时可使用别名代替全量路径：

```json vite.config.ts
"resolve": {
    "alias": {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'types'),
        '$': path.resolve(__dirname, 'src/plugins'),
        '~': path.resolve(__dirname, 'src/modules'),
    },
},
```

- `@`：代表了 `./src` 目录，一般情况下所有前端项目默认都有此别名。
- `#`：代表了 `./types` 目录，可方便引入全局类型。
- `$`: 代表了 `./src/plugins` 目录，可方便快速的引入插件内的文件。
- `~`: 代表了 `./src/modules` 目录，可方便快速的引入模块内的文件。