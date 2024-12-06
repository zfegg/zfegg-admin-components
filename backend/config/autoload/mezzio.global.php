<?php

declare(strict_types=1);

use Laminas\ConfigAggregator\ConfigAggregator;
use Laminas\Stratigility\Middleware\ErrorHandler;
use Mezzio\Application;
use Mezzio\Container\ApplicationConfigInjectionDelegator;
use Mezzio\Handler\NotFoundHandler;
use Mezzio\Helper\BodyParams\BodyParamsMiddleware;
use Mezzio\Helper\ServerUrlMiddleware;
use Mezzio\Helper\UrlHelperMiddleware;
use Mezzio\Middleware\ErrorResponseGenerator;
use Mezzio\Router\Middleware\DispatchMiddleware;
use Mezzio\Router\Middleware\ImplicitHeadMiddleware;
use Mezzio\Router\Middleware\ImplicitOptionsMiddleware;
use Mezzio\Router\Middleware\MethodNotAllowedMiddleware;
use Mezzio\Router\Middleware\RouteMiddleware;
use Zfegg\PsrMvc\Container\ErrorResponseGeneratorFactory;
use Zfegg\PsrMvc\Container\LoggingError\LoggingErrorDelegator;

return [
    // Toggle the configuration cache. Set this to boolean false, or remove the
    // directive, to disable configuration caching. Toggling development mode
    // will also disable it by default; clear the configuration cache using
    // `composer clear-config-cache`.
    ConfigAggregator::ENABLE_CACHE => true,

    // Enable debugging; typically used to provide debugging information within templates.
    'debug' => false,

    'dependencies' => [
        'factories' => [
        ],
        'delegators' => [
            Application::class => [
                ApplicationConfigInjectionDelegator::class,
            ],
            ErrorHandler::class => [
                LoggingErrorDelegator::class,
            ],
        ],
    ],

    'mezzio' => [
        // Provide templates for the error handling middleware to use when
        // generating responses.
        'error_handler' => [
            'template_404'   => 'error::404',
            'template_error' => 'error::error',
        ],
    ],

    'middleware_pipeline' => [
        'before_route' => [
            'middleware' => [
                ErrorHandler::class,
                \Blast\BaseUrl\BaseUrlMiddleware::class,
                ServerUrlMiddleware::class,
                BodyParamsMiddleware::class,
                RKA\Middleware\IpAddress::class,
            ],
            'priority' => PHP_INT_MAX
        ],
        [
            'middleware' => [
                RouteMiddleware::class,
                ImplicitHeadMiddleware::class,
                ImplicitOptionsMiddleware::class,
                MethodNotAllowedMiddleware::class,
                UrlHelperMiddleware::class,
            ],
            'priority' => 1000
        ],
        [
            'middleware' => [
                DispatchMiddleware::class,
                NotFoundHandler::class,
            ],
        ],
    ],
];
