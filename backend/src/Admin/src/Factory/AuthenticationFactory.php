<?php


namespace Zfegg\Admin\Admin\Factory;

use Doctrine\ORM\EntityManagerInterface;
use Mezzio\Helper\ServerUrlHelper;
use Mezzio\Helper\UrlHelper;
use Psr\Container\ContainerInterface;
use Zfegg\Admin\Admin\Authentication;

class AuthenticationFactory
{

    public function __invoke(ContainerInterface $container): Authentication
    {
        return new Authentication(
            $container->get(EntityManagerInterface::class),
            $container->get(ServerUrlHelper::class)('/')
        );
    }
}
