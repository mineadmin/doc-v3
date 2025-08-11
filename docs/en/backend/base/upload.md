# File Upload

## Backend Upload

::: tip

File upload is implemented in MineAdmin using the [mineadmin/upload](https://github.com/mineadmin/upload) component.

:::

MineAdmin provides a default server-side file upload logic through the `/admin/attachment/upload` interface, which integrates with the resource manager upon successful upload.

::: code-group

```php [ControllerUpload]
#[Post(
    path: '/admin/attachment/upload',
    operationId: 'UploadAttachment',
    summary: 'Upload Attachment',
    security: [['Bearer' => [], 'ApiKey' => []]],
    tags: ['Data Center'],
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

### Replace Local Storage with OSS Storage

In typical business scenarios, files are usually stored on OSS. In this case, the default file upload handling needs to be replaced. Taking Alibaba Cloud as an example, first configure the `config/autoload/file.php` file to add an Alibaba Cloud channel. Then create an `AliyunUploadSubscribe` to replace the default `UploadSubscribe` in `config/autoload/listeners.php` and specify the Alibaba Cloud channel.

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
            // OSS domain address; if left empty, path generation will fail
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
    // Default file upload
    // UploadSubscriber::class,
    // Alibaba Cloud OSS upload
    AliyunUploadSubscribe::class,
    // Handle application startup
    BootApplicationSubscriber::class,
    // Handle SQL execution
    DbQueryExecutedSubscriber::class,
    // Handle command exceptions
    FailToHandleSubscriber::class,
    // Handle worker exit
    ResumeExitCoordinatorSubscriber::class,
    // Handle queues
    QueueHandleSubscriber::class,
    // Register new Blueprint macros
    RegisterBlueprintListener::class,
];

```

:::

### Modify Default File Naming and Directory Naming

By default, file naming and directory naming are handled by `Mine\Upload\Listener\UploadListener->generatorPath()` and `Mine\Upload\Listener\UploadListener->generatorId()`. All upload handling classes inherit from this class. Taking the previous OSS storage replacement as an example, you only need to override these two methods in your upload handling class.

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
        // Generate filename with random string of length 10
        return Str::random(10);
    }

    protected function generatorPath(): string
    {
        // Directory format: year/month/day
        return date('Y/m/d');
    }

}

```


### Process Flow

The `frontend` calls the `/admin/attachment/upload` interface, passing the `file` parameter (a file). The server-side file controller calls the file service to process the `file`. The `file service` checks if the uploaded file's hash has been uploaded before. If it has, it queries the database and returns the previous upload information. If not, it `calls the UploadInterface instance to dispatch an UploadEvent`. After dispatching, it `checks if UploadEvent->isUploaded()` returns true. If the upload is successful, it returns the `Upload` instance. If not, it throws an upload failure exception.

#### Flowchart

```plantuml
|Frontend|
start
:Call interface /admin/attachment/upload with file parameter;
|Server File Controller|
:Call file service to process file;
|File Service|
:Check if file hash has been uploaded before;
if (Uploaded before) then (Yes)
    :Query database and return previous upload info;
else (No)
    :Call UploadInterface to dispatch UploadEvent;
    |UploadEvent|
    :Check if isUploaded() is true;
    if (Upload successful) then (Yes)
        :Return Upload instance;
    else (No)
        :Throw upload failure exception;
    endif
endif
```

#### Sequence Diagram

```plantuml
participant "Frontend" as Frontend
participant "Server File Controller" as Controller
participant "File Service" as FileService
participant "UploadInterface" as Uploader
participant "Database" as Database

Frontend -> Controller : Call /admin/attachment/upload with file
Controller -> FileService : Process file
FileService -> FileService : Check if file hash exists
alt Exists
    FileService -> Database : Query database
    Database -> FileService : Return previous upload info
    FileService -> Controller : Return previous upload info
    Controller -> Frontend : Return previous upload info
else Not exists
    FileService -> Uploader : Dispatch UploadEvent
    Uploader -> Uploader : Check isUploaded()
    alt Upload successful
        Uploader -> FileService : Return Upload instance
        FileService -> Controller : Return Upload instance
        Controller -> Frontend : Return Upload instance
    else Upload failed
        Uploader -> FileService : Throw upload failure
        FileService -> Controller : Throw upload failure
        Controller -> Frontend : Throw upload failure
    end
end
```

## Frontend Direct Upload to OSS

TODO