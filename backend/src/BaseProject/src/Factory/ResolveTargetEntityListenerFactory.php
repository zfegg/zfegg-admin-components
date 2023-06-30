<?php

namespace Zfegg\Admin\BaseProject\Factory;

use Doctrine\ORM\Tools\ResolveTargetEntityListener;
use Psr\Container\ContainerInterface;

class ResolveTargetEntityListenerFactory
{

    public function __invoke(ContainerInterface $container): ResolveTargetEntityListener
    {
        $config = $container->get('config')[ResolveTargetEntityListener::class] ?? [];
        $listener = new ResolveTargetEntityListener();

        foreach ($config as $originalEntity => $newEntity) {
            if (is_string($newEntity)) {
                $listener->addResolveTargetEntity(
                    $originalEntity,
                    $newEntity,
                    []
                );
            } else {
                $listener->addResolveTargetEntity(
                    $originalEntity,
                    $newEntity['entity'],
                    $newEntity['mapping']
                );
            }
        }

        return $listener;
    }
}
