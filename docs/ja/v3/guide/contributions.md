# 貢献ガイド

:::tip 共にオープンソースを築く
オープンソースは皆様のサポートが必要です。サポート方法は様々で、使用、推奨、チュートリアルの作成、エコシステムの保護、コードの貢献、質問への回答、経験の共有などがあります。ぜひご参加ください！
:::

## リポジトリアドレス
> Giteeリポジトリには貢献しないでください。Giteeに提出されたコードはGithubリポジトリで上書きされ、貢献者リストにあなたの名前も表示されません。

### Github

* [MineAdmin バックエンドソースコード](https://github.com/mineadmin/mineadmin)
* [MineAdmin フロントエンドソースコード](https://github.com/mineadmin/mineadmin-vue)
* [MineAdmin コアコンポーネント](https://github.com/mineadmin/components)
* [MineAdmin ドキュメント](https://github.com/mineadmin/doc-v3)

### Gitee

* [MineAdmin バックエンドソースコード](https://gitee.com/mineadmin/mineadmin)
* [MineAdmin フロントエンドソースコード](https://gitee.com/mineadmin/mineadmin-vue)

## あなたができること

### [issues](https://github.com/mineadmin/mineadmin/issues) の動向をチェックする

* issuesでは開発予定の機能を公開しています。興味があれば、issuesにコメントを残してください。できるだけ早く返信します。
* 質問しているユーザーに返信して支援する。
* [issues](https://github.com/mineadmin/mineadmin/issues)の内容に基づき、合理的な解決策を提案し、バグの修正や機能の実装を行い、[pull request](https://github.com/mineadmin/mineadmin/pulls)としてMineAdminリポジトリに提出する。
* 自身が提出したPull Requestの進捗とステータスを確認し、メインリポジトリへのマージを促進する。
* 他の人が提出したPull Requestのコードレビューを行い、アドバイスや意見を提供する。
* 自分や他の人のニーズに応じて、独立した機能コンポーネントを開発する。
* [ドキュメント](https://gitee.com/mineadmin/doc-v3)を改善し、より良い使い方を提供する。

### Pull Request ガイド

定期的に開発予定の機能を公開しますが、ご自身で実装したい機能を提案することも大歓迎です。[issues](https://github.com/mineadmin/mineadmin/issues)であなたのアイデアを提案してください。受け入れ可能かどうか、できるだけ早く返信します。
問題を提出する前に、類似した問題がすでに公開されていないか確認してください。

* このリポジトリを自分のGithubアカウントにforkする。
* コミット情報の形式は [File Name]: Info about commit. とします。（例） README.md: Fix xxx bug
* コードをコミットする前に、`composer cs-fix` を実行してコードをフォーマットする。
* コードをコミットする前に、`composer an` を実行してコードの静的チェックを行う。
* コードをコミットする前に、`composer test` を実行して単体テストを行う。単体テストはデータの追加・削除を行うため、本番環境では実行しないでください。
* PRは機能ブランチから作成し、masterブランチに直接変更をコミットしないでください。
* バグを修正するPRの場合は、関連するバグの説明を提供してください。