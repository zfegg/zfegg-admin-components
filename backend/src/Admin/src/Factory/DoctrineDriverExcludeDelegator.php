<?php


namespace Zfegg\Admin\Admin\Factory;

use Doctrine\Persistence\Mapping\Driver\AnnotationDriver;
use Interop\Container\ContainerInterface;
use Laminas\ServiceManager\Factory\DelegatorFactoryInterface;

class DoctrineDriverExcludeDelegator implements DelegatorFactoryInterface
{

    /** @inheritdoc  */
    public function __invoke(ContainerInterface $container, $name, callable $callback, ?array $options = null)
    {
        /** @var \Doctrine\Persistence\Mapping\Driver\MappingDriverChain $service */
        $service = $callback();
        $annotDriver = $service->getDefaultDriver();

        if ($annotDriver instanceof AnnotationDriver) {
            $classes = $container->get('config')['doctrine']['driver']['annotation']['excludes'];
            foreach ($classes as $className) {
                $ref = new \ReflectionClass($className);
                $annotDriver->addExcludePaths([$ref->getFileName()]);
            }
        }

        return $service;
    }
}
