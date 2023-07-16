<?php

namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Zfegg\Admin\Admin\Response\ProblemResponseFactoryInterface;

class UserControllerFactory
{

    public function __invoke(ContainerInterface $container): UserController
    {
        return new UserController(
            $container->get(EntityManagerInterface::class),
            $container->get(SerializerInterface::class),
            $container->get(ProblemResponseFactoryInterface::class),
            $container->get('UsersResource'),
        );
    }
}
