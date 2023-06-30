<?php

namespace Zfegg\Admin\BaseProject\Middleware;

use Zfegg\Admin\BaseProject\Entity\Member;
use Zfegg\Admin\BaseProject\Repository\MemberRepository;
use Doctrine\ORM\EntityManagerInterface;
use Mezzio\Authentication\UserInterface;
use Mezzio\Router\RouteResult;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zfegg\Admin\Admin\Authorization\GateInterface;

class ProjectAuthorizationMiddleware implements MiddlewareInterface
{

    public function __construct(
        private GateInterface $gate,
        private EntityManagerInterface $em,
        private ResponseFactoryInterface $rf,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $projectId = $request->getAttribute('project_id');
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

        /** @var MemberRepository $members */
        $members = $this->em->getRepository(Member::class);

        $rows = $members->findBy([
            'member' => $request->getAttribute(UserInterface::class)->getIdentity(),
            'project' => $projectId,
        ]);

        if ($this->isGranted($rows, $permission)) {
            return $handler->handle($request);
        }

        return $this->rf->createResponse(403);
    }

    /**
     * @param Member[]  $rows
     */
    private function isGranted(array $rows, string $permission): bool
    {
        foreach ($rows as $row) {
            if ($this->gate->isGrantedByRole($row->getRole()->getId(), $permission)) {
                return true;
            }
        }

        return false;
    }
}
