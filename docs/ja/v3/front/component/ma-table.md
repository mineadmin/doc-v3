# MaTable

`Element plus`ベースのテーブルを二次ラッピングした`Table`コンポーネントです。すべてのネイティブテーブルパラメータ、イベント、スロットをサポートし、一部機能を拡張しています。非常に使いやすいです。

::: tip 説明
すべてのネイティブ`el-table`パラメータ、イベント、スロットを完全に互換・サポートしているため、テーブルは拡張パラメータのみ説明します。

公式パラメータは [Element plus](https://element-plus.org/zh-CN/component/table.html) 公式ドキュメントを参照してください。

**注意：デモコンポーネントの表示言語パックが正しくないのは正常です。プロジェクトではこの問題は発生しません。**
:::

## 基本使用
<DemoPreview dir="demos/ma-table/default" />

## サンプル集

### 基本機能サンプル
- [基本テーブル](./ma-table/basic) - 基本的なデータ表示と設定
- [テーブルソート](./ma-table/sorting) - 各種ソート機能のデモ
- [テーブルフィルター](./ma-table/filter) - フィルターと検索機能

### 高度な機能サンプル  
- [カスタムレンダリング](./ma-table/custom-render) - セルとヘッダーのカスタムレンダリング
- [動的列管理](./ma-table/dynamic-columns) - 列の動的追加・削除・変更
- [ページネーションテーブル](./ma-table/pagination) - 完全なページネーション機能

### 特殊シナリオサンプル
- [ツリーテーブル](./ma-table/tree-table) - 階層データの表示
- [複数選択テーブル](./ma-table/selection) - 選択と一括操作
- [レスポンシブテーブル](./ma-table/responsive) - 高さ自動調整とレスポンシブレイアウト

## Props

| パラメータ | 説明 | タイプ | Ele-公式ドキュメント | バージョン |
|-----------|-----------------------------------------------------|-------------------|----------------------------------------------------------------------------------------------|-------|
| `options` | `el-table` パラメータ及び[拡張パラメータ](#extraprops) | `MaTableOptions` | [テーブル属性](https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7) | 1.0.0 |
| `columns` | `el-table-column` パラメータ及び[拡張パラメータ](#columnextraprops) | `MaTableColumns[]` | [テーブル列属性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%