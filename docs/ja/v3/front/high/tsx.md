# JSX および TSX 開発

`3.0` のフロントエンドでは、ルートビューは `vue` だけでなく、**`jsx`、`tsx`** をビューファイルとしてもサポートしており、開発者に異なる選択肢を提供します。
もちろん `vue` ファイル内でも `tsx` や `jsx` を記述でき、従来の記法も維持できます。

`vue` の `script` の `lang` 属性は `tsx` に設定することを強く推奨します。

```vue
<script setup lang="tsx">
// vue の明示的なインポートは不要
const example = ref('hello world!')  
  
// HTML タグを含むコンポーネントを定義
const customComponent = () => {
  return <div class="w-full text-red-5">{example.value}</div> 
}
</script>

<template>
  <div>
    <!-- hello world を出力 -->
    <div>{{ example }} </div>
    
    <!-- コンポーネントを出力 -->
    <component :is="customComponent()" />
  </div>
</template>
```

:::info
通常の記法と大きな違いはありませんが、`script` タグ内で直接 `<div>` のようなタグを記述できると、非常に便利だと気付くでしょう。
:::

以上は単純な例です。以下に学習に役立つ情報をいくつか紹介します。
- [vue3.0 公式プラグイン babel-plugin-jsx 構文チュートリアル](https://github.com/vuejs/babel-plugin-jsx#syntax)
- [Vue3 シリーズ JSX 構文を理解する](https://juejin.cn/post/6846687592138670094)