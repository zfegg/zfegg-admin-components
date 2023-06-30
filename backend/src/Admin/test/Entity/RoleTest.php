<?php

namespace ZfeggTest\Admin\Admin\Entity;

use Doctrine\ORM\EntityManagerInterface;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\RoleMenu;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class RoleTest extends AbstractActionTestCase
{
    use InitEntityTrait;

    public function testJoinUser2(): void
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $this->removeTestRole();
        $user = $this->initTestUser();

        $role = new Role('test');
        $role->addUser($user);
        $em->persist($role);
        $em->flush();
        $em->refresh($role);

        $this->assertCount(1, $role->getUsers());
    }

    public function testJoinUser(): void
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $this->removeTestRole();
        $role = $this->initTestRole();
        $user = $this->initTestUser();

        $role->addUser($user);
        $em->flush();
        $em->refresh($role);

        $this->assertCount(1, $role->getUsers());

        $role->removeUser($user);
        $em->flush();

        $this->assertCount(0, $role->getUsers());
    }


    public function testJoinMenu(): void
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $role = $em->getRepository(Role::class)->findOneBy(['name' => 'test']);
        if ($role) {
            $em->remove($role);
            $em->flush();
        }

        $role = new Role('test');
        $role->getMenus()->add(new RoleMenu($role, 'aaa'));
        $role->getMenus()->add(new RoleMenu($role, 'bbb'));
        $role->getMenus()->add(new RoleMenu($role, 'ccc'));
        $em->persist($role);
        $em->flush();
        $em->refresh($role);

        $comp = function (RoleMenu $a, RoleMenu $b) {
            return strcasecmp($a->getMenu(), $b->getMenu());
        };

        $ps = [
            new RoleMenu($role, 'ddd'),
            new RoleMenu($role, 'eee'),
            new RoleMenu($role, 'aaa')
        ];
        $rs1 = array_uintersect(
            $role->getMenus()->toArray(),
            $ps,
            $comp
        );
        $rs2 = array_udiff(
            $ps,
            $role->getMenus()->toArray(),
            $comp
        );
        $role->getMenus()->clear();
        foreach (array_merge($rs1, $rs2) as $item) {
            $role->getMenus()->add($item);
        }

        $em->flush();
        $em->refresh($role);

        $this->assertEquals(3, $role->getMenus()->count());
    }
}
