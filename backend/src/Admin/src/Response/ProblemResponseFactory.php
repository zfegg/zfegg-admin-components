<?php


namespace Zfegg\Admin\Admin\Response;

use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;

class ProblemResponseFactory implements ProblemResponseFactoryInterface
{

    public function create(
        string $message,
        int $code = 403,
        array $additional = [],
        \Throwable $e = null
    ): ResponseInterface {
        $status = ($code < 100 || $code >= 1000) ? 403 : $code;
        return new JsonResponse(
            [
                'status' => $code,
                'message' => $message,
                'data' => $additional,
                'exception' => $e,
            ],
            $status
        );
    }
}
