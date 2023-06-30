<?php

namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerInterface;

class RoleUsersResourceFactory
{

    public function __invoke(ContainerInterface $container): RoleUsersResource
    {
        return new RoleUsersResource(
            $container->get(EntityManagerInterface::class),
            $container->get('RolesResource')
        );
    }
}
