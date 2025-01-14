# File Upload

## Backend Upload

::: tip

File upload is built by MineAdmin integrating the [mineadmin/upload](https://github.com/mineadmin/upload) component.

:::

MineAdmin provides a default server-side file upload logic. The interface `/admin/attachment/upload` is used, and after successful upload, it is integrated into the resource manager.

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

In daily business scenarios, files are usually stored on OSS. At this point, the default file upload processing needs to be replaced. Taking Alibaba Cloud as an example, first, we need to configure the `config/autoload/file.php` file. Add an Alibaba Cloud channel. Then, create a new `AliyunUploadSubscribe` to replace the default `UploadSubscribe` in `config/autoload/listeners.php` and specify the Alibaba Cloud channel.

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
    // Handle queue
    QueueHandleSubscriber::class,
    // Register new Blueprint macros
    RegisterBlueprintListener::class,
];

```

:::

### Modify Default Upload File Naming and Directory Naming

The default file naming and directory naming are implemented by `Mine\Upload\Listener\UploadListener->generatorPath()` and `Mine\Upload\Listener\UploadListener->generatorId()`. All upload processing classes inherit from this class. Taking the previous example of replacing OSS storage, you only need to replace these two methods in your upload processing class.

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
        // Generate file name, random string length is 10
        return Str::random(10);
    }

    protected function generatorPath(): string
    {
        // Directory format: year/month/day
        return date('Y/m/d');
    }

}

```

### Processing Flow

`Frontend` calls the interface `/admin/attachment/upload`, passing the parameter `file`, which is of type file.
The server-side file controller calls the file service to process the `file` passed from the frontend.
The `file service` checks if the hash value of the uploaded file has been uploaded before.
If it has, it queries the database and returns the information from the previous upload.
If it hasn't, it `calls the UploadInterface instance to dispatch an UploadEvent`.
After dispatching, it `checks if UploadEvent->isUploaded()` is successful.
If the upload is successful, it returns the `Upload` upload instance.
If the upload is not successful, it throws an upload failure exception.

#### Flowchart

```plantuml
|Frontend|
start
:Call interface /admin/attachment/upload, pass file parameter file;
|Server-side File Controller|
:Call file service to process file;
|File Service|
:Check if the hash value of the uploaded file has been uploaded before;
if (Uploaded before) then (Yes)
    :Query database and return previous upload information;
else (No)
    :Call UploadInterface instance to dispatch UploadEvent;
    |UploadEvent|
    :Check if isUploaded() is successful;
    if (Upload successful) then (Yes)
        :Return Upload upload instance;
    else (No)
        :Throw upload failure exception;
    endif
endif
```

#### Sequence Diagram

```plantuml
participant "Frontend" as Frontend
participant "Server-side File Controller" as Controller
participant "File Service" as FileService
participant "UploadInterface" as Uploader
participant "Database" as Database

Frontend -> Controller : Call interface /admin/attachment/upload, pass file
Controller -> FileService : Process file
FileService -> FileService : Check if file hash value has been uploaded before
alt Uploaded before
    FileService -> Database : Query database
    Database -> FileService : Return previous upload information
    FileService -> Controller : Return previous upload information
    Controller -> Frontend : Return previous upload information
else Not uploaded before
    FileService -> Uploader : Dispatch UploadEvent
    Uploader -> Uploader : Check if isUploaded() is successful
    alt Upload successful
        Uploader -> FileService : Return Upload upload instance
        FileService -> Controller : Return Upload upload instance
        Controller -> Frontend : Return Upload upload instance
    else Upload failed
        Uploader -> FileService : Throw upload failure exception
        FileService -> Controller : Throw upload failure exception
        Controller -> Frontend : Throw upload failure exception
    end
end
```

## Frontend Direct Upload to OSS

TODO