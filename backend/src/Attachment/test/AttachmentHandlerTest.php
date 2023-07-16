<?php

namespace ZfeggTest\AdminAttachment;

use League\Flysystem\Filesystem;
use PHPUnit\Framework\TestCase;
use Zfegg\Admin\Admin\Test\InitEntityTrait;
use Zfegg\ExpressiveTest\AbstractActionTestCase;

class AttachmentHandlerTest extends AbstractActionTestCase
{
    use InitEntityTrait;

    public function testUpload()
    {
        $this->initSession();


        $files = [
            'file' => [
                'tmp_name' => __DIR__ . '/images/Test.png',
                'size' => 1,
                'error' => 0,
                'name' => 'Test.png',
                'type' => 'application/xml'
            ]
        ];
        $response = $this->call('POST', "/api/attachment/images", [], [], $files);
        $response->assertJsonStructure(['file']);

        $this->container->get(Filesystem::class)->deleteDir('images');
    }
}
