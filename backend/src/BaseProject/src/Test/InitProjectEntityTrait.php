<?php


namespace Zfegg\Admin\BaseProject\Test;

use Zfegg\Admin\BaseProject\Entity\Member;
use Zfegg\Admin\BaseProject\Entity\MemberInterface;
use Zfegg\Admin\BaseProject\Entity\Project;
use Zfegg\Admin\BaseProject\Entity\ProjectInterface;
use Doctrine\ORM\EntityManagerInterface;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

/**
 * Trait InitProjectEntityTrait
 * @mixin AbstractActionTestCase
 */
trait InitProjectEntityTrait
{
    use InitEntityTrait;

    private function initTestProjectMember(
        ?User $user = null,
        ?Role $role = null,
        ?ProjectInterface $project = null
    ): MemberInterface {
        $project = $project ?? $this->initTestProject();
        $role = $role ?? $this->initTestRole();
        $user = $user ?? $this->initTestUser();
        $em = $this->container->get(EntityManagerInterface::class);

        $row = $em->getRepository(Member::class)->findOneBy([
            'member' => $user,
            'project' => $project,
            'role' => $role,
        ]);

        if (! $row) {
            $row = new Member();
            $row->setMember($user);
            $row->setProject($project);
            $row->setRole($role);

            $em->persist($row);
            $em->flush();
        }

        return $row;
    }

    public function initTestProject(array $data = []): ProjectInterface
    {
        $data = $data + [
            'code' => 'test',
            'name' => 'Test',
        ];
        $em = $this->container->get(EntityManagerInterface::class);
        $project = $em->getRepository(ProjectInterface::class)->findOneBy(['code' => $data['code']]);

        if (! $project) {
            $className = $this->projectClassName ?? Project::class;
            $project = new $className();
            $project->setName($data['name']);
            $project->setCode($data['code']);
            $em->persist($project);
            $em->flush();
        }

        return $project;
    }

    public function removeTestProject(string $code = 'test'): void
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $project = $em->getRepository(Project::class)->findOneBy(['code' => $code]);

        if ($project) {
            $em->remove($project);
            $em->flush();
        }
    }
}
