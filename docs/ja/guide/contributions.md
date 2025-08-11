# 貢献ガイド

:::tip オープンソースの共創
オープンソースは皆様のサポートが必要です。サポートの方法はさまざまで、例えば使用、推薦、チュートリアルの執筆、エコシステムの保護、コードの貢献、質問への回答、経験の共有などがあります。ぜひ私たちの仲間になってください！
:::

## リポジトリの場所
> Giteeリポジトリへの貢献はご遠慮ください。Giteeに提出されたコードはGithubリポジトリによって上書きされ、貢献者リストにもお名前が表示されません。

### Github

* [MineAdmin バックエンドソースコード](https://github.com/mineadmin/mineadmin)
* [MineAdmin フロントエンドソースコード](https://github.com/mineadmin/mineadmin-vue)
* [MineAdmin コアコンポーネント](https://github.com/mineadmin/components)
* [MineAdmin ドキュメント](https://github.com/mineadmin/doc-v3)

### Gitee

* [MineAdmin バックエンドソースコード](https://gitee.com/mineadmin/mineadmin)
* [MineAdmin フロントエンドソースコード](https://gitee.com/mineadmin/mineadmin-vue)

## あなたにできること

### [issues](https://github.com/mineadmin/mineadmin/issues) の動向をフォロー

* 私たちはissuesで開発待ちの機能を公開しています。興味があれば、issuesにコメントを残してください。できるだけ早く返信します。
* 質問をしているユーザーにコメントで回答する；
* [issues](https://github.com/mineadmin/mineadmin/issues)の内容に基づき、適切な解決策を提案する；バグを修正したり機能を実装したりし、[pull request](https://github.com/mineadmin/mineadmin/pulls)の形でMineAdminリポジトリに提出する；
* 自分が提出したPull Requestの進捗と状態をフォローし、あなたのPull Requestができるだけ早くメインリポジトリにマージされるようにする；
* 他の人が提出したPull RequestをCode Reviewし、あなたの提案や意見を述べる。
* 他人や自分自身のニーズに応じて、独立した機能コンポーネントを開発する；
* [ドキュメント](https://gitee.com/mineadmin/doc-v3)を充実させ、より良い使用説明を提供する。

### Pull Request ガイド

定期的に開発待ちの機能を公開していますが、あなた自身が実装したい機能を提案してくれることをさらに歓迎します。[issues](https://github.com/mineadmin/mineadmin/issues)であなたのアイデアを提案してください。私たちはできるだけ早く受け入れるかどうかを返信します。
問題を提出する前に、類似の問題がすでに公開されていないか確認してください。

* このリポジトリをあなたのGithubアカウントにforkする；
* コミット情報のフォーマットは [ファイル名]: コミットに関する情報 とする。（例） README.md: xxxバグを修正
* コードを提出する前に、`composer cs-fix`を実行してコードをフォーマットする；
* コードを提出する前に、`composer an`を実行してコードの静的チェックを行う；
* コードを提出する前に、`composer test`を実行してユニットテストを行う；ユニットテストはデータを削除するため、いかなる本番環境でも実行しないでください；
* PRを作成する際は、必ず機能ブランチとして作成し、masterブランチに直接変更を加えないようにする。
* あなたのPRがバグを修正するものである場合、関連するバグの説明を提供してください。