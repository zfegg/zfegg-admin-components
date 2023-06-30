<?php

declare(strict_types=1);

namespace Zfegg\AdminAttachment;

use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemInterface;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Session\SessionMiddleware;
use Zfegg\ApiRestfulHandler\Utils\Route;
use Zfegg\PsrMvc\Routing\Group;
use Zfegg\PsrMvc\Routing\RouteMetadata;

class ConfigProvider
{
    public function __invoke() : array
    {
        return [
            'dependencies' => $this->getDependencies(),
            'doctrine' => $this->getDoctrine(),
            'routes' => $this->getRoutes(),
            'rest' => [
            ],
            'doctrine.orm-resources' => [
            ],
            RouteMetadata::class => [
                'paths' => [
                    __DIR__ . '/Controller',
                ]
            ],
            AttachmentHandler::class => [
                'rules' => [
                    'UploadExtension' => [
                        'options' => ['allowed' => ['jpg', 'jpeg', 'png', 'gif', 'bmp']],
                        'messageTemplate' => '文件必须为图片格式 (jpg, jpeg, png, gif, bmp)',
                    ],
                    'UploadSize' => [
                        'options' => ['max' => '1M'],
                        'messageTemplate' => '上传文件必须小于 {max}'
                    ],
                ],
                'storage' => 'images/{date}/{uniqid}.{ext}',
                'url' => 'http://localhost:3000/uploads'
            ],
            Filesystem::class => [
                'url' => 'file:///www/zfegg/kefu-admin-v2/backend/public/uploads'
//                'url' => 'osss://LTAI5t91VNwUgcAnZvrJzSqW:qc8wX7PNBgXB4UmpBXpU2jAxLTRYa9@support-app-zfegg-com/?bucket=support-app-zfegg-com'
            ]
        ];
    }

    /**
     * Returns the container dependencies
     */
    public function getDependencies() : array
    {
        return [
            'invokables' => [
            ],
            'factories'  => [
                AttachmentHandler::class => Factory\AttachmentHandlerFactory::class,
                Filesystem::class => Factory\FilesystemFactory::class,
            ],
            'aliases' => [
                FilesystemInterface::class => Filesystem::class,
            ],
        ];
    }

    public function getDoctrine(): array
    {
        return [
            'configuration' => [
                'default' => [
                    'entity_namespaces' => [
                        'YcProject' => __NAMESPACE__ . '\\Entity'
                    ],
                ],
            ],
            'driver' => [
                'attribute' => [
                    'paths' => [
//                        __DIR__ . '/Entity',
                    ],
                ],
            ],
        ];
    }

    private function getRoutes(): array
    {
        return [
            [
                'path' => '/api/attachment/images',
                'middleware' => [
                    SessionMiddleware::class,
                    AuthenticationMiddleware::class,
                    AttachmentHandler::class,
                ],
                'allowed_methods' => ['POST'],
            ]
        ];
    }
}
