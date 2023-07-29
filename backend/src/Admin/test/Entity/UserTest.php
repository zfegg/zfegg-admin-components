<?php


namespace ZfeggTest\Admin\Admin\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Serializer;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\Admin\Admin\Test\Utils;
use Zfegg\ApiRestfulHandler\Test\RestfulApiTestTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class UserTest extends AbstractActionTestCase
{
    use RestfulApiTestTrait;
    use InitEntityTrait;

    private string $path = '/api/admin/users';

    protected function setUp(): void
    {
        parent::setUp();
        Utils::initSession();
    }

    public function testCURD(): void
    {
        $this->removeTestUser();
        $role1 = $this->initTestRole('test1');
        $role2 = $this->initTestRole('test2');
        $data = [
            'email' => 'test@test.com',
            'password' => '123123',
            'real_name' => 'Test',
            'admin' => '0',
            'status' => '1',
            'roles' => [$role1->getId()],
            'add_test' => 1,
        ];

        $id = $this->apiCreate($data);
        $this->apiGetList();
        $this->apiPatch($id, ['password' => 'xxxxxx', 'roles' => [$role2->getId()],]);
    }

    public function testJoin(): void
    {
        $this->removeTestUser();
        $role = $this->initTestRole();
        $data = [
            'email' => 'test@test.com',
            'password' => '123123',
            'real_name' => 'test',
            'admin' => false,
            'status' => 1,
        ];
        $em = $this->container->get(EntityManagerInterface::class);
        $serializer = $this->container->get(Serializer::class);

        /** @var User $user */
        $user = $serializer->denormalize($data, User::class, 'json');
        $user->getRoles()->add($role);
        $em->persist($user);
        $em->flush();

        $roles = $user->getRoles();

        $this->assertInstanceOf(Collection::class, $roles);
    }
}
