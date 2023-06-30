<?php

namespace Zfegg\Admin\BaseProject\Controller;

use Zfegg\Admin\BaseProject\Entity\Project;
use Zfegg\Admin\BaseProject\Entity\ProjectInterface;
use Zfegg\Admin\BaseProject\Middleware\ProjectAuthorizationMiddleware;
use Zfegg\Admin\BaseProject\Middleware\ProjectBindingMiddleware;
use Doctrine\ORM\EntityManagerInterface;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Session\SessionMiddleware;
use Zfegg\ContentValidation\ContentValidationMiddleware;
use Zfegg\PsrMvc\Attribute\HttpGet;
use Zfegg\PsrMvc\Attribute\Route;

#[Route(
    '/api/projects/{project_id}/[action]',
    [
        SessionMiddleware::class,
        AuthenticationMiddleware::class,
        ProjectBindingMiddleware::class,
        ProjectAuthorizationMiddleware::class,
        ContentValidationMiddleware::class,
    ],
    'api.projects:[action]'
)]
class ProjectController
{

    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    #[HttpGet()]
    public function generateSecret(int $projectId): void
    {
        /** @var Project $project */
        $project = $this->em->find(ProjectInterface::class, $projectId);
        $project->setSecret(md5(uniqid()));

        $this->em->persist($project);
        $this->em->flush();
    }
}
