<?php


namespace App\Factory;

use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\MessageFormatter;
use GuzzleHttp\Middleware;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;

class HttpClientFactory
{
    const MAX_RETRIES = 1;

    public function __invoke(ContainerInterface $container): Client
    {
        $logger = $container->get(LoggerInterface::class);
        $stack = HandlerStack::create();
        $stack->push(Middleware::log($logger, new MessageFormatter(MessageFormatter::DEBUG), LogLevel::DEBUG));

        $options = [
            'timeout' => 4,
            'handler' => $stack
        ];

        return new Client($options);
    }
}
