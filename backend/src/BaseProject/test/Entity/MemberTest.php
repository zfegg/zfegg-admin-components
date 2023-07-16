<?php

namespace ZfeggTest\Admin\BaseProject\Entity;

use PHPUnit\Framework\TestCase;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\Admin\BaseProject\Test\InitProjectEntityTrait;
use Zfegg\ApiRestfulHandler\Test\RestfulApiTestTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class MemberTest extends AbstractActionTestCase
{
    use RestfulApiTestTrait;
    use InitEntityTrait;
    use InitProjectEntityTrait;

    private string $path = '/api/projects/%s/members';

    public function testCurd(): void
    {
        $this->initSession();
        $project = $this->initTestProject();
        $this->path = sprintf($this->path, $project->getId());

        $user = $this->initTestUser();
        $role = $this->initTestRole();
        $body = [
            'member_id' => $user->getId(),
            'role_id' => $role->getId(),
        ];

        /** @var \Doctrine\DBAL\Connection $conn */
        $conn = $this->container->get('doctrine.connection.default');
        $conn->delete('project_member_roles', $body);

        $this->apiCurd($body, $body, $body);
    }
}
