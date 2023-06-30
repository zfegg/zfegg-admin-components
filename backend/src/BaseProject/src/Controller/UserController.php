<?php


namespace Zfegg\Admin\BaseProject\Controller;

use Zfegg\Admin\BaseProject\Entity\Member;
use Zfegg\Admin\BaseProject\Entity\ProjectInterface;
use Zfegg\Admin\BaseProject\Middleware\ProjectBindingMiddleware;
use Doctrine\ORM\EntityManagerInterface;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Authentication\UserInterface;
use Mezzio\Session\SessionMiddleware;
use Zfegg\PsrMvc\Attribute\HttpGet;
use Zfegg\PsrMvc\Attribute\Route;

#[Route(
    '/api',
    [
        SessionMiddleware::class,
        AuthenticationMiddleware::class,
    ],
)]
class UserController
{

    private EntityManagerInterface $em;

    public function __construct(
        EntityManagerInterface $em,
    ) {
        $this->em = $em;
    }

    #[HttpGet('[action]')]
    public function myProjects(UserInterface $user): array
    {
        /** @var \zfegg\Admin\BaseProject\Repository\MemberRepository $members */
        $members = $this->em->getRepository(Member::class);

        $projects = $user->isAdmin()
            ? $this->em
                ->createQuery(sprintf(
                    'SELECT p.id, p.code, p.name, p.avatar, p.config FROM %s p WHERE p.status=1',
                    ProjectInterface::class
                ))
                ->getResult()
            : $members->fetchProjectsByMember($user->getId());

        return $projects;
    }

    #[HttpGet('my-projects/{project_id}/menus', [ProjectBindingMiddleware::class])]
    public function myProjectMenus(int $projectId, UserInterface $user): array
    {
        /** @var \zfegg\Admin\BaseProject\Repository\MemberRepository $members */
        $members = $this->em->getRepository(Member::class);

        return $members->fetchMemberMenus($projectId, $user->getIdentity());
    }
}
