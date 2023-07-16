<?php

namespace ZfeggTest\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Laminas\ServiceManager\ServiceManager;
use Zfegg\Admin\Admin\Entity\UserAuthBinding;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\AdminCenterOauthHandler\Service\AdminCenterService;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

/**
 * @property ServiceManager $container
 */
class UserBindingControllerTest extends AbstractActionTestCase
{
    use InitEntityTrait;

    public function testBind(): void
    {
    }
}
