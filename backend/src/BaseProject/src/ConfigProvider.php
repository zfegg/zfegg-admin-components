<?php

declare(strict_types=1);

namespace Zfegg\Admin\BaseProject;

use Zfegg\Admin\BaseProject\Entity\Member;
use Zfegg\Admin\BaseProject\Entity\Project;
use Zfegg\Admin\BaseProject\Entity\ProjectInterface;
use Zfegg\Admin\BaseProject\Middleware\ProjectAuthorizationMiddleware;
use Zfegg\Admin\BaseProject\Middleware\ProjectBindingMiddleware;
use Doctrine\ORM\Tools\ResolveTargetEntityListener;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Session\SessionMiddleware;
use Opis\JsonSchema\Validator;
use Zfegg\Admin\Admin\Middleware\AuthorizationMiddleware;
use Zfegg\ApiRestfulHandler\Utils\Route;
use Zfegg\ContentValidation\ContentValidationMiddleware;
use Zfegg\PsrMvc\Routing\Group;
use Zfegg\PsrMvc\Routing\RouteMetadata;

class ConfigProvider
{
    public function __invoke(): array
    {
        return [
            'dependencies' => $this->getDependencies(),
            'doctrine' => $this->getDoctrine(),
            'routes' => $this->getRoutes(),
            'rest' => [
                'api.admin.projects' => [
                    'resource' => 'ProjectResource',
                    'serialization_context' => [
                    ],
                    'identifier_name' => 'project_id',
                ],
                'api.projects.roles' => [
                    'resource' => 'RolesResource',
                    'serialization_context' => [
                        'attributes' => [
                            'id',
                            'member' => [
                                'id', 'realName', 'avatar', 'email', 'status'
                            ],
                            'name',
                            'expired'
                        ]
                    ],
                ],
                'api.projects.members' => [
                    'resource' => 'ProjectMemberResource',
                    'serialization_context' => [
                        'attributes' => [
                            'id',
                            'member' => [
                                'id', 'realName', 'avatar', 'email', 'status'
                            ],
                            'role' => [
                                'id', 'name',
                            ],
                            'expired'
                        ]
                    ],
                ],
                'api.projects.groups' => [
                    'resource' => 'GroupResource',
                    'serialization_context' => [
                        'attributes' => [
                            'id',
                            'members' => [
                                'id', 'realName', 'avatar', 'email', 'status'
                            ],
                            'name',
                        ]
                    ],
                ],
            ],
            'doctrine.orm-resources' => [
                'ProjectResource' => [
                    'entity' => Project::class,
                    'extensions' => [
                        'pagination' => [
                        ],
                    ],
                ],
                'ProjectMemberResource' => [
                    'entity' => Member::class,
                    'parent' => 'ProjectResource',
                    'extensions' => [
                        'sort' => [
                            'fields' => [
                                'member' => 'asc'
                            ]
                        ]
                    ],
                ],
                'GroupResource' => [
                    'entity' => Entity\Group::class,
                    'parent' => 'ProjectResource',
                    'extensions' => [
                    ],
                ],
            ],
            ResolveTargetEntityListener::class => [
                ProjectInterface::class => Project::class,
            ],
            RouteMetadata::class => [
                'paths' => [
                    __DIR__ . '/Controller',
                ]
            ],
            Validator::class => [
                'resolvers' => [
                    'protocolDir' => [
                        ['zfegg-admin-base-project', '', __DIR__ . '/../schema']
                    ]
                ]
            ],
            'menus' => $this->getMenus(),
        ];
    }


    private function getMenus(): array
    {
        return [
            '项目' => [
                'name' => '项目',
                'children' => [
                    '设置' => [
                        'name' => '设置',
                        'children' => [
                            '项目成员' => [
                                'name' => '项目成员',
                                'permissions' => [
                                    'api.projects.users:GET',
                                    'api.projects.roles:GET',
                                    'api.projects.members:*',
                                    'api.projects.groups:*',
                                ],
                            ],
                            '基础设置' => [
                                'name' => '基础设置',
                                'permissions' => [
                                    'api.projects:GET',
                                    'api.projects:PATCH',
                                ]
                            ],
                        ]
                    ],
                ]
            ]
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
            'factories'  => [
                ResolveTargetEntityListener::class => Factory\ResolveTargetEntityListenerFactory::class,
            ],
        ];
    }


    public function getDoctrine(): array
    {
        return [
            'driver' => [
                'attribute' => [
                    'paths' => [
                        __DIR__ . '/Entity',
                    ],
                ],
            ],
        ];
    }

    public function getRoutes(): array
    {
        $group = new Group('/api', [
            SessionMiddleware::class,
            AuthenticationMiddleware::class,
        ], 'api.');

        $group->route(
            '/projects',
            [
                AuthorizationMiddleware::class,
                ContentValidationMiddleware::class,
                'api.admin.projects',
            ],
            ['POST', 'GET'],
            'admin.projects'
        );
        $group->delete(
            '/projects/{project_id}',
            [
                AuthorizationMiddleware::class,
                ContentValidationMiddleware::class,
                'api.admin.projects',
            ],
            'admin.projects:DELETE'
        );
        $group->route(
            '/projects/{project_id}',
            [
                ProjectBindingMiddleware::class,
                ProjectAuthorizationMiddleware::class,
                ContentValidationMiddleware::class,
                'api.admin.projects',
            ],
            ['GET', 'PATCH', 'PUT'],
            'projects',
            [
                'schema:PATCH' => 'zfegg-admin-base-project:///project.patch.json',
            ]
        );

        $projectGroup = $group->group(
            '/projects/{project_id}',
            [
                ProjectBindingMiddleware::class,
                ProjectAuthorizationMiddleware::class,
            ],
            'projects.'
        );
        $projectRest = Route::restRoute($projectGroup);
        $projectRest('members', []);
        $projectRest('groups', []);

        $projectGroup->get('/users', 'api.admin.users', 'users');
        $projectGroup->get('/roles', 'api.admin.roles', 'roles');

        return $group->getRoutes();
    }
}
