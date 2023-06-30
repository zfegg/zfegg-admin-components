<?php


namespace Zfegg\Admin\Admin\Test;

use Doctrine\ORM\EntityManagerInterface;
use Mezzio\Authentication\UserInterface;
use Mezzio\Session\Session;
use Mezzio\Session\SessionInterface;
use Mezzio\Session\SessionPersistenceInterface;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Serializer;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\User;

/**
 * Trait InitUserEntityTrait
 * @mixin \Zfegg\ExpressiveTest\AbstractActionTestCase
 * @property \Psr\Container\ContainerInterface $container
 */
trait InitEntityTrait
{

    public function initSession(
        int $id = 1,
        array $user = [
            'email' => 'test@test.com',
            'real_name' => '测试',
            'admin' => false,
        ]
    ): void {
        $session = new Session([
            UserInterface::class => [
                'identifier' => $id,
                'user' => $user,
            ]
        ]);
        $persistence = $this->createMock(SessionPersistenceInterface::class);
        $persistence->method('initializeSessionFromRequest')
            ->willReturn($session);
        $persistence->method('persistSession')
            ->willReturnCallback(fn(SessionInterface $session, ResponseInterface $response) => $response);
        $this->container->setService(SessionPersistenceInterface::class, $persistence);
    }

    public function initTestRole(string $name = 'test'): Role
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $role = $em->getRepository(Role::class)->findOneBy(['name' => $name]);

        if (! $role) {
            $role = new Role($name);
            $em->persist($role);
            $em->flush();
        }

        return $role;
    }

    public function removeTestRole(): void
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $role = $em->getRepository(Role::class)->findOneBy(['name' => 'test']);

        if ($role) {
            $em->remove($role);
            $em->flush();
        }
    }

    public function initTestUser(array $details = []): User
    {
        $data = $details + [
            'email' => 'test@test.com',
            'password' => password_hash('123123', PASSWORD_DEFAULT),
            'real_name' => 'Test',
            'admin' => false,
            'status' => 1,
        ];

        $em = $this->container->get(EntityManagerInterface::class);
        $serializer = $this->container->get(Serializer::class);
        $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (! $user) {
            $user = $serializer->denormalize($data, User::class);
            $em->persist($user);
            $em->flush();
        } elseif ($details) {
            $context = [];
            $context[AbstractNormalizer::OBJECT_TO_POPULATE] = $user;
            $serializer->denormalize($details, User::class, null, $context);
            $em->flush();
        }

        return $user;
    }

    public function removeTestUser(string $email = 'test@test.com'): void
    {
        $em = $this->container->get(EntityManagerInterface::class);
        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if ($user) {
            $em->remove($user);
            $em->flush();
        }
    }
}
