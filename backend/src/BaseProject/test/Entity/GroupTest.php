<?php

namespace ZfeggTest\Admin\BaseProject\Entity;

use Doctrine\ORM\EntityManagerInterface;
use Zfegg\Admin\BaseProject\Entity\Group;
use Zfegg\Admin\BaseProject\Test\InitProjectEntityTrait;
use Zfegg\ApiRestfulHandler\Test\RestfulApiTestTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class GroupTest extends AbstractActionTestCase
{
    use RestfulApiTestTrait;
    use InitProjectEntityTrait;

    private string $path = '/api/projects/%s/groups';

    public function testCURD(): void
    {
        $this->initSession();
        $project = $this->initTestProject();
        $user = $this->initTestUser();
        $user2 = $this->initTestUser([
            'email' => 'test2@test.com',
            'real_name' => 'Test2',
        ]);
        $this->path = sprintf($this->path, $project->getId());
        $em = $this->container->get(EntityManagerInterface::class);
        $rows = $em->getRepository(Group::class)->findBy(['name' => 'Test1']);
        foreach ($rows as $row) {
            $em->remove($row);
        }
        $em->flush();

        $post = [
            'name' => 'Test1',
            'members' => [
                $user->getId(),
            ]
        ];

        $this->apiCurd(
            $post,
            [
                'members' => [
                    $user->getId(),
                    $user2->getId(),
                ],
            ],
            [
                'members' => [],
            ],
        );
    }
}
