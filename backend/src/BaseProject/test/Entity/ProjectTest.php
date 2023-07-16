<?php


namespace ZfeggTest\Admin\BaseProject\Entity;

use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ApiRestfulHandler\Test\RestfulApiTestTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class ProjectTest extends AbstractActionTestCase
{
    use RestfulApiTestTrait;
    use InitEntityTrait;

    private string $path = '/api/projects';

    public function testCurl(): void
    {
        $this->initSession();
        $name = substr(md5(uniqid()), 0, 5);
        $body = [
            'code' => $name,
            'name' => $name,
            'config' => ["ANA_DEV_DB_CONN" => "","ANA_PRO_DB_CONN" => ""],
        ];
        $this->apiCurd($body, $body, $body);
    }
}
