<?php

use Psr\Container\ContainerInterface;
use Zfegg\AdminCenterOauthHandler\Handler\AuthenticatedHandler\AuthenticatedHandlerInterface;
use Zfegg\AdminCenterOauthHandler\Handler\AuthenticatedHandler\ForceRegister;
use Zfegg\AdminCenterOauthHandler\Mezzio\ConfigProvider;
use Zfegg\AdminCenterOauthHandler\Service\AdminCenterService;

return [
    'dependencies' => [
        'factories' => [
            'db.yc_admin_center' => function (ContainerInterface $container) {
                /** @var \Doctrine\DBAL\Connection $conn */
                $conn = $container->get('doctrine.connection.default');

                return $conn->getNativeConnection();
            }
        ],
        'aliases' => [
            AuthenticatedHandlerInterface::class => ForceRegister::class,
        ],
    ],
    ConfigProvider::CONFIG_KEY => [
        AdminCenterService::class => [
            'api' => 'http://admincenter.cloudtoad.com',
            'app_id' => 79,
            'app_uid' => 'basis_skeleton',
            'app_secret' => '4f89ac3ade807b04ddd963f0976882e6adbcbd68',
        ],
    ],

    'middleware_pipeline' => [
        [
            'path' => '/zfegg/admin-center-auth',
            'middleware' => [
                \Mezzio\Session\SessionMiddleware::class,
            ],
            'priority' => 1000,
        ],
    ],
];
