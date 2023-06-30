<?php

namespace Zfegg\AdminAttachment\Factory;

use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemInterface;
use Psr\Container\ContainerInterface;
use Sirius\Validation\ValueValidator;
use Zfegg\AdminAttachment\AttachmentHandler;
use Zfegg\AdminAttachment\FlysystemAdapterFactory;

class AttachmentHandlerFactory
{

    public function __invoke(ContainerInterface $container)
    {
        $config = $container->get('config')[AttachmentHandler::class] ?? [];

        $validator = new ValueValidator();

        foreach (($config['rules'] ?? []) as $name => $rule) {
            $validator->add(
                $name,
                ...$rule
            );
        }

        return new AttachmentHandler(
            $validator,
            ! isset($config['filesystem']) || is_string($config['filesystem'])
                ? $container->get($config['filesystem'] ?? FilesystemInterface::class)
                : new Filesystem(
                    FlysystemAdapterFactory::createFromUri($config['filesystem']['url']),
                    $config['filesystem']['config'] ?? null
                ),
            $config['storage'],
            $config['url'] ?? '/',
        );
    }
}