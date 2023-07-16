<?php


namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerInterface;

class RoleResourceFactory
{
    public function __invoke(ContainerInterface $container): RoleResource
    {
        return new RoleResource(
            $container->get('RolesResource'),
            $container->get(EntityManagerInterface::class),
        );
    }
}
