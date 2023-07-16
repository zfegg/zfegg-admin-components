<?php

namespace Zfegg\Admin\BaseProject\Factory;

use Doctrine\Common\EventManager;
use Laminas\ServiceManager\Initializer\InitializerInterface;
use Psr\Container\ContainerInterface;

class EventManagerInitFactory implements InitializerInterface
{

    public function __invoke(ContainerInterface $container, $instance)
    {
        /** @var EventManager $instance */
        $instance;
    }
}