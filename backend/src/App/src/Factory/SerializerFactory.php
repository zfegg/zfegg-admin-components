<?php


namespace App\Factory;

use Doctrine\Persistence\ManagerRegistry;
use Psr\Container\ContainerInterface;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;
use Symfony\Component\Serializer\Encoder\CsvEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\CustomNormalizer;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\DateTimeZoneNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Zfegg\Admin\Admin\Serializer\UserIdentityDenormalizer;
use Zfegg\ApiResourceDoctrine\Serializer\DoctrineEntityDenormalizer;
use Zfegg\ApiSerializerExt\Basic\CollectionNormalizer;
use Zfegg\ApiSerializerExt\Basic\CursorPaginationNormalizer;

class SerializerFactory
{

    public function __invoke(ContainerInterface $container): Serializer
    {

        return new Serializer(
            [
                new DateTimeZoneNormalizer(),
                new DateTimeNormalizer(),
                new UserIdentityDenormalizer(),
                new CustomNormalizer(),
                new DoctrineEntityDenormalizer($container->get(ManagerRegistry::class)),
                new ArrayDenormalizer(),
                new ObjectNormalizer(
                    null,
                    new CamelCaseToSnakeCaseNameConverter(),
                    null,
                    new ReflectionExtractor(),
                ),
                new CursorPaginationNormalizer(),
                new CollectionNormalizer(),
            ],
            [
                new JsonEncoder(),
                new CsvEncoder(),
            ]
        );
    }
}
