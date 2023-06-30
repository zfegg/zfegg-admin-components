<?php

namespace ZfeggTest\Admin\Admin\Handler;

use Mezzio\Session\Cache\CacheSessionPersistence;
use Mezzio\Session\SessionPersistenceInterface;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\Admin\Admin\Test\Utils;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class UserLoginHandlerTest extends AbstractActionTestCase
{
    use InitEntityTrait;

    public function testHandle(): void
    {
        $this->container->setService(CacheItemPoolInterface::class, new ArrayAdapter());
        $this->container->setAlias(SessionPersistenceInterface::class, CacheSessionPersistence::class);

        $this->removeTestUser();
        $user = $this->initTestUser();
        Utils::initSession($user->getId());

        $this->post('/api/auth/login', ['email' => $user->getEmail(), 'password' => '123123'])
            ->assertCookie('PHPSESSION')
            ->assertNoContent();
    }
}
