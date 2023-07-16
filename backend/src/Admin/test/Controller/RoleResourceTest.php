<?php

namespace ZfeggTest\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\Admin\Admin\Test\Utils;
use Zfegg\ApiRestfulHandler\Test\RestfulApiTestTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class RoleResourceTest extends AbstractActionTestCase
{
    use RestfulApiTestTrait;
    use InitEntityTrait;

    private string $path = '/api/admin/roles';

    protected function setUp(): void
    {
        parent::setUp();
        Utils::initSession();
    }

    public function testCURD(): void
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $this->removeTestRole();
        $user = $this->initTestUser();
        $data = [
            'name' => 'test',
            'description' => 'test123',
            'users' => [$user->getId()],
            'menus' => [
                'aaa',
                'bbb',
                'ccc'
            ]
        ];

        $em->clear();
        $id = $this->apiCreate($data);

        $this->apiGetList();

        $role = $em->find(Role::class, $id);
        $this->assertCount(1, $role->getUsers());

        $data['name'] = 'test' . uniqid();
        $data['menus'] = ['ccc', 'ddd', 'eee', 'fff'];
        $this->apiPatch($id, $data);
        $this->assertCount(4, $role->getMenus());

        $this->apiDelete($id);
    }
}
