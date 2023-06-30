<?php

namespace ZfeggTest\Admin\Admin\Controller;

use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\Admin\Admin\Test\Utils;
use Zfegg\ApiRestfulHandler\Test\RestfulApiTestTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class RoleUsersResourceTest extends AbstractActionTestCase
{
    use RestfulApiTestTrait;
    use InitEntityTrait;

    private string $path = '/api/admin/roles/%s/users';

    protected function setUp(): void
    {
        parent::setUp();
        Utils::initSession();

        $this->removeTestRole();
        $role = $this->initTestRole();
        $this->path = sprintf($this->path, $role->getId());
    }

    public function testCURD(): void
    {
        $user = $this->initTestUser();
        $data = ['id' => $user->getId()];
        $id = $this->apiCreate($data);
        $this->apiDelete($id);
    }
}
