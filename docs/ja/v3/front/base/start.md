# 開始

::: tip ヒント
以下は、ソースコードをダウンロード済みで、コマンドラインで `./web` ディレクトリに移動していることを前提としています。
:::

## 開発環境

ローカル環境に [Node.js](https://nodejs.org/zh-cn)、[pnpm](https://pnpm.io/) を順番にインストールする必要があります。`yarn` など他のパッケージ管理ツールも使用可能ですが、`pnpm` の使用を推奨し、ドキュメントは `pnpm` を基準とします。

- Node.js >= 20.0.0、推奨は 20.x.x の LTS バージョン
- PNPM >= 9.0.0

## 依存関係のインストールと実行
実行成功後、自動的にページが開き、デフォルトアドレスは http://localhost:2888 です。

```bash
# 依存関係のインストール
pnpm i または pnpm install

# 実行
pnpm dev
```

::: warning 依存関係のインストールエラー
依存関係が正常にインストールできない場合、npm のデフォルトソースにアクセスできない可能性があります。
`pnpm config set registry https://registry.npmmirror.com/` を実行して
国内の `npmmirror` ミラーソースに切り替えてみてください（[nrm](https://github.com/Pana/nrm) を使用してワンクリックでソースを切り替えることも可能）。
その後、ルートディレクトリの `/node_modules` フォルダを削除し、依存関係を再インストールしてください。
:::