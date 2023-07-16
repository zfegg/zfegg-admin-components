<?php

use Monolog\Handler\PsrHandler;
use Psr\Container\ContainerInterface;
use Symfony\Component\Console\Logger\ConsoleLogger;
use Symfony\Component\Console\Output\ConsoleOutput;
use Laminas\ServiceManager\Factory\InvokableFactory;

return [
    'dependencies' => [
        'factories' => [
            'console.logger'     => function (ContainerInterface $container) {
                $file = __DIR__ . '/../../data/logs/console.log';

                $logger = new Monolog\Logger('console');
                $logger->pushProcessor(new Monolog\Processor\UidProcessor());
                $logger->pushHandler(new Monolog\Handler\StreamHandler($file));
                $logger->pushHandler(
                    new PsrHandler(
                        new ConsoleLogger($container->get(ConsoleOutput::class))
                    )
                );


                return $logger;
            },
            ConsoleOutput::class => InvokableFactory::class,
        ],
    ],
    'commands'     => [],
];
