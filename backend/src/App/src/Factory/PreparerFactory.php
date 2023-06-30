<?php

namespace App\Factory;

use Psr\Container\ContainerInterface;
use Zfegg\ApiRestfulHandler\Mvc\Preparer\CsvPreparer;
use Zfegg\PsrMvc\Preparer\CommonPreparer;
use Zfegg\PsrMvc\Preparer\DefaultPreparer;
use Zfegg\PsrMvc\Preparer\PreparerStack;
use Zfegg\PsrMvc\Preparer\SerializationPreparer;

class PreparerFactory
{

    public function __invoke(ContainerInterface $container): PreparerStack
    {
        $preparer = new PreparerStack();
        $preparer->push($container->get(DefaultPreparer::class));
        $preparer->push($container->get(SerializationPreparer::class));
        $preparer->push($container->get(CsvPreparer::class));
        $preparer->push($container->get(CommonPreparer::class));

        return $preparer;
    }
}