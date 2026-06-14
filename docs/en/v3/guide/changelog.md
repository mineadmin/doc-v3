# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [v3.0.6] - 2025-08-02

### ✨ Features
- feat(e2e): add Playwright configuration and initial tests ([#675](https://github.com/mineadmin/mineadmin/pull/675)) ([a0694fd](https://github.com/mineadmin/mineadmin/commit/a0694fd84da20ae758bebdc744af5188d4b3ae4d))
- feat(workflow): update path configuration for push and pull_request events ([#668](https://github.com/mineadmin/mineadmin/pull/668)) ([2ff8c5f](https://github.com/mineadmin/mineadmin/commit/2ff8c5fb957cd2cf252f6eb33b852b3f030bb80a))
- feat(app-store): add prompt information for plugin download and installation ([#667](https://github.com/mineadmin/mineadmin/pull/667)) ([14617f5](https://github.com/mineadmin/mineadmin/commit/14617f5b600691141e8b688fb4741d9ba35050fc))
- feat(dialog): optimize full-screen interaction, achieve controllable full-screen state, and enlarge full-screen button hot zone ([#660](https://github.com/mineadmin/mineadmin/pull/660)) ([ba5816a](https://github.com/mineadmin/mineadmin/commit/ba5816a2d5f210f4a771d7ab960f42aa1ea65998))
- feat(boring-cyborg): update file path configuration, add permission settings for multiple modules ([#659](https://github.com/mineadmin/mineadmin/pull/659)) ([a8fb2b5](https://github.com/mineadmin/mineadmin/commit/a8fb2b5ad117f5d3755011e7b43b2ed42dafac75))

### 🐛 Bug Fixes
- fix(boring-cyborg): fix case sensitivity error in Logstash service path ([#665](https://github.com/mineadmin/mineadmin/pull/665)) ([6375e2c](https://github.com/mineadmin/mineadmin/commit/6375e2ce247fc040cb5d5c0b1088c5acc0de4c3b))
- fix(handleResize): fix addEventListener event error in responsive mode causing abnormal menu closure ([#662](https://github.com/mineadmin/mineadmin/pull/662)) ([6882046](https://github.com/mineadmin/mineadmin/commit/6882046d84eec0350d0b889d4cbb9ab73e8cc5f1))

## [v3.0.5] - 2025-07-22

### ✨ Features
- feat(user): enhance user service with caching and refactor menu filtering logic ([#655](https://github.com/mineadmin/mineadmin/pull/655)) ([dc501ca](https://github.com/mineadmin/mineadmin/commit/dc501ca91c84293169e51631a25e5f02e7a57192))

### 🐛 Bug Fixes
- fix(issue-template): fix composer command in bug report template to match project name ([#658](https://github.com/mineadmin/mineadmin/pull/658)) ([c57753e](https://github.com/mineadmin/mineadmin/commit/c57753e3f547683dc3e14836c3563a51ba4edaee))
- fix(workflow): fixed PHP version change to php-version ([#657](https://github.com/mineadmin/mineadmin/pull/657)) ([7bbc5c0](https://github.com/mineadmin/mineadmin/commit/7bbc5c09301d93b67b4539e9f321dab2165a4c77))
- fix: fix APP_URL format in .env.example and update .gitignore to include storage/uploads ([#648](https://github.com/mineadmin/mineadmin/pull/648)) ([012853e](https://github.com/mineadmin/mineadmin/commit/012853e71ae2da8ac3905c715dc9412365f925e0))

### 📚 Documentation
- docs(README): fix description errors in English md, update QQ group link to clickable format ([#654](https://github.com/mineadmin/mineadmin/pull/654)) ([4139090](https://github.com/mineadmin/mineadmin/commit/4139090a67245cc3321da875a2956dd720c255b2))

### ♻️ Code Refactoring
- refactor(repository): refactor list interface methods ([#651](https://github.com/mineadmin/mineadmin/pull/651)) ([4261b4b](https://github.com/mineadmin/mineadmin/commit/4261b4b06bf1e09af9e33979f46da7d436148095))

### 🔧 Others
- chore(workbench): optimize quick entry route display logic ([#643](https://github.com/mineadmin/mineadmin/pull/643)) ([805b92d](https://github.com/mineadmin/mineadmin/commit/805b92dc48b1f0182f47c640b8730b5582ef4143))
- ci(swoole): expand swoole 6.x version coverage in test matrix ([#652](https://github.com/mineadmin/mineadmin/pull/652)) ([95e5788](https://github.com/mineadmin/mineadmin/commit/95e578866e79d2d09fcaeacefdb93a3fb2796c50))

## [v3.0.4] - 2025-07-10

### 🐛 Bug Fixes
- fix: add MINE_ACCESS_TOKEN status check prompt information ([#646](https://github.com/mineadmin/mineadmin/pull/646)) ([c60a937](https://github.com/mineadmin/mineadmin/commit/c60a9374c8c20ff3e0622b3e12dac5da602033e1))
- fix: update upload method parameter type hint to support Swow ([#640](https://github.com/mineadmin/mineadmin/pull/640)) ([b6af324](https://github.com/mineadmin/mineadmin/commit/b6af32480010506edbf6a16c06ab72ec653a98c6))

### ♻️ Code Refactoring
- refactor: simplify UserController by removing PassportService dependency and updating login method ([#647](https://github.com/mineadmin/mineadmin/pull/647)) ([86e883e](https://github.com/mineadmin/mineadmin/commit/86e883ea629459dfb5eac158e172da8084ca07b4))

## [v3.0.3] - 2025-06-13

### 🐛 Bug Fixes
- fix: adapt to the latest ele version of el-link api ([f194d8f](https://github.com/mineadmin/mineadmin/commit/f194d8f2c3cf7b61da23c48142deedd7b10ad3dd))
- fix: fix bug caused by referencing Swow package ([66e0fb6](https://github.com/mineadmin/mineadmin/commit/66e0fb6f225a81df22a488b2ed7cca08ea448d4f))

### 📚 Documentation
- docs(README): Updated contributors graphs link ([#626](https://github.com/mineadmin/mineadmin/pull/626)) ([d9bf462](https://github.com/mineadmin/mineadmin/commit/d9bf46280101bacc64edc4d0670c2f1469d079bf))

## [v3.0.2] - 2025-05-29

### ✨ Features
- feat(plugin): frontend plugin adds loginBefore Hook for processing submitted login data before login request, can modify submitted login data to backend ([040a1f6](https://github.com/mineadmin/mineadmin/commit/040a1f6b75a72a1bd8e38d1e472639426ce7425c))
- feat(app-store): support displaying latest version, compatible versions, and demo link on plugin detail page ([#601](https://github.com/mineadmin/mineadmin/pull/601)) ([1edebfc](https://github.com/mineadmin/mineadmin/commit/1edebfc5c789dbb7cfd0476010c3a619172ac33d))
- feat: add functionality to remotely load and render vue ([559fe56](https://github.com/mineadmin/mineadmin/commit/559fe5624d1be42b9f4da292262d7d727d332121))
- feat(ma-dict-picker): support rendering disabled attribute for checkbox, radio, and select components ([#599](https://github.com/mineadmin/mineadmin/pull/599)) ([2cfef12](https://github.com/mineadmin/mineadmin/commit/2cfef1257fb4d300bac601487f946b9672ed8fd9))
- feat: add fast kill port and process file ([991c0b3](https://github.com/mineadmin/mineadmin/commit/991c0b3eb3f4bddfd5502af28f0d267afa6b51ae))
- feat(result): add account disabled related error handling and internationalization support ([#593](https://github.com/mineadmin/mineadmin/pull/593)) ([7f24cb4](https://github.com/mineadmin/mineadmin/commit/7f24cb46524edc522ecdfca2bd01fb2e5f6d90e1))
- feat(download): add download Base64 file functionality ([#592](https://github.com/mineadmin/mineadmin/pull/592)) ([2aa7003](https://github.com/mineadmin/mineadmin/commit/2aa7003d374d0c75626c0084cd391556e1537664))
- feat:(component) add ma-select-table component ([#587](https://github.com/mineadmin/mineadmin/pull/587)) ([e7586e7](https://github.com/mineadmin/mineadmin/commit/e7586e73a7f403bd724938da001d1bf8e30d2d2b))
- feat: frontend language first initialization listening ([#585](https://github.com/mineadmin/mineadmin/pull/585)) ([d831aef](https://github.com/mineadmin/mineadmin/commit/d831aef2860425c982bb61287ba588b1b997d1da))
- feat(user): add password validation rules to UserRequest ([#580](https://github.com/mineadmin/mineadmin/pull/580)) ([c814e19](https://github.com/mineadmin/mineadmin/commit/c814e19a0f67419fef61fbd3a817ffd1552f2a90))
- feat: add request dynamic rule matching class ActionRulesTrait ([#579](https://github.com/mineadmin/mineadmin/pull/579)) ([af439bb](https://github.com/mineadmin/mineadmin/commit/af439bb781483b6a9c3a288e266bd54a0cc10488))
- feat: upgrade mineadmin/search to version 1.0.31 ([67701e8](https://github.com/mineadmin/mineadmin/commit/67701e8257eaaac885764a9dc22199d7fa8fc633))
- feat(download): optimize file download handling ([#574](https://github.com/mineadmin/mineadmin/pull/574)) ([bbbb130](https://github.com/mineadmin/mineadmin/commit/bbbb130135fc97d9e83066ed6a82b82be1a48dea))
- feat: enhance user permission handling and add account status checks ([#573](https://github.com/mineadmin/mineadmin/pull/573)) ([aa508ba](https://github.com/mineadmin/mineadmin/commit/aa508ba7aaa25bdb6cfc2bbbc976caf7b84e154e))
- feat: Add 'Toolbar Settings' configuration information and save it to the user data table ([#571](https://github.com/mineadmin/mineadmin/pull/571)) ([1625566](https://github.com/mineadmin/mineadmin/commit/1625566a55ca3c1cf4273320f4fab8330f544f27))
- feat:(ma-col-card) add card list component ([bd54161](https://github.com/mineadmin/mineadmin/commit/bd54161aae8436990233c390c5713f09f3abb192))
- feat: update dependencies ([4485dec](https://github.com/mineadmin/mineadmin/commit/4485dec4ef6ce170b925cae06feeca783448aa32))
- feat: ma-form updated to 1.0.25 ([#534](https://github.com/mineadmin/mineadmin/pull/534)) ([7e6c18a](https://github.com/mineadmin/mineadmin/commit/7e6c18a2b52710e5832fa9992d07f544f1fec83e))

### 🐛 Bug Fixes
- fix(login): fix bug where language flag was not set after user login, causing default to English ([eb4615b](https://github.com/mineadmin/mineadmin/commit/eb4615b4745fbdef168cd5a9783ee3bb60e6d814))
- fix(icons): fix icon generation command reporting missing `inquirer` library ([1123bf4](https://github.com/mineadmin/mineadmin/commit/1123bf45a9984dc517393509b0882426fbbb6cbe))
- fix(ma-select-table): fix single-row/multi-row selection status determination error, enhance selection judgment safety ([#610](https://github.com/mineadmin/mineadmin/pull/610)) ([8e5436f](https://github.com/mineadmin/mineadmin/commit/8e5436f8d69273aa7cf5f7dbb00feebb244defcf))
- fix(menu-form): fix recursive update issue in menu management page rendering ([#605](https://github.com/mineadmin/mineadmin/pull/605)) ([58c6873](https://github.com/mineadmin/mineadmin/commit/58c6873bf04d8fa811bc156644885ded6cb525b4))
- fix(MaDictSelect): support el-option-group grouped option rendering, mixed options ([#604](https://github.com/mineadmin/mineadmin/pull/604)) ([8288988](https://github.com/mineadmin/mineadmin/commit/8288988c51ee529f8171f6d47c44425ddd14574e))
- fix: restore style.css under mineadmin/search ([e26abba](https://github.com/mineadmin/mineadmin/commit/e26abba6658967937d1b2c6e129905d30c686525))
- fix: restore ma-dict-select component ([805a6ab](https://github.com/mineadmin/mineadmin/commit/805a6ab7b94eb834fd18e72948c88c1b0d6ab716))
- fix: fix issue where after ma-form supports children configuration item, it causes component default slot parameter loss and sub-components not rendering in jsx syntax within render function, also fix some ma-search compatibility issues with ma-form ([6f09d93](https://github.com/mineadmin/mineadmin/commit/6f09d939721edbba750b545cf668efe61f62f549))
- fix: README-en.md ([daa15a3](https://github.com/mineadmin/mineadmin/commit/daa15a33e23c6d600821fd36ef639227ca3d6e9c))
- fix: README.md ([d7a4df0](https://github.com/mineadmin/mineadmin/commit/d7a4df047518008e86cf21fb87559e4a8387ddb3))
- fix(menu): fix issue where parent menu cannot be clicked when all sub-menus are hidden ([#595](https://github.com/mineadmin/mineadmin/pull/595)) ([0644922](https://github.com/mineadmin/mineadmin/commit/064492263501646210a2537c9ca4c24ba148259a))
- fix: Cache retrieval logic error does not return default value ([#589](https://github.com/mineadmin/mineadmin/pull/589)) ([198f8f1](https://github.com/mineadmin/mineadmin/commit/198f8f15c603edf681986518248186a476e5526d))
- fix: fix occasional inconsistency between theme mode and component theme mode ([c98d5a7](https://github.com/mineadmin/mineadmin/commit/c98d5a79b7c836459c76033a1bab3f8227d585d7))
- fix: add PHPStan ignore directive for ActionRulesTrait ([719a755](https://github.com/mineadmin/mineadmin/commit/719a7553b6c190a5b5323ea75dbaf6074d941fa1))
- fix swagger render bug ([#578](https://github.com/mineadmin/mineadmin/pull/578)) ([afcc510](https://github.com/mineadmin/mineadmin/commit/afcc510c7de94310a78c3d62f1f26f0c1198715d))
- fix: optimize handlePage method of IRepository to be more focused on pagination formatting ([#566](https://github.com/mineadmin/mineadmin/pull/566)) ([9c0770e](https://github.com/mineadmin/mineadmin/commit/9c0770e1b91579fc616137ae8f7a0c278364657b))
- fix: fix getQuery parameter search ([#565](https://github.com/mineadmin/mineadmin/pull/565)) ([9f91123](https://github.com/mineadmin/mineadmin/commit/9f9112306b01e875f2e19a4150018db5afacd840))
- fix(MenuService): update create method to return Menu type and correct parent_id reference ([#560](https://github.com/mineadmin/mineadmin/pull/560)) ([ab9076e](https://github.com/mineadmin/mineadmin/commit/ab9076e7ccedb18f59e5b8b62f8b1177e5a57f91))
- fix：Breadcrumb navigation display hidden menu bug ([#553](https://github.com/mineadmin/mineadmin/pull/553)) ([5eabf44](https://github.com/mineadmin/mineadmin/commit/5eabf44f8577b2db20f3d03fb83d87ea000fced2))
- fix: Duplicate data appears when adding "button permissions" to the menu ([#548](https://github.com/mineadmin/mineadmin/pull/548)) ([88a7200](https://github.com/mineadmin/mineadmin/commit/88a7200023347a732e089557598e268919ec5efe))
- fix: modify API request address and proxy prefix to adapt to development environment ([947bac0](https://github.com/mineadmin/mineadmin/commit/947bac0122bfc132389e78c61c16b62bfb407f97))

### ♻️ Code Refactoring
- refactor: remove mine-admin/remoteVue plugin ([faad2b2](https://github.com/mineadmin/mineadmin/commit/faad2b2f80e6b7db9e8bc17a03d8d3590f071cc5))
- refactor(ma-dict-select): refactor dictionary selector slot logic and update dependency version ([f989ab9](https://github.com/mineadmin/mineadmin/commit/f989ab960efa023cf11260e43b82f682215a4a7d))
- refactor(config): adjust Swagger configuration to fix multiple plugin swagger override issue ([#597](https://github.com/mineadmin/mineadmin/pull/597)) ([370928a](https://github.com/mineadmin/mineadmin/commit/370928aec1164d9a49599b21b01b94885b2cc85c))
- refactor(server): clean up configuration settings by removing commented lines ([#575](https://github.com/mineadmin/mineadmin/pull/575)) ([a354f6a](https://github.com/mineadmin/mineadmin/commit/a354f6a0591ac5bf1b604b8c6bf8c3bb10d1de6f))
- refactor(http): optimize request authorization and validation ([#532](https://github.com/mineadmin/mineadmin/pull/532)) ([4c7cbb0](https://github.com/mineadmin/mineadmin/commit/4c7cbb08dcea5d17b491d0e240c88640019d0832))

### 🔧 Others
- chore(deps): upgrade @mineadmin/form dependency version to ^1.0.51 ([0453007](https://github.com/mineadmin/mineadmin/commit/04530071b83fb94516e83dca2742e6d8fb79f7a6))
- chore(deps): upgrade @mineadmin/form dependency version to ^1.0.33 ([776620b](https://github.com/mineadmin/mineadmin/commit/776620b5e50dcd31fe33607d0c0a5f83e3e9c239))
- chore(deps): upgrade vite dependency version to ^6.2.6 ([7cec2b4](https://github.com/mineadmin/mineadmin/commit/7cec2b4cc81d8bba0bcb3747754ee8a89f3e9a7f))
- chore(deps): update package.json dependency configuration ([3fb7549](https://github.com/mineadmin/mineadmin/commit/3fb75496aad60f9a74973f4a0551b34aa443018b))
- chore(deps): upgrade @mineadmin/form and @mineadmin/pro-table dependency versions ([4d06473](https://github.com/mineadmin/mineadmin/commit/4d064738dbef9c20dc5e7686a1ea22bacb5eb4f9))
- styles: remove el-tag border ([#557](https://github.com/mineadmin/mineadmin/pull/557)) ([7c2eede](https://github.com/mineadmin/mineadmin/commit/7c2eede7d3beaa665d6f81d67564482e7d86c7b0))
- chore: fix Menu highlight menu field editing cannot save data ([#544](https://github.com/mineadmin/mineadmin/pull/544)) ([5baebc7](https://github.com/mineadmin/mineadmin/commit/5baebc7f3904a1b570598c197cb9264bd92448d1))
- chore: fix MaRemoteSelect component Slot not displayed ([#543](https://github.com/mineadmin/mineadmin/pull/543)) ([4d414cb](https://github.com/mineadmin/mineadmin/commit/4d414cb51a3665127462ea37d10d623a7798da5b))
- chore: add ma-key-value component ([#538](https://github.com/mineadmin/mineadmin/pull/538)) ([85f06a2](https://github.com/mineadmin/mineadmin/commit/85f06a22fd2252d14f55fb39f4500fe72b9cfd6d))
- styles: remove el-tag border ([#536](https://github.com/mineadmin/mineadmin/pull/536)) ([bbd4724](https://github.com/mineadmin/mineadmin/commit/bbd4724ea031c2b5ef4efd26f762b5b55a488ff8))
- chore: add APP_DEBUG to .env.example ([#535](https://github.com/mineadmin/mineadmin/pull/535)) ([16a0cd7](https://github.com/mineadmin/mineadmin/commit/16a0cd7d8dd57b98b99ab19dcf2b050d21e3b83e))
- ci: update code coverage and simplify phone number validation ([#533](https://github.com/mineadmin/mineadmin/pull/533)) ([b4d9213](https://github.com/mineadmin/mineadmin/commit/b4d9213b1a1abf8f5ef0b4d3d026b0f4a49ff338))

## [v3.0.1] - 2025-01-08

### ✨ Features
- feat(ma-pro-table & ma-remote-select) : ([#499](https://github.com/mineadmin/mineadmin/pull/499)) ([631fae7](https://github.com/mineadmin/mineadmin/commit/631fae759bbe8c5ffc31c108772a3d24793a2759))
- feat(ma-drawer): add ma-drawer component, optimize and enhance `ma-dialog` component: ([#470](https://github.com/mineadmin/mineadmin/pull/470)) ([de0b94b](https://github.com/mineadmin/mineadmin/commit/de0b94b5c50e523c12450ac5ebe69ba501fedc5c))
- feat(iframe): add iframe menu cache, no longer reload third-party pages when switching tabs ([#465](https://github.com/mineadmin/mineadmin/pull/465)) ([1b79b76](https://github.com/mineadmin/mineadmin/commit/1b79b768a484a003f97e2673afae40c744f29b71))
- feat(dict-component): dictionary related components' `props: data` attribute supports passing functions ([321e507](https://github.com/mineadmin/mineadmin/commit/321e5075d407d44b1d38f76c0eeb2b8cf02b12ac))
- feat(package): add vue3-ace-editor dependency as default dependency ([#441](https://github.com/mineadmin/mineadmin/pull/441)) ([fc36e23](https://github.com/mineadmin/mineadmin/commit/fc36e23a09c82e81e853a73a48fdae0edeb4b6a7))
- feat(readme): add acknowledgement information ([#440](https://github.com/mineadmin/mineadmin/pull/440)) ([e0881a7](https://github.com/mineadmin/mineadmin/commit/e0881a740f9a90609358b4dc902ed07c9c6be7e1))
- feat(tab): useTabStore add changeTabTitle() ([#437](https://github.com/mineadmin/mineadmin/pull/437)) ([e69159c](https://github.com/mineadmin/mineadmin/commit/e69159c8513351423b0796a56311da87d3bb2f47))
- feat(dict-component): dictionary component props add data parameter, can directly pass dictionary data collection ([#435](https://github.com/mineadmin/mineadmin/pull/435)) ([e86e9cc](https://github.com/mineadmin/mineadmin/commit/e86e9cc446dc53655c2d5afd44bf75b2c624d7d7))
- feat(resource): add resource manager page, update dependencies ([#413](https://github.com/mineadmin/mineadmin/pull/413)) ([25d5e9c](https://github.com/mineadmin/mineadmin/commit/25d5e9ce50f8962a880c50c0678f832ca00141f8))
- feat(ma-tree): add extra slot ([#412](https://github.com/mineadmin/mineadmin/pull/412)) ([a3016af](https://github.com/mineadmin/mineadmin/commit/a3016af8ca7899f8e2d1cdb6691cdce440306e7c))
- feat(ma-search): add listening for enter key press to quickly submit search ([#411](https://github.com/mineadmin/mineadmin/pull/411)) ([af4cc3b](https://github.com/mineadmin/mineadmin/commit/af4cc3b51ee4afcded9900091f7e4f76c3a7f1fa))
- feat(favicon.ico): add favicon.ico file ([#403](https://github.com/mineadmin/mineadmin/pull/403)) ([87c9883](https://github.com/mineadmin/mineadmin/commit/87c988378b6cda58b5c4f6289dfbcfd1084f7a13))
- feat(maTree): add `setCheckStrictly()`, optimize role setting menu editing to default to strict mode ([#402](https://github.com/mineadmin/mineadmin/pull/402)) ([5aa771f](https://github.com/mineadmin/mineadmin/commit/5aa771fadcb01790ddea90af668d2825cf8a1590))
- feat: resolve issue where upload component resets to empty ([#400](https://github.com/mineadmin/mineadmin/pull/400)) ([aea0013](https://github.com/mineadmin/mineadmin/commit/aea0013d00e7eedcedd630db0167871df4ce18ff))
- feat(i18n): add data center related translations ([#391](https://github.com/mineadmin/mineadmin/pull/391)) ([cfa22e4](https://github.com/mineadmin/mineadmin/commit/cfa22e4df261781119769a24b4fb8ab5784ef0f8))
- feat(swagger): add UI interface, view API documentation via `http://127.0.0.1:9503/swagger` ([#390](https://github.com/mineadmin/mineadmin/pull/390)) ([7d6d997](https://github.com/mineadmin/mineadmin/commit/7d6d99770afdabcfd116d209a85b70c579714d0c))
- feat(menu): update menu permissions and add data center related permissions ([#388](https://github.com/mineadmin/mineadmin/pull/388)) ([bdbe598](https://github.com/mineadmin/mineadmin/commit/bdbe5986ac9b9f4ecf649db7224728523bbfdba1))
- feat(config): add ModeNotFoundHandler to exception handlers ([#373](https://github.com/mineadmin/mineadmin/pull/373)) ([afe51c4](https://github.com/mineadmin/mineadmin/commit/afe51c4ae4b379e989f7746f6750e611a3154134))

### 🐛 Bug Fixes
- fix(tabbar): fix issue where pressing Alt key twice triggers browser's Access Keys mode, causing useMagicKeys to fail to capture Alt key events normally ([#510](https://github.com/mineadmin/mineadmin/pull/510)) ([2ee8e31](https://github.com/mineadmin/mineadmin/commit/2ee8e31ff682e4719cfcf7f37fae35a7e8e3eb81))
- fix(table-and-menu): remove menu add and save dialog box, element plus el-tree-select has recursive error bug, so remove the dialog box ([#511](https://github.com/mineadmin/mineadmin/pull/511)) ([80ef288](https://github.com/mineadmin/mineadmin/commit/80ef2887290362015282fbbe649390398cb1301e))
- fix(ma-search): upgrade ma-search to version 1.0.27 ([#505](https://github.com/mineadmin/mineadmin/pull/505)) ([f78b21b](https://github.com/mineadmin/mineadmin/commit/f78b21b42ffc83abeb770ab2d944aaf657311643))
- fix(ma-remote-select): fix api parameter not being passed to axiosConfig configuration item ([#504](https://github.com/mineadmin/mineadmin/pull/504)) ([87975c9](https://github.com/mineadmin/mineadmin/commit/87975c9d257b04d75804710dca74c065cc5c935a))
- fix: fix inconsistent table fixed column styles ([#500](https://github.com/mineadmin/mineadmin/pull/500)) ([bda1653](https://github.com/mineadmin/mineadmin/commit/bda165309e018e1b9820ef66fe2a071b0e504549))
- fix(migrate): fix table name error when deleting attachment table ([#497](https://github.com/mineadmin/mineadmin/pull/497)) ([d7edbe1](https://github.com/mineadmin/mineadmin/commit/d7edbe1555e31e49d8fde7d56c3dea1d808d5610))
- fix(Permission): fix backend permission annotation parsing logic ([#492](https://github.com/mineadmin/mineadmin/pull/492)) ([c7598f6](https://github.com/mineadmin/mineadmin/commit/c7598f6a6399811196c89ab7e412be0411445a1e))
- fix(docker-compose/dockerfile): fix frontend dockerfile fixed production and duplicate packaging ([#495](https://github.com/mineadmin/mineadmin/pull/495)) ([212b5eb](https://github.com/mineadmin/mineadmin/commit/212b5eb8636527e12e3451a6ceb91d3d9c997b55))
- fix(pro-table): fix issue where setting operation column of pro-table with setTableColumns is invalid ([#484](https://github.com/mineadmin/mineadmin/pull/484)) ([e2bd3a0](https://github.com/mineadmin/mineadmin/commit/e2bd3a098a60fada078fb8e8046776e2b4e10316))
- fix(swagger): fix issue where css and js imported by documentation are invalid ([#482](https://github.com/mineadmin/mineadmin/pull/482)) ([1b3b8f0](https://github.com/mineadmin/mineadmin/commit/1b3b8f093f5524c41c8db582e77d24e3b25c648e))
- fix(seeder): fix issue where executing php-cs-fixer causes seeder file class name error ([#476](https://github.com/mineadmin/mineadmin/pull/476)) ([f368ec1](https://github.com/mineadmin/mineadmin/commit/f368ec1ae0f93c823d6f17a85eb71515790e09b7))
- fix(php-cs) ([#475](https://github.com/mineadmin/mineadmin/pull/475)) ([e380d78](https://github.com/mineadmin/mineadmin/commit/e380d7868a82228f1bf4e2c332e5eb25d519685c))
- fix(layout): fix layout and iframe page issues ([#469](https://github.com/mineadmin/mineadmin/pull/469)) ([74ed80a](https://github.com/mineadmin/mineadmin/commit/74ed80a9270c47e40add28390fe121972e19a93f))
- fix:(menu): fix inaccurate prompt information description ([#468](https://github.com/mineadmin/mineadmin/pull/468)) ([24b08c1](https://github.com/mineadmin/mineadmin/commit/24b08c17b010adc61a017cff3d4f2400d7ac4472))
- fix(