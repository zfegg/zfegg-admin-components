<?php

namespace Zfegg\Admin\Admin\Factory;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerInterface;
use Zfegg\Admin\Admin\Authorization\Gate;

class GateFactory
{

    public function __invoke(ContainerInterface $container): Gate
    {
        return new Gate(
            $container->get(EntityManagerInterface::class),
            $container->get('config')['menus'],
        );
    }
}
