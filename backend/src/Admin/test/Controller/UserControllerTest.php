<?php

namespace ZfeggTest\Admin\Admin\Controller;

use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\Admin\Admin\Test\Utils;
use Zfegg\ApiRestfulHandler\Test\RestfulApiTestTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class UserControllerTest extends AbstractActionTestCase
{
    use RestfulApiTestTrait;
    use InitEntityTrait;

    private string $path = '/api/admin/users';

    private Role $role;

    public function testCURD(): void
    {
        $this->initSession();
        $this->removeTestUser();
        $role = $this->initTestRole();
        $role2 = $this->initTestRole('test2');
        $data = [
            'email' => 'test@test.com',
            'password' => '123123',
            'real_name' => 'Test',
            'roles' => [$role->getId()],
            'admin' => '0',
            'status' => '1',
            'add_test' => 1,
        ];

        $id = $this->apiCreate($data);
        $this->apiGetList();
        $this->apiPatch($id, ['roles' => [$role2->getId()]]);
    }

    public function testGetUser(): void
    {
        $user = $this->initTestUser();
        Utils::initSession($user->getId());
        $this->withHeader('X-Requested-With', 'XMLHttpRequest');
        $this->get('/api/user')
            ->assertOk()
            ->assertJsonStructure(['real_name', 'admin']);
    }


    public function testGetUserProfile(): void
    {
        $user = $this->initTestUser();
        Utils::initSession($user->getId());
        $this->withHeader('X-Requested-With', 'XMLHttpRequest');
        $this->get('/api/user/profile')
            ->assertOk()
            ->assertJsonStructure(['real_name', 'admin', 'bindings']);
    }

    public function testPostProfile(): void
    {
        $this->initSession();
        $this->post('/api/user/profile', ['avatar' => 'about:blank', 'config' => ['test' => 1]])
            ->assertOk();
    }
}
