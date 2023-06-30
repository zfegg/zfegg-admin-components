<?php

declare(strict_types=1);

use Laminas\ConfigAggregator\ArrayProvider;
use Laminas\ConfigAggregator\ConfigAggregator;
use Laminas\ConfigAggregator\PhpFileProvider;

// To enable or disable caching, set the `ConfigAggregator::ENABLE_CACHE` boolean in
// `config/autoload/local.php`.
$cacheConfig = [
    'config_cache_path' => 'data/cache/config-cache.php',
];
$providers = [

    \Mezzio\ConfigProvider::class,
    \Mezzio\Authentication\ConfigProvider::class,
    \Mezzio\Helper\ConfigProvider::class,
    \Mezzio\Router\ConfigProvider::class,
    \Mezzio\Router\FastRouteRouter\ConfigProvider::class,
    \Mezzio\Session\ConfigProvider::class,
    \Mezzio\Session\Cache\ConfigProvider::class,
    \Mezzio\Session\Ext\ConfigProvider::class,
    \Mezzio\ProblemDetails\ConfigProvider::class,

    \Laminas\HttpHandlerRunner\ConfigProvider::class,
    \Laminas\Diactoros\ConfigProvider::class,

    \zfegg\AdminCenterOauthHandler\Mezzio\ConfigProvider::class,
    \zfegg\CommonLoggerModule\ConfigProvider::class,
    \zfegg\Admin\Admin\ConfigProvider::class,
    \zfegg\Admin\BaseProject\ConfigProvider::class,
    \zfegg\AttachmentHandler\ConfigProvider::class,

    \Zfegg\ApiSerializerExt\ConfigProvider::class,
    \Zfegg\ApiRestfulHandler\ConfigProvider::class,
    \Zfegg\ApiResourceDoctrine\ConfigProvider::class,
    \Zfegg\PsrMvc\ConfigProvider::class,
    \Zfegg\DoctrineHelper\ConfigProvider::class,
    \Zfegg\ContentValidation\ConfigProvider::class,

    // Default App module config
    \App\ConfigProvider::class,
    \Book\ConfigProvider::class,

    // Include cache configuration
    new ArrayProvider($cacheConfig),

    // Load application config in a pre-defined order in such a way that local settings
    // overwrite global settings. (Loaded as first to last):
    //   - `global.php`
    //   - `*.global.php`
    //   - `local.php`
    //   - `*.local.php`
    new PhpFileProvider(realpath(__DIR__) . '/autoload/{{,*.}global,{,*.}local}.php'),

    // Load development config if it exists
    new PhpFileProvider(realpath(__DIR__) . '/development.config.php'),
];

if (PHP_SAPI == 'cli') {
    $providers = array_merge(
        $providers,
        [
            \Zfegg\DoctrineHelper\CliConfigProvider::class,
            new PhpFileProvider(realpath(__DIR__) . '/cli-autoload/{{,*.}global,{,*.}local}.php'),
        ]
    );
}

$aggregator = new ConfigAggregator($providers, $cacheConfig['config_cache_path']);

return $aggregator->getMergedConfig();
