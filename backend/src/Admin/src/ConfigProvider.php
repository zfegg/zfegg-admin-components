<?php

declare(strict_types=1);

namespace Zfegg\Admin\Admin;

use Laminas\Di\Container\AutowireFactory;
use Laminas\ServiceManager\Factory\InvokableFactory;
use Mezzio\Authentication\AuthenticationInterface;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Session\SessionMiddleware;
use Opis\JsonSchema\Validator;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\Admin\Admin\Handler\MenuHandler;
use Zfegg\Admin\Admin\Handler\UserLoginHandler;
use Zfegg\Admin\Admin\Middleware\AuthorizationMiddleware;
use Zfegg\Admin\Admin\Remembering\RememberingMe;
use Zfegg\AttachmentHandler\AttachmentHandler;
use Zfegg\ApiResourceDoctrine\Extension\QueryFilter\CamelizeNamingStrategy;
use Zfegg\ApiRestfulHandler\Utils\Route;
use Zfegg\ContentValidation\ContentValidationMiddleware;
use Zfegg\DoctrineHelper\Factory\DoctrineRepositoryFactory;
use Zfegg\PsrMvc\Routing\Group;
use Zfegg\PsrMvc\Routing\RouteMetadata;

class ConfigProvider
{
    /**
     * Returns the configuration array
     *
     * To add a bit of a structure, each section is defined in a separate
     * method which returns an array with its configuration.
     */
    public function __invoke(): array
    {
        $userAttrs = [
            'id',
            'email',
            'realName',
            'status',
            'avatar',
            'admin'
        ];
        return [
            'doctrine' => $this->getDoctrine(),
            'dependencies' => $this->getDependencies(),
            'routes' => $this->getRoutes(),
            'rest' => [
                'api.admin.roles' => [
                    'resource' => Controller\RoleResource::class,
                    'serialization_context' => [
                        'attributes' => [
                            'id',
                            'name',
                            'description',
                            'users' => $userAttrs,
                            'menus',
                        ],
                    ],
                ],
                'api.admin.roles.users' => [
                    'resource' => Controller\RoleUsersResource::class,
                    'serialization_context' => [
                        'attributes' => $userAttrs,
                    ],
                ],
                'api.admin.users' => [
                    'resource' => 'UsersResource',
                    'serialization_context' => [
                        'attributes' => [
                            'id',
                            'email',
                            'realName',
                            'createdAt',
                            'updatedAt',
                            'status',
                            'avatar',
                            'admin',
                            'roles' => ['id', 'name'],
                            'bindings' => [
                                'id', 'provider', 'createdAt', 'info'
                            ]
                        ],
                    ]
                ],
            ],
            'menus' => [],
            'doctrine.orm-resources' => [
                'UsersResource' => [
                    'entity' => Entity\User::class,
                    'extensions' => [
                        'pagination' => [
                        ],
                        'kendo_query_filter' => [
                            'fields' => [
                                'email' => [
                                    'op' => ['eq', 'startswith', 'contains'],
                                ],
                                'real_name' => [
                                    'op' => ['eq', 'startswith', 'contains'],
                                ],
                                'status' => [
                                    'op' => ['eq', 'in'],
                                ],
                            ],
                            'namingStrategy' => CamelizeNamingStrategy::class,
                        ],
                    ],
                ],
                'RolesResource' => [
                    'entity' => Entity\Role::class,
                ],
            ],
            Validator::class => [
                'resolvers' => [
                    'protocolDir' => [
                        ['zfegg-admin-admin', '', __DIR__ . '/../schema']
                    ]
                ]
            ],
            RouteMetadata::class => [
                'paths' => [
                    __DIR__ . '/Controller'
                ],
                'groups' => [
                    'api.base' => [
                        'prefix' => '/api',
                        'middlewares' => [
                            SessionMiddleware::class,
                            AuthenticationMiddleware::class,
                        ],
                        'name' => 'api.admin.'
                    ]
                ]
            ],
        ];
    }

    /**
     * Returns the container dependencies
     */
    public function getDependencies(): array
    {
        return [
            'invokables' => [
            ],
            'factories' => [
                Response\ProblemResponseFactory::class => InvokableFactory::class,
                Repository\Users::class => [DoctrineRepositoryFactory::class, User::class],
                Controller\RoleUsersResource::class => Controller\RoleUsersResourceFactory::class,
                Controller\RoleResource::class => Controller\RoleResourceFactory::class,
//                Controller\UserBindingController::class => Controller\UserBindingControllerFactory::class,
                Authentication::class => Factory\AuthenticationFactory::class,
                Handler\MenuHandler::class => Handler\MenuHandlerFactory::class,
                Authorization\Gate::class => Factory\GateFactory::class,
                RememberingMe::class => AutowireFactory::class,
            ],
            'aliases' => [
                Response\ProblemResponseFactoryInterface::class => Response\ProblemResponseFactory::class,
                Authorization\GateInterface::class => Authorization\Gate::class,
                AuthenticationInterface::class => Authentication::class,
            ],
        ];
    }

    public function getDoctrine(): array
    {
        return [
            'configuration' => [
                'default' => [
                    'entity_namespaces' => [
                        'YcAdmin' => __NAMESPACE__ . '\\Entity'
                    ],
                ],
            ],
            'driver' => [
                'annotation' => [
                    'paths' => [
                        __DIR__ . '/Entity',
                    ],
                ],
                'attribute' => [
                    'paths' => [
                        __DIR__ . '/Entity',
                    ],
                ],
            ],
        ];
    }

    private function getRoutes(): array
    {
        $group = new Group('/api/admin', [
            SessionMiddleware::class,
            AuthenticationMiddleware::class,
            AuthorizationMiddleware::class,
            ContentValidationMiddleware::class,
        ], 'api.admin.');

        $group->get('/menus', MenuHandler::class, 'menus');

        $rest = Route::restRoute($group);

        $rest(
            'users',
            [
                'schema:POST' => 'zfegg-admin-admin:///users.create.json',
                'schema:PATCH' => 'zfegg-admin-admin:///users.patch.json',
            ],
            ['GET', 'POST', 'PATCH',],
        );
        $rest(
            'roles',
            [
                'schema:POST' => 'zfegg-admin-admin:///roles.create.json',
                'schema:PATCH' => 'zfegg-admin-admin:///roles.patch.json',
            ],
        );
        $group->route(
            "/roles/{role_id}/users[/{id}]",
            $group->getName() . 'roles.users',
            ['GET', 'POST', 'DELETE',],
            'roles.users',
            [
                'schema:POST' => 'zfegg-admin-admin:///role-users.create.json',
            ]
        );

        return array_merge(
            [
                [
                    'path' => '/api/attachment/images',
                    'middleware' => [
                        SessionMiddleware::class,
                        AuthenticationMiddleware::class,
                        AttachmentHandler::class,
                    ],
                    'allowed_methods' => ['POST'],
                ],
            ],
            $group->getRoutes()
        );
    }
}
