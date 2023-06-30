<?php


namespace Zfegg\Admin\Admin\Middleware;

use Mezzio\Authentication\UserInterface;
use Mezzio\Router\RouteResult;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zfegg\Admin\Admin\Authorization\GateInterface;

class AuthorizationMiddleware implements MiddlewareInterface
{
    private GateInterface $gate;
    private ResponseFactoryInterface $rf;

    public function __construct(
        GateInterface $gate,
        ResponseFactoryInterface $rf
    ) {
        $this->gate = $gate;
        $this->rf = $rf;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $route = $request->getAttribute(RouteResult::class);
        $user = $request->getAttribute(UserInterface::class);

        // 用户未登录不需执行授权验证
        if (! $user || (! $route) || $route->isFailure() || $user->getDetail('admin')) {
            return $handler->handle($request);
        }

        $route->getMatchedRoute();
        $permission = $route->getMatchedRouteName();
        if (! str_contains($permission, ':')) {
            $permission .= ':' . $request->getMethod();
        }

        if ($this->gate->isGranted($user, $permission)) {
            return $handler->handle($request);
        }

        return $this->rf->createResponse(403)->withHeader('X-Permission', $permission);
    }
}
