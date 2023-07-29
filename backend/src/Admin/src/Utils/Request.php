<?php

namespace Zfegg\Admin\Admin\Utils;

use Psr\Http\Message\ServerRequestInterface;

class Request
{

    public static function isAjax(ServerRequestInterface $request): bool
    {
        return $request->getHeaderLine('X-Requested-With') == 'XMLHttpRequest'
            || str_starts_with($request->getAttribute('format'), 'json');
    }
}