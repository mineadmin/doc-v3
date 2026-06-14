# File Upload

## Backend Upload

::: tip

File upload is built by MineAdmin integrating the [mineadmin/upload](https://github.com/mineadmin/upload) component.

:::

MineAdmin provides a default server-side file upload logic. The interface is `/admin/attachment/upload`
and it integrates with the resource manager upon successful upload.

::: code-group

```php [ControllerUpload]
#[Post(
    path: '/admin/attachment/upload',
    operationId: 'UploadAttachment',
    summary: 'Upload attachment',
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

### Replacing Local Storage with OSS Storage

In everyday business scenarios, files are typically stored on OSS. In this case, you need to replace the default file upload handling. Using Alibaba Cloud as an example:
First, configure the `config/autoload/file.php` file. Add an Alibaba Cloud channel.
Then, create a new `AliyunUploadSubscribe` to replace the default `UploadSubscribe` in `config/autoload/listeners.php`, specifying the Alibaba Cloud channel.

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
            // oss domain address, if not filled in, the access path generation will fail
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
    // Handle program startup
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

### Modifying Default Upload File Naming and Directory Naming

The default file naming and directory naming are implemented by `Mine\Upload\Listener\UploadListener->generatorPath()` and
`Mine\Upload\Listener\UploadListener->generatorId()`, and all upload processing classes inherit from this class.
Taking the OSS storage replacement example above, you only need to override these two methods in your upload processing class.

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
        // Generate file name, random string length 10
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

`Frontend` calls the interface `/admin/attachment/upload`, passing the parameter `file` with a file type.
The server-side file controller calls the file service to process the `file` passed from the frontend.
The `File Service` checks if the upload file's hash value has already been uploaded.
If yes, it queries the database and returns the information from the previous upload.
If no, it `calls the UploadInterface instance to dispatch an UploadEvent event`.
After dispatching, it `checks if UploadEvent->isUploaded() is successful`.
If upload is successful, it returns the `Upload` instance.
If not successful, it throws an exception indicating upload failure.

#### Flowchart

```plantuml
|Frontend|
start
:Call interface /admin/attachment/upload, pass file parameter;
|Server File Controller|
:Call file service to process file;
|File Service|
:Check if the file hash has been uploaded before;
if (Uploaded before?) then (yes)
    :Query database for previous upload info;
else (no)
    :Call UploadInterface instance to dispatch UploadEvent;
    |UploadEvent|
    :Check isUploaded() success;
    if (Upload successful) then (yes)
        :Return Upload instance;
    else (no)
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

Frontend -> Controller : Call interface /admin/attachment/upload, pass file
Controller -> FileService : Process file
FileService -> FileService : Check if file hash was uploaded before
alt Uploaded before
    FileService -> Database : Query database
    Database -> FileService : Return previous upload info
    FileService -> Controller : Return previous upload info
    Controller -> Frontend : Return previous upload info
else Not uploaded before
    FileService -> Uploader : Dispatch UploadEvent
    Uploader -> Uploader : Check isUploaded() success
    alt Upload successful
        Uploader -> FileService : Return Upload instance
        FileService -> Controller : Return Upload instance
        Controller -> Frontend : Return Upload instance
    else Upload failed
        Uploader -> FileService : Throw upload failure exception
        FileService -> Controller : Throw upload failure exception
        Controller -> Frontend : Throw upload failure exception
    end
end
```

## Frontend Direct Upload to OSS

TODO