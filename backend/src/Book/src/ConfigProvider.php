<?php

namespace Book;

use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Session\SessionMiddleware;
use Zfegg\Admin\Admin\Middleware\AuthorizationMiddleware;
use Zfegg\ApiRestfulHandler\Utils\Route;
use Zfegg\ContentValidation\ContentValidationMiddleware;
use Zfegg\PsrMvc\Routing\Group;

class ConfigProvider
{

    public function __invoke(): array
    {
        return [
            'dependencies'           => $this->getDependencies(),
            'doctrine'               => $this->getDoctrine(),
            'routes'                 => $this->getRoutes(),
            'rest'                   => [
                // 键名可与路由名称匹配
                'book.books'        => [
                    'resource'              => 'Book\\BookResource',
                    'serialization_context' => [

                        // 配置API要返回的字段, 不配置默认返回全部字段
                        'attributes' => [
                            'id',
                            'name',
                            'barcode',
                            'createdAt',
                            'status',
                            'group',
                        ]
                    ]
                ],
                'book.books2'       => [
                    'resource'              => 'Book\\BookResource2',
                    'serialization_context' => [
                        // 配置API要返回的字段, 不配置默认返回全部字段
                        'attributes' => [
                            'id',
                            'name',
                            'barcode',
                            'createdAt',
                            'status',
                            'group',
                        ]
                    ]
                ],
                'book.groups'       => [
                    'resource' => 'Book\\GroupResource',
                ],
                'book.groups.books' => [
                    'resource' => 'Book\\Group\\BookResource',
                ],
            ],
            'doctrine.orm-resources' => [
                'Book\\BookResource2'       => [
                    'entity'     => Entity\Book::class,
                    'extensions' => [
                        // 接口分页支持
                        'cursor_pagination'  => [
                            'pageSizeRange' => [3, 10, 20],
                        ],
                        // 接口 kendoUI组件 query规则支持
                        'kendo_query_filter' => [
                            'fields' => [
                                'code' => [
                                    'op' => ['contains']
                                ],
                                'name' => [
                                    'op' => ['eq', 'contains']
                                ],
                            ]
                        ],
                        // 接口排序支持
                        'sort'               => [
                            'fields' => [
                                'id' => 'desc'
                            ]
                        ],
                    ],
                ],
                'Book\\BookResource'        => [
                    'entity'     => Entity\Book::class,
                    'extensions' => [
                        // 接口分页支持
                        'pagination'         => [
                        ],
                        // 接口 kendoUI组件 query规则支持
                        'kendo_query_filter' => [
                            'fields' => [
                                'code' => [
                                    'op' => ['contains']
                                ],
                                'name' => [
                                    'op' => ['eq', 'contains']
                                ],
                            ]
                        ],
                        // 接口排序支持
                        'sort'               => [
                            'fields' => [
                                'id' => 'desc'
                            ]
                        ],
                    ],
                ],
                'Book\\GroupResource'       => [
                    'entity' => Entity\Group::class,
                ],
                'Book\\Group\\BookResource' => [
                    'entity'     => Entity\Book::class,
                    'extensions' => [
                    ],
                ],
            ],
            'menus'                  => [
                'book' => [
                    'name'        => '书本管理',
                    'children'    => [
                        'pro-table' => [
                            'name' => 'ProTable',
                            'permissions' => [
                                'book.books:GET',
                                'book.books:POST',
                                'book.books:PUT',
                                'book.books:PATCH',
                                'book.books:DELETE',
                            ],
                        ],
                        'table' => [
                            'name'        => 'Table',
                            'permissions' => [
                                'book.books:GET',
                            ],
                            'children' => [
                                [
                                    'name'        => '查询',
                                    'permissions' => [
                                        'book.books:GET',
                                    ]
                                ],
                                [
                                    'name'        => '编辑',
                                    'permissions' => [
                                        'book.books:POST',
                                        'book.books:PUT',
                                        'book.books:PATCH',
                                    ]
                                ],
                                [
                                    'name'        => '删除',
                                    'permissions' => [
                                        'book.books:DELETE',
                                    ]
                                ],
                            ]
                        ],
                    ]
                ]
            ]
        ];
    }

    private function getRoutes(): array
    {
        $group = new Group('/api/book', [
            SessionMiddleware::class,
            AuthenticationMiddleware::class,             // 登录认证中间件(登录验证)
            AuthorizationMiddleware::class,
            ContentValidationMiddleware::class, // 数据内容验证支持
        ], 'book.');

        $group->get('/books/{id}/sold-out', Controller\BookController::class . 'books@soldOut');

        $rest = Route::restRoute($group);
        $rest('books');
        $rest('books2');
        $rest('groups');

        return $group->getRoutes();
    }

    public function getDoctrine(): array
    {
        return [
            'driver' => [
                'annotation' => [
                    'paths' => [
                        __DIR__ . '/Entity',
                    ],
                ],
            ],
        ];
    }

    private function getDependencies(): array
    {
        return [
            'factories' => [
            ]
        ];
    }
}
