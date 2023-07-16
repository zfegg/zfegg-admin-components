<?php

namespace Zfegg\Admin\Admin\Handler;

use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class MenuHandler implements RequestHandlerInterface
{
    public function __construct(
        private array $menus
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        return new JsonResponse(['data' => $this->menus]);
    }
}
