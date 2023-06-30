<?php


namespace Zfegg\Admin\Admin\Response;

use Psr\Http\Message\ResponseInterface;

interface ProblemResponseFactoryInterface
{
    public function create(
        string $message,
        int $code = 403,
        array $additional = [],
        \Throwable $e = null
    ): ResponseInterface;
}
