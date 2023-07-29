<?php
// phpcs:ignoreFile

use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\MemoryUsageProcessor;
use Monolog\Processor\ProcessIdProcessor;
use Monolog\Processor\UidProcessor;
use MonologFactory\DiContainerLoggerFactory;
use Psr\Log\LoggerInterface;

$formatter = [
    'name' => LineFormatter::class,
    'params' => [
        'format' => "[%datetime%] %extra.process_id% [%extra.memory_usage%] %channel%.%level_name%: %message% %context% %extra%\n"
    ]
];

return [
    'dependencies' => [
        'factories' => [
            Logger::class => [DiContainerLoggerFactory::class, PHP_SAPI == 'cli' ? 'console' : 'default'],
        ],
        'aliases'    => [
            'logger' => Logger::class,
            LoggerInterface::class => Logger::class,
        ],
    ],
    'logger' => [
        'default' => [
            'name' => 'default',
            'handlers' => [
                [
                    'name' => StreamHandler::class,
                    'params' => [
                        'stream' => 'data/logs/app.log',
                        'level'  => Logger::DEBUG,
                    ],
                    'formatter' => [
                        'name' => LineFormatter::class,
                        'params' => [
                            'format' => "[%datetime%] %extra.uid% %channel%.%level_name%: %message% %context% %extra%\n"
                        ]
                    ],
                ],
            ],
            'processors' => [
                ['name' => UidProcessor::class],
            ],
        ],
        'console' => [
            'handlers' => [
                [
                    'name' => StreamHandler::class,
                    'params' => [
                        'stream' => 'data/logs/app.log',
                        'level'  => Logger::DEBUG,
                    ],
                    'formatter' => $formatter,
                ],
                [
                    'name' => StreamHandler::class,
                    'params' => [
                        'stream' => 'php://stdout',
                        'level'  => Logger::DEBUG,
                    ],
                    'formatter' => $formatter,
                ],
            ],
            'processors' => [
                ['name' => ProcessIdProcessor::class],
                ['name' => MemoryUsageProcessor::class],
            ],
        ],
    ],
];
