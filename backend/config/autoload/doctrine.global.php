<?php

use Doctrine\ORM\Mapping\UnderscoreNamingStrategy;
use Doctrine\ORM\Tools\ResolveTargetEntityListener;
use Zfegg\DoctrineHelper\ContainerEntityListenerResolver;

return [
    'dependencies' => [
        'factories' => [
        ],
    ],
    'doctrine' => [
        'configuration' => [
            'default' => [
                'driver' => 'default',
                'proxy_dir' => 'data/cache/doctrine-proxy',
                'filters' => [
//                    'soft-deleteable' => SoftDeleteableFilter::class,
                ],
                'entity_listener_resolver' => ContainerEntityListenerResolver::class,
                'naming_strategy' => UnderscoreNamingStrategy::class,
            ],
        ],
        'connection' => [
            'default' => [
//            'driver_class' => \Doctrine\DBAL\Driver\PDO\MySql\Driver::class,
//            'pdo' => null,
                'event_manager' => 'default',
                'params' => [
//                    'url' => 'mysql://root:@localhost/yc_admin_v1?charset=utf8',
                    'url' => 'pdo-sqlite:///' . __DIR__ . '/../../data/app.db',
                ],
                'charset' => 'utf8',
            ],
        ],
        'entity_manager' => [
            'default' => [
                'connection' => 'default',
                'configuration' => 'default',
            ],
        ],
        'event_manager' => [
            'default' => [
                'subscribers' => [
                    ResolveTargetEntityListener::class,
//                    TimestampableListener::class,
//                    SoftDeleteableListener::class,
                ],
            ],
        ],

        'driver' => [
            'attribute' => [
                'class' => \Doctrine\ORM\Mapping\Driver\AttributeDriver::class,
                'cache' => 'cache.default',
            ],
            'default' => [
                'class' => \Doctrine\Persistence\Mapping\Driver\MappingDriverChain::class,
                'default_driver' => 'attribute',
                'drivers' => [
                ],
            ],
        ],
        'types' => [
        ],
        'repositories' => [],
    ]
];
