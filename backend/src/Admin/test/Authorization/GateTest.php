<?php

namespace ZfeggTest\Admin\Admin\Authorization;

use Doctrine\ORM\EntityManagerInterface;
use Mezzio\Authentication\UserInterface;
use Zfegg\Admin\Admin\Authorization\Gate;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\RoleMenu;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class GateTest extends AbstractActionTestCase
{
    private Role $role;

    protected function setUp(): void
    {
        parent::setUp();
        $em = $this->container->get(EntityManagerInterface::class);
        $roleName = 'test-gate';
        $role = $em->getRepository(Role::class)->findOneBy(['name' => $roleName]);
        if (! $role) {
            $role = new Role();
            $role->setName($roleName);
        }
        $menus = $role->getMenus();
        if (! $menus->exists(fn($index, $menu) => $menu->getMenu() == 'Test/foo')) {
            $menus->add(new RoleMenu($role, 'Test/foo'));
        }
        if (! $menus->exists(fn($index, $menu) => $menu->getMenu() == 'Test/bar')) {
            $menus->add(new RoleMenu($role, 'Test/bar'));
        }
        $em->persist($role);
        $em->flush();

        $this->role = $role;
    }

    private function createGate(): Gate
    {
        $menus = [
            [
                'name' => 'Test',
                'permissions' => [
                    'Test:GET',
                ],
                'children' => [
                    [
                        'name' => 'foo',
                        'permissions' => [
                            'xxx:GET',
                        ]
                    ],
                    [
                        'name' => 'bar',
                        'permissions' => [
                            'xxx:POST',
                        ]
                    ],
                ]
            ]
        ];
        return new Gate($this->container->get(EntityManagerInterface::class), $menus);
    }

    public function testIsGranted(): void
    {
        $user = $this->createMock(UserInterface::class);
        $user->method('getRoles')->willReturn([$this->role]);

        $gate = $this->createGate();
        $rs = $gate->isGranted($user, 'xxx:GET');

        $this->assertTrue($rs);
    }

    public function testIsGrantedByRole(): void
    {

        $gate = $this->createGate();
        $rs = $gate->isGrantedByRole($this->role->getId(), 'xxx:GET');

        $this->assertTrue($rs);
    }

    public function testUserMenus(): void
    {
        $username = 'test-gate@test.com';
        $em = $this->container->get(EntityManagerInterface::class);
        $user = $em->getRepository(User::class)->findOneBy(['email' => $username]);
        if ($user) {
            $em->remove($user);
            $em->flush();
        }

        $user = new User();
        $user->setEmail($username);
        $user->setRealName('Test');
        $user->getRoles()->add($this->role);
        $em->persist($user);
        $em->flush();

        $gate = $this->container->get(Gate::class);
        $rs = $gate->userMenus($user->getId());

        $this->assertEquals(['Test/foo', 'Test/bar'], $rs);
    }
}
