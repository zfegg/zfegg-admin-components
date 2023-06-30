<?php

namespace Zfegg\Admin\Admin\Handler;

use Psr\Container\ContainerInterface;

class MenuHandlerFactory
{

    public function __invoke(ContainerInterface $container): MenuHandler
    {
        $menus = $container->get('config')['menus'];

        $menus = self::reIndex($menus);
        return new MenuHandler($menus);
    }

    private static function reIndex(array $menus): array
    {
        $data = [];
        foreach ($menus as $item) {
            if (isset($item['children'])) {
                $item['children'] = self::reIndex($item['children']);
            }
            $data[] = $item;
        }

        return $data;
    }
}
