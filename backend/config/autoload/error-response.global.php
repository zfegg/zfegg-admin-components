<?php

use Mezzio\Container\WhoopsErrorResponseGeneratorFactory;
use Mezzio\Middleware\ErrorResponseGenerator;
use Mezzio\Middleware\WhoopsErrorResponseGenerator;
use Zfegg\ApiRestfulHandler\ErrorResponse\FormatMatcherErrorResponseGenerator;
use Zfegg\ApiRestfulHandler\Factory\FormatMatcherErrorResponseGeneratorFactory;

return [
    'dependencies' => [
        'aliases' => [
            FormatMatcherErrorResponseGenerator::class => ErrorResponseGenerator::class,
        ],
        'factories'  => [
            ErrorResponseGenerator::class => FormatMatcherErrorResponseGeneratorFactory::class,
            WhoopsErrorResponseGenerator::class => WhoopsErrorResponseGeneratorFactory::class,
        ],
    ],
    FormatMatcherErrorResponseGenerator::class => [
        'error_formats' => [
        ],
        'generators' => [
            'default' => WhoopsErrorResponseGenerator::class,
        ],
    ],
];
