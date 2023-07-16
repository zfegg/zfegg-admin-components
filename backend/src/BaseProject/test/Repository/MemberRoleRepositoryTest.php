<?php

namespace ZfeggTest\Admin\BaseProject\Repository;

use Zfegg\Admin\BaseProject\Entity\Member;
use Zfegg\Admin\BaseProject\Test\InitProjectEntityTrait;
use Doctrine\ORM\EntityManagerInterface;
use Zfegg\Admin\BaseProject\Repository\MemberRepository;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class MemberRoleRepositoryTest extends AbstractActionTestCase
{
    use InitProjectEntityTrait;

    public function testFetchMemberProjects(): void
    {
        $em = $this->container->get(EntityManagerInterface::class);

        /** @var MemberRepository $repository */
        $repository = $em->getRepository(Member::class);
        $result = $repository->fetchProjectsByMember(185);

        $this->assertIsArray($result);
    }

    public function testFetchByProject(): void
    {
        $project = $this->initTestProject();
        $em = $this->container->get(EntityManagerInterface::class);

        /** @var MemberRepository $repository */
        $repository = $em->getRepository(Member::class);
        $result = $repository->fetchByProject($project->getId());

        $this->assertIsArray($result);
    }
}
