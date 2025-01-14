# 文件上傳

## 後端上傳

::: tip

文件上傳由 MineAdmin 接入 [mineadmin/upload](https://github.com/mineadmin/upload) 組件建設而成

:::

MineAdmin 提供了一個默認的服務端文件上傳邏輯。接口 `/admin/attachment/upload`
並且在上傳成功後接入了資源管理器。

::: code-group

```php [ControllerUpload]
#[Post(
    path: '/admin/attachment/upload',
    operationId: 'UploadAttachment',
    summary: '上傳附件',
    security: [['Bearer' => [], 'ApiKey' => []]],
    tags: ['數據中心'],
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

### 替換本地存儲為 Oss 存儲

在日常的業務場景中，一般文件存儲在 OSS 上。那麼此時就需要替換默認的文件上傳處理了。以阿里雲舉例
首先我們要配置 `config/autoload/file.php` 文件。新增阿里雲通道。
然後新建一個 `AliyunUploadSubscribe` 替換 `config/autoload/listeners.php` 中默認的 `UploadSubscribe` 指定為阿里雲通道


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
    // 默認文件上傳
    // UploadSubscriber::class,
    // 阿里雲 oss 上傳
    AliyunUploadSubscribe::class,
    // 處理程序啓動
    BootApplicationSubscriber::class,
    // 處理 sql 執行
    DbQueryExecutedSubscriber::class,
    // 處理命令異常
    FailToHandleSubscriber::class,
    // 處理 worker 退出
    ResumeExitCoordinatorSubscriber::class,
    // 處理隊列
    QueueHandleSubscriber::class,
    // 註冊新的 Blueprint 宏
    RegisterBlueprintListener::class,
];

```

:::

### 修改默認上傳文件命名和目錄命名

文件的命名以及文件的目錄命名默認是由 `Mine\Upload\Listener\UploadListener->generatorPath()` 和
`Mine\Upload\Listener\UploadListener->generatorId()` 實現的，而所有的上傳處理類都是繼承與這個類。
那麼以上一張替換 OSS 存儲為例。只需要在你的上傳處理類中替換這兩個方法即可

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
        // 生成文件名，隨機字符串長度為 10
        return Str::random(10);
    }

    protected function generatorPath(): string
    {
        // 目錄格式：年/月/日
        return date('Y/m/d');
    }

}

```


### 處理流程

`前端`調用接口 `/admin/attachment/upload` ，傳入參數 `file`、參數類型為文件。
服務端文件控制器調用 文件服務對前端傳入的 `file` 進行處理、
`文件服務`判斷上傳文件hash值是否已經上傳過
如果有。則查詢數據庫返回上次上傳的信息
如果沒有。則`調用 UploadInterface 實例分發一個 UploadEvent 事件`
分發後。`判斷 UploadEvent->isUploaded() 是否上傳成功`
如果上傳成功則返回 `Upload` 上傳實例
如果沒有上傳成功則拋出異常上傳失敗

#### 流程圖

```plantuml
|前端|
start
:調用接口 /admin/attachment/upload，傳入文件參數 file;
|服務端文件控制器|
:調用文件服務處理 file;
|文件服務|
:判斷上傳文件 hash 值是否已上傳過;
if (已上傳過) then (是)
    :查詢數據庫返回上次上傳信息;
else (否)
    :調用 UploadInterface 實例分發 UploadEvent;
    |UploadEvent|
    :判斷 isUploaded() 是否上傳成功;
    if (上傳成功) then (是)
        :返回 Upload 上傳實例;
    else (否)
        :拋出異常上傳失敗;
    endif
endif
```

#### 時序圖

```plantuml
participant "前端" as Frontend
participant "服務端文件控制器" as Controller
participant "文件服務" as FileService
participant "UploadInterface" as Uploader
participant "數據庫" as Database

Frontend -> Controller : 調用接口 /admin/attachment/upload，傳入 file
Controller -> FileService : 處理 file
FileService -> FileService : 判斷文件 hash 值是否已上傳過
alt 已上傳過
    FileService -> Database : 查詢數據庫
    Database -> FileService : 返回上次上傳信息
    FileService -> Controller : 返回上次上傳信息
    Controller -> Frontend : 返回上次上傳信息
else 未上傳過
    FileService -> Uploader : 分發 UploadEvent
    Uploader -> Uploader : 判斷 isUploaded() 是否上傳成功
    alt 上傳成功
        Uploader -> FileService : 返回 Upload 上傳實例
        FileService -> Controller : 返回 Upload 上傳實例
        Controller -> Frontend : 返回 Upload 上傳實例
    else 上傳失敗
        Uploader -> FileService : 拋出異常上傳失敗
        FileService -> Controller : 拋出異常上傳失敗
        Controller -> Frontend : 拋出異常上傳失敗
    end
end
```

## 前端直傳 OSS

TODO