<?php

use League\Flysystem\Filesystem;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Session\SessionMiddleware;
use Zfegg\AdminAttachment\AttachmentHandler;

return [
    AttachmentHandler::class => [
        'rules' => [
            'UploadExtension' => [
                'options' => ['allowed' => ['jpg', 'jpeg', 'png', 'gif', 'bmp']],
                'messageTemplate' => '文件必须为图片格式 (jpg, jpeg, png, gif, bmp)',
            ],
            'UploadSize' => [
                'options' => ['size' => '1M'],
                'messageTemplate' => '上传文件必须小于 {size}'
            ],
        ],
        'storage' => 'images/{date}/{uniqid}.{ext}',
        'url' => 'http://localhost:3000/uploads'
    ],
    Filesystem::class => [
        'url' => 'public/uploads'
    ],
    'routes' => [
        [
            'path' => '/api/attachment/images',
            'middleware' => [
                SessionMiddleware::class,
                AuthenticationMiddleware::class,
                AttachmentHandler::class,
            ],
            'allowed_methods' => ['POST'],
        ]
    ]
];