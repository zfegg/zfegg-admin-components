<?php

namespace ZfeggTest\Admin\BaseProject\Controller;

use Zfegg\Admin\BaseProject\Test\InitProjectEntityTrait;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class ProjectControllerTest extends AbstractActionTestCase
{
    use InitEntityTrait;
    use InitProjectEntityTrait;

    public function testGenerateSecret(): void
    {
        $project = $this->initTestProject();
        $this->initSession();
        $this->get("/api/projects/{$project->getId()}/generate-secret")
            ->assertNoContent();
    }
}
