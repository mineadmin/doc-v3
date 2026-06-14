# 変更履歴

このプロジェクトの注目すべき変更はすべてこのファイルに記録されます。

## [Unreleased]

## [v3.0.6] - 2025-08-02

### ✨ 機能
- feat(e2e): Playwright設定と初期テストを追加 ([#675](https://github.com/mineadmin/mineadmin/pull/675)) ([a0694fd](https://github.com/mineadmin/mineadmin/commit/a0694fd84da20ae758bebdc744af5188d4b3ae4d))
- feat(workflow): pushとpull_requestイベントのパス設定を更新 ([#668](https://github.com/mineadmin/mineadmin/pull/668)) ([2ff8c5f](https://github.com/mineadmin/mineadmin/commit/2ff8c5fb957cd2cf252f6eb33b852b3f030bb80a))
- feat(app-store): プラグインのダウンロードとインストールに関するヒント情報を追加 ([#667](https://github.com/mineadmin/mineadmin/pull/667)) ([14617f5](https://github.com/mineadmin/mineadmin/commit/14617f5b600691141e8b688fb4741d9ba35050fc))
- feat(dialog): 全画面インタラクション体験を最適化し、全画面状態を制御可能にし、全画面ボタンのホットゾーンを拡大 ([#660](https://github.com/mineadmin/mineadmin/pull/660)) ([ba5816a](https://github.com/mineadmin/mineadmin/commit/ba5816a2d5f210f4a771d7ab960f42aa1ea65998))
- feat(boring-cyborg): ファイルパス設定を更新し、複数のモジュールの権限設定を追加 ([#659](https://github.com/mineadmin/mineadmin/pull/659)) ([a8fb2b5](https://github.com/mineadmin/mineadmin/commit/a8fb2b5ad117f5d3755011e7b43b2ed42dafac75))

### 🐛 バグ修正
- fix(boring-cyborg): Logstashサービスのパスの大文字小文字の誤りを修正 ([#665](https://github.com/mineadmin/mineadmin/pull/665)) ([6375e2c](https://github.com/mineadmin/mineadmin/commit/6375e2ce247fc040cb5d5c0b1088c5acc0de4c3b))
- fix(handleResize): レスポンシブ状況でのaddEventListenerイベントエラーを修正し、メニューの異常なクローズを防止 ([#662](https://github.com/mineadmin/mineadmin/pull/662)) ([6882046](https://github.com/mineadmin/mineadmin/commit/6882046d84eec0350d0b889d4cbb9ab73e8cc5f1))

## [v3.0.5] - 2025-07-22

### ✨ 機能
- feat(user): キャッシュによるユーザーサービスの強化とメニューフィルタリングロジックのリファクタリング ([#655](https://github.com/mineadmin/mineadmin/pull/655)) ([dc501ca](https://github.com/mineadmin/mineadmin/commit/dc501ca91c84293169e51631a25e5f02e7a57192))

### 🐛 バグ修正
- fix(issue-template): バグ報告テンプレート内のcomposerコマンドをプロジェクト名に合わせて修正 ([#658](https://github.com/mineadmin/mineadmin/pull/658)) ([c57753e](https://github.com/mineadmin/mineadmin/commit/c57753e3f547683dc3e14836c3563a51ba4edaee))
- fix(workflow): PHPバージョン変更をphp-versionに修正 ([#657](https://github.com/mineadmin/mineadmin/pull/657)) ([7bbc5c0](https://github.com/mineadmin/mineadmin/commit/7bbc5c09301d93b67b4539e9f321dab2165a4c77))
- fix: .env.exampleのAPP_URL形式を修正し、.gitignoreを更新してstorage/uploadsを含める ([#648](https://github.com/mineadmin/mineadmin/pull/648)) ([012853e](https://github.com/mineadmin/mineadmin/commit/012853e71ae2da8ac3905c715dc9412365f925e0))

### 📚 ドキュメント
- docs(README): 英語のREADMEの説明エラーを修正し、QQグループリンクをクリック可能な形式に更新 ([#654](https://github.com/mineadmin/mineadmin/pull/654)) ([4139090](https://github.com/mineadmin/mineadmin/commit/4139090a67245cc3321da875a2956dd720c255b2))

### ♻️ コードリファクタリング
- refactor(repository): リストインターフェースメソッドのリファクタリング ([#651](https://github.com/mineadmin/mineadmin/pull/651)) ([4261b4b](https://github.com/mineadmin/mineadmin/commit/4261b4b06bf1e09af9e33979f46da7d436148095))

### 🔧 その他
- chore(workbench): クイックアクセスルート表示ロジックの最適化 ([#643](https://github.com/mineadmin/mineadmin/pull/643)) ([805b92d](https://github.com/mineadmin/mineadmin/commit/805b92dc48b1f0182f47c640b8730b5582ef4143))
- ci(swoole): テストマトリックスでswoole 6.xバージョンカバレッジを拡張 ([#652](https://github.com/mineadmin/mineadmin/pull/652)) ([95e5788](https://github.com/mineadmin/mineadmin/commit/95e578866e79d2d09fcaeacefdb93a3fb2796c50))

## [v3.0.4] - 2025-07-10

### 🐛 バグ修正
- fix: MINE_ACCESS_TOKENチェックステータスヒント情報を追加 ([#646](https://github.com/mineadmin/mineadmin/pull/646)) ([c60a937](https://github.com/mineadmin/mineadmin/commit/c60a9374c8c20ff3e0622b3e12dac5da602033e1))
- fix: Swowをサポートするためにアップロードメソッドのパラメータタイプヒントを更新 ([#640](https://github.com/mineadmin/mineadmin/pull/640)) ([b6af324](https://github.com/mineadmin/mineadmin/commit/b6af32480010506edbf6a16c06ab72ec653a98c6))

### ♻️ コードリファクタリング
- refactor: PassportService依存関係を削除し、ログインメソッドを更新することでUserControllerを簡素化 ([#647](https://github.com/mineadmin/mineadmin/pull/647)) ([86e883e](https://github.com/mineadmin/mineadmin/commit/86e883ea629459dfb5eac158e172da8084ca07b4))

## [v3.0.3] - 2025-06-13

### 🐛 バグ修正
- fix: 最新のeleバージョンのel-link apiに適応 ([f194d8f](https://github.com/mineadmin/mineadmin/commit/f194d8f2c3cf7b61da23c48142deedd7b10ad3dd))
- fix: Swowパッケージの参照によるバグを修正 ([66e0fb6](https://github.com/mineadmin/mineadmin/commit/66e0fb6f225a81df22a488b2ed7cca08ea448d4f))

### 📚 ドキュメント
- docs(README): コントリビューターグラフリンクを更新 ([#626](https://github.com/mineadmin/mineadmin/pull/626)) ([d9bf462](https://github.com/mineadmin/mineadmin/commit/d9bf46280101bacc64edc4d0670c2f1469d079bf))

## [v3.0.2] - 2025-05-29

### ✨ 機能
- feat(plugin): フロントエンドプラグインにloginBeforeフックを追加、ログインリクエスト前のデータ送信処理用 ([040a1f6](https://github.com/mineadmin/mineadmin/commit/040a1f6b75a72a1bd8e38d1e472639426ce7425c))
- feat(app-store): プラグイン詳細ページで最新バージョン、互換バージョン、デモリンクを表示する機能をサポート ([#601](https://github.com/mineadmin/mineadmin/pull/601)) ([1edebfc](https://github.com/mineadmin/mineadmin/commit/1edebfc5c789dbb7cfd0476010c3a619172ac33d))
- feat: リモートからvueをロードしてレンダリングする機能を追加。 ([559fe56](https://github.com/mineadmin/mineadmin/commit/559fe5624d1be42b9f4da292262d7d727d332121))
- feat(ma-dict-picker): チェックボックス、ラジオボタン、セレクトコンポーネントのdisabled属性レンダリングをサポート ([#599](https://github.com/mineadmin/mineadmin/pull/599)) ([2cfef12](https://github.com/mineadmin/mineadmin/commit/2cfef1257fb4d300bac601487f946b9672ed8fd9))
- feat: 高速ポートキルとプロセスファイルを追加 ([991c0b3](https://github.com/mineadmin/mineadmin/commit/991c0b3eb3f4bddfd5502af28f0d267afa6b51ae))
- feat(result): アカウント無効関連のエラー処理と国際化サポートを追加 ([#593](https://github.com/mineadmin/mineadmin/pull/593)) ([7f24cb4](https://github.com/mineadmin/mineadmin/commit/7f24cb46524edc522ecdfca2bd01fb2e5f6d90e1))
- feat(download): Base64ファイルダウンロード機能を追加 ([#592](https://github.com/mineadmin/mineadmin/pull/592)) ([2aa7003](https://github.com/mineadmin/mineadmin/commit/2aa7003d374d0c75626c0084cd391556e1537664))
- feat:(component) ma-select-tableコンポーネントを追加 ([#587](https://github.com/mineadmin/mineadmin/pull/587)) ([e7586e7](https://github.com/mineadmin/mineadmin/commit/e7586e73a7f403bd724938da001d1bf8e30d2d2b))
- feat: フロントエンド言語監視の初回初期化 ([#585](https://github.com/mineadmin/mineadmin/pull/585)) ([d831aef](https://github.com/mineadmin/mineadmin/commit/d831aef2860425c982bb61287ba588b1b997d1da))
- feat(user): UserRequestにパスワード検証ルールを追加 ([#580](https://github.com/mineadmin/mineadmin/pull/580)) ([c814e19](https://github.com/mineadmin/mineadmin/commit/c814e19a0f67419fef61fbd3a817ffd1552f2a90))
- feat: 新しいrequest動的ルールマッチングクラスActionRulesTraitを追加 ([#579](https://github.com/mineadmin/mineadmin/pull/579)) ([af439bb](https://github.com/mineadmin/mineadmin/commit/af439bb781483b6a9c3a288e266bd54a0cc10488))
- feat: mineadmin/searchを1.0.31にアップグレード ([67701e8](https://github.com/mineadmin/mineadmin/commit/67701e8257eaaac885764a9dc22199d7fa8fc633))
- feat(download): ファイルダウンロード処理を最適化 ([#574](https://github.com/mineadmin/mineadmin/pull/574)) ([bbbb130](https://github.com/mineadmin/mineadmin/commit/bbbb130135fc97d9e83066ed6a82b82be1a48dea))
- feat: ユーザー権限処理の強化とアカウントステータスチェックの追加 ([#573](https://github.com/mineadmin/mineadmin/pull/573)) ([aa508ba](https://github.com/mineadmin/mineadmin/commit/aa508ba7aaa25bdb6cfc2bbbc976caf7b84e154e))
- feat: 「ツールバー設定」設定情報を追加し、ユーザーデータテーブルに保存 ([#571](https://github.com/mineadmin/mineadmin/pull/571)) ([1625566](https://github.com/mineadmin/mineadmin/commit/1625566a55ca3c1cf4273320f4fab8330f544f27))
- feat:(ma-col-card) カードリストコンポーネントを追加 ([bd54161](https://github.com/mineadmin/mineadmin/commit/bd54161aae8436990233c390c5713f09f3abb192))
- feat: 依存関係を更新 ([4485dec](https://github.com/mineadmin/mineadmin/commit/4485dec4ef6ce170b925cae06feeca783448aa32))
- feat: ma-formを1.0.25に更新 ([#534](https://github.com/mineadmin/mineadmin/pull/534)) ([7e6c18a](https://github.com/mineadmin/mineadmin/commit/7e6c18a2b52710e5832fa9992d07f544f1fec83e))

### 🐛 バグ修正
- fix(login): ユーザーログイン後に言語設定が行われず、デフォルトが英語になるバグを修正 ([eb4615b](https://github.com/mineadmin/mineadmin/commit/eb4615b4745fbdef168cd5a9783ee3bb60e6d814))
- fix(icons): アイコン生成コマンドが`inquirer`ライブラリ不足でエラーになる問題を修正 ([1123bf4](https://github.com/mineadmin/mineadmin/commit/1123bf45a9984dc517393509b0882426fbbb6cbe))
- fix(ma-select-table): 単一行/複数行選択状態の判定エラーを修正、選択判定の安全性を強化 ([#610](https://github.com/mineadmin/mineadmin/pull/610)) ([8e5436f](https://github.com/mineadmin/mineadmin/commit/8e5436f8d69273aa7cf5f7dbb00feebb244defcf))
- fix(menu-form): メニュー管理ページレンダリングにおける再帰更新問題を修正 ([#605](https://github.com/mineadmin/mineadmin/pull/605)) ([58c6873](https://github.com/mineadmin/mineadmin/commit/58c6873bf04d8fa811bc156644885ded6cb525b4))
- fix(MaDictSelect): el-option-groupグループオプションレンダリングと混合オプションをサポート ([#604](https://github.com/mineadmin/mineadmin/pull/604)) ([8288988](https://github.com/mineadmin/mineadmin/commit/8288988c51ee529f8171f6d47c44425ddd14574e))
- fix: mineadmin/searchのstyle.cssを復元。 ([e26abba](https://github.com/mineadmin/mineadmin/commit/e26abba6658967937d1b2c6e129905d30c686525))
- fix: ma-dict-selectコンポーネントを復元 ([805a6ab](https://github.com/mineadmin/mineadmin/commit/805a6ab7b94eb834fd18e72948c88c1b0d6ab716))
- fix: ma-formがchildren設定項目をサポートした後、コンポーネントのデフォルトスロットパラメータが欠落し、render関数内のjsx構文の子コンポーネントがレンダリングされない問題、およびma-searchのma-form互換性に関するいくつかの問題を修正 ([6f09d93](https://github.com/mineadmin/mineadmin/commit/6f09d939721edbba750b545cf668efe61f62f549))
- fix: README-en.md ([daa15a3](https://github.com/mineadmin/mineadmin/commit/daa15a33e23c6d600821fd36ef639227ca3d6e9c))
- fix: README.md ([d7a4df0](https://github.com/mineadmin/mineadmin/commit/d7a4df047518008e86cf21fb87559e4a8387ddb3))
- fix(menu): 子メニューがすべて非表示の場合に親メニューがクリックできない問題を修正 ([#595](https://github.com/mineadmin/mineadmin/pull/595)) ([0644922](https://github.com/mineadmin/mineadmin/commit/064492263501646210a2537c9ca4c24ba148259a))
- fix: キャッシュ取得ロジックエラーによりデフォルト値が返されない ([#589](https://github.com/mineadmin/mineadmin/pull/589)) ([198f8f1](https://github.com/mineadmin/mineadmin/commit/198f8f15c603edf681986518248186a476e5526d))
- fix: テーマモードとコンポーネントテーマモードがまれに一致しない問題を修正 ([c98d5a7](https://github.com/mineadmin/mineadmin/commit/c98d5a79b7c836459c76033a1bab3f8227d585d7))
- fix: ActionRulesTraitにPHPStan無視ディレクティブを追加 ([719a755](https://github.com/mineadmin/mineadmin/commit/719a7553b6c190a5b5323ea75dbaf6074d941fa1))
- fix: swaggerレンダリングバグを修正 ([#578](https://github.com/mineadmin/mineadmin/pull/578)) ([afcc510](https://github.com/mineadmin/mineadmin/commit/afcc510c7de94310a78c3d62f1f26f0c1198715d))
- fix: IRepositoryのhandlePageメソッドを最適化し、ページネーションフォーマットに集中させる ([#566](https://github.com/mineadmin/mineadmin/pull/566)) ([9c0770e](https://github.com/mineadmin/mineadmin/commit/9c0770e1b91579fc616137ae8f7a0c278364657b))
- fix: getQueryパラメータ検索を修正 ([#565](https://github.com/mineadmin/mineadmin/pull/565)) ([9f91123](https://github.com/mineadmin/mineadmin/commit/9f9112306b01e875f2e19a4150018db5afacd840))
- fix(MenuService): createメソッドを更新してMenu型を返し、parent_id参照を修正 ([#560](https://github.com/mineadmin/mineadmin/pull/560)) ([ab9076e](https://github.com/mineadmin/mineadmin/commit/ab9076e7ccedb18f59e5b8b62f8b1177e5a57f91))
- fix：パンくずナビゲーションが非表示メニューを表示するバグ ([#553](https://github.com/mineadmin/mineadmin/pull/553)) ([5eabf44](https://github.com/mineadmin/mineadmin/commit/5eabf44f8577b2db20f3d03fb83d87ea000fced2))
- fix: メニューに「ボタン権限」を追加する際に重複データが表示される ([#548](https://github.com/mineadmin/mineadmin/pull/548)) ([88a7200](https://github.com/mineadmin/mineadmin/commit/88a7200023347a732e089557598e268919ec5efe))
- fix: 開発環境に適応するためにAPIリクエストアドレスとプロキシプレフィックスを変更 ([947bac0](https://github.com/mineadmin/mineadmin/commit/947bac0122bfc132389e78c61c16b62bfb407f97))

### ♻️ コードリファクタリング
- refactor: mine-admin/remoteVueプラグインを削除 ([faad2b2](https://github.com/mineadmin/mineadmin/commit/faad2b2f80e6b7db9e8bc17a03d8d3590f071cc5))
- refactor(ma-dict-select): 辞書セレクタースロットロジックをリファクタリングし、依存関係バージョンを更新 ([f989ab9](https://github.com/mineadmin/mineadmin/commit/f989ab960efa023cf11260e43b82f682215a4a7d))
- refactor(config): Swagger設定を調整し、複数プラグインのswagger上書き問題を修正 ([#597](https://github.com/mineadmin/mineadmin/pull/597)) ([370928a](https://github.com/mineadmin/mineadmin/commit/370928aec1164d9a49599b21b01b94885b2cc85c))
- refactor(server): コメントアウトされた行を削除して設定をクリーンアップ ([#575](https://github.com/mineadmin/mineadmin/pull/575)) ([a354f6a](https://github.com/mineadmin/mineadmin/commit/a354f6a0591ac5bf1b604b8c6bf8c3bb10d1de6f))
- refactor(http): リクエスト認証と検証を最適化 ([#532](https://github.com/mineadmin/mineadmin/pull/532)) ([4c7cbb0](https://github.com/mineadmin/mineadmin/commit/4c7cbb08dcea5d17b491d0e240c88640019d0832))

### 🔧 その他
- chore(deps): @mineadmin/form依存関係バージョンを^1.0.51にアップグレード ([0453007](https://github.com/mineadmin/mineadmin/commit/04530071b83fb94516e83dca2742e6d8fb79f7a6))
- chore(deps): @mineadmin/form依存関係バージョンを^1.0.33にアップグレード ([776620b](https://github.com/mineadmin/mineadmin/commit/776620b5e50dcd31fe33607d0c0a5f83e3e9c239))
- chore(deps): vite依存関係バージョンを^6.2.6にアップグレード ([7cec2b4](https://github.com/mineadmin/mineadmin/commit/7cec2b4cc81d8bba0bcb3747754ee8a89f3e9a7f))
- chore(deps): package.json依存関係設定を更新 ([3fb7549](https://github.com/mineadmin/mineadmin/commit/3fb75496aad60f9a74973f4a0551b34aa443018b))
- chore(deps): @mineadmin/formと@mineadmin/pro-tableの依存関係バージョンをアップグレード ([4d06473](https://github.com/mineadmin/mineadmin/commit/4d064738dbef9c20dc5e7686a1ea22bacb5eb4f9))
- styles: el-tagの境界線を削除 ([#557](https://github.com/mineadmin/mineadmin/pull/557)) ([7c2eede](https://github.com/mineadmin/mineadmin/commit/7c2eede7d3beaa665d6f81d67564482e7d86c7b0))
- chore: メニューハイライトメニューフィールド編集でデータを保存できない問題を修正 ([#544](https://github.com/mineadmin/mineadmin/pull/544)) ([5baebc7](https://github.com/mineadmin/mineadmin/commit/5baebc7f3904a1b570598c197cb9264bd92448d1))
- chore: MaRemoteSelectコンポーネントのSlotが表示されない問題を修正 ([#543](https://github.com/mineadmin/mineadmin/pull/543)) ([4d414cb](https://github.com/mineadmin/mineadmin/commit/4d414cb51a3665127462ea37d10d623a7798da5b))
- chore: ma-key-valueコンポーネントを追加 ([#538](https://github.com/mineadmin/mineadmin/pull/538)) ([85f06a2](https://github.com/mineadmin/mineadmin/commit/85f06a22fd2252d14f55fb39f4500fe72b9cfd6d))
- styles: el-tagの境界線を削除 ([#536](https://github.com/mineadmin/mineadmin/pull/536)) ([bbd4724](https://github.com/mineadmin/mineadmin/commit/bbd4724ea031c2b5ef4efd26f762b5b55a488ff8))
- chore: .env.exampleにAPP_DEBUGを追加 ([#535](https://github.com/mineadmin/mineadmin/pull/535)) ([16a0cd7](https://github.com/mineadmin/mineadmin/commit/16a0cd7d8dd57b98b99ab19dcf2b050d21e3b83e))
- ci: コードカバレッジを更新し、電話番号検証を簡素化 ([#533](https://github.com/mineadmin/mineadmin/pull/533)) ([b4d9213](https://github.com/mineadmin/mineadmin/commit/b4d9213b1a1abf8f5ef0b4d3d026b0f4a49ff338))

## [v3.0.1] - 2025-01-08

### ✨ 機能
- feat(ma-pro-table & ma-remote-select) : ([#499](https://github.com/mineadmin/mineadmin/pull/499)) ([631fae7](https://github.com/mineadmin/mineadmin/commit/631fae759bbe8c5ffc31c108772a3d24793a2759))
- feat(ma-drawer): ma-drawerコンポーネントを追加し、`ma-dialog`コンポーネントを最適化・強化： ([#470](https://github.com/mineadmin/mineadmin/pull/470)) ([de0b94b](https://github.com/mineadmin/mineadmin/commit/de0b94b5c50e523c12450ac5ebe69ba501fedc5c))
- feat(iframe): iframeメニューキャッシュを新規追加、タブ切り替え時にサードパーティのウェブページを再読み込みしない ([#465](https://github.com/mineadmin/mineadmin/pull/465)) ([1b79b76](https://github.com/mineadmin/mineadmin/commit/1b79b768a484a003f97e2673afae40c744f29b71))
- feat(dict-component): 辞書関連コンポーネントの`props：data`属性が関数の受け渡しをサポート ([321e507](https://github.com/mineadmin/mineadmin/commit/321e5075d407d44b1d38f76c0eeb2b8cf02b12ac))
- feat(package): vue3-ace-editor依存関係をデフォルト依存関係として追加 ([#441](https://github.com/mineadmin/mineadmin/pull/441)) ([fc36e23](https://github.com/mineadmin/mineadmin/commit/fc36e23a09c82e81e853a73a48fdae0edeb4b6a7))
- feat(readme): 謝辞情報を追加 ([#440](https://github.com/mineadmin/mineadmin/pull/440)) ([e0881a7](https://github.com/mineadmin/mineadmin/commit/e0881a740f9a90609358b4dc902ed07c9c6be7e1))
- feat(tab): useTabStoreにchangeTabTitle()を追加 ([#437](https://github.com/mineadmin/mineadmin/pull/437)) ([e69159c](https://github.com/mineadmin/mineadmin/commit/e69159c8513351423b0796a56311da87d3bb2f47))
- feat(dict-component): 辞書コンポーネントのpropsにdataパラメータを追加、辞書データセットを直接渡せるように ([#435](https://github.com/mineadmin/mineadmin/pull/435)) ([e86e9cc](https://github.com/mineadmin/mineadmin/commit/e86e9cc446dc53655c2d5afd44bf75b2c624d7d7))
- feat(resource): リソースマネージャーページを追加、依存関係を更新 ([#413](https://github.com/mineadmin/mineadmin/pull/413)) ([25d5e9c](https://github.com/mineadmin/mineadmin/commit/25d5e9ce50f8962a880c50c0678f832ca00141f8))
- feat(ma-tree): extraスロットを新規追加 ([#412](https://github.com/mineadmin/mineadmin/pull/412)) ([a3016af](https://github.com/mineadmin/mineadmin/commit/a3016af8ca7899f8e2d1cdb6691cdce440306e7c))
- feat(ma-search): Enterキーを押すと検索をショートカット送信する機能を追加 ([#411](https://github.com/mineadmin/mineadmin/pull/411)) ([af4cc3b](https://github.com/mineadmin/mineadmin/commit/af4cc3b51ee4afcded9900091f7e4f76c3a7f1fa))
- feat(favicon.ico): favicon.icoファイルを追加 ([#403](https://github.com/mineadmin/mineadmin/pull/403)) ([87c9883](https://github.com/mineadmin/mineadmin/commit/87c988378b6cda58b5c4f6289dfbcfd1084f7a13))
- feat(maTree)：`setCheckStrictly()`を追加、ロール設定メニュー編集時のデフォルトを厳格モードに最適化 ([#402](https://github.com/mineadmin/mineadmin/pull/402)) ([5aa771f](https://github.com/mineadmin/mineadmin/commit/5aa771fadcb01790ddea90af668d2825cf8a1590))
- feat: アップロードコンポーネントのリセット時に空になる問題を解決 ([#400](https://github.com/mineadmin/mineadmin/pull/400)) ([aea0013](https://github.com/mineadmin/mineadmin/commit/aea0013d00e7eedcedd630db0167871df4ce18ff))
- feat(i18n): データセンター関連の翻訳を追加 ([#391](https://github.com/mineadmin/mineadmin/pull/391)) ([cfa22e4](https://github.com/mineadmin/mineadmin/commit/cfa22e4df261781119769a24b4fb8ab5784ef0f8))
- feat(swagger): UIインターフェースを追加、`http://127.0.0.1:9503/swagger`でAPIドキュメントを表示 ([#390](https://github.com/mineadmin/mineadmin/pull/390)) ([7d6d997](https://github.com/mineadmin/mineadmin/commit/7d6d99770afdabcfd116d209a85b70c579714d0c))
- feat(menu): メニュー権限を更新し、データセンター関連の権限を追加 ([#388](https://github.com/mineadmin/mineadmin/pull/388)) ([bdbe598](https://github.com/mineadmin/mineadmin/commit/bdbe5986ac9b9f4ecf649db7224728523bbfdba1))
- feat(config): 例外ハンドラにModeNotFoundHandlerを追加 ([#373](https://github.com/mineadmin/mineadmin/pull/373)) ([afe51c4](https://github.com/mineadmin/mineadmin/commit/afe51c4ae4b379e989f7746f6750e611a3154134))

### 🐛 バグ修正
- fix(tabbar):Altキーを2回連続で押すとブラウザのアクセスキーモードがトリガーされ、useMagicKeysがAltキーイベントを正常にキャプチャできない問題を修正。 ([#510](https://github.com/mineadmin/mineadmin/pull/510)) ([2ee8e31](https://github.com/mineadmin/mineadmin/commit/2ee8e31ff682e4719cfcf7f37fae35a7e8e3eb81))
- fix(table-and-menu): メニュー追加と保存のポップアップを削除。element plusのel-tree-selectに再帰エラーバグがあるため、ポップアップを削除。 ([#511](https://github.com/mineadmin/mineadmin/pull/511)) ([80ef288](https://github.com/mineadmin/mineadmin/commit/80ef2887290362015282fbbe649390398cb1301e))
- fix(ma-search): ma-searchを1.0.27にアップグレード ([#505](https://github.com/mineadmin/mineadmin/pull/505)) ([f78b21b](https://github.com/mineadmin/mineadmin/commit/f78b21b42ffc83abeb770ab2d944aaf657311643))
-