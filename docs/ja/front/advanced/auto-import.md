# 自動インポート

## 説明
以前の `2.x` やそれ以前のバージョンでは、

`Vue API` を使用する際には、ファイル内に `import { ref, ... } from 'vue'` などの記述が必要でした。
現在では `vite` が発展し、コミュニティのプラグインが非常に充実しているため、これらを活用することでコードを簡略化し、開発効率を向上させることができます。これらの素晴らしいプラグインを提供してくれた開発者の方々に感謝します。

::: tip 説明
現在、`*.vue`、`*.ts`、`*.tsx` の開発時には、以下の `API` やコンポーネントを手動でインポートする必要がありません：

- VueのすべてのAPI
- VueRouter
- Pinia
- すべての `store` ファイル：`./src/store/modules/*`
- hooksディレクトリ下の自動インポート対象：`./src/hooks/auto-imports/*`
- および `./src/components/` 下のすべてのコンポーネント `（*.vue タイプのファイルのみ明示的なインポート不要）`
:::

## カスタム自動インポート

`./vite` ディレクトリには、`auto-import.ts` と `components.ts` の2つのファイルがあり、自動インポートする**パッケージ、関数、コンポーネント**などを定義できます。

### パッケージ・関数の自動インポート

`./vite/auto-import.ts` では、自動インポートするパッケージや関数を定義できます。例：`vue-router`、`pinia`、`axios` など

```ts{3-8,10-14}
export default function createAutoImport() {
  return autoImport({
    // ここでインポート対象をカスタマイズ可能
    imports: [
      'vue',
      'vue-router',
      'pinia',
    ],
    dts: './types/auto-imports.d.ts',
    // カスタム関数ライブラリやその他tsファイルを追加可能
    dirs: [
      './src/hooks/auto-imports/**',
      './src/store/modules/**',
    ],
  })
}
```

### カスタムコンポーネントライブラリの自動インポート

`./vite/components.ts` では、自動インポートするコンポーネントライブラリのディレクトリを定義できます。システム内の `./src/components` ディレクトリ下のコンポーネントは、明示的なインポートが不要です。

```ts{2}
  return components({
  dirs: ['src/components'],
  include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
  dts: './types/components.d.ts',
})
```