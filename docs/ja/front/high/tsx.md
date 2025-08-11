# JSX と TSX 開発

`3.0` のフロントエンドでは、ルートビューは `vue` だけでなく **`jsx、tsx`** もビューファイルとしてサポートしており、開発者に異なる選択肢を提供しています。もちろん、`vue` ファイル内でも `tsx` や `jsx` を記述することができ、従来の書き方も維持できます。

`vue` の `script` タグの `lang` 属性を `tsx` に設定することを強く推奨します。

```vue
<script setup lang="tsx">
// vue を明示的にインポートする必要はありません
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
通常の書き方と大きな違いはありませんが、`script` タグ内で直接 `<div>` などのタグを記述する際には、特に便利であることがわかります。
:::

上記は単純な例ですが、以下に学習リソースをいくつか紹介します：
- [Vue3.0 の公式プラグイン babel-plugin-jsx の構文チュートリアル](https://github.com/vuejs/babel-plugin-jsx#syntax)
- [Vue3 シリーズ：JSX 構文の導入](https://juejin.cn/post/6846687592138670094)