# 文件上传

## 后端上传

::: tip

文件上传由 MineAdmin 接入 [mineadmin/upload](https://github.com/mineadmin/upload) 组件建设而成

:::

MineAdmin 提供了一个默认的服务端文件上传逻辑。接口 `/admin/attachment/upload`
并且在上传成功后接入了资源管理器。

::: code-group

```php [ControllerUpload]
#[Post(
    path: '/admin/attachment/upload',
    operationId: 'UploadAttachment',
    summary: '上传附件',
    security: [['Bearer' => [], 'ApiKey' => []]],
    tags: ['数据中心'],
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

### 替换本地存储为 Oss 存储

在日常的业务场景中，一般文件存储在 OSS 上。那么此时就需要替换默认的文件上传处理了。以阿里云举例
首先我们要配置 `config/autoload/file.php` 文件。新增阿里云通道。
然后新建一个 `AliyunUploadSubscribe` 替换 `config/autoload/listeners.php` 中默认的 `UploadSubscribe` 指定为阿里云通道


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
    // 默认文件上传
    // UploadSubscriber::class,
    // 阿里云 oss 上传
    AliyunUploadSubscribe::class,
    // 处理程序启动
    BootApplicationSubscriber::class,
    // 处理 sql 执行
    DbQueryExecutedSubscriber::class,
    // 处理命令异常
    FailToHandleSubscriber::class,
    // 处理 worker 退出
    ResumeExitCoordinatorSubscriber::class,
    // 处理队列
    QueueHandleSubscriber::class,
    // 注册新的 Blueprint 宏
    RegisterBlueprintListener::class,
];

```

:::

### 修改默认上传文件命名和目录命名

文件的命名以及文件的目录命名默认是由 `Mine\Upload\Listener\UploadListener->generatorPath()` 和
`Mine\Upload\Listener\UploadListener->generatorId()` 实现的，而所有的上传处理类都是继承与这个类。
那么以上一张替换 OSS 存储为例。只需要在你的上传处理类中替换这两个方法即可

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
        // 生成文件名，随机字符串长度为 10
        return Str::random(10);
    }

    protected function generatorPath(): string
    {
        // 目录格式：年/月/日
        return date('Y/m/d');
    }

}

```


### 处理流程

`前端`调用接口 `/admin/attachment/upload` ，传入参数 `file`、参数类型为文件。
服务端文件控制器调用 文件服务对前端传入的 `file` 进行处理、
`文件服务`判断上传文件hash值是否已经上传过
如果有。则查询数据库返回上次上传的信息
如果没有。则`调用 UploadInterface 实例分发一个 UploadEvent 事件`
分发后。`判断 UploadEvent->isUploaded() 是否上传成功`
如果上传成功则返回 `Upload` 上传实例
如果没有上传成功则抛出异常上传失败

#### 流程图

```plantuml
|前端|
start
:调用接口 /admin/attachment/upload，传入文件参数 file;
|服务端文件控制器|
:调用文件服务处理 file;
|文件服务|
:判断上传文件 hash 值是否已上传过;
if (已上传过) then (是)
    :查询数据库返回上次上传信息;
else (否)
    :调用 UploadInterface 实例分发 UploadEvent;
    |UploadEvent|
    :判断 isUploaded() 是否上传成功;
    if (上传成功) then (是)
        :返回 Upload 上传实例;
    else (否)
        :抛出异常上传失败;
    endif
endif
```

#### 时序图

```plantuml
participant "前端" as Frontend
participant "服务端文件控制器" as Controller
participant "文件服务" as FileService
participant "UploadInterface" as Uploader
participant "数据库" as Database

Frontend -> Controller : 调用接口 /admin/attachment/upload，传入 file
Controller -> FileService : 处理 file
FileService -> FileService : 判断文件 hash 值是否已上传过
alt 已上传过
    FileService -> Database : 查询数据库
    Database -> FileService : 返回上次上传信息
    FileService -> Controller : 返回上次上传信息
    Controller -> Frontend : 返回上次上传信息
else 未上传过
    FileService -> Uploader : 分发 UploadEvent
    Uploader -> Uploader : 判断 isUploaded() 是否上传成功
    alt 上传成功
        Uploader -> FileService : 返回 Upload 上传实例
        FileService -> Controller : 返回 Upload 上传实例
        Controller -> Frontend : 返回 Upload 上传实例
    else 上传失败
        Uploader -> FileService : 抛出异常上传失败
        FileService -> Controller : 抛出异常上传失败
        Controller -> Frontend : 抛出异常上传失败
    end
end
```

## 前端直传 OSS

TODO