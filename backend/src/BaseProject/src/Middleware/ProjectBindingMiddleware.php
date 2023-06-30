<?php

namespace Zfegg\Admin\BaseProject\Middleware;

use Zfegg\Admin\BaseProject\Entity\ProjectInterface;
use Doctrine\ORM\EntityManagerInterface;
use Mezzio\Handler\NotFoundHandler;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ProjectBindingMiddleware implements MiddlewareInterface
{
    private EntityManagerInterface $em;
    private NotFoundHandler $notFound;

    public function __construct(EntityManagerInterface $em, NotFoundHandler $notFound)
    {
        $this->em = $em;
        $this->notFound = $notFound;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $code = $request->getAttribute('project_id');
        $entity = ProjectInterface::class;
        if (is_numeric($code)) {
            $project = $this->em->find($entity, $code);
        } else {
            $project = $this->em->getRepository($entity)->findOneByCode($code);
        }

        if (! $project) {
            return $this->notFound->handle($request);
        }

        $request = $request->withAttribute('project_id', $project->getId())
            ->withAttribute(ProjectInterface::class, $project);

        return $handler->handle($request);
    }
}
