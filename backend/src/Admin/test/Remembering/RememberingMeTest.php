<?php

namespace ZfeggTest\Admin\Admin\Remembering;

use Mezzio\Authentication\DefaultUser;
use Zfegg\Admin\Admin\Remembering\RememberingMe;
use PHPUnit\Framework\TestCase;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class RememberingMeTest extends AbstractActionTestCase
{

    public function testGenToken()
    {
        $remembering = $this->container->get(RememberingMe::class);

        $user = new DefaultUser(123, ['username' => 'test']);
        $jwt = $remembering->genToken($user);

        self::assertIsString($jwt);
    }
}
