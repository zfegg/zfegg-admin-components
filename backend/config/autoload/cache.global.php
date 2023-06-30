<?php

return [
    'dependencies' => [
        'factories' => [
            'cache.default' => \Zfegg\Psr11SymfonyCache\CacheFactory::class,
            'cache.array' => [\Zfegg\Psr11SymfonyCache\CacheFactory::class, 'array'],
        ],
        'aliases' => [
            \Psr\Cache\CacheItemPoolInterface::class => 'cache.default',
            'doctrine.cache.array' => 'cache.array',
        ]
    ],

    'cache' => [
        // At the bare minimum you must include a default adaptor.
        'default' => [
            'type' => 'local',
            'options' => [
                'root' => 'data/cache/'
            ],
        ],

        // Some other Adaptor.  Keys are the names for each adaptor
        'array' => [
            'type' => 'array',
        ],
    ],

];
