<?php

use Psr\Container\ContainerInterface;
use Laminas\Code\Scanner\DirectoryScanner;
use Laminas\Di\CodeGenerator\InjectorGenerator;
use Laminas\Di\Config;
use Laminas\Di\Definition\RuntimeDefinition;
use Laminas\Di\Resolver\DependencyResolver;
use Zfegg\Admin\Admin\Remembering\RememberingMe;

require __DIR__ . '/../vendor/autoload.php';

// Define the source directories to scan for classes for which
// to generate AoT factories:
$directories = [
    __DIR__ . '/../src/App/src',
];

/** @var ContainerInterface $container */
$container = require __DIR__ . '/../config/container.php';
//$scanner = new DirectoryScanner($directories);
$generator = $container->get(InjectorGenerator::class);
//
//$generator->generate($scanner->getClassNames());


//$config = new Config();
//$resolver = new DependencyResolver(new RuntimeDefinition(), $config);
//$generator = new InjectorGenerator($config, $resolver);

// It is highly recommended to set the container that is used at runtime:
//$resolver->setContainer($container);
//$generator->setOutputDirectory('/path/to/generated/files');
$generator->generate([
    RememberingMe::class,
    // ...
]);