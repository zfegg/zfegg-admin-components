<?php

namespace ZfeggTest\Admin\BaseProject\Controller;

use Zfegg\Admin\BaseProject\Test\InitProjectEntityTrait;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class UserControllerTest extends AbstractActionTestCase
{
    use InitEntityTrait;
    use InitProjectEntityTrait;

    public function testMyProjects(): void
    {
        $user = $this->initTestUser(['admin' => true]);
        $this->initTestProject();
        $this->initSession($user->getId());
        $result = $this->get('/api/my-projects')->assertOk()->json();

        $this->assertIsArray($result);
    }

    public function testMyProjectMenus(): void
    {
        $user = $this->initTestUser();
        $this->initSession($user->getId());

        $this->get('/api/my-projects/2/menus')
        ->assertOk();
    }
}
