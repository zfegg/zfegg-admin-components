<?php

namespace ZfeggTest\Admin\Admin\Controller;

use Mezzio\Session\Cache\CacheSessionPersistence;
use Mezzio\Session\SessionPersistenceInterface;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class AuthControllerTest extends AbstractActionTestCase
{
    use InitEntityTrait;

    const SESS_COOKIE = 'PHPSESSION';

    public function testLoginLogout()
    {

        $this->container->setService(CacheItemPoolInterface::class, new ArrayAdapter());
        $this->container->setAlias(SessionPersistenceInterface::class, CacheSessionPersistence::class);

        $this->removeTestUser();
        $user = $this->initTestUser();

        $response = $this->post('/api/auth/login', ['email' => $user->getEmail(), 'password' => '123123'])
            ->assertCookie(self::SESS_COOKIE)
            ->assertNoContent();

        $this->withCookie(self::SESS_COOKIE, $response->getCookie(self::SESS_COOKIE)->getValue());
        $this->get('/api/auth/logout')
            ->assertCookieExpired(self::SESS_COOKIE)
            ->assertNoContent();
    }
}
