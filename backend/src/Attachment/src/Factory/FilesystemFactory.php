<?php

namespace Zfegg\AdminAttachment\Factory;

use League\Flysystem\Filesystem;
use Psr\Container\ContainerInterface;
use Zfegg\AdminAttachment\FlysystemAdapterFactory;

class FilesystemFactory
{
    public function __invoke(ContainerInterface $container): Filesystem
    {
        $config = $container->get('config')[Filesystem::class] ?? [];
        return new Filesystem(
            FlysystemAdapterFactory::createFromUri($config['url']),
            $config['config'] ?? null
        );
    }
}
