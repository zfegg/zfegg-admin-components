<?php

namespace ZfeggTest\Admin\Admin\Handler;

use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class MenuHandlerTest extends AbstractActionTestCase
{
    use InitEntityTrait;

    public function testGetMenus(): void
    {
        $this->initSession();

        $this->get('/api/admin/menus')->assertOk();
    }
}
