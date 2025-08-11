# ファイルアップロード

## バックエンドアップロード

::: tip

ファイルアップロードは MineAdmin が [mineadmin/upload](https://github.com/mineadmin/upload) コンポーネントを統合して構築されています

:::

MineAdmin はデフォルトのサーバーサイドファイルアップロードロジックを提供しています。エンドポイント `/admin/attachment/upload`
また、アップロード成功後にリソースマネージャーに統合されます。

::: code-group

```php [ControllerUpload]
#[Post(
    path: '/admin/attachment/upload',
    operationId: 'UploadAttachment',
    summary: '添付ファイルアップロード',
    security: [['Bearer' => [], 'ApiKey' => []]],
    tags: ['データセンター'],
)]
#[Permission(code: 'attachment:upload')]
#[ResultResponse(instance: new Result())]
public function upload(UploadRequest $request): Result
{
    $uploadFile = $request->file('file');
    $newTmpPath = sys_get_temp_dir() . '/' . uniqid() . '.' . $uploadFile->getExtension();
    $uploadFile->moveTo($newTmpPath);
    $splFileInfo = new SplFileInfo($newTmpPath, '', '');
    return $this->success(
        $this->service->upload($splFileInfo, $uploadFile, $this->currentUser->id())
    );
}
```

```php [Service->Upload]

namespace App\Service;

use App\Model\Attachment;
use App\Repository\AttachmentRepository;
use Hyperf\HttpMessage\Upload\UploadedFile;
use Mine\Upload\UploadInterface;
use Symfony\Component\Finder\SplFileInfo;

/**
 * @extends IService<AttachmentRepository>
 */
final class AttachmentService extends IService
{
    public function __construct(
        protected readonly AttachmentRepository $repository,
        protected readonly UploadInterface $upload
    ) {}

    public function upload(SplFileInfo $fileInfo, UploadedFile $uploadedFile, int $userId): Attachment
    {
        $fileHash = md5_file($fileInfo->getRealPath());
        if ($attachment = $this->repository->findByHash($fileHash)) {
            return $attachment;
        }
        $upload = $this->upload->upload(
            $fileInfo,
        );
        return $this->repository->create([
            'created_by' => $userId,
            'origin_name' => $uploadedFile->getClientFilename(),
            'storage_mode' => $upload->getStorageMode(),
            'object_name' => $upload->getObjectName(),
            'mime_type' => $upload->getMimeType(),
            'storage_path' => $upload->getStoragePath(),
            'hash' => $fileHash,
            'suffix' => $upload->getSuffix(),
            'size_byte' => $upload->getSizeByte(),
            'size_info' => $upload->getSizeInfo(),
            'url' => $upload->getUrl(),
        ]);
    }
```

:::

### ローカルストレージをOSSストレージに置き換え

日常の業務シナリオでは、通常ファイルはOSS上に保存されます。この場合、デフォルトのファイルアップロード処理を置き換える必要があります。Alibaba Cloudを例に挙げます
まず `config/autoload/file.php` ファイルを設定します。Alibaba Cloudチャネルを追加します。
次に新しい `AliyunUploadSubscribe` を作成し、`config/autoload/listeners.php` のデフォルトの `UploadSubscribe` をAlibaba Cloudチャネルに指定します


::: code-group

```php{19} [AliyunUploadSubscribe]
<?php
// app/Http/Common/Subscribe/AliyunUploadSubscribe.php
declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

namespace App\Http\Common\Subscriber\Upload;

use Mine\Upload\Listener\UploadListener as AbstractUploadListener;

final class AliyunUploadSubscribe extends AbstractUploadListener
{
    public const ADAPTER_NAME = 'oss';
}

```

```php{28-40} [file.php]
<?php
// config/autoload/file.php
declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */
use Hyperf\Filesystem\Adapter\AliyunOssAdapterFactory;
use Hyperf\Filesystem\Adapter\CosAdapterFactory;
use Hyperf\Filesystem\Adapter\FtpAdapterFactory;
use Hyperf\Filesystem\Adapter\LocalAdapterFactory;
use Hyperf\Filesystem\Adapter\MemoryAdapterFactory;
use Hyperf\Filesystem\Adapter\QiniuAdapterFactory;
use Hyperf\Filesystem\Adapter\S3AdapterFactory;

return [
    'default' => 'local',
    'storage' => [
        'local' => [
            'driver' => LocalAdapterFactory::class,
            'root' => BASE_PATH . '/storage/uploads',
            'public_url' => env('APP_URL') . '/uploads',
        ],
        'oss' => [
            'driver' => AliyunOssAdapterFactory::class,
            'accessId' => '',
            'accessSecret' => '',
            'bucket' => '',
            'endpoint' => '',
            'domain' => '',
            'schema' => 'http://',
            'isCName' => false,
            // ossドメインアドレス、未記入の場合はアクセスパス生成に失敗します
            'public_url' => env('APP_URL') . '/uploads',
            // 'timeout'        => 3600,
            // 'connectTimeout' => 10,
            // 'token'          => '',
        ],
    ],
];

```

```php{20,25-28} [listeners.php]
// config/autoload/listeners.php
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */
use Hyperf\ExceptionHandler\Listener\ErrorExceptionHandler;
use Mine\Core\Subscriber\BootApplicationSubscriber;
use Mine\Core\Subscriber\DbQueryExecutedSubscriber;
use Mine\Core\Subscriber\FailToHandleSubscriber;
use Mine\Core\Subscriber\QueueHandleSubscriber;
use Mine\Core\Subscriber\ResumeExitCoordinatorSubscriber;
use Mine\Core\Subscriber\Upload\UploadSubscriber;
use App\Http\Common\Subscriber\AliyunUploadSubscribe;
use Mine\Support\Listener\RegisterBlueprintListener;

return [
    ErrorExceptionHandler::class,
    // デフォルトファイルアップロード
    // UploadSubscriber::class,
    // Alibaba Cloud OSSアップロード
    AliyunUploadSubscribe::class,
    // アプリケーション起動処理
    BootApplicationSubscriber::class,
    // SQL実行処理
    DbQueryExecutedSubscriber::class,
    // コマンド例外処理
    FailToHandleSubscriber::class,
    // worker終了処理
    ResumeExitCoordinatorSubscriber::class,
    // キュー処理
    QueueHandleSubscriber::class,
    // 新しいBlueprintマクロ登録
    RegisterBlueprintListener::class,
];

```

:::

### デフォルトのアップロードファイル名とディレクトリ名の変更

ファイル名およびファイルディレクトリ名はデフォルトで `Mine\Upload\Listener\UploadListener->generatorPath()` と
`Mine\Upload\Listener\UploadListener->generatorId()` によって実装されています。すべてのアップロード処理クラスはこのクラスを継承しています。
前章のOSSストレージ置き換えを例にとると、アップロード処理クラスでこれら2つのメソッドを置き換えるだけで済みます

```php{22-32}
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

namespace Mine\Core\Subscriber\Upload;

use Hyperf\Stringable\Str;
use Mine\Upload\Listener\UploadListener as AbstractUploadListener;

final class UploadSubscriber extends AbstractUploadListener
{
    public const ADAPTER_NAME = 'local';

    protected function generatorId(): string
    {
        // ファイル名生成、ランダム文字列長10
        return Str::random(10);
    }

    protected function generatorPath(): string
    {
        // ディレクトリ形式：年/月/日
        return date('Y/m/d');
    }

}

```


### 処理フロー

`フロントエンド`がエンドポイント `/admin/attachment/upload` を呼び出し、パラメータ `file`（ファイルタイプ）を渡します。
サーバーサイドファイルコントローラーがファイルサービスを呼び出してフロントエンドから渡された `file` を処理します。
`ファイルサービス`がアップロードファイルのハッシュ値が既にアップロードされているかどうかを判断します。
既にある場合、データベースを検索して前回のアップロード情報を返します。
ない場合、`UploadInterface インスタンスを呼び出して UploadEvent イベントをディスパッチします`
ディスパッチ後、`UploadEvent->isUploaded() がアップロード成功かどうかを判断します`
アップロードが成功した場合、`Upload` アップロードインスタンスを返します。
アップロードが成功していない場合、アップロード失敗の例外をスローします

#### フローチャート

```plantuml
|フロントエンド|
start
:エンドポイント /admin/attachment/upload を呼び出し、ファイルパラメータ file を渡す;
|サーバーサイドファイルコントローラー|
:ファイルサービスを呼び出して file を処理;
|ファイルサービス|
:アップロードファイルのハッシュ値が既にアップロードされているか判断;
if (既にアップロード済み) then (はい)
    :データベースを検索して前回のアップロード情報を返す;
else (いいえ)
    :UploadInterface インスタンスを呼び出して UploadEvent をディスパッチ;
    |UploadEvent|
    :isUploaded() がアップロード成功か判断;
    if (アップロード成功) then (はい)
        :Upload アップロードインスタンスを返す;
    else (いいえ)
        :アップロード失敗の例外をスロー;
    endif
endif
```

#### シーケンス図

```plantuml
participant "フロントエンド" as Frontend
participant "サーバーサイドファイルコントローラー" as Controller
participant "ファイルサービス" as FileService
participant "UploadInterface" as Uploader
participant "データベース" as Database

Frontend -> Controller : エンドポイント /admin/attachment/upload を呼び出し、file を渡す
Controller -> FileService : file を処理
FileService -> FileService : ファイルハッシュ値が既にアップロードされているか判断
alt 既にアップロード済み
    FileService -> Database : データベースを検索
    Database -> FileService : 前回のアップロード情報を返す
    FileService -> Controller : 前回のアップロード情報を返す
    Controller -> Frontend : 前回のアップロード情報を返す
else 未アップロード
    FileService -> Uploader : UploadEvent をディスパッチ
    Uploader -> Uploader : isUploaded() がアップロード成功か判断
    alt アップロード成功
        Uploader -> FileService : Upload アップロードインスタンスを返す
        FileService -> Controller : Upload アップロードインスタンスを返す
        Controller -> Frontend : Upload アップロードインスタンスを返す
    else アップロード失敗
        Uploader -> FileService : アップロード失敗の例外をスロー
        FileService -> Controller : アップロード失敗の例外をスロー
        Controller -> Frontend : アップロード失敗の例外をスロー
    end
end
```

## フロントエンド直接OSSアップロード

TODO